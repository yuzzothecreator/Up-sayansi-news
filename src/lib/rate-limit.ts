import type { RateLimitResult } from "@/types";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

const store = new Map<string, RateLimitEntry>();

function cleanupExpired(now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const existing = store.get(identifier);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(identifier, { count: 1, resetAt });

    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: resetAt,
    };
  }

  if (existing.count >= options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(identifier, existing);

  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - existing.count,
    reset: existing.resetAt,
  };
}

export function getRateLimitKey(prefix: string, identifier: string): string {
  return `${prefix}:${identifier}`;
}

export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

export function clearAllRateLimits(): void {
  store.clear();
}

export type { RateLimitOptions };
