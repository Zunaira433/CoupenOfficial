import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const avatarSchema = z.object({
  avatarUrl: z.string().trim().min(1).max(1000)
});

export async function PATCH(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = avatarSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.userId },
    data: { avatarUrl: parsed.data.avatarUrl }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await prisma.user.update({
    where: { id: user.userId },
    data: { avatarUrl: null }
  });

  return NextResponse.json({ ok: true });
}