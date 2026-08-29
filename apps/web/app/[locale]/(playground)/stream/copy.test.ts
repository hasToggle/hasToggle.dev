import { describe, expect, test } from "bun:test";
import {
  barLanded,
  GROUP_PENDING,
  rowLanded,
  rowPending,
  SEAMS,
  SHELL_CHUNK,
} from "./copy";
import { STREAM_ROWS } from "./rows";

/** Any millisecond reading — the thing a seam must never repeat. */
const MEASUREMENT = /\d+\s*ms/;

describe("the seams", () => {
  test("no seam quotes a measurement the rows already carry", () => {
    for (const seam of Object.values(SEAMS)) {
      expect(seam).not.toMatch(MEASUREMENT);
    }
  });

  test("the belief's seam names the cost without pricing it", () => {
    expect(SEAMS.blocking).toContain("the fastest has to wait for the slowest");
  });

  test("all three seams keep the same three slots in the same order", () => {
    for (const seam of Object.values(SEAMS)) {
      expect(seam.split(" · ")).toHaveLength(3);
    }
    expect(SEAMS.blocking.startsWith("one boundary")).toBe(true);
    expect(SEAMS.loading.startsWith("one boundary")).toBe(true);
    expect(SEAMS.parts.startsWith("a boundary per row")).toBe(true);
  });

  test("only the split arrangement claims three arrivals", () => {
    expect(SEAMS.blocking).toContain("three rows, one arrival");
    expect(SEAMS.loading).toContain("three rows, one arrival");
    expect(SEAMS.parts).toContain("three arrivals");
  });

  test("the fallback seam names what the fallback bought", () => {
    expect(SEAMS.loading).toContain("a placeholder from +0 instead of a blank");
  });

  test("every seam is one line in the instrument register", () => {
    for (const seam of Object.values(SEAMS)) {
      expect(seam).not.toContain("\n");
      expect(seam[0]).toBe(seam[0]?.toLowerCase());
    }
  });
});

describe("the response view", () => {
  test("the shell bar reports what the first chunk carried", () => {
    expect(SHELL_CHUNK.blocking).toBe("nothing to show");
    expect(SHELL_CHUNK.loading).toBe("1 placeholder");
    expect(SHELL_CHUNK.parts).toBe(`${STREAM_ROWS.length} placeholders`);
  });

  test("a bar reads as an offset, never as a clock", () => {
    expect(barLanded(1903)).toBe("+1903 ms");
  });
});

describe("the row readouts", () => {
  test("a landed row shows the price it quoted and when it arrived", () => {
    expect(rowLanded(400, 1903)).toBe("takes 400 ms · landed +1903 ms");
  });

  test("a pending row knows the price but not the arrival", () => {
    expect(rowPending(400)).toBe("takes 400 ms · in flight");
  });

  test("the group fallback counts the rows it stands in for", () => {
    expect(GROUP_PENDING).toBe(`all ${STREAM_ROWS.length} · in flight`);
  });
});
