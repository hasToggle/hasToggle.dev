import { describe, expect, test } from "bun:test";
import {
  attentionTarget,
  boardReducer,
  type BoardState,
  EXECUTE_TICKS,
  initialBoardState,
  isBoardDone,
  isSettled,
  VALIDATE_TICKS,
} from "./reducer";

const tick = (s: BoardState, n = 1) => {
  let next = s;
  for (let i = 0; i < n; i += 1) {
    next = boardReducer(next, { type: "tick" });
  }
  return next;
};
const AUTO_TICKS = EXECUTE_TICKS + VALIDATE_TICKS;

describe("initial board", () => {
  test("rag plans, wp and deps are already executing", () => {
    const s = initialBoardState();
    expect(s.lanes.rag.phase).toBe("plan");
    expect(s.lanes.wp.phase).toBe("execute");
    expect(s.lanes.deps.phase).toBe("execute");
  });

  test("attention starts at the rag plan gate", () => {
    expect(attentionTarget(initialBoardState())).toBe("rag-plan");
  });
});

describe("automatic lanes", () => {
  test("wp reaches done without any click", () => {
    const s = tick(initialBoardState(), AUTO_TICKS);
    expect(s.lanes.wp.phase).toBe("done");
  });

  test("deps parks at awaiting-signature and never auto-merges", () => {
    const s = tick(initialBoardState(), AUTO_TICKS + 20);
    expect(s.lanes.deps.phase).toBe("awaiting-signature");
  });

  test("rag never leaves plan without the hand-off click", () => {
    const s = tick(initialBoardState(), 50);
    expect(s.lanes.rag.phase).toBe("plan");
  });
});

describe("gates", () => {
  test("handOff moves rag into execute, then ticks carry it to done", () => {
    let s = boardReducer(initialBoardState(), { type: "handOff" });
    expect(s.lanes.rag.phase).toBe("execute");
    s = tick(s, AUTO_TICKS);
    expect(s.lanes.rag.phase).toBe("done");
  });

  test("approveMerge is a no-op until deps awaits a signature", () => {
    const early = boardReducer(initialBoardState(), { type: "approveMerge" });
    expect(early.lanes.deps.phase).toBe("execute");
    const parked = tick(initialBoardState(), AUTO_TICKS);
    const merged = boardReducer(parked, { type: "approveMerge" });
    expect(merged.lanes.deps.phase).toBe("done");
  });
});

describe("attention + completion", () => {
  test("attention moves to the deps signature once rag is handed off", () => {
    let s = boardReducer(initialBoardState(), { type: "handOff" });
    s = tick(s, AUTO_TICKS);
    expect(attentionTarget(s)).toBe("deps-signature");
  });

  test("board completes only after both clicks and all ticks", () => {
    let s = boardReducer(initialBoardState(), { type: "handOff" });
    s = tick(s, AUTO_TICKS);
    expect(isBoardDone(s)).toBe(false);
    s = boardReducer(s, { type: "approveMerge" });
    expect(isBoardDone(s)).toBe(true);
    expect(attentionTarget(s)).toBe(null);
  });
});

describe("fastForward and reset", () => {
  test("fastForward settles the board but holds every gate", () => {
    const s = boardReducer(initialBoardState(), { type: "fastForward" });
    expect(isSettled(s)).toBe(true);
    expect(s.lanes.rag.phase).toBe("plan");
    expect(s.lanes.wp.phase).toBe("done");
    expect(s.lanes.deps.phase).toBe("awaiting-signature");
  });

  test("reset returns to the initial state", () => {
    let s = boardReducer(initialBoardState(), { type: "fastForward" });
    s = boardReducer(s, { type: "reset" });
    expect(s).toEqual(initialBoardState());
  });
});
