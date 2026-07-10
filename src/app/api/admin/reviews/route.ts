import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: { select: { name: true, slug: true } } },
    take: 200
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const review = await prisma.review.create({ data: parsed.data });
  await cacheInvalidatePrefix("reviews:");
  return NextResponse.json(review, { status: 201 });
}
