export type LaneId = "rag" | "wp" | "deps";

/**
 * A lane never moves on its own. Every transition is a click, because the
 * point of the board is where the human's attention goes: you hand work off,
 * you decide when it comes back, and the agent owns everything in between.
 */
export type LanePhase =
  | "planned"
  | "executing"
  | "executed"
  | "validating"
  | "validated";

export interface LaneState {
  /** Frozen the moment the lane leaves `executing`. */
  elapsedMs: number;
  phase: LanePhase;
}

export interface BoardState {
  lanes: Record<LaneId, LaneState>;
}

/**
 * `markDone` only stops the clock; `toValidation` only moves the work. They
 * are separate because they are separate judgments: the agent finishing is not
 * the same event as me deciding the result is worth validating.
 */
export type BoardAction =
  | { type: "handOff"; lane: LaneId }
  | { type: "markDone"; lane: LaneId }
  | { type: "toValidation"; lane: LaneId }
  | { type: "accept"; lane: LaneId }
  | { type: "tick"; ms: number }
  | { type: "reset" };

/**
 * A run that nobody stops would otherwise count into the hours while the talk
 * moves on. The cap is deliberately not shown: the lane stays executing, the
 * clock just stops being interesting.
 */
export const EXECUTION_CAP_MS = 5 * 60 * 1000;

const LANE_IDS: readonly LaneId[] = ["rag", "wp", "deps"];

export function initialBoardState(): BoardState {
  return {
    lanes: {
      deps: { elapsedMs: 0, phase: "planned" },
      rag: { elapsedMs: 0, phase: "planned" },
      wp: { elapsedMs: 0, phase: "planned" },
    },
  };
}

/** Whether anything is on the clock, so the UI can idle its interval. */
export function isAnyExecuting(state: BoardState): boolean {
  return LANE_IDS.some((id) => state.lanes[id].phase === "executing");
}

export function isBoardDone(state: BoardState): boolean {
  return LANE_IDS.every((id) => state.lanes[id].phase === "validated");
}

/** Lanes handed off but not yet accepted — what I am still carrying. */
export function inFlightCount(state: BoardState): number {
  return LANE_IDS.filter((id) => {
    const { phase } = state.lanes[id];
    return phase !== "planned" && phase !== "validated";
  }).length;
}

export function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function advance(
  state: BoardState,
  id: LaneId,
  from: LanePhase,
  to: LanePhase
): BoardState {
  const lane = state.lanes[id];
  if (lane.phase !== from) {
    return state;
  }
  return {
    lanes: { ...state.lanes, [id]: { ...lane, phase: to } },
  };
}

export function boardReducer(
  state: BoardState,
  action: BoardAction
): BoardState {
  switch (action.type) {
    case "handOff":
      return advance(state, action.lane, "planned", "executing");
    case "markDone":
      return advance(state, action.lane, "executing", "executed");
    case "toValidation":
      return advance(state, action.lane, "executed", "validating");
    case "accept":
      return advance(state, action.lane, "validating", "validated");
    case "tick": {
      if (!isAnyExecuting(state)) {
        return state;
      }
      const lanes = { ...state.lanes };
      for (const id of LANE_IDS) {
        const lane = lanes[id];
        if (lane.phase === "executing") {
          lanes[id] = {
            ...lane,
            elapsedMs: Math.min(lane.elapsedMs + action.ms, EXECUTION_CAP_MS),
          };
        }
      }
      return { lanes };
    }
    case "reset":
      return initialBoardState();
    default:
      return state;
  }
}
