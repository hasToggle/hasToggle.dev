import { describe, expect, test } from "bun:test";
import {
  stepPaints,
  stepRender,
  stepReturns,
  varProofClicked,
  varProofDeclared,
} from "./copy";

describe("state exhibit replay steps", () => {
  test("the render step opens the top-to-bottom re-run", () => {
    expect(stepRender(6)).toBe(
      "render #6 · React runs StateCard() again, top to bottom"
    );
  });

  test("the return step reports the kept value", () => {
    expect(stepReturns(4)).toBe("useState returns 4 — the value React kept");
  });

  test("the paint step closes the loop", () => {
    expect(stepPaints(4)).toBe("paints 4");
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
  });
});
