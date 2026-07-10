import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = blogPostSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const post = await prisma.blogPost.create({ data: parsed.data });
  await cacheInvalidatePrefix("blog:");
  return NextResponse.json(post, { status: 201 });
}
