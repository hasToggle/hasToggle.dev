import { describe, expect, test } from "bun:test";
import { LADDER_STAGES } from "./stages";

describe("LADDER_STAGES", () => {
  test("has exactly three chronological stages", () => {
    expect(LADDER_STAGES.length).toBe(3);
    expect(LADDER_STAGES.map((s) => s.year)).toEqual(["2024", "2025", "2026"]);
  });

  test("2024 keeps the literature-student line verbatim", () => {
    expect(LADDER_STAGES[0].line).toContain("like a literature student");
  });

  test("each stage shows a distinct artifact kind", () => {
    expect(LADDER_STAGES.map((s) => s.artifact)).toEqual([
      "diff",
      "plan",
      "design",
    ]);
  });

  test("the reading visibly shrinks: artifact body lines decrease", () => {
    const [a, b, c] = LADDER_STAGES;
    expect(a.body.length).toBeGreaterThan(b.body.length);
    expect(b.body.length).toBeGreaterThan(c.body.length);
  });
});
