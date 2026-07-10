import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { favoriteSchema } from "@/lib/validation";
import { isSameOriginRequest } from "@/lib/csrf";

export async function GET() {
  const user = requireUser();
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.userId },
    include: { brand: { select: { id: true, name: true, slug: true, logoUrl: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  const user = requireUser();
  const json = await req.json().catch(() => null);
  const parsed = favoriteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { brandId } = parsed.data;

  const existing = await prisma.favorite.findFirst({ where: { userId: user.userId, brandId } });
  if (existing) {
    return NextResponse.json({ error: "Already favorited" }, { status: 409 });
  }

  const fav = await prisma.favorite.create({ data: { userId: user.userId, brandId } });
  return NextResponse.json(fav, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  const user = requireUser();
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("brandId");
  if (!brandId) return NextResponse.json({ error: "brandId required" }, { status: 400 });

  await prisma.favorite.deleteMany({ where: { userId: user.userId, brandId } });
  return NextResponse.json({ ok: true });
}
