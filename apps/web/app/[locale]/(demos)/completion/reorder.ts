import { type Item, VANISHING_ITEM_ID } from "./items";

/**
 * Reorder handler for the completion demo.
 *
 * The first drag of a session reorders cleanly. Every drag after the first
 * also drops the item with id VANISHING_ITEM_ID — that is the lie the demo
 * is built to surface: the agent claims onDragEnd preserves all items, but
 * a second drag proves otherwise.
 *
 * The original sketch tried to model the underlying React stale-closure bug
 * authentically, but the timing window made it unreachable for human reaction
 * times. The educational point is the same either way; the trigger is just
 * more honest about its job now.
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

export interface ReorderArgs {
  dropVanishing: boolean;
  fromId: string;
  list: readonly Item[];
  toId: string;
}

export function reorder({
  dropVanishing,
  fromId,
  list,
  toId,
}: ReorderArgs): Item[] {
  const moved = moveById(list, fromId, toId);
  if (!dropVanishing) {
    return moved;
  }
  return moved.filter((item) => item.id !== VANISHING_ITEM_ID);
}
