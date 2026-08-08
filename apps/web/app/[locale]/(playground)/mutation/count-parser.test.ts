import { describe, expect, test } from "bun:test";
import { MAX_COUNT, parseCount } from "./count-parser";

describe("parseCount", () => {
  test("no cookie means zero presses", () => {
    expect(parseCount(undefined)).toBe(0);
    expect(parseCount("")).toBe(0);
  });

  test("well-behaved values pass through", () => {
    expect(parseCount("0")).toBe(0);
    expect(parseCount("1")).toBe(1);
    expect(parseCount("421")).toBe(421);
  });

  test("caps at MAX_COUNT", () => {
    expect(parseCount("9999")).toBe(MAX_COUNT);
  });

  test("tampered cookies collapse to zero", () => {
    expect(parseCount("-3")).toBe(0);
    expect(parseCount("2.5")).toBe(0);
    expect(parseCount("31337x")).toBe(0);
    expect(parseCount("99999")).toBe(0);
    expect(parseCount("NaN")).toBe(0);
    expect(parseCount("<script>")).toBe(0);
  });
});
