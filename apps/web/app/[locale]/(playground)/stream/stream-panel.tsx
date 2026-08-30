"use client";

import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { LivePanel } from "../live-panel";
import {
  SEAMS,
  STEP_ONE_LABEL,
  STEP_THREE_DETAIL,
  STEP_THREE_LABEL,
  STEP_TWO_DETAIL,
  STEP_TWO_LABEL,
  VIEW_LABEL,
} from "./copy";
import { MAX_RUN_ID } from "./parse-run-id";
import { StageGhosts } from "./row";
import { StageSignalProvider } from "./stage-signals";
import { nextStrategy, STRATEGY_ORDER, type Strategy } from "./strategy";
import { Axis, ShellBar } from "./timeline";

// The outline variant's `disabled:` look re-expressed for `aria-disabled`,
// so a locked step stays focusable and keyboard users keep their place when
// the sequence moves past it. Same trick as the boundary deck.
const LOCKED_LOOK = cn(
  "aria-disabled:bg-transparent aria-disabled:opacity-40",
  "aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent"
);

// The nudge: the step that continues the walk wears the instrument's cyan
// on its ring, so the hand knows where to go next.
const ARMED_LOOK = "ring-ht-cyan-700/50 dark:ring-ht-cyan-400/50";

const STEPS: Record<
  Strategy,
  { detail?: string; label: string; mark: string }
> = {
  blocking: { label: STEP_ONE_LABEL, mark: "1" },
  loading: { detail: STEP_TWO_DETAIL, label: STEP_TWO_LABEL, mark: "2" },
  parts: { detail: STEP_THREE_DETAIL, label: STEP_THREE_LABEL, mark: "3" },
};

/** The mono step marker inside a deck button — real sequence, so real numbers. */
function StepMark({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="mr-2 select-none font-mono text-muted-foreground text-xs"
    >
      {n}
    </span>
  );
}

interface DeckStepProps {
  /** True for the step that continues the walk — it wears the nudge. */
  armed: boolean;
  locked: boolean;
  onSelect: (step: Strategy) => void;
  /** The arrow before every step but the first: the deck is a sequence. */
  precedes: boolean;
  step: Strategy;
}

/** One arrangement, as the developer's own act of moving the boundary. */
function DeckStep({ armed, locked, onSelect, precedes, step }: DeckStepProps) {
  const handleClick = useCallback(() => {
    if (!locked) {
      onSelect(step);
    }
  }, [locked, onSelect, step]);
  const { detail, label, mark } = STEPS[step];

  return (
    <div className="flex items-center gap-3">
      {precedes ? (
        <span
          aria-hidden="true"
          className="select-none font-mono text-muted-foreground/50"
        >
          →
        </span>
      ) : null}
      <MarketingButton
        aria-disabled={locked}
        className={cn(LOCKED_LOOK, armed && ARMED_LOOK)}
        onClick={handleClick}
        variant="outline"
      >
        <StepMark n={mark} />
        {label}
        {detail ? (
          <span className="ml-2 font-mono text-muted-foreground text-xs">
            {detail}
          </span>
        ) : null}
      </MarketingButton>
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
 * arrangement the deck is showing, which view the body is drawn in, and the
 * gauge.
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
  const [strategy, setStrategy] = useState<Strategy>("blocking");
  const [run, setRun] = useState(0);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [view, setView] = useState<"page" | "response">("page");
  // Latches once the walk has reached the end: from there the deck is a
  // three-way switch, because comparing the arrangements is the point and
  // the lock only ever existed to make the introduction happen in order.
  const [unlocked, setUnlocked] = useState(false);

  const onRendered = useCallback((nextRun: number, rendered: Strategy) => {
    setStrategy(rendered);
    setRun(nextRun);
    if (rendered === "parts") {
      setUnlocked(true);
    }
  }, []);

  const onSettled = useCallback((nextRun: number, settled: Strategy) => {
    setSettledKey(`${settled}-${nextRun}`);
  }, []);

  const signals = useMemo(
    () => ({ onRendered, onSettled }),
    [onRendered, onSettled]
  );

  const select = useCallback(
    (target: Strategy) => {
      const nextRun = (run % MAX_RUN_ID) + 1;
      setStrategy(target);
      setRun(nextRun);
      setSettledKey(null);
      if (target === "parts") {
        setUnlocked(true);
      }
      const params = new URLSearchParams(window.location.search);
      params.set("mode", target);
      params.set("stream", String(nextRun));
      const href = `${window.location.pathname}?${params.toString()}`;
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [router, run]
  );

  const handleViewChange = useCallback((checked: boolean) => {
    setView(checked ? "response" : "page");
  }, []);

  const armed = nextStrategy(strategy);
  const working = isPending || settledKey !== `${strategy}-${run}`;

  // No reset here: rewinding this bench means running the first
  // arrangement, and the first deck step already is that button.
  const viewControls = (
    <div className="flex items-center gap-2.5">
      <label
        className="cursor-pointer select-none font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]"
        htmlFor="stream-response-view"
      >
        {VIEW_LABEL}
      </label>
      <Switch
        checked={view === "response"}
        id="stream-response-view"
        onCheckedChange={handleViewChange}
      />
    </div>
  );

  const deck = (
    <div className="flex flex-wrap items-center gap-3">
      {STRATEGY_ORDER.map((step, index) => (
        <DeckStep
          armed={step === armed}
          key={step}
          locked={!(unlocked || step === strategy || step === armed)}
          onSelect={select}
          precedes={index > 0}
          step={step}
        />
      ))}
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
        <p
          className="grid font-mono text-muted-foreground text-xs/5"
          role="status"
        >
          {STRATEGY_ORDER.map((step) => (
            <span
              aria-hidden={step !== strategy}
              className={cn(
                "[grid-area:1/1]",
                step !== strategy && "invisible"
              )}
              key={step}
            >
              {SEAMS[step]}
            </span>
          ))}
        </p>
      </div>
    </LivePanel>
  );
}
