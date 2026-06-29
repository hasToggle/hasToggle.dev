import { describe, expect, test } from "bun:test";
import { matchIntent } from "./match";

describe("era4 matchIntent", () => {
  test("routes salary/pay phrasing to pay", () => {
    expect(matchIntent("how does the pay compare?").id).toBe("pay");
    expect(matchIntent("what salary for junior roles").id).toBe("pay");
  });
  test("routes skills/demand phrasing to ai-skills", () => {
    expect(matchIntent("most in-demand AI engineering skills").id).toBe(
      "ai-skills"
    );
  });
  test("routes stack phrasing to stacks", () => {
    expect(matchIntent("which tech stack should a junior learn").id).toBe(
      "stacks"
    );
  });
  test("routes trend phrasing to rising", () => {
    expect(matchIntent("what is rising from 2024 to 2026").id).toBe("rising");
  });
  test("unmatched questions fall back to ai-skills with matched=false", () => {
    const r = matchIntent("tell me about the weather");
    expect(r.matched).toBe(false);
    expect(r.id).toBe("ai-skills");
  });
});
