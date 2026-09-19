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
 * Six hex characters, so the fingerprint IS a CSS color — the swatch beside
 * it renders the literal value, nothing derived, nothing truncated.
 *
 * The hero, the shell demo, the caching chapter and the contents row all
 * read this, so they must never disagree — which is why the directive says
 * `remote`. Plain `use cache` is the memory of whichever instance rendered
 * it, and on Vercel every page regenerates on its own instance, so the
 * contents row and the chapter page each minted a bake of their own and
 * never converged (observed live, 2026-09-19). `remote` is the platform's
 * shared store (Vercel Runtime Cache, per region): one entry, every reader.
 */
// biome-ignore lint/suspicious/useAwait: `use cache` only works on async functions, even when nothing awaits
export async function getBake(): Promise<Bake> {
  "use cache: remote";
  cacheTag("landing-shell");
  cacheLife("days");

  return {
    bakedAt: new Date().toISOString(),
    id: crypto.randomUUID().slice(0, 6),
  };
}
