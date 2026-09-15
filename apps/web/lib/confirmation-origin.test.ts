import { describe, expect, test } from "bun:test";
import { confirmationOrigin } from "./confirmation-origin";

const SITE = "https://www.hastoggle.dev";

describe("confirmationOrigin", () => {
  test("keeps the configured site", () => {
    expect(confirmationOrigin(`${SITE}/api/confirm`, SITE)).toBe(SITE);
  });

  test("keeps preview and local hosts, where the request's database lives", () => {
    expect(
      confirmationOrigin("https://web-abc-team.vercel.app/api/confirm", SITE)
    ).toBe("https://web-abc-team.vercel.app");
    expect(confirmationOrigin("http://localhost:3001/api/confirm", SITE)).toBe(
      "http://localhost:3001"
    );
  });

  test("replaces a foreign host with the configured site", () => {
    expect(confirmationOrigin("https://evil.example/api/confirm", SITE)).toBe(
      SITE
    );
    expect(
      confirmationOrigin("https://hastoggle.dev.evil.example/x", SITE)
    ).toBe(SITE);
  });

  test("falls back on an unparsable request URL", () => {
    expect(confirmationOrigin("not a url", SITE)).toBe(SITE);
  });
});
