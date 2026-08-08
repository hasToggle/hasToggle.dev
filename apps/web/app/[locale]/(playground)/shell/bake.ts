import { cacheLife, cacheTag } from "next/cache";

export interface Bake {
  bakedAt: string;
  id: string;
}

/**
 * The page's own cache entry. Runs once, lands in the static shell, and is
 * served as-is until someone presses the re-bake button (updateTag) or the
 * cache lifetime runs out. The random id exists so a re-bake is undeniable —
 * timestamps invite squinting, fingerprints don't.
 *
 * The hero and the shell demo both read this, so they can never disagree.
 */
// biome-ignore lint/suspicious/useAwait: `use cache` only works on async functions, even when nothing awaits
export async function getBake(): Promise<Bake> {
  "use cache";
  cacheTag("landing-shell");
  cacheLife("days");

  return {
    bakedAt: new Date().toISOString(),
    id: crypto.randomUUID().slice(0, 8),
  };
}
