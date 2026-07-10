import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const comparisonUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  coverUrl: z.string().trim().url().nullable().optional(),
  itemAName: z.string().trim().max(100).optional().or(z.literal("")),
  itemBName: z.string().trim().max(100).optional().or(z.literal("")),
  brandAId: z.string().cuid().nullable().optional(),
  brandBId: z.string().cuid().nullable().optional(),
  prosA: z.array(z.string().trim().min(1)).max(20).optional(),
  consA: z.array(z.string().trim().min(1)).max(20).optional(),
  prosB: z.array(z.string().trim().min(1)).max(20).optional(),
  consB: z.array(z.string().trim().min(1)).max(20).optional(),
  bestForA: z.string().trim().max(300).optional().or(z.literal("")),
  bestForB: z.string().trim().max(300).optional().or(z.literal("")),
  ctaLinkA: z.string().trim().url().optional().or(z.literal("")),
  ctaLabelA: z.string().trim().max(50).optional().or(z.literal("")),
  ctaLinkB: z.string().trim().url().optional().or(z.literal("")),
  ctaLabelB: z.string().trim().max(50).optional().or(z.literal("")),
  summary: z.string().trim().max(2000).optional().or(z.literal(""))
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const comparison = await prisma.comparison.findUnique({ where: { id: params.id } });
  if (!comparison) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(comparison);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => null);
  const parsed = comparisonUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const comparison = await prisma.comparison.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(comparison);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.comparison.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}