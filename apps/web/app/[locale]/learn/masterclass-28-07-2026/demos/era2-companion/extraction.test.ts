import { describe, expect, test } from "bun:test";
import { clipTransition, THREAD_ANSWER } from "./extraction";

describe("era2 clipboard machine", () => {
  test("copy then paste is the only path through", () => {
    expect(clipTransition("idle", "paste")).toBe("idle");
    expect(clipTransition("idle", "copy")).toBe("copied");
    expect(clipTransition("copied", "copy")).toBe("copied");
    expect(clipTransition("copied", "paste")).toBe("pasted");
    expect(clipTransition("pasted", "copy")).toBe("pasted");
  });

  test("reset returns to idle from anywhere", () => {
    expect(clipTransition("pasted", "reset")).toBe("idle");
    expect(clipTransition("copied", "reset")).toBe("idle");
  });

  test("the answer is a code block", () => {
    expect(THREAD_ANSWER.length).toBeGreaterThan(0);
    expect(THREAD_ANSWER[0]).toContain("function");
  });
});
