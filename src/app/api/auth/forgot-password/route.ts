import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/csrf";
import { env } from "@/lib/env";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const limit = await rateLimit(`forgot-password:${ip}`, 5, 60 * 15);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user) {
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60)
      }
    });

    const resetUrl = `${env.SITE_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your CoupenOfficial password",
      html: `
        <p>You requested a password reset for your CoupenOfficial account.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      `
    });
  }

  return NextResponse.json({ ok: true });
}