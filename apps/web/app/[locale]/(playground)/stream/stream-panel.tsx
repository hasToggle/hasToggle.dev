"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { LivePanel } from "../live-panel";
import { StableStack } from "../stable-stack";
import { ViewSwitch } from "../view-switch";
import {
  ARRANGEMENT_DETAILS,
  ARRANGEMENT_LABELS,
  RUN_AGAIN_LABEL,
  SEAMS,
  VIEW_LABEL,
} from "./copy";
import { MAX_RUN_ID } from "./parse-run-id";
import { StageGhosts } from "./row";
import { streamHref } from "./search-params";
import { StageSignalProvider } from "./stage-signals";
import { DEFAULT_STRATEGY, STRATEGY_ORDER, type Strategy } from "./strategy";
import { Axis, ShellBar } from "./timeline";

// The segmented control: three arrangements as one radio group. The chosen
// segment is filled and reads as "this is what is running"; the others are
// quiet until hovered. No lock, no nudge — these are peers, and the reader
// may take them in any order.
const SEGMENT_LOOK = cn(
  "inline-flex cursor-pointer select-none items-center gap-2 px-3 py-[calc(0.375rem-1px)]",
  "whitespace-nowrap font-medium text-muted-foreground text-sm",
  "transition-colors hover:text-foreground",
  "focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ht-cyan-500/60",
  "aria-checked:bg-muted aria-checked:text-foreground"
);

interface SegmentProps {
  checked: boolean;
  onSelect: (target: Strategy) => void;
  strategy: Strategy;
}

/** One arrangement, as a radio the reader can pick in any order. */
function Segment({ checked, onSelect, strategy }: SegmentProps) {
  const handleClick = useCallback(
    () => onSelect(strategy),
    [onSelect, strategy]
  );
  const detail = ARRANGEMENT_DETAILS[strategy];

  return (
    // biome-ignore lint/a11y/useSemanticElements: a native radio cannot trigger a router navigation on select without a form; the button-as-radio pattern keeps the group's keyboard contract (arrow keys, one tab stop) in ArrangementPicker.
    <button
      aria-checked={checked}
      className={cn(SEGMENT_LOOK, "first:rounded-l-lg last:rounded-r-lg")}
      data-strategy={strategy}
      onClick={handleClick}
      role="radio"
      tabIndex={checked ? 0 : -1}
      type="button"
    >
      {ARRANGEMENT_LABELS[strategy]}
      {detail ? (
        <span className="font-mono text-muted-foreground/80 text-xs">
          {detail}
        </span>
      ) : null}
    </button>
  );
}

const ARROW_DELTAS: Record<string, number> = {
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -1,
};

interface ArrangementPickerProps {
  onSelect: (target: Strategy) => void;
  value: Strategy;
}

/**
 * The radio group, with the arrow keys doing what a radio group's arrow keys
 * do: move the choice, and with it the page.
 */
function ArrangementPicker({ onSelect, value }: ArrangementPickerProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const delta = ARROW_DELTAS[event.key];
      if (delta === undefined) {
        return;
      }
      event.preventDefault();
      const index = STRATEGY_ORDER.indexOf(value);
      const next =
        STRATEGY_ORDER[
          (index + delta + STRATEGY_ORDER.length) % STRATEGY_ORDER.length
        ];
      if (next) {
        onSelect(next);
        const target = event.currentTarget.querySelector<HTMLButtonElement>(
          `[data-strategy="${next}"]`
        );
        target?.focus();
      }
    },
    [onSelect, value]
  );

  return (
    <div
      aria-label="Arrangement"
      className="inline-flex divide-x divide-border rounded-lg shadow ring-1 ring-border"
      onKeyDown={handleKeyDown}
      role="radiogroup"
    >
      {STRATEGY_ORDER.map((strategy) => (
        <Segment
          checked={strategy === value}
          key={strategy}
          onSelect={onSelect}
          strategy={strategy}
        />
      ))}
    </div>
  );
}

/**
 * The stage's one column, rendered twice: once invisible to hold the height
 * and once for real. The shell bar and the axis belong to the response
 * view, so they sit here rather than inside the streamed content — they are
 * the chrome of a reading, not part of it.
 */
function StageColumn({
  children,
  strategy,
}: {
  children: React.ReactNode;
  strategy: Strategy;
}) {
  return (
    <div className="flex flex-col gap-3">
      <ShellBar strategy={strategy} />
      {children}
      <Axis />
    </div>
  );
}

