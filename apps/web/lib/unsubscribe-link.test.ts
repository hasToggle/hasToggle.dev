import { describe, expect, test } from "bun:test";
import {
  unsubscribeHeaders,
  unsubscribeSignature,
  unsubscribeUrl,
  verifyUnsubscribe,
} from "./unsubscribe-link";

const SECRET = "test-unsubscribe-secret-that-is-long-enough";

describe("the unsubscribe link", () => {
  test("verifies its own signature and nothing else", () => {
    const sig = unsubscribeSignature("sub-1", SECRET);
    expect(verifyUnsubscribe("sub-1", sig, SECRET)).toBe(true);
    expect(verifyUnsubscribe("sub-2", sig, SECRET)).toBe(false);
    expect(verifyUnsubscribe("sub-1", `${sig}x`, SECRET)).toBe(false);
    expect(verifyUnsubscribe("sub-1", "", SECRET)).toBe(false);
    expect(verifyUnsubscribe("sub-1", sig, `${SECRET}!`)).toBe(false);
  });

  test("points at the route on the origin the mail was sent from", () => {
    const url = new URL(unsubscribeUrl("https://example.com", "sub-1", SECRET));
    expect(url.origin).toBe("https://example.com");
    expect(url.pathname).toBe("/api/unsubscribe");
    expect(url.searchParams.get("id")).toBe("sub-1");
    expect(
      verifyUnsubscribe("sub-1", url.searchParams.get("sig") ?? "", SECRET)
    ).toBe(true);
  });

  test("carries the one-click headers a mail client looks for", () => {
    expect(unsubscribeHeaders("https://x/api/unsubscribe?id=1&sig=2")).toEqual({
      "List-Unsubscribe": "<https://x/api/unsubscribe?id=1&sig=2>",
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    });
  });
});
