import { describe, expect, test } from "bun:test";
import { REVEALS } from "./reveals";

describe("REVEALS", () => {
  test("four rows, in the order the presenter walks them", () => {
    expect(REVEALS.map((r) => r.id)).toEqual([
      "skipped",
      "bent",
      "left",
      "reached",
    ]);
  });

  test("every row carries both columns of the annotation", () => {
    for (const r of REVEALS) {
      expect(r.insideLoop.length).toBeGreaterThan(0);
      expect(r.outsideLoop.length).toBeGreaterThan(0);
    }
  });

  test("the bent row is a diff whose two sides differ", () => {
    const bent = REVEALS.find((r) => r.id === "bent");
    expect(bent?.evidence.kind).toBe("diff");
    if (bent?.evidence.kind === "diff") {
      expect(bent.evidence.added).not.toBe(bent.evidence.removed);
    }
  });
});
