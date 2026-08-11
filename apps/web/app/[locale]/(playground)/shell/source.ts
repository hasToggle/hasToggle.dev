export const SHELL_SOURCE = `
// bake.ts — the cache entry (lives in the static shell)
export async function getBake() {
  "use cache";
  cacheTag("landing-shell");
  cacheLife("days");
  return {
    bakedAt: new Date().toISOString(),
    id: crypto.randomUUID().slice(0, 8), // the fingerprint
  };
}

// actions.ts — the mutation
"use server";

export async function rebakeShell() {
  updateTag("landing-shell"); // expires it now, for everyone
  // The tag's expiry is stamped after this render finishes, so the bake in
  // this response was cached for nobody. The next request makes the real one.
  return { rebakedAt: new Date().toISOString() };
}
`;
