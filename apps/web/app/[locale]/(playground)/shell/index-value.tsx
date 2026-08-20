import { BakeSwatch } from "../bake-swatch";
import { getBake } from "./bake";

/**
 * The cache chapter's reading on the contents page: the current bake,
 * straight from the same tagged entry the exhibit serves. Press rebake
 * anywhere and this row changes with it — one entry, shared by every
 * visitor, and by every page that reads it.
 *
 * One caveat, by construction: build workers bake independently, so a
 * fresh deploy's static shells can open with this row and the landing
 * stamp disagreeing. The first rebake (or an expired cacheLife window)
 * converges them — the runtime entry is shared; the build-time ones were
 * not. See design.md §6.
 */
export async function ShellIndexValue() {
  const bake = await getBake();

  return (
    <span className="inline-flex items-baseline gap-1.5">
      <BakeSwatch className="self-center" id={bake.id} />
      bake #{bake.id}
    </span>
  );
}
