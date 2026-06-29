import { describe, expect, test } from "bun:test";
import { bandFor, PROMPTS, selectCompletion } from "./selector";

describe("era1 selector", () => {
  test("bandFor splits the temperature range", () => {
    expect(bandFor(0.1)).toBe("low");
    expect(bandFor(0.7)).toBe("mid");
    expect(bandFor(1.3)).toBe("high");
  });

  test("selectCompletion returns the band-specific continuation", () => {
    const fn = PROMPTS.find((p) => p.id === "reverse-fn");
    expect(fn).toBeDefined();
    expect(selectCompletion("reverse-fn", 0.1)).toBe(fn!.continuations.low);
    expect(selectCompletion("reverse-fn", 1.3)).toBe(fn!.continuations.high);
  });

  test("the question prompt never answers — it continues into more questions", () => {
    const q = PROMPTS.find((p) => p.id === "how-do-i");
    expect(q?.isQuestion).toBe(true);
    // Every continuation keeps asking rather than answering.
    for (const band of ["low", "mid", "high"] as const) {
      expect(q?.continuations[band]).toContain("?");
    }
  });

  test("unknown id falls back to an empty string (never throws)", () => {
    expect(selectCompletion("nope", 0.5)).toBe("");
  });
});
