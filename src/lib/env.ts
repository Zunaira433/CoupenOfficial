


/**
 * Centralized, fail-fast environment validation.
 *
 * In production, missing critical secrets (JWT_SECRET, DATABASE_URL) must
 * crash the app loudly at boot rather than silently falling back to an
 * insecure default. This module is imported by anything that needs these
 * values, so the check runs as early as possible.
 */

function required(name: string, devFallback?: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `[env] Missing required environment variable "${name}" in production. ` +
        `Refusing to start with an insecure default.`
    );
  }

  if (devFallback !== undefined) return devFallback;

  throw new Error(`[env] Missing required environment variable "${name}".`);
}

export const env = {
  JWT_SECRET: required("JWT_SECRET", "dev-only-insecure-secret-do-not-use-in-prod"),
  DATABASE_URL: required("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/coupenofficial"),
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://coupenofficial.com",
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""
};
