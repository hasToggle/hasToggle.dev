"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useReducer } from "react";
import { LANES, type LaneMeta } from "./lanes";
import {
  attentionTarget,
  boardReducer,
  type BoardState,
  initialBoardState,
  isBoardDone,
  isSettled,
  type LanePhase,
} from "./reducer";

const TICK_MS = 700;
const PHASES = ["plan", "execute", "validate"] as const;
type Column = (typeof PHASES)[number];

const PHASE_COLUMN: Record<LanePhase, Column> = {
  plan: "plan",
  execute: "execute",
  validate: "validate",
  "awaiting-signature": "validate",
  done: "validate",
};

export function Era3Pipeline() {
  const [state, dispatch] = useReducer(
    boardReducer,
    undefined,
    initialBoardState
  );

  useEffect(() => {
    if (isSettled(state)) {
      return;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      dispatch({ type: "fastForward" });
      return;
    }
    const id = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => clearInterval(id);
  }, [state]);

  const target = attentionTarget(state);
  const done = isBoardDone(state);

  return (
    <div className="mt-10 rounded-xl border border-foreground/10 p-4 sm:p-6">
      <p className="font-medium text-sm">Three lanes, one week</p>
      <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
        Three real streams from my board. Every lane runs plan → execute →
        validate. The board runs itself — click where it asks you.
      </p>

      <div className="mt-5 space-y-4">
        {LANES.map((lane) => (
          <LaneRow
            dispatch={dispatch}
            key={lane.id}
            lane={lane}
            state={state}
            target={target}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="max-w-2xl text-foreground/55 text-sm italic">
          {done
            ? "Notice where your clicks went. That's where the job went."
            : "Only one column ever needs you."}
        </p>
        <button
          className="shrink-0 rounded border border-foreground/15 px-3 py-1 text-muted-foreground text-xs hover:text-foreground"
          onClick={() => dispatch({ type: "reset" })}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function LaneRow({
  dispatch,
  lane,
  state,
  target,
}: {
  dispatch: React.Dispatch<Parameters<typeof boardReducer>[1]>;
  lane: LaneMeta;
  state: BoardState;
  target: ReturnType<typeof attentionTarget>;
}) {
  const laneState = state.lanes[lane.id];
  const activeColumn = PHASE_COLUMN[laneState.phase];

  return (
    <div className="rounded-lg border border-foreground/10 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-foreground/80 text-sm">{lane.plain}</p>
        <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
          {lane.mono} · court: {lane.court}
        </p>
      </div>
      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70 italic">
        {lane.tense}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {PHASES.map((column) => (
          <PhaseCell
            column={column}
            dispatch={dispatch}
            key={column}
            lane={lane}
            laneState={laneState}
            reached={PHASES.indexOf(column) <= PHASES.indexOf(activeColumn)}
            target={target}
          />
        ))}
      </div>
    </div>
  );
}

function PhaseCell({
  column,
  dispatch,
  lane,
  laneState,
  reached,
  target,
}: {
  column: Column;
  dispatch: React.Dispatch<Parameters<typeof boardReducer>[1]>;
  lane: LaneMeta;
  laneState: { phase: LanePhase };
  reached: boolean;
  target: ReturnType<typeof attentionTarget>;
}) {
  const isActive = PHASE_COLUMN[laneState.phase] === column;
  const isDone =
    laneState.phase === "done"
      ? reached
      : reached && !isActive;
  const isRagGate =
    lane.id === "rag" && column === "plan" && laneState.phase === "plan";
  const isDepsGate =
    lane.id === "deps" &&
    column === "validate" &&
    laneState.phase === "awaiting-signature";
  const isTargeted =
    (isRagGate && target === "rag-plan") ||
    (isDepsGate && target === "deps-signature");

  return (
    <div
      className={cn(
        "rounded-md border px-2 py-2 text-center font-mono text-[11px]",
        isDone && "border-foreground/10 text-muted-foreground",
        isActive && !isRagGate && !isDepsGate &&
          "animate-pulse border-ht-cyan-500/50 text-foreground",
        !reached && "border-foreground/5 text-muted-foreground/40 opacity-50",
        isTargeted && "ring-2 ring-ht-cyan-500"
      )}
    >
      {isRagGate ? (
        <button
          className="w-full rounded bg-foreground px-2 py-1 text-background"
          onClick={() => dispatch({ type: "handOff" })}
          type="button"
        >
          Hand off →
        </button>
      ) : isDepsGate ? (
        <button
          className="w-full rounded bg-foreground px-2 py-1 text-background"
          onClick={() => dispatch({ type: "approveMerge" })}
          type="button"
        >
          Approve merge ✓
        </button>
      ) : lane.id === "wp" &&
        column === "validate" &&
        laneState.phase === "done" ? (
        <span className="rounded bg-[#238636] px-2 py-0.5 text-white">
          VALIDATED ✓
        </span>
      ) : (
        <span>
          {isDone ? "✓ " : ""}
          {column}
          {lane.id === "deps" && column === "validate" && isDone
            ? " · merged"
            : ""}
        </span>
      )}
    </div>
  );
}
