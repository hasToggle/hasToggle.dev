"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { clientIp, rateLimiter } from "@/lib/rate-limit";

export interface RebakeResult {
  rebakedAt: string;
}

// Every press expires the shell for everyone, so a script looping the
// button would keep the landing page rendering dynamically for every
// visitor. A person pressing as fast as the panel lets them fits well
// inside this; past it the press is acknowledged but changes nothing.
const PER_CALLER = { limit: 30, ms: 1000 * 60 };

/**
 * Expires the `landing-shell` cache entry immediately (read-your-own-writes),
 * so the visitor who pressed the button sees the new bake in the same
 * round-trip. `revalidateTag` would refresh it lazily in the background;
 * for a demo, "watch it change right now" is the whole point.
 */
export async function rebakeShell(): Promise<RebakeResult> {
  const ip = clientIp(await headers());
  if (ip) {
    const limiter = await rateLimiter("rebake", PER_CALLER);
    const { success } = await limiter.limit(ip);
    if (!success) {
      return { rebakedAt: new Date().toISOString() };
    }
  }
  updateTag("landing-shell");
  return { rebakedAt: new Date().toISOString() };
}
