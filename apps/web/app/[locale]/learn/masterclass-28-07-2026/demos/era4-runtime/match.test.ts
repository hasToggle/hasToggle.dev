import { describe, expect, test } from "bun:test";
import { matchIntent } from "./match";

describe("era4 matchIntent", () => {
  test("routes junior-market phrasing to juniors", () => {
    expect(matchIntent("Is AI taking junior developer jobs?").id).toBe(
      "juniors"
    );
    expect(matchIntent("are entry-level jobs disappearing").id).toBe(
      "juniors"
    );
  });
  test("routes roles/growth phrasing to ai-skills", () => {
    expect(matchIntent("Which roles are growing fastest right now?").id).toBe(
      "ai-skills"
    );
  });
  test("routes pay/premium phrasing to pay", () => {
    expect(matchIntent("how does the pay compare?").id).toBe("pay");
    expect(matchIntent("what's the AI wage premium?").id).toBe("pay");
  });
  test("routes trust phrasing to trust", () => {
    expect(matchIntent("do developers actually trust AI?").id).toBe("trust");
  });
  test("unmatched questions fall back to ai-skills with matched=false", () => {
    const r = matchIntent("tell me about the weather");
    expect(r.matched).toBe(false);
    expect(r.id).toBe("ai-skills");
  });
});
