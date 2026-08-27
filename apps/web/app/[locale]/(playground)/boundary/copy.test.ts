import { describe, expect, test } from "bun:test";
import {
  DIRECTIVE_LINES,
  FACTS,
  REFUSAL_ERROR,
  SEAMS,
  SIDES,
  STEP_TWO_LABEL,
} from "./copy";

const BEATS = ["rest", "refused", "hydrated"] as const;

describe("the refusal", () => {
  test("quotes the compiler verbatim (next-swc binary, 2026-08-27)", () => {
    expect(REFUSAL_ERROR).toBe(
      'You\'re importing a component that needs `useState`. This React Hook only works in a Client Component. To fix, mark the file (or its parent) with the `"use client"` directive.'
    );
  });

  test("keeps straight quotes — it is quoted code, not prose (voice.md §8)", () => {
    expect(REFUSAL_ERROR).not.toContain("’");
    expect(REFUSAL_ERROR).not.toContain("“");
  });
});

describe("the beats", () => {
  test("the directive appears exactly once, on the hydrated card, in real syntax", () => {
    expect(DIRECTIVE_LINES.hydrated).toBe('"use client";');
    expect(DIRECTIVE_LINES.rest).toBe("// no directive");
    expect(DIRECTIVE_LINES.refused).toBe("// no directive");
  });

  test("the badge crosses the boundary only when the directive lands", () => {
    expect(SIDES.rest).toBe("server");
    expect(SIDES.refused).toBe("server");
    expect(SIDES.hydrated).toBe("client");
  });

  test("every beat carries three fact rows and a seam", () => {
    for (const beat of BEATS) {
      expect(FACTS[beat]).toHaveLength(3);
      expect(SEAMS[beat].length).toBeGreaterThan(0);
    }
  });
});

describe("register (voice.md §8)", () => {
  test("prose apostrophes are typographic", () => {
    for (const beat of BEATS) {
      for (const line of [...FACTS[beat], SEAMS[beat]]) {
        expect(line).not.toContain("'");
      }
    }
  });

  test("the deck's directive label is real code with straight quotes", () => {
    expect(STEP_TWO_LABEL).toBe('"use client"');
  });
});
