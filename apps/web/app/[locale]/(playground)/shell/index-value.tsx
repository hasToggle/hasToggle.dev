import { BakeSwatch } from "../bake-swatch";
import { getBake } from "./bake";

/**
 * The cache chapter's reading on the contents page: the current bake,
 * straight from the same tagged entry the exhibit serves. Press rebake on
 * either page and this row changes with it — one entry, shared by every
 * visitor, and by every page that reads it.
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
