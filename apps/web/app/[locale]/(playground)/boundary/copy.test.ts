import { describe, expect, test } from "bun:test";
import {
  CROSSED_ERROR,
  DIRECTIVE_LINES,
  FACTS,
  REFUSAL_ERROR,
  SEAMS,
  SIDES,
  STEP_THREE_DETAIL,
  STEP_TWO_LABEL,
} from "./copy";

const BEATS = ["rest", "refused", "crossed", "split"] as const;

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

  test("the second refusal is verbatim too, and names the separate file", () => {
    expect(CROSSED_ERROR).toBe(
      'It is not allowed to define inline "use cache" annotated functions in Client Components.\nTo use "use cache" functions in a Client Component, you can either export them from a separate file with "use cache" or "use server" at the top, or pass them down through props from a Server Component.'
    );
    expect(CROSSED_ERROR).toContain("separate file");
  });
});

describe("the beats", () => {
  test("the directive appears exactly once, on the crossed card, in real syntax", () => {
    expect(DIRECTIVE_LINES.crossed).toBe('"use client";');
    expect(DIRECTIVE_LINES.rest).toBe("// no directive");
    expect(DIRECTIVE_LINES.refused).toBe("// no directive");
    expect(DIRECTIVE_LINES.split).toBe("// no directive");
  });

  test("card.tsx crosses the boundary once and comes back with the split", () => {
    expect(SIDES.rest).toBe("server");
    expect(SIDES.refused).toBe("server");
    expect(SIDES.crossed).toBe("client");
    expect(SIDES.split).toBe("server");
  });

  test("the split names the file that carries the directive", () => {
    expect(FACTS.split[0]).toContain(STEP_THREE_DETAIL);
    expect(SEAMS.split).toContain("Client Component");
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
