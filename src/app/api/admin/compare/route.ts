import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const comparisonInputSchema = z.object({
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

export async function GET() {
  const comparisons = await prisma.comparison.findMany({
    orderBy: { createdAt: "desc" },
    include: { brandA: { select: { name: true } }, brandB: { select: { name: true } } }
  });
  return NextResponse.json(comparisons);
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = comparisonInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const comparison = await prisma.comparison.create({ data: parsed.data });
  return NextResponse.json(comparison, { status: 201 });
}