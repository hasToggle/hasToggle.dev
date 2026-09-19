import { BakeSwatch } from "../bake-swatch";
import { getBake } from "./bake";

/**
 * The cache chapter's reading on the contents page: the current entry,
 * straight from the same tagged entry the exhibit serves. Press rebake
 * anywhere and this row changes with it — one entry, shared by every
 * visitor, and by every page that reads it.
 *
 * That sharing is only true because the entry is `use cache: remote`.
 * With plain `use cache` each page's regeneration minted its own bake and
 * the three surfaces never agreed again (observed live, 2026-09-19). Any
 * future reading that a second page also renders needs the same store —
 * see design.md §4 (index readings) and §6.
 */
export async function ShellIndexValue() {
  const bake = await getBake();

  return (
    <span className="inline-flex items-baseline gap-1.5">
      <BakeSwatch className="self-center" id={bake.id} />
      entry #{bake.id}
    </span>
  );
}
