/**
 * Mock PATCH /items/reorder endpoint.
 *
 * The deliberate bug: the write goes to a stale-keyed bucket that the read
 * never visits. The agent's claim ("Wired up PATCH /items/reorder for
 * persistence") is true at the network level — the request is made, the
 * response is 200 — but false at the artifact level. After a remount the
 * read returns the original order.
 *
 * This is the documented real-world AI failure mode: agent wires the
 * request, the response is OK, the persistence step is wrong. We surface
 * the bug as authored-on-purpose so the source is honest about the lie.
 */

import { INITIAL_ITEMS, type Item } from "./items";

const READ_KEY = "completion-demo:order";
// Deliberate bug: writes go here, reads come from READ_KEY. Never aligned.
const WRITE_KEY_PREFIX = "completion-demo:write-";

interface PatchResponse {
  ok: true;
  status: 200;
}

function safeStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export async function patchOrder(
  order: readonly Item[]
): Promise<PatchResponse> {
  const storage = safeStorage();
  if (storage) {
    // The bug: each write picks a fresh key based on Date.now(). The read
    // path uses READ_KEY, which is never written. The agent could "prove"
    // the request fires (it does) and "prove" something is in localStorage
    // (it is) — but the read path never sees any of it.
    storage.setItem(`${WRITE_KEY_PREFIX}${Date.now()}`, JSON.stringify(order));
  }
  // Mock network latency.
  await new Promise((resolve) => setTimeout(resolve, 120));
  return { status: 200, ok: true };
}

export function loadPersistedOrder(): readonly Item[] {
  const storage = safeStorage();
  if (!storage) {
    return INITIAL_ITEMS;
  }
  const raw = storage.getItem(READ_KEY);
  if (!raw) {
    return INITIAL_ITEMS;
  }
  try {
    return JSON.parse(raw) as readonly Item[];
  } catch {
    return INITIAL_ITEMS;
  }
}

export function clearPersistedOrder(): void {
  const storage = safeStorage();
  if (!storage) {
    return;
  }
  // Clean only our own keys, not the whole localStorage.
  const keysToRemove: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && (key === READ_KEY || key.startsWith(WRITE_KEY_PREFIX))) {
      keysToRemove.push(key);
    }
  }
  for (const key of keysToRemove) {
    storage.removeItem(key);
  }
}
