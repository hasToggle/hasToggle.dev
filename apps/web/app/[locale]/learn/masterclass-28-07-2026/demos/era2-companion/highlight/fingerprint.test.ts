import { describe, expect, test } from "bun:test";
import { fingerprintText } from "../../highlight";
import {
  applySuggestion,
  INITIAL_FILE,
  resolveMismatch,
  SUGGESTION,
} from "../apply";
import { THREAD_ANSWER } from "../extraction";
import {
  EDITOR_TOKENS,
  FILE_FINGERPRINT,
  FILE_TOKENS,
  SOURCE_FINGERPRINT,
} from "./tokens.generated";

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

describe("era2 companion file tokens", () => {
  const applied = applySuggestion(INITIAL_FILE, SUGGESTION).file;
  const resolved = resolveMismatch(applied, SUGGESTION);
  const states = [
    ["initial", INITIAL_FILE.lines],
    ["applied", applied.lines],
    ["resolved", resolved.lines],
  ] as const;

  test("the committed tokens describe what the demo actually produces", () => {
    // Hashes the rendered states, so this fails if INITIAL_FILE, SUGGESTION,
    // applySuggestion or resolveMismatch changed.
    // Fix: cd apps/web && bun run gen:era2-highlight
    expect(fingerprintText(states.map(([, lines]) => lines.join("\n")))).toBe(
      FILE_FINGERPRINT
    );
  });

  test("every phase has one token line per source line", () => {
    for (const [phase, lines] of states) {
      expect(FILE_TOKENS[phase].length).toBe(lines.length);
    }
  });

  test("each line's tokens reconstruct that line exactly", () => {
    // The gutter numbers lines and the code column renders them, so a token
    // list that does not rebuild its own line would misalign the two.
    for (const [phase, lines] of states) {
      FILE_TOKENS[phase].forEach((tokens, index) => {
        expect(tokens.map((t) => t.t).join("")).toBe(lines[index]);
      });
    }
  });

  test("the resolved state really does contain an empty line", () => {
    // Not trivia: it is why the renderer must emit a space for a zero-token
    // line. Without that the row collapses and the gutter slips by one for
    // every line below it.
    expect(FILE_TOKENS.resolved.some((tokens) => tokens.length === 0)).toBe(
      true
    );
  });

  test("the applied state still contains the reference that is missing", () => {
    // The red-line beat depends on finding this token; if the suggestion copy
    // changes so the reference vanishes, the highlight silently stops.
    const hit = FILE_TOKENS.applied.some((tokens) =>
      tokens
        .map((t) => t.t)
        .join("")
        .includes(SUGGESTION.missingRef)
    );
    expect(hit).toBe(true);
  });
});
