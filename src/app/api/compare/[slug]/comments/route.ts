import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const comparison = await prisma.comparison.findUnique({ where: { slug: params.slug } });
  if (!comparison) return NextResponse.json({ error: "Comparison not found" }, { status: 404 });

  const comments = await prisma.comment.findMany({
    where: { comparisonId: comparison.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true, avatarUrl: true } } }
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in to comment" }, { status: 401 });

  const comparison = await prisma.comparison.findUnique({ where: { slug: params.slug } });
  if (!comparison) return NextResponse.json({ error: "Comparison not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = commentSchema.omit({ blogPostId: true }).safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { comparisonId: comparison.id, userId: user.userId, body: parsed.data.body },
    include: { user: { select: { name: true, email: true, avatarUrl: true } } }
  });
  return NextResponse.json(comment, { status: 201 });
}