import type { Item } from "./items";

export interface ReorderArgs {
  fromId: string;
  list: readonly Item[];
  toId: string;
}

export function reorder({ fromId, list, toId }: ReorderArgs): Item[] {
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
