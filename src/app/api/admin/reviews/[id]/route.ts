import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewUpdateSchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => null);
  const parsed = reviewUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const review = await prisma.review.update({ where: { id: params.id }, data: parsed.data });
  await cacheInvalidatePrefix("reviews:");
  return NextResponse.json(review);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.review.delete({ where: { id: params.id } });
  await cacheInvalidatePrefix("reviews:");
  return NextResponse.json({ ok: true });
}
