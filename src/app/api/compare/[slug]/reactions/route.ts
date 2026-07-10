import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const reactionBodySchema = z.object({ type: z.enum(["LIKE", "DISLIKE"]) });

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const comparison = await prisma.comparison.findUnique({ where: { slug: params.slug } });
  if (!comparison) return NextResponse.json({ error: "Comparison not found" }, { status: 404 });

  const [likes, dislikes] = await Promise.all([
    prisma.reaction.count({ where: { comparisonId: comparison.id, type: "LIKE" } }),
    prisma.reaction.count({ where: { comparisonId: comparison.id, type: "DISLIKE" } })
  ]);

  const user = getCurrentUser();
  let userReaction: "LIKE" | "DISLIKE" | null = null;
  if (user) {
    const existing = await prisma.reaction.findUnique({
      where: { comparisonId_userId: { comparisonId: comparison.id, userId: user.userId } }
    });
    userReaction = existing?.type || null;
  }

  return NextResponse.json({ likes, dislikes, userReaction });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in to react" }, { status: 401 });

  const comparison = await prisma.comparison.findUnique({ where: { slug: params.slug } });
  if (!comparison) return NextResponse.json({ error: "Comparison not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = reactionBodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const existing = await prisma.reaction.findUnique({
    where: { comparisonId_userId: { comparisonId: comparison.id, userId: user.userId } }
  });

  if (existing && existing.type === parsed.data.type) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else if (existing) {
    await prisma.reaction.update({ where: { id: existing.id }, data: { type: parsed.data.type } });
  } else {
    await prisma.reaction.create({
      data: { comparisonId: comparison.id, userId: user.userId, type: parsed.data.type }
    });
  }

  const [likes, dislikes] = await Promise.all([
    prisma.reaction.count({ where: { comparisonId: comparison.id, type: "LIKE" } }),
    prisma.reaction.count({ where: { comparisonId: comparison.id, type: "DISLIKE" } })
  ]);
  const updated = await prisma.reaction.findUnique({
    where: { comparisonId_userId: { comparisonId: comparison.id, userId: user.userId } }
  });

  return NextResponse.json({ likes, dislikes, userReaction: updated?.type || null });
}