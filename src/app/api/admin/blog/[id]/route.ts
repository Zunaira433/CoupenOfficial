import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostUpdateSchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => null);
  const parsed = blogPostUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const post = await prisma.blogPost.update({ where: { id: params.id }, data: parsed.data });
  await cacheInvalidatePrefix("blog:");
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.blogPost.delete({ where: { id: params.id } });
    await cacheInvalidatePrefix("blog:");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete this post because it still has comments or reactions linked to it." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}