import { cn } from "@repo/design-system/lib/utils";
import {
  BAR_PENDING,
  barLanded,
  GROUP_BAR_LABEL,
  GROUP_PENDING,
  rowLanded,
  rowPending,
} from "./copy";
import { SLOWEST_MS, STREAM_ROWS, trackPercent } from "./rows";
import { Bar, PAGE_ONLY } from "./timeline";

// Narrow screens stack the label above its readout rather than letting the
// two share a line and clip: the second number is the argument, so it never
// goes off the edge.
const ROW_SHAPE = cn(
  "flex flex-col gap-1 rounded-lg px-4 py-3",
  "sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
);

interface RowProps {
  delayMs: number;
  label: string;
  short: string;
}

/**
 * A row that has reached the browser. Two readings, deliberately: what the
 * work cost, and when it arrived. In the belief's arrangement those two
 * numbers disagree for every row but the slowest, and that gap is the
 * chapter's whole argument — so it is a column, not a sentence.
 */
export function LandedRow({
  delayMs,
  label,
  landedMs,
  short,
}: RowProps & { landedMs: number }) {
  return (
    <>
      <div
        className={cn(
          ROW_SHAPE,
          "border border-ht-cyan-700/20 bg-ht-cyan-50/60 dark:border-ht-cyan-500/25 dark:bg-ht-cyan-950/25",
          PAGE_ONLY
        )}
      >
        <p className="text-foreground/85 text-sm/6">{label}</p>
        <p className="whitespace-nowrap font-mono text-ht-cyan-800/85 text-xs dark:text-ht-cyan-300/85">
          {rowLanded(delayMs, landedMs)}
        </p>
      </div>
      <Bar
        label={short}
        percent={trackPercent(landedMs)}
        value={barLanded(landedMs)}
      />
    </>
  );
}

/**
 * What a Suspense fallback is: the honest placeholder the shell ships while
 * the server finishes. Same height as the real row, so nothing jumps — and
 * the price tag is already known, because the work was always going to cost
 * what it costs.
 */
export function PendingRow({ delayMs, label, short }: RowProps) {
  return (
    <>
      <div
        className={cn(
          ROW_SHAPE,
          "border border-foreground/10 bg-muted/30",
          PAGE_ONLY
        )}
      >
        <div className="h-5 w-40 max-w-full rounded bg-foreground/10 motion-safe:animate-pulse" />
        <span className="sr-only">{label}</span>
        <p className="whitespace-nowrap font-mono text-muted-foreground text-xs">
          {rowPending(delayMs)}
        </p>
      </div>
      <Bar label={short} pending percent={0} value={BAR_PENDING} />
    </>
  );
}

/** Row-shaped, invisible, load-bearing: it reserves a row's height. */
function GhostRow() {
  return (
    <div aria-hidden="true" className={cn(ROW_SHAPE, "invisible border")}>
      <p className="text-sm/6">&nbsp;</p>
      <p className="font-mono text-xs">&nbsp;</p>
    </div>
  );
}

/**
 * One boundary's fallback, standing in for all three rows at once — which
 * is what a single `loading.tsx` does to a segment. It takes the height of
 * everything behind it, so the placeholder is the size of its promise.
 */
export function GroupPending() {
  return (
    <>
      <div
        className={cn(
          "grid rounded-lg border border-foreground/10 border-dashed bg-muted/30",
          PAGE_ONLY
        )}
      >
        <div
          aria-hidden="true"
          className="flex flex-col gap-3 p-0 [grid-area:1/1]"
        >
          {STREAM_ROWS.map((row) => (
            <GhostRow key={row.label} />
          ))}
        </div>
        <div className="flex items-center justify-center [grid-area:1/1]">
          <p className="font-mono text-muted-foreground text-xs motion-safe:animate-pulse">
            {GROUP_PENDING}
          </p>
        </div>
      </div>
      <Bar label={GROUP_BAR_LABEL} pending percent={0} value={BAR_PENDING} />
    </>
  );
}

/**
 * The stage's height, reserved by the thing that will fill it. Rendered
 * invisible behind every arrangement so the deck never moves when a run
 * starts with an empty specimen — which the belief's arrangement always
 * does.
 */
export function StageGhosts() {
  return STREAM_ROWS.map((row) => (
    <LandedRow
      delayMs={row.delayMs}
      key={row.label}
      label={row.label}
      landedMs={SLOWEST_MS}
      short={row.short}
    />
  ));
}