interface StreamPanelProps {
  /** The stage, rendered on the server in whichever arrangement is running. */
  children: React.ReactNode;
  references: React.ReactNode;
}

/**
 * The client owner of the stream instrument. It owns three things: which
 * arrangement the picker is showing, which view the body is drawn in, and
 * the gauge.
 *
 * The arrangement itself is a server fact — a press writes `?mode=` and
 * `?stream=` and the server re-renders the specimen with its boundaries
 * somewhere else — so the panel mirrors rather than decides: the stage
 * reports the arrangement it actually ran (`StageRendered`) and the moment
 * its last chunk lands (`StageSettled`). That second signal is what the
 * gauge is wired to, because the navigation finishes long before the
 * response does, and a gauge that goes quiet while the belief's arrangement
 * is still holding a blank specimen would be the panel's first lie.
 */
export function StreamPanel({ children, references }: StreamPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [strategy, setStrategy] = useState<Strategy>(DEFAULT_STRATEGY);
  const [run, setRun] = useState(0);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [view, setView] = useState<"page" | "response">("page");

  const onRendered = useCallback((nextRun: number, rendered: Strategy) => {
    setStrategy(rendered);
    setRun(nextRun);
  }, []);

  const onSettled = useCallback((nextRun: number, settled: Strategy) => {
    setSettledKey(`${settled}-${nextRun}`);
  }, []);

  const navigate = useCallback(
    (target: Strategy, nextRun: number) => {
      setStrategy(target);
      setRun(nextRun);
      setSettledKey(null);
      const href = streamHref(
        `${window.location.pathname}${window.location.search}`,
        { mode: target, stream: nextRun }
      );
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [router]
  );

  const select = useCallback(
    (target: Strategy) => navigate(target, (run % MAX_RUN_ID) + 1),
    [navigate, run]
  );

  // The first run of a stage that waited to be seen. Separate from `select`
  // so the signals stay stable: `select` changes with every run, and a new
  // signals object would re-fire the stage's own effects mid-transition.
  const start = useCallback(
    (target: Strategy) => navigate(target, 1),
    [navigate]
  );

  const signals = useMemo(
    () => ({ onRendered, onSettled, start }),
    [onRendered, onSettled, start]
  );

  const handleViewChange = useCallback((checked: boolean) => {
    setView(checked ? "response" : "page");
  }, []);

  const runAgain = useCallback(() => select(strategy), [select, strategy]);
  const working = isPending || settledKey !== `${strategy}-${run}`;

  // No reset here: there is no "start" to rewind to — every arrangement is
  // one press away, and "run again" replays the one that is showing.
  const viewControls = (
    <ViewSwitch
      checked={view === "response"}
      id="stream-response-view"
      label={VIEW_LABEL}
      onCheckedChange={handleViewChange}
    />
  );

  const deck = (
    <div className="flex flex-wrap items-center gap-3">
      <ArrangementPicker onSelect={select} value={strategy} />
      <MarketingButton disabled={working} onClick={runAgain} variant="outline">
        {RUN_AGAIN_LABEL}
      </MarketingButton>
    </div>
  );

  return (
    <LivePanel
      deck={deck}
      references={references}
      status={working ? "working" : "live"}
      viewControls={viewControls}
    >
      <div className="flex flex-col gap-5">
        {/* Two copies of the stage in one grid cell: the invisible one holds
            the height so the deck never moves when a run starts on a blank
            specimen, which the belief's arrangement always does. `data-view`
            here is what decides whether the page rows or the response bars
            have a size — one stream, two drawings. */}
        <div className="group/stage grid" data-view={view}>
          <div aria-hidden="true" className="invisible [grid-area:1/1]">
            <StageColumn strategy={strategy}>
              <StageGhosts />
            </StageColumn>
          </div>
          <div className="[grid-area:1/1]">
            <StageColumn strategy={strategy}>
              <StageSignalProvider value={signals}>
                {children}
              </StageSignalProvider>
            </StageColumn>
          </div>
        </div>
        {/* The seam, narrated: the one fact this arrangement proves. The
            ghosts reserve the tallest seam's height for the same reason. */}
        <StableStack
          active={strategy}
          as="p"
          className="font-mono text-muted-foreground text-xs/5"
          role="status"
          variants={STRATEGY_ORDER.map((step) => ({
            key: step,
            node: SEAMS[step],
          }))}
        />
      </div>
    </LivePanel>
  );
}
