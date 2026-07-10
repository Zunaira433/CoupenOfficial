import { redis } from "@/lib/redis";

type RateLimitResult = { allowed: boolean; remaining: number; resetSeconds: number };

/**
 * Fixed-window rate limiter backed by Redis.
 * Fails OPEN (allows the request) if Redis is unreachable, so a Redis outage
 * never takes down auth entirely — but logs so it's visible in monitoring.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    const fullKey = `ratelimit:${key}`;
    const current = await redis.incr(fullKey);
    if (current === 1) {
      await redis.expire(fullKey, windowSeconds);
    }
    const ttl = await redis.ttl(fullKey);
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetSeconds: ttl > 0 ? ttl : windowSeconds
    };
  } catch (err) {
    console.error("[rateLimit] Redis unavailable, failing open:", err);
    return { allowed: true, remaining: limit, resetSeconds: windowSeconds };
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}
