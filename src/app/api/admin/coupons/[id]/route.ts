import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { couponUpdateSchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => null);
  const parsed = couponUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const coupon = await prisma.coupon.update({ where: { id: params.id }, data: parsed.data });
  await cacheInvalidatePrefix("coupons:");
  return NextResponse.json(coupon);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.coupon.delete({ where: { id: params.id } });
    await cacheInvalidatePrefix("coupons:");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
