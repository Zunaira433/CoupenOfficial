import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandSchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

// GET and POST are both protected by the edge middleware in src/middleware.ts

export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { category: { select: { name: true } } }
  });
  return NextResponse.json(brands);
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = brandSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const brand = await prisma.brand.create({ data: parsed.data });
  await cacheInvalidatePrefix("brands:");
  return NextResponse.json(brand, { status: 201 });
}
