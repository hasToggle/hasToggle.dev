import { cn } from "@repo/design-system/lib/utils";
import { AXIS_ORIGIN, SHELL_CHUNK, SHELL_ROW_LABEL } from "./copy";
import { TIMELINE_MAX_MS, TIMELINE_TICKS_MS, trackPercent } from "./rows";
import type { Strategy } from "./strategy";

/**
 * The two presentations of one run. Every streamed unit emits both — the
 * page row and the response bar — and the stage's `data-view` decides which
 * one has a size. Switching views is therefore a CSS change, not a re-run:
 * the same chunks, drawn the other way, mid-flight if you like.
 */
export const PAGE_ONLY = "group-data-[view=response]/stage:hidden";
export const RESPONSE_ONLY = "group-data-[view=page]/stage:hidden";

// Three columns: what arrived, when it arrived drawn, when it arrived read.
// The track holds geometry only, so no number ever sits at a position that
// contradicts it. Narrow screens drop the track to its own full-width line
// rather than squeezing it — a 90px axis measures nothing.
const TRACK_GRID = cn(
  "grid grid-cols-[minmax(0,1fr)_5rem] items-center gap-x-3 gap-y-1",
  "sm:grid-cols-[7.5rem_minmax(0,1fr)_5rem] sm:gap-y-0"
);

/** The track's cell: second on wide screens, its own row on narrow ones. */
const TRACK_CELL = "order-3 col-span-2 sm:order-2 sm:col-span-1";

/** The reading's cell: last on wide screens, beside the label on narrow ones. */
const READING_CELL = "order-2 text-right sm:order-3";

/** A bar with nothing in it is still a bar — give the zero a mark. */
const MIN_FILL_PERCENT = 0.6;

/** The tick lines the axis labels, drawn inside every track so they align. */
function Ticks() {
  return TIMELINE_TICKS_MS.slice(1, -1).map((ms) => (
    <span
      aria-hidden="true"
      className="absolute inset-y-0 w-px bg-foreground/10"
      key={ms}
      style={{ left: `${trackPercent(ms)}%` }}
    />
  ));
}

interface BarProps {
  /** What this chunk carried, set where the bar starts — the shell's line. */
  cargo?: string;
  label: string;
  /** Still behind its boundary: the track pulses instead of measuring. */
  pending?: boolean;
  /** How far along the axis this landed, as a percentage of its top. */
  percent: number;
  value: string;
}

/** One row of the response view: what arrived, and how far in. */
export function Bar({ cargo, label, pending, percent, value }: BarProps) {
  return (
    <div className={cn(TRACK_GRID, RESPONSE_ONLY)}>
      <span className="order-1 truncate font-mono text-muted-foreground text-xs">
        {label}
      </span>
      <span
        className={cn(
          "relative block h-7 overflow-hidden rounded-md border border-foreground/10 bg-muted/30",
          TRACK_CELL
        )}
      >
        <Ticks />
        <span
          className={cn(
            "absolute inset-y-0 left-0",
            pending
              ? "w-full bg-foreground/5 motion-safe:animate-pulse"
              : "bg-ht-cyan-500/30 dark:bg-ht-cyan-400/25"
          )}
          style={
            pending
              ? undefined
              : { width: `${Math.max(percent, MIN_FILL_PERCENT)}%` }
          }
        />
        {cargo ? (
          <span className="absolute inset-y-0 left-3 flex items-center font-mono text-muted-foreground text-xs">
            {cargo}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          READING_CELL,
          "font-mono text-xs",
          pending
            ? "text-muted-foreground"
            : "text-ht-cyan-800/85 dark:text-ht-cyan-300/85"
        )}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * The response view's first row: the chunk that left before any work had
 * finished. It costs nothing to send, so it gets the sliver it earns — and
 * what changes between arrangements is what it carried.
 */
export function ShellBar({ strategy }: { strategy: Strategy }) {
  return (
    <Bar
      cargo={SHELL_CHUNK[strategy]}
      label={SHELL_ROW_LABEL}
      percent={0}
      value="+0 ms"
    />
  );
}

/** The axis under the bars, and the one thing a tick can't say for itself. */
export function Axis() {
  return (
    <div className={cn("flex flex-col gap-1.5", RESPONSE_ONLY)}>
      <div className={TRACK_GRID}>
        <span className="order-1 hidden sm:block" />
        <span
          className={cn(
            "relative block h-3.5 font-mono text-[0.65rem] text-muted-foreground",
            TRACK_CELL
          )}
        >
          {TIMELINE_TICKS_MS.map((ms) => (
            <span
              className="absolute"
              key={ms}
              style={
                ms === 0
                  ? { left: 0 }
                  : {
                      left: `${trackPercent(ms)}%`,
                      transform:
                        ms === TIMELINE_MAX_MS
                          ? "translateX(-100%)"
                          : "translateX(-50%)",
                    }
              }
            >
              {ms === 0 ? "0" : `${ms / 1000}s`}
            </span>
          ))}
        </span>
        <span className={cn("hidden sm:block", READING_CELL)} />
      </div>
      <p className={cn(TRACK_GRID, "font-mono text-[0.65rem]")}>
        <span className="order-1 hidden sm:block" />
        <span className={cn(TRACK_CELL, "text-muted-foreground/70")}>
          {AXIS_ORIGIN}
        </span>
        <span className={cn("hidden sm:block", READING_CELL)} />
      </p>
    </div>
  );
}
