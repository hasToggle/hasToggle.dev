import { describe, expect, test } from "bun:test";
import {
  AXIS_ORIGIN,
  barLanded,
  GROUP_PENDING,
  rowLanded,
  rowPending,
  SEAMS,
  SHELL_CHUNK,
} from "./copy";
import { FASTEST_MS, IDLE_MS, SLOWEST_MS, STREAM_ROWS } from "./rows";

describe("the seams", () => {
  test("the belief's seam prices the wait from the running config", () => {
    expect(SEAMS.blocking).toContain(`${FASTEST_MS} ms row`);
    expect(SEAMS.blocking).toContain(`${IDLE_MS} ms after it finished`);
  });

  test("the fallback seam separates seeing something from getting it", () => {
    expect(SEAMS.loading).toContain("one boundary around all three");
    expect(SEAMS.loading).toContain("+0");
  });

  test("the resolution refuses to claim anything got faster", () => {
    expect(SEAMS.parts).toContain(`still costs ${SLOWEST_MS} ms`);
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

  test("the axis names its origin", () => {
    expect(AXIS_ORIGIN).toBe("0 = the response opened");
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
