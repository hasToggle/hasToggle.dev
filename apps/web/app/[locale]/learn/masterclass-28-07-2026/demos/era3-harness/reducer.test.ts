import { describe, expect, test } from "bun:test";
import {
  harnessReducer,
  initialHarnessState,
  isClear,
  remainingCount,
} from "./reducer";

function run(state = initialHarnessState()) {
  return harnessReducer(state, { type: "run" });
}

describe("era3 harness reducer", () => {
  test("starts with pending diffs and the iframe excepted, not validated", () => {
    const s = initialHarnessState();
    expect(s.validated).toBe(false);
    expect(s.diffs.some((d) => d.status === "excepted")).toBe(true);
    expect(remainingCount(s)).toBeGreaterThan(0);
  });

  test("excepted items never count toward remaining", () => {
    const s = initialHarnessState();
    const pending = s.diffs.filter((d) => d.status === "pending").length;
    expect(remainingCount(s)).toBe(pending);
  });

  test("tick resolves the next pending diff and logs it", () => {
    const s = run();
    const t = harnessReducer(s, { type: "tick" });
    expect(remainingCount(t)).toBe(remainingCount(s) - 1);
    expect(t.log.length).toBeGreaterThan(s.log.length);
  });

  test("ticking to zero clears all pending; isClear becomes true", () => {
    let s = run();
    while (remainingCount(s) > 0) {
      s = harnessReducer(s, { type: "tick" });
    }
    expect(isClear(s)).toBe(true);
    expect(s.running).toBe(false);
  });

  test("validate only succeeds when clear", () => {
    const notClear = run();
    expect(harnessReducer(notClear, { type: "validate" }).validated).toBe(false);
    let s = run();
    while (remainingCount(s) > 0) {
      s = harnessReducer(s, { type: "tick" });
    }
    expect(harnessReducer(s, { type: "validate" }).validated).toBe(true);
  });

  test("reset returns to the initial state", () => {
    let s = run();
    s = harnessReducer(s, { type: "tick" });
    const r = harnessReducer(s, { type: "reset" });
    expect(remainingCount(r)).toBe(remainingCount(initialHarnessState()));
    expect(r.validated).toBe(false);
  });
});
