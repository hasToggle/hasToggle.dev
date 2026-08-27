import { setTimeout as sleep } from "node:timers/promises";
import { connection } from "next/server";
import { Suspense } from "react";
import { GroupPending, LandedRow, PendingRow } from "./row";
import { STREAM_ROWS } from "./rows";
import { StageRendered, StageSettled } from "./stage-signals";
import type { Strategy } from "./strategy";

interface RunProps {
  run: number;
  strategy: Strategy;
}

/**
 * The belief, as a component: every await finished before anything is
 * returned. All three rows therefore carry the same arrival, because they
 * left the server in the same chunk — the fast query's own 400 ms is
 * spent, and then it waits.
 */
async function GroupRows({ run, strategy }: RunProps) {
  await connection();
  const startedAt = Date.now();
  await Promise.all(STREAM_ROWS.map((row) => sleep(row.delayMs)));
  const landedMs = Date.now() - startedAt;

  return (
    <>
      {STREAM_ROWS.map((row) => (
        <LandedRow
          delayMs={row.delayMs}
          key={row.label}
          label={row.label}
          landedMs={landedMs}
          short={row.short}
        />
      ))}
      <StageSettled run={run} strategy={strategy} />
    </>
  );
}

interface SlowRowProps extends RunProps {
  delayMs: number;
  label: string;
  /** The last row to arrive carries the run's settled signal. */
  last: boolean;
  short: string;
}

/**
 * Deliberately slow, on the server, per request — and awaiting nothing but
 * its own work. `connection()` marks this as request-time, which is exactly
 * why it must sit inside a `<Suspense>` boundary: the shell ships first and
 * this row follows whenever it is done.
 */
async function SlowRow({
  delayMs,
  label,
  last,
  run,
  short,
  strategy,
}: SlowRowProps) {
  await connection();
  const startedAt = Date.now();
  await sleep(delayMs);
  const landedMs = Date.now() - startedAt;

  return (
    <>
      <LandedRow
        delayMs={delayMs}
        label={label}
        landedMs={landedMs}
        short={short}
      />
      {last ? <StageSettled run={run} strategy={strategy} /> : null}
    </>
  );
}

/**
 * The specimen. Three arrangements of the same three data calls, and the
 * only thing that moves between them is the boundary:
 *
 * - `blocking` — one boundary, no fallback: nothing on screen until the
 *   slowest call is done, which is the sentence at the top of this page.
 * - `loading` — the same boundary with a fallback, which is all a
 *   `loading.tsx` is: you see something at once, you get everything late.
 * - `parts` — a boundary per row, so each one arrives on its own clock.
 *
 * The run id is in every boundary key, so pressing a deck step the panel is
 * already showing tears the boundaries down and cooks the whole thing again.
 */
export function Stage({ run, strategy }: RunProps) {
  const runKey = `${strategy}-${run}`;

  if (strategy === "parts") {
    return (
      <>
        <StageRendered run={run} strategy={strategy} />
        {STREAM_ROWS.map((row, index) => (
          <Suspense
            fallback={
              <PendingRow
                delayMs={row.delayMs}
                label={row.label}
                short={row.short}
              />
            }
            key={`${runKey}-${row.label}`}
          >
            <SlowRow
              delayMs={row.delayMs}
              label={row.label}
              last={index === STREAM_ROWS.length - 1}
              run={run}
              short={row.short}
              strategy={strategy}
            />
          </Suspense>
        ))}
      </>
    );
  }

  return (
    <>
      <StageRendered run={run} strategy={strategy} />
      <Suspense
        fallback={strategy === "loading" ? <GroupPending /> : null}
        key={runKey}
      >
        <GroupRows run={run} strategy={strategy} />
      </Suspense>
    </>
  );
}
