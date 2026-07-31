import { formatStamp } from "../format";
import { getBake } from "./bake";

/**
 * What the visitor sees inside the shell demo panel: the bake fingerprint,
 * large, plus the facts. Cached with the `landing-shell` tag — pressing
 * re-bake replaces all of it, for everyone, at once.
 */
export async function BakedStamp() {
  const bake = await getBake();

  return (
    <div className="flex flex-col gap-4">
      <p className="font-display font-medium text-4xl text-foreground tracking-tight sm:text-5xl">
        bake{" "}
        <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
          #{bake.id}
        </span>
      </p>
      <dl className="grid gap-1 font-mono text-muted-foreground text-sm/6">
        <div className="flex gap-3">
          <dt className="text-muted-foreground/60">baked</dt>
          <dd>{formatStamp(new Date(bake.bakedAt))}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-muted-foreground/60">served</dt>
          <dd>from the static shell — no server render for you</dd>
        </div>
      </dl>
    </div>
  );
}
