import { BakeSwatch } from "../bake-swatch";
import { formatStamp } from "../format";
import type { Bake } from "./bake";

interface BakedStampProps {
  bake: Bake;
}

/**
 * The fingerprint and the moment it was minted — the two things that are true
 * of this bake no matter which render produced it. Where it came from is a
 * different question, and one that changes when you press the button, so the
 * panel below answers it instead.
 */
export function BakedStamp({ bake }: BakedStampProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-display font-medium text-4xl text-foreground tracking-tight sm:text-5xl">
        bake <BakeSwatch className="mr-1 align-[0.02em]" id={bake.id} />
        <span className="text-ht-cyan-700 dark:text-ht-cyan-300">
          #{bake.id}
        </span>
      </p>
      <dl className="grid gap-1 font-mono text-muted-foreground text-sm/6">
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-muted-foreground/60">baked</dt>
          <dd>{formatStamp(new Date(bake.bakedAt))}</dd>
        </div>
      </dl>
    </div>
  );
}
