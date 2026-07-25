import { describe, expect, test } from "bun:test";
import { OUTPUT_COLUMNS, OUTPUT_LINES, PROMPTS } from "./completions";
import { type Band, bandFor } from "./selector";

const BANDS: Band[] = ["low", "mid", "high"];

/** Every string the output panel can ever be asked to render. */
function everyRendering(): string[] {
  const out: string[] = [];
  for (const prompt of PROMPTS) {
    for (const band of BANDS) {
      out.push(prompt.prefix + prompt.continuations[band]);
      out.push(prompt.prefix + prompt.instructAnswers[band]);
    }
  }
  return out;
}

describe("era1 output geometry", () => {
  test("no rendering exceeds the reserved line count", () => {
    for (const text of everyRendering()) {
      expect(text.split("\n").length).toBeLessThanOrEqual(OUTPUT_LINES);
    }
  });

  test("no line is wide enough to wrap into a second one", () => {
    for (const text of everyRendering()) {
      for (const line of text.split("\n")) {
        expect(line.length).toBeLessThanOrEqual(OUTPUT_COLUMNS);
      }
    }
  });

  test("bandFor covers every reserved band", () => {
    expect(BANDS.map((b) => b)).toEqual(["low", "mid", "high"]);
    expect(bandFor(0.1)).toBe("low");
    expect(bandFor(0.7)).toBe("mid");
    expect(bandFor(1.4)).toBe("high");
  });
});
