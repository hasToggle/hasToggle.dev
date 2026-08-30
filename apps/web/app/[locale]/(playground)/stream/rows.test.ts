import { describe, expect, test } from "bun:test";
import {
  FASTEST_MS,
  SLOWEST_MS,
  STREAM_ROWS,
  TIMELINE_MAX_MS,
  TIMELINE_TICKS_MS,
  trackPercent,
} from "./rows";

describe("the three price tags", () => {
  test("the config carries a short label for the axis column", () => {
    for (const row of STREAM_ROWS) {
      expect(row.short.length).toBeLessThanOrEqual(16);
    }
  });

  test("the derived costs come from the rows themselves", () => {
    expect(FASTEST_MS).toBe(400);
    expect(SLOWEST_MS).toBe(1900);
  });
});

describe("the timeline scale", () => {
  test("the axis tops out at a whole second above the slowest row", () => {
    expect(TIMELINE_MAX_MS).toBe(2000);
    expect(TIMELINE_TICKS_MS).toEqual([0, 1000, 2000]);
  });

  test("a reading maps onto the track as a percentage", () => {
    expect(trackPercent(0)).toBe(0);
    expect(trackPercent(1000)).toBe(50);
    expect(trackPercent(TIMELINE_MAX_MS)).toBe(100);
  });

  test("a reading past the axis stays on the track", () => {
    expect(trackPercent(9999)).toBe(100);
    expect(trackPercent(-5)).toBe(0);
  });
});
