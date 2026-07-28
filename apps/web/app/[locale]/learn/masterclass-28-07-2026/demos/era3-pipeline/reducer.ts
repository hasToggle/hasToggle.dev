export type LaneId = "rag" | "wp" | "deps";

export type LanePhase =
  | "plan"
  | "execute"
  | "validate"
  | "awaiting-signature"
  | "done";

export interface LaneState {
  phase: LanePhase;
  ticksInPhase: number;
}

export interface BoardState {
  lanes: Record<LaneId, LaneState>;
}

export type BoardAction =
  | { type: "tick" }
  | { type: "handOff" }
  | { type: "approveMerge" }
  | { type: "fastForward" }
  | { type: "reset" };

export const EXECUTE_TICKS = 4;
export const VALIDATE_TICKS = 2;

const LANE_IDS: readonly LaneId[] = ["rag", "wp", "deps"];

export function initialBoardState(): BoardState {
  return {
    lanes: {
      deps: { phase: "execute", ticksInPhase: 0 },
      rag: { phase: "plan", ticksInPhase: 0 },
      wp: { phase: "execute", ticksInPhase: 0 },
    },
  };
}

function tickLane(id: LaneId, lane: LaneState): LaneState {
  if (
    lane.phase === "plan" ||
    lane.phase === "awaiting-signature" ||
    lane.phase === "done"
  ) {
    return lane;
  }
  const ticks = lane.ticksInPhase + 1;
  if (lane.phase === "execute") {
    return ticks >= EXECUTE_TICKS
      ? { phase: "validate", ticksInPhase: 0 }
      : { phase: "execute", ticksInPhase: ticks };
  }
  // validate
  if (ticks >= VALIDATE_TICKS) {
    return id === "deps"
      ? { phase: "awaiting-signature", ticksInPhase: 0 }
      : { phase: "done", ticksInPhase: 0 };
  }
  return { phase: "validate", ticksInPhase: ticks };
}

function tickBoard(state: BoardState): BoardState {
  return {
    lanes: {
      deps: tickLane("deps", state.lanes.deps),
      rag: tickLane("rag", state.lanes.rag),
      wp: tickLane("wp", state.lanes.wp),
    },
  };
}

export function isSettled(state: BoardState): boolean {
  return LANE_IDS.every((id) => {
    const { phase } = state.lanes[id];
    return (
      phase === "plan" || phase === "awaiting-signature" || phase === "done"
    );
  });
}

export function isBoardDone(state: BoardState): boolean {
  return LANE_IDS.every((id) => state.lanes[id].phase === "done");
}

export function attentionTarget(
  state: BoardState
): "rag-plan" | "deps-signature" | null {
  if (state.lanes.rag.phase === "plan") {
    return "rag-plan";
  }
  if (state.lanes.deps.phase === "awaiting-signature") {
    return "deps-signature";
  }
  return null;
}

export function boardReducer(
  state: BoardState,
  action: BoardAction
): BoardState {
  switch (action.type) {
    case "tick":
      return tickBoard(state);
    case "handOff":
      if (state.lanes.rag.phase !== "plan") {
        return state;
      }
      return {
        lanes: {
          ...state.lanes,
          rag: { phase: "execute", ticksInPhase: 0 },
        },
      };
    case "approveMerge":
      if (state.lanes.deps.phase !== "awaiting-signature") {
        return state;
      }
      return {
        lanes: {
          ...state.lanes,
          deps: { phase: "done", ticksInPhase: 0 },
        },
      };
    case "fastForward": {
      let next = state;
      while (!isSettled(next)) {
        next = tickBoard(next);
      }
      return next;
    }
    case "reset":
      return initialBoardState();
    default:
      return state;
  }
}
