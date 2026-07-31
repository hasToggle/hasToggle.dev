import { setTimeout as sleep } from "node:timers/promises";
import { connection } from "next/server";
import { formatClock } from "../format";

interface SlowRowProps {
  delayMs: number;
  label: string;
}

/**
 * Deliberately slow on purpose, on the server, per request. `connection()`
 * marks this as request-time work — which is exactly why it must live inside
 * a `<Suspense>` boundary: the static shell ships immediately and this row
 * streams in whenever it's done.
 */
export async function SlowRow({ delayMs, label }: SlowRowProps) {
  await connection();
  await sleep(delayMs);
  const arrivedAt = formatClock(new Date());

  return (
    <div className="flex items-baseline justify-between gap-4 rounded-lg border border-ht-cyan-700/20 bg-ht-cyan-50/60 px-4 py-3 dark:border-ht-cyan-500/25 dark:bg-ht-cyan-950/25">
      <p className="text-foreground/85 text-sm/6">{label}</p>
      <p className="whitespace-nowrap font-mono text-ht-cyan-800/85 text-xs dark:text-ht-cyan-300/85">
        {delayMs} ms · landed {arrivedAt}
      </p>
    </div>
  );
}
