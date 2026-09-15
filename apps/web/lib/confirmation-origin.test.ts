import { describe, expect, test } from "bun:test";
import { confirmationOrigin } from "./confirmation-origin";

const SITE = "https://www.hastoggle.dev";
const OWN = ["web-abc-team.vercel.app", "web-git-main-team.vercel.app"];

describe("confirmationOrigin", () => {
  test("keeps the configured site", () => {
    expect(confirmationOrigin(`${SITE}/api/confirm`, SITE, OWN)).toBe(SITE);
  });

  test("keeps this deployment's own preview hosts and localhost", () => {
    expect(
      confirmationOrigin(
        "https://web-abc-team.vercel.app/api/confirm",
        SITE,
        OWN
      )
    ).toBe("https://web-abc-team.vercel.app");
    expect(
      confirmationOrigin("http://localhost:3001/api/confirm", SITE, OWN)
    ).toBe("http://localhost:3001");
  });

  test("replaces a foreign host, including someone else's vercel.app", () => {
    expect(
      confirmationOrigin("https://evil.example/api/confirm", SITE, OWN)
    ).toBe(SITE);
    expect(
      confirmationOrigin("https://attacker.vercel.app/api/confirm", SITE, OWN)
    ).toBe(SITE);
    expect(
      confirmationOrigin("https://hastoggle.dev.evil.example/x", SITE, OWN)
    ).toBe(SITE);
  });

  test("trusts nothing extra when the platform sets no hostnames", () => {
    expect(
      confirmationOrigin("https://web-abc-team.vercel.app/x", SITE, [
        undefined,
        undefined,
      ])
    ).toBe(SITE);
  });

  test("falls back on an unparsable request URL", () => {
    expect(confirmationOrigin("not a url", SITE, OWN)).toBe(SITE);
  });
});
