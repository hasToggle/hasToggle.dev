import { describe, expect, test } from "bun:test";
import {
  type BoardState,
  boardReducer,
  EXECUTION_CAP_MS,
  formatElapsed,
  inFlightCount,
  initialBoardState,
  isAnyExecuting,
  isBoardDone,
  type LaneId,
} from "./reducer";

function tick(state: BoardState, ms: number): BoardState {
  return boardReducer(state, { ms, type: "tick" });
}

function handOff(state: BoardState, lane: LaneId): BoardState {
  return boardReducer(state, { lane, type: "handOff" });
}

describe("era3 board", () => {
  test("every lane starts planned, so each one needs its own hand-off", () => {
    const s = initialBoardState();
    expect(Object.values(s.lanes).every((l) => l.phase === "planned")).toBe(
      true
    );
    expect(isAnyExecuting(s)).toBe(false);
  });

  test("a lane never advances on its own — only clicks move it", () => {
    let s = handOff(initialBoardState(), "rag");
    for (let i = 0; i < 60; i += 1) {
      s = tick(s, 1000);
    }
    expect(s.lanes.rag.phase).toBe("executing");
  });

  test("the clock runs only for lanes that were handed off", () => {
    const s = tick(handOff(initialBoardState(), "rag"), 3000);
    expect(s.lanes.rag.elapsedMs).toBe(3000);
    expect(s.lanes.wp.elapsedMs).toBe(0);
    expect(s.lanes.deps.elapsedMs).toBe(0);
  });

  test("lanes run in parallel, each on its own clock", () => {
    let s = handOff(initialBoardState(), "rag");
    s = tick(s, 2000);
    s = handOff(s, "wp");
    s = tick(s, 2000);
    expect(s.lanes.rag.elapsedMs).toBe(4000);
    expect(s.lanes.wp.elapsedMs).toBe(2000);
    expect(inFlightCount(s)).toBe(2);
  });

  test("done stops the clock without moving the work to validation", () => {
    let s = tick(handOff(initialBoardState(), "rag"), 5000);
    s = boardReducer(s, { lane: "rag", type: "markDone" });
    expect(s.lanes.rag.phase).toBe("executed");
    s = tick(s, 9000);
    expect(s.lanes.rag.elapsedMs).toBe(5000);
    // Still mine to carry: stopped is not accepted.
    expect(inFlightCount(s)).toBe(1);
  });

  test("validation cannot be reached while the clock is still running", () => {
    const running = tick(handOff(initialBoardState(), "rag"), 2000);
    expect(boardReducer(running, { lane: "rag", type: "toValidation" })).toBe(
      running
    );
  });

  test("the clock stops at the hidden cap, and the lane keeps waiting", () => {
    let s = handOff(initialBoardState(), "rag");
    s = tick(s, EXECUTION_CAP_MS + 60_000);
    expect(s.lanes.rag.elapsedMs).toBe(EXECUTION_CAP_MS);
    expect(s.lanes.rag.phase).toBe("executing");
  });

  test("transitions are refused out of order", () => {
    const s = initialBoardState();
    expect(boardReducer(s, { lane: "rag", type: "toValidation" })).toBe(s);
    expect(boardReducer(s, { lane: "rag", type: "accept" })).toBe(s);
    const executing = handOff(s, "rag");
    expect(boardReducer(executing, { lane: "rag", type: "accept" })).toBe(
      executing
    );
  });

  test("a second hand-off does not restart a running lane", () => {
    const running = tick(handOff(initialBoardState(), "rag"), 4000);
    expect(handOff(running, "rag")).toBe(running);
  });

  test("the board is done only once all three are accepted", () => {
    let s = initialBoardState();
    for (const lane of ["rag", "wp", "deps"] as LaneId[]) {
      // Four clicks a lane: hand off, done, validate, accept.
      s = handOff(s, lane);
      s = boardReducer(s, { lane, type: "markDone" });
      s = boardReducer(s, { lane, type: "toValidation" });
      expect(isBoardDone(s)).toBe(false);
      s = boardReducer(s, { lane, type: "accept" });
    }
    expect(isBoardDone(s)).toBe(true);
    expect(inFlightCount(s)).toBe(0);
  });

  test("reset returns to the initial state", () => {
    const s = tick(handOff(initialBoardState(), "rag"), 8000);
    expect(boardReducer(s, { type: "reset" })).toEqual(initialBoardState());
  });
});

describe("formatElapsed", () => {
  test("pads seconds and rolls into minutes", () => {
    expect(formatElapsed(0)).toBe("0:00");
    expect(formatElapsed(7000)).toBe("0:07");
    expect(formatElapsed(65_000)).toBe("1:05");
    expect(formatElapsed(EXECUTION_CAP_MS)).toBe("5:00");
  });
});
