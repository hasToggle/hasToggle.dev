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
    expect(line).toContain("There's no one in there to ask");
  });

  test("the high band earns its own reading", () => {
    const mid = verdictFor({ band: "mid", isQuestion: true, mode: "base" });
    const high = verdictFor({ band: "high", isQuestion: true, mode: "base" });
    expect(high).not.toBe(mid);
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
