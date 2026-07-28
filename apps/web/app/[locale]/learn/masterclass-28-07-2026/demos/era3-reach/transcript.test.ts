import { describe, expect, test } from "bun:test";
import { REACHED_LINE_INDEX, TRANSCRIPT } from "./transcript";

describe("TRANSCRIPT", () => {
  test("opens on the instruction and closes on the claim", () => {
    expect(TRANSCRIPT[0].kind).toBe("message");
    expect(TRANSCRIPT.at(-1)?.text).toBe("done.");
  });

  test("REACHED_LINE_INDEX points at the destructive command", () => {
    expect(TRANSCRIPT[REACHED_LINE_INDEX].text).toContain("TRUNCATE discounts");
  });

  test("the destructive command is not the last line", () => {
    // Beat 7 works only because this scrolled past looking like progress.
    expect(REACHED_LINE_INDEX).toBeLessThan(TRANSCRIPT.length - 1);
  });

  test("lint never appears — that is what beat 4 asserts", () => {
    expect(TRANSCRIPT.some((l) => l.text.toLowerCase().includes("lint"))).toBe(
      false
    );
  });
});
