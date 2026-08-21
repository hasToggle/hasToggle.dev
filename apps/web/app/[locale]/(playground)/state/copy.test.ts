import { describe, expect, test } from "bun:test";
import {
  RERENDER_CHIP,
  stepPaints,
  stepPress,
  stepRender,
  stepReturns,
  varProofClicked,
  varProofDeclared,
} from "./copy";

describe("state exhibit replay steps", () => {
  test("the press step carries the stale closure read", () => {
    expect(stepPress(4, 3)).toBe(
      "you pressed · setCount(4) — count here still reads 3"
    );
  });

  test("the render step names the call that follows", () => {
    expect(stepRender(6)).toBe("render #6 · React calls StateCard() again");
  });

  test("the return step reports the kept value", () => {
    expect(stepReturns(4)).toBe("useState returns 4 — the value React kept");
  });

  test("the paint step closes the loop", () => {
    expect(stepPaints(4)).toBe("paints 4");
  });

  test("the deck chip states the provable outcome", () => {
    expect(RERENDER_CHIP).toBe("re-rendered · count kept");
  });
});

describe("banked var-card narration (the learning path's half)", () => {
  test("the proof lines survive for the /learn lesson", () => {
    expect(varProofDeclared(1)).toBe("let count = 0 · declared by render #1");
    expect(varProofDeclared(4)).toBe(
      "let count = 0 · re-declared by render #4"
    );
    expect(varProofClicked(3)).toBe("count = 3 · the screen hasn’t heard");
  });

  test("prose apostrophes are typographic (voice.md §8)", () => {
    expect(varProofClicked(1)).not.toContain("'");
    expect(RERENDER_CHIP).not.toContain("'");
  });
});
