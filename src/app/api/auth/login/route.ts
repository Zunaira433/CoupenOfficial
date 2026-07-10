import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/csrf";
import { signUserToken, authCookieOptions, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  // Limit by IP to slow down brute force / credential stuffing.
  const limit = await rateLimit(`login:${ip}`, 10, 60 * 15);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.resetSeconds) } }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  // Always compare against a hash, even if the user doesn't exist, so that
  // login timing doesn't leak whether an email is registered.
  const valid = await bcrypt.compare(
    password,
    user?.password || "$2a$12$invalidsaltinvalidsaltinvalidsalAA"
  );
  if (!user || !valid) {
    // Also burn an additional rate-limit point per-email to slow targeted attacks.
    await rateLimit(`login-email:${email}`, 10, 60 * 15);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signUserToken({ userId: user.id, role: user.role, email: user.email });

  const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email, role: user.role } });
  res.cookies.set(AUTH_COOKIE_NAME, token, authCookieOptions());
  return res;
}
