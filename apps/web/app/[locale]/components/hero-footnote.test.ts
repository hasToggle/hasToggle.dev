import { describe, expect, test } from "bun:test";
import nextPackage from "next/package.json";
import { NEXT_MAJOR } from "./hero-footnote";

/**
 * The hero footnote is a readout, and voice.md §2 says a readout that cannot
 * be filled with true facts means the panel is not finished. It names a
 * Next.js major, which §7 would otherwise call a line waiting to go stale —
 * so the staleness is a failing test rather than a thing someone notices.
 */
describe("the hero footnote", () => {
  test("names the Next.js major the app actually installs", () => {
    const [installed] = nextPackage.version.split(".");
    expect(NEXT_MAJOR).toBe(installed);
  });
});
