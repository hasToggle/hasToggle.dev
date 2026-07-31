import { describe, expect, test } from "bun:test";
import { clampTitle, DEFAULT_OG_TITLE, MAX_TITLE_LENGTH } from "./title";

const BELL = "\u0007";
const ZERO_WIDTH_SPACE = "\u200B";

describe("clampTitle", () => {
  test("absent or empty input falls back to the site line", () => {
    expect(clampTitle(null)).toBe(DEFAULT_OG_TITLE);
    expect(clampTitle(undefined)).toBe(DEFAULT_OG_TITLE);
    expect(clampTitle("")).toBe(DEFAULT_OG_TITLE);
    expect(clampTitle("   ")).toBe(DEFAULT_OG_TITLE);
  });

  test("ordinary titles pass through trimmed", () => {
    expect(clampTitle("  Ship it  ")).toBe("Ship it");
    expect(clampTitle("Streaming is not magic")).toBe("Streaming is not magic");
  });

  test("control and format characters are stripped", () => {
    expect(clampTitle(`Ship${BELL} it`)).toBe("Ship it");
    expect(clampTitle(`A${ZERO_WIDTH_SPACE}title`)).toBe("Atitle");
    expect(clampTitle(`${ZERO_WIDTH_SPACE}${ZERO_WIDTH_SPACE}  `)).toBe(
      DEFAULT_OG_TITLE
    );
  });

  test("long titles are clamped with an ellipsis", () => {
    const long = "x".repeat(200);
    const clamped = clampTitle(long);
    expect(clamped.length).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
    expect(clamped.endsWith("…")).toBe(true);
  });

  test("clamping does not leave a trailing space before the ellipsis", () => {
    const long = `${"word ".repeat(13)}${"y".repeat(30)}`;
    const clamped = clampTitle(long);
    expect(clamped).not.toContain(" …");
  });
});
