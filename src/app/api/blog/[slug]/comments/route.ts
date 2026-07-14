import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const comments = await prisma.comment.findMany({
    where: { blogPostId: post.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true, avatarUrl: true } } }
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in to comment" }, { status: 401 });

  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = commentSchema.safeParse({ ...json, blogPostId: post.id });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { blogPostId: post.id, userId: user.userId, body: parsed.data.body },
    include: { user: { select: { name: true, email: true, avatarUrl: true } } }
  });
  return NextResponse.json(comment, { status: 201 });
}