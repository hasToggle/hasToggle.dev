import { describe, expect, test } from "bun:test";
import { fingerprintText } from "../../highlight";
import { THREAD_ANSWER } from "../extraction";
import { EDITOR_TOKENS, SOURCE_FINGERPRINT } from "./tokens.generated";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

describe("era2 editor tokens", () => {
  test("the committed tokens were generated from the current answer", () => {
    // If this fails, THREAD_ANSWER changed and the tokens are stale.
    // Fix: cd apps/web && bun run gen:era2-highlight
    expect(fingerprintText([...THREAD_ANSWER])).toBe(SOURCE_FINGERPRINT);
  });

  test("there is one token line per source line", () => {
    expect(EDITOR_TOKENS.length).toBe(THREAD_ANSWER.length);
  });

  test("each line's tokens reconstruct that line exactly", () => {
    // The gutter numbers lines and the code column renders them, so a token
    // list that does not rebuild its own line would silently misalign the two.
    EDITOR_TOKENS.forEach((line, index) => {
      expect(line.map((t) => t.t).join("")).toBe(THREAD_ANSWER[index]);
    });
  });

  test("every token carries a colour", () => {
    for (const line of EDITOR_TOKENS) {
      for (const token of line) {
        expect(token.c).toMatch(HEX_COLOR);
      }
    }
  });

  test("no line is empty — the gutter's row heights depend on it", () => {
    for (const line of EDITOR_TOKENS) {
      expect(line.length).toBeGreaterThan(0);
    }
  });
});
