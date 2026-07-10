import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandUpdateSchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({ where: { id: params.id } });
  if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(brand);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => null);
  const parsed = brandUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const brand = await prisma.brand.update({ where: { id: params.id }, data: parsed.data });
  await cacheInvalidatePrefix("brands:");
  return NextResponse.json(brand);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.brand.delete({ where: { id: params.id } });
    await cacheInvalidatePrefix("brands:");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete this brand because it still has coupons, reviews, or comparisons linked to it. Remove those first." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}