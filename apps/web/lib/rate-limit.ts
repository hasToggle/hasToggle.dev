import { keys as rateLimitKeys } from "@repo/rate-limit/keys";

/**
 * A sliding-window limiter for the two forms that send mail.
 *
 * Production has no Upstash keys today, so the Redis limiter in
 * `@repo/rate-limit` would be a no-op there. This one runs in memory when
 * Redis is absent: per function instance, reset on cold start, so it bounds
 * a burst rather than a patient attacker. That is still the difference
 * between a script sending a confirmation mail per request and one sending a
 * handful per instance per window. A platform-level rule (Vercel WAF rate
 * limiting) is the stronger tool and needs no code; this is the floor under
 * it. When Upstash is configured the same calls share a window across
 * instances.
 */
export interface RateLimitResult {
  readonly success: boolean;
}

export interface RateLimiter {
  readonly limit: (key: string) => Promise<RateLimitResult>;
}

export interface Window {
  readonly limit: number;
  readonly ms: number;
}

const MAX_TRACKED_KEYS = 10_000;

export function createMemoryLimiter(
  window: Window,
  now: () => number = Date.now
): RateLimiter {
  const hits = new Map<string, number[]>();

  const prune = (stamps: number[], cutoff: number) => {
    let i = 0;
    while (i < stamps.length && (stamps[i] as number) <= cutoff) {
      i += 1;
    }
    return i === 0 ? stamps : stamps.slice(i);
  };

  return {
    limit(key) {
      const current = now();
      const cutoff = current - window.ms;
      const recent = prune(hits.get(key) ?? [], cutoff);

      if (recent.length >= window.limit) {
        hits.set(key, recent);
        return Promise.resolve({ success: false });
      }

      if (hits.size >= MAX_TRACKED_KEYS && !hits.has(key)) {
        // Drop the oldest tracked key rather than grow without bound.
        const oldest = hits.keys().next().value;
        if (oldest !== undefined) {
          hits.delete(oldest);
        }
      }

      recent.push(current);
      hits.set(key, recent);
      return Promise.resolve({ success: true });
    },
  };
}

async function createRedisLimiter(
  window: Window,
  prefix: string
): Promise<RateLimiter> {
  const { createRateLimiter, slidingWindow } = await import("@repo/rate-limit");
  const seconds = Math.max(1, Math.round(window.ms / 1000));
  const limiter = createRateLimiter({
    limiter: slidingWindow(window.limit, `${seconds} s`),
    prefix: `has-toggle:${prefix}`,
  });
  return {
    async limit(key) {
      const { success } = await limiter.limit(key);
      return { success };
    },
  };
}

const redisConfigured = () => {
  const env = rateLimitKeys();
  return Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
};

/**
 * One limiter per (prefix, window), created on first use. The memory
 * variant lives for the instance; the Redis variant is stateless here.
 */
const limiters = new Map<string, Promise<RateLimiter>>();

/** Forgets every window. For tests that share a process. */
export function resetRateLimiters(): void {
  limiters.clear();
}

export function rateLimiter(
  prefix: string,
  window: Window
): Promise<RateLimiter> {
  const id = `${prefix}:${window.limit}:${window.ms}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    limiter = redisConfigured()
      ? createRedisLimiter(window, prefix)
      : Promise.resolve(createMemoryLimiter(window));
    limiters.set(id, limiter);
    // A failed construction is not kept: the next call tries again rather
    // than answering every request for the instance's lifetime with the
    // same rejection.
    limiter.catch(() => limiters.delete(id));
  }
  return limiter;
}

/**
 * The caller's address as Vercel reports it. `x-real-ip` is set by the
 * platform; the leftmost `x-forwarded-for` entry is the fallback. Neither
 * present means no per-IP key at all — better no limit than one bucket
 * shared by everyone behind a missing header.
 */
export function clientIp(headers: Headers): string | null {
  const real = headers.get("x-real-ip")?.trim();
  if (real) {
    return real;
  }
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || null;
}
