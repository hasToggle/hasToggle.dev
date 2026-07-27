import { describe, expect, test } from "bun:test";
import { advanceLoop, LAST_LOOP_STEP, LOOP_STEPS } from "./sequence";

describe("era3 loop sequence", () => {
  test("starts with a message and ends with a response", () => {
    expect(LOOP_STEPS[0].kind).toBe("message");
    expect(LOOP_STEPS.at(-1)?.kind).toBe("respond");
  });

  test("walks forward one step at a time", () => {
    expect(advanceLoop(0)).toBe(1);
  });

  test("stops at the end instead of wrapping", () => {
    expect(advanceLoop(LAST_LOOP_STEP)).toBeNull();
  });

  test("tools appear between thinking", () => {
    expect(LOOP_STEPS.some((s) => s.kind === "tool")).toBe(true);
    expect(LOOP_STEPS.some((s) => s.kind === "think")).toBe(true);
  });
});
