import { describe, expect, test } from "bun:test";
import {
  DIRECTIVE_LINES,
  FACTS,
  SEAMS,
  SIDES,
  STEP_DETAIL,
  STEP_LABEL,
} from "./copy";

const BEATS = ["rest", "split"] as const;

describe("the beats", () => {
  test("card.tsx never carries the directive — the button's file does", () => {
    expect(DIRECTIVE_LINES.rest).toBe("// no directive");
    expect(DIRECTIVE_LINES.split).toBe("// no directive");
  });

  test("card.tsx stays on the server in both states", () => {
    expect(SIDES.rest).toBe("server");
    expect(SIDES.split).toBe("server");
  });

  test("the split names both files by residency, and the seam states the rule", () => {
    expect(FACTS.split[0]).toContain("Server Component");
    expect(FACTS.split[1]).toContain(STEP_DETAIL);
    expect(FACTS.split[1]).toContain("Client Component");
    expect(SEAMS.split).toContain(
      "Server Component can import a Client Component"
    );
  });

  test("the rest state lists what the server side can do", () => {
    expect(FACTS.rest[0]).toContain("Node");
    expect(FACTS.rest[1]).toContain("0 kB");
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

  test("the deck step is a subject action with its file as detail", () => {
    expect(STEP_LABEL).toBe("Add a copy button");
    expect(STEP_DETAIL).toBe("copy-button.tsx");
  });
});
