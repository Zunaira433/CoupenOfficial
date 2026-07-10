import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";
import { cacheInvalidatePrefix } from "@/lib/redis";

// GET and POST are both protected by the edge middleware in src/middleware.ts

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = categorySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const category = await prisma.category.create({ data: parsed.data });
  await cacheInvalidatePrefix("home:categories");
  return NextResponse.json(category, { status: 201 });
}