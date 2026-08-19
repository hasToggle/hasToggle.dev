import { connection } from "next/server";
import { Suspense } from "react";
import { BakeSwatch } from "./bake-swatch";
import { formatStamp } from "./format";
import { getBake } from "./shell/bake";

async function StreamedNow() {
  await connection();
  return (
    <>
      this line streamed in just for you —{" "}
      <span className="tabular-nums">{formatStamp(new Date())}</span>
    </>
  );
}

/**
 * The page's thesis, stated by the page itself: one line naming a value that
 * was minted before you arrived, one line that streamed in at request time.
 * Both heights are fixed, so the arrival is a fact, not a layout shift.
 *
 * The first line states the fingerprint and when it was minted, and claims
 * nothing about where it came from — a Server Action re-renders this route
 * too, so during a re-bake the value here is the private render, and any
 * "served from the static shell" wording would be false exactly when the
 * visitor is most likely to check it.
 */
export async function HeroReadout() {
  const bake = await getBake();

  return (
    <aside className="border-ht-cyan-700/30 border-l-2 pl-4 font-mono text-ht-cyan-900/85 text-sm/6 dark:border-ht-cyan-500/40 dark:text-ht-cyan-300/85">
      {/*
        Three parts, three treatments, all of them above 4.5:1 on both
        backgrounds — the fingerprint is vivid and half a weight up because
        it is the thing worth noticing, the label and the stamp stay quiet,
        and `tabular-nums` stops the digits shuffling as the seconds change.
      */}
      <p className="h-6">
        <span>bake</span> <BakeSwatch className="mr-1" id={bake.id} />
        <span className="font-medium text-ht-cyan-800 dark:text-ht-cyan-200">
          #{bake.id}
        </span>
        <span aria-hidden="true" className="px-2 opacity-40">
          ·
        </span>
        <span className="tabular-nums">
          {formatStamp(new Date(bake.bakedAt))}
        </span>
      </p>
      <p className="h-6">
        <Suspense
          fallback={<span className="opacity-50">waiting for the server…</span>}
        >
          <StreamedNow />
        </Suspense>
      </p>
    </aside>
  );
}
