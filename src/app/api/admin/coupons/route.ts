import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

export async function GET() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: { select: { name: true, slug: true } } },
    take: 200
  });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = couponSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const coupon = await prisma.coupon.create({ data: parsed.data });
  await cacheInvalidatePrefix("coupons:");
  return NextResponse.json(coupon, { status: 201 });
}
