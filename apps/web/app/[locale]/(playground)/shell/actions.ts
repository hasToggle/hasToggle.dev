"use server";

import { updateTag } from "next/cache";

export interface RebakeResult {
  rebakedAt: string;
}

/**
 * Expires the `landing-shell` cache entry immediately (read-your-own-writes),
 * so the visitor who pressed the button sees the new bake in the same
 * round-trip. `revalidateTag` would refresh it lazily in the background;
 * for a demo, "watch it change right now" is the whole point.
 */
// biome-ignore lint/suspicious/useAwait: server actions must be async functions, even when nothing awaits
export async function rebakeShell(): Promise<RebakeResult> {
  updateTag("landing-shell");
  return { rebakedAt: new Date().toISOString() };
}
