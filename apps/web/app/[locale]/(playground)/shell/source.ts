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
  return { rebakedAt: new Date().toISOString() };
}
`;
