import { describe, expect, test } from "bun:test";
import { LOOP_STEPS, nextLoopStep } from "./sequence";

describe("era3 loop sequence", () => {
  test("starts with a message and ends with a response", () => {
    expect(LOOP_STEPS[0].kind).toBe("message");
    expect(LOOP_STEPS.at(-1)?.kind).toBe("respond");
  });

  test("the loop wraps", () => {
    expect(nextLoopStep(LOOP_STEPS.length - 1)).toBe(0);
    expect(nextLoopStep(0)).toBe(1);
  });

  test("tools appear between thinking", () => {
    expect(LOOP_STEPS.some((s) => s.kind === "tool")).toBe(true);
    expect(LOOP_STEPS.some((s) => s.kind === "think")).toBe(true);
  });
});
