import { Suspense } from "react";
import { parseRunId } from "./parse-run-id";
import { RowSkeleton } from "./row-skeleton";
import { STREAM_ROWS } from "./rows";
import { SlowRow } from "./slow-row";

interface StreamRowsProps {
  searchParams: Promise<{ stream?: string }>;
}

/**
 * Reads the `?stream=` run id (runtime data — that's why the whole thing sits
 * behind Suspense in the page) and keys each row's boundary with it. A new
 * run id means new boundaries, which means fresh fallbacks, which means you
 * get to watch the server cook again.
 */
export async function StreamRows({ searchParams }: StreamRowsProps) {
  const { stream } = await searchParams;
  const run = parseRunId(stream);

  return (
    <div className="flex flex-col gap-3">
      {STREAM_ROWS.map((row) => (
        <Suspense
          fallback={<RowSkeleton delayMs={row.delayMs} />}
          key={`run-${run}-${row.label}`}
        >
          <SlowRow delayMs={row.delayMs} label={row.label} />
        </Suspense>
      ))}
    </div>
  );
}

export function StreamRowsFallback() {
  return (
    <div className="flex flex-col gap-3">
      {STREAM_ROWS.map((row) => (
        <RowSkeleton delayMs={row.delayMs} key={row.label} />
      ))}
    </div>
  );
}
