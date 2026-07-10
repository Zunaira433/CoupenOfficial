import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reactionSchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const [likes, dislikes] = await Promise.all([
    prisma.reaction.count({ where: { blogPostId: post.id, type: "LIKE" } }),
    prisma.reaction.count({ where: { blogPostId: post.id, type: "DISLIKE" } })
  ]);

  const user = getCurrentUser();
  let userReaction: "LIKE" | "DISLIKE" | null = null;
  if (user) {
    const existing = await prisma.reaction.findUnique({
      where: { blogPostId_userId: { blogPostId: post.id, userId: user.userId } }
    });
    userReaction = existing?.type || null;
  }

  return NextResponse.json({ likes, dislikes, userReaction });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in to react" }, { status: 401 });

  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = reactionSchema.safeParse({ ...json, blogPostId: post.id });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.reaction.findUnique({
    where: { blogPostId_userId: { blogPostId: post.id, userId: user.userId } }
  });

  if (existing && existing.type === parsed.data.type) {
    // Clicking the same reaction again removes it (toggle off)
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else if (existing) {
    // Switching from LIKE to DISLIKE or vice versa
    await prisma.reaction.update({ where: { id: existing.id }, data: { type: parsed.data.type } });
  } else {
    await prisma.reaction.create({
      data: { blogPostId: post.id, userId: user.userId, type: parsed.data.type }
    });
  }

  const [likes, dislikes] = await Promise.all([
    prisma.reaction.count({ where: { blogPostId: post.id, type: "LIKE" } }),
    prisma.reaction.count({ where: { blogPostId: post.id, type: "DISLIKE" } })
  ]);
  const updated = await prisma.reaction.findUnique({
    where: { blogPostId_userId: { blogPostId: post.id, userId: user.userId } }
  });

  return NextResponse.json({ likes, dislikes, userReaction: updated?.type || null });
}