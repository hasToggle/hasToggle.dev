import { describe, expect, test } from "bun:test";
import {
  stateAskLine,
  stateRenderLine,
  varProofClicked,
  varProofDeclared,
  WIPE_CHIP,
} from "./copy";

describe("state exhibit narration", () => {
  test("the variable's proof line names the render that declared it", () => {
    expect(varProofDeclared(1)).toBe("let count = 0 · declared by render #1");
    expect(varProofDeclared(4)).toBe(
      "let count = 0 · re-declared by render #4"
    );
  });

  test("the clicked proof line reports the value the screen never saw", () => {
    expect(varProofClicked(3)).toBe("count = 3 · the screen hasn’t heard");
  });

  test("the ask line carries the stale closure read", () => {
    expect(stateAskLine(4, 3)).toBe(
      "1 · setCount(4) — inside this click, count still reads 3"
    );
  });

  test("the render line reports the paint that caught up", () => {
    expect(stateRenderLine(4, 6)).toBe("2 · render #6 — count now reads 4");
  });

  test("prose apostrophes are typographic (voice.md §8)", () => {
    expect(varProofClicked(1)).not.toContain("'");
    expect(WIPE_CHIP).not.toContain("'");
  });
});
