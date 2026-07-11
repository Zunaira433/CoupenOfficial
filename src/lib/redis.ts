import Redis from "ioredis";

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    connectTimeout: 1500,
    commandTimeout: 1500,
    retryStrategy: () => null
  });

redis.on("error", () => {
  // Swallow connection errors globally so they never crash a request —
  // caching is a performance optimization, not a required dependency.
});

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export async function cacheGetOrSet<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached) as T;
  } catch {
    // Redis unavailable, fall through to DB
  }
  const data = await fetcher();
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch {}
  return data;
}

/** Invalidate one or more cache keys, e.g. after an admin create/update/delete. */
export async function cacheInvalidate(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (err) {
    console.error("[cacheInvalidate] failed:", err);
  }
}

/** Invalidate every key matching a prefix (uses SCAN, safe for production). */
export async function cacheInvalidatePrefix(prefix: string): Promise<void> {
  try {
    const stream = redis.scanStream({ match: `${prefix}*`, count: 100 });
    const keys: string[] = [];
    for await (const batch of stream) keys.push(...(batch as string[]));
    if (keys.length) await redis.del(...keys);
  } catch (err) {
    console.error("[cacheInvalidatePrefix] failed:", err);
  }
}
