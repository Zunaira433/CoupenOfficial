import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

export type CurrentUser = { userId: string; role: "USER" | "ADMIN"; email: string };

const COOKIE_NAME = "token";

export function getCurrentUser(): CurrentUser | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, env.JWT_SECRET) as CurrentUser;
  } catch {
    return null;
  }
}

export function signUserToken(payload: CurrentUser): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "90d" });
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 90
  };
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;

/** Throws-style guard for use at the top of server pages/route handlers. */
export function requireUser(): CurrentUser {
  const user = getCurrentUser();
  if (!user) throw new AuthError("Not authenticated", 401);
  return user;
}

export function requireAdmin(): CurrentUser {
  const user = requireUser();
  if (user.role !== "ADMIN") throw new AuthError("Forbidden", 403);
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
