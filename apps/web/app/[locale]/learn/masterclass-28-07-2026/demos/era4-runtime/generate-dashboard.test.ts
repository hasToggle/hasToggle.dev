import { describe, expect, test } from "bun:test";
import { generateDashboard } from "./generate-dashboard";
import { INTENTS } from "./match";

describe("generateDashboard", () => {
  test("returns a non-empty spec for every known intent question", () => {
    for (const intent of INTENTS) {
      const r = generateDashboard(intent.question);
      expect(r.intent).toBe(intent.id);
      expect(r.matched).toBe(true);
      expect(r.spec.widgets.length).toBeGreaterThan(0);
      expect(r.spec.title.length).toBeGreaterThan(0);
    }
  });

  test("falls back to a valid spec for an unrecognized question", () => {
    const r = generateDashboard("what's the weather like");
    expect(r.matched).toBe(false);
    expect(r.spec.widgets.length).toBeGreaterThan(0);
  });
});
