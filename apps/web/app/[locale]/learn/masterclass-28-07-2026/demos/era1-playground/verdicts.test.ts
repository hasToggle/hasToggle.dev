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

  test("only the dial beat depends on the dial", () => {
    // Every beat reads the same at every temperature, so what the room hears
    // never depends on where the slider happens to be sitting. The exception is
    // the base question, where turning the dial is itself the next beat and so
    // earns a second reading — one for parked, one for turned.
    for (const mode of MODES) {
      for (const isQuestion of [true, false]) {
        const readings = new Set(
          BANDS.map((band) => verdictFor({ band, isQuestion, mode }))
        );
        const isDialBeat = mode === "base" && isQuestion;
        expect(readings.size).toBe(isDialBeat ? 2 : 1);
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
    expect(cold).toBe(hot);
    expect(cold).not.toBe(parked);
  });

  test("the dial beat explains what temperature is", () => {
    const line = verdictFor({ band: "high", isQuestion: true, mode: "base" });
    expect(line).toContain("temperature");
  });

  test("the flip lands on ChatGPT at every temperature", () => {
    // The era's payoff. It must survive arriving with the dial still cranked
    // from the beat before, which is the path the presenter actually walks.
    for (const band of BANDS) {
      expect(
        verdictFor({ band, isQuestion: true, mode: "instruct" })
      ).toContain("ChatGPT");
    }
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
