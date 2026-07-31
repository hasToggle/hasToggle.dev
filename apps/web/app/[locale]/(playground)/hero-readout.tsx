import { connection } from "next/server";
import { Suspense } from "react";
import { formatStamp } from "./format";
import { getBake } from "./shell/bake";

async function StreamedNow() {
  await connection();
  return <>this line streamed in just for you — {formatStamp(new Date())}</>;
}

/**
 * The page's thesis, stated by the page itself: one line that was baked into
 * the static shell, one line that streamed in at request time. Both heights
 * are fixed, so the arrival is a fact, not a layout shift.
 */
export async function HeroReadout() {
  const bake = await getBake();

  return (
    <aside className="border-ht-cyan-700/30 border-l-2 pl-4 font-mono text-sm/6 dark:border-ht-cyan-500/40">
      <p className="text-ht-cyan-900/70 dark:text-ht-cyan-300/85">
        static shell baked — {formatStamp(new Date(bake.bakedAt))}
      </p>
      <p className="h-6 text-ht-cyan-900/70 dark:text-ht-cyan-300/85">
        <Suspense
          fallback={<span className="opacity-50">waiting for the server…</span>}
        >
          <StreamedNow />
        </Suspense>
      </p>
    </aside>
  );
}
