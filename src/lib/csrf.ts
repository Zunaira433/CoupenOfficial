import { env } from "@/lib/env";

/**
 * Lightweight CSRF defense: verify the request's Origin (or Referer as a
 * fallback) matches our own site. This is the standard mitigation for
 * same-origin cookie-authenticated APIs and works alongside the
 * `sameSite=lax` cookie flag already set on the auth cookie.
 */
export function isSameOriginRequest(req: Request): boolean {
  
 
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const allowedOrigin = new URL(env.SITE_URL).origin;

  // Allow localhost during development regardless of NEXT_PUBLIC_SITE_URL.
  const devOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

  const candidate = origin || referer;
  if (!candidate) {
    // No Origin/Referer at all (some same-site requests omit both) — only
    // tolerate this in development to avoid breaking local testing.
    return process.env.NODE_ENV !== "production";
  }

  try {
    const candidateOrigin = new URL(candidate).origin;
    return candidateOrigin === allowedOrigin || devOrigins.includes(candidateOrigin);
  } catch {
    return false;
  }
}

