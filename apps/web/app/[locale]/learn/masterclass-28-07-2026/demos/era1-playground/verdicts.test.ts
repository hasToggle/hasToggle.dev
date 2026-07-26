import { describe, expect, test } from "bun:test";
import type { Band, Mode } from "./selector";
import { verdictFor } from "./verdicts";

const BANDS: Band[] = ["low", "mid", "high"];
const MODES: Mode[] = ["base", "instruct"];

describe("era1 verdicts", () => {
  test("every reachable combination has a line", () => {
    for (const band of BANDS) {
      for (const mode of MODES) {
        for (const isQuestion of [true, false]) {
          expect(verdictFor({ band, isQuestion, mode }).length).toBeGreaterThan(
            0
          );
        }
      }
    }
  });

  test("the base machine never answers the question", () => {
    const line = verdictFor({ band: "mid", isQuestion: true, mode: "base" });
    // Assert the reading, not the sentence: the line has to say it declined to
    // answer and name what it did instead, or the beat lands on nothing.
    expect(line).toContain("didn't answer");
    expect(line).toContain("continued");
  });

  test("the dial beat reads the same whichever way the dial was turned", () => {
    const parked = verdictFor({ band: "mid", isQuestion: true, mode: "base" });
    const cold = verdictFor({ band: "low", isQuestion: true, mode: "base" });
    const hot = verdictFor({ band: "high", isQuestion: true, mode: "base" });
    // Turning it either way is the same beat, so it earns one reading...
    expect(cold).toBe(hot);
    // ...and that reading is not the one for the dial sitting where it started.
    expect(cold).not.toBe(parked);
  });

  test("the dial beat explains what temperature is", () => {
    const line = verdictFor({ band: "high", isQuestion: true, mode: "base" });
    expect(line).toContain("temperature");
  });

  test("low and mid share a reading — only the high band is strange", () => {
    expect(verdictFor({ band: "low", isQuestion: false, mode: "base" })).toBe(
      verdictFor({ band: "mid", isQuestion: false, mode: "base" })
    );
  });

  test("post-training did not flatten the dice — the high band still reads differently", () => {
    for (const isQuestion of [true, false]) {
      const low = verdictFor({ band: "low", isQuestion, mode: "instruct" });
      const mid = verdictFor({ band: "mid", isQuestion, mode: "instruct" });
      const high = verdictFor({ band: "high", isQuestion, mode: "instruct" });
      expect(low).toBe(mid);
      expect(high).not.toBe(mid);
    }
  });

  test("the flip names the ChatGPT moment", () => {
    expect(
      verdictFor({ band: "mid", isQuestion: true, mode: "instruct" })
    ).toContain("ChatGPT moment");
  });

  test("no verdict borrows the engineers' register", () => {
    for (const band of BANDS) {
      for (const mode of MODES) {
        for (const isQuestion of [true, false]) {
          const line = verdictFor({ band, isQuestion, mode });
          expect(line).not.toContain("//");
          expect(line).not.toContain("▸");
        }
      }
    }
  });
});
