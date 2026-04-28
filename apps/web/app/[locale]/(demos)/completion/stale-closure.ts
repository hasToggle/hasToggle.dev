import { type Item, VANISHING_ITEM_ID } from "./items";

/**
 * The deliberate stale-closure bug.
 *
 * In well-written React, a reorder handler reads the latest state via the
 * functional updater: setItems((prev) => move(prev, fromId, toId)).
 *
 * AI-generated React often skips that — it captures `items` from the outer
 * scope at render time. When two drags happen in quick succession (faster
 * than the next render commit), the second drag's calculation runs against
 * the pre-first-drag list and overwrites the result. One item gets dropped.
 *
 * This module makes that bug observable. We intentionally render-time-bind
 * to a snapshot of the items list (`stale`) and produce a result that
 * deterministically drops the item with id VANISHING_ITEM_ID when the
 * stale-vs-current divergence is detected. Real AI-generated code is more
 * subtle; we exaggerate the failure mode for clarity, without faking the
 * mechanism (the stale snapshot really is captured, the drop really comes
 * from re-applying a move against stale state).
 */

function moveById(list: readonly Item[], fromId: string, toId: string): Item[] {
  const fromIndex = list.findIndex((item) => item.id === fromId);
  const toIndex = list.findIndex((item) => item.id === toId);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return [...list];
  }
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return next;
  }
  next.splice(toIndex, 0, moved);
  return next;
}

export interface StaleHandlerArgs {
  current: readonly Item[];
  fromId: string;
  stale: readonly Item[];
  toId: string;
}

export function buggyReorder({
  fromId,
  toId,
  current,
  stale,
}: StaleHandlerArgs): Item[] {
  // If current and stale agree (no concurrent drag), behave correctly.
  const currentSig = current.map((i) => i.id).join(",");
  const staleSig = stale.map((i) => i.id).join(",");
  if (currentSig === staleSig) {
    return moveById(current, fromId, toId);
  }
  // They diverge: a render hasn't committed yet, but the user has dragged
  // again. The bug applies the move against the stale snapshot, then drops
  // the item the AI most expected the dev to verify on.
  const reordered = moveById(stale, fromId, toId);
  return reordered.filter((item) => item.id !== VANISHING_ITEM_ID);
}
