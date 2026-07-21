import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";
import { isSameOriginRequest } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token: parsed.data.token } });

  if (!record || record.used || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } })
  ]);

  return NextResponse.json({ ok: true });
}