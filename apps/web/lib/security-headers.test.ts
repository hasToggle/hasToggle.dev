import { describe, expect, test } from "bun:test";
import {
  posthogOrigins,
  securityHeaders,
  securityOptions,
  securityOptionsWithToolbar,
  withSecurityHeaders,
} from "./security-headers";

const csp = (headers: Headers) => headers.get("content-security-policy") ?? "";

describe("securityHeaders", () => {
  test("sets a CSP without a nonce, so prerendered shells stay runnable", () => {
    const policy = csp(securityHeaders(securityOptions));
    expect(policy).toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).not.toContain("nonce-");
  });

  test("pins the policy's structural directives", () => {
    const policy = csp(securityHeaders(securityOptions));
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'none'");
    expect(policy).toContain("form-action 'self'");
  });

  test("sets the non-CSP headers", () => {
    const headers = securityHeaders(securityOptions);
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(headers.get("strict-transport-security")).toContain("max-age=");
    expect(headers.get("cross-origin-embedder-policy")).toBeNull();
  });

  test("widens for the toolbar only when asked", () => {
    expect(csp(securityHeaders(securityOptions))).not.toContain("vercel.live");
    expect(csp(securityHeaders(securityOptionsWithToolbar))).toContain(
      "vercel.live"
    );
  });
});

describe("posthogOrigins", () => {
  test("pairs the API host with its assets host", () => {
    expect(posthogOrigins("https://eu.i.posthog.com")).toEqual([
      "https://eu.i.posthog.com",
      "https://eu-assets.i.posthog.com",
    ]);
  });

  test("keeps a self-hosted origin as is", () => {
    expect(posthogOrigins("https://ph.example.com/")).toEqual([
      "https://ph.example.com",
    ]);
  });

  test("the policy carries both PostHog hosts", () => {
    const policy = csp(securityHeaders(securityOptions));
    expect(policy).toContain("connect-src 'self' https://eu.i.posthog.com");
    expect(policy).toContain("https://eu-assets.i.posthog.com");
  });
});

describe("withSecurityHeaders", () => {
  test("merges onto a response that already carries headers", () => {
    const response = new Response(null, {
      headers: { "x-middleware-rewrite": "/en" },
    });
    const merged = withSecurityHeaders(
      response,
      new Headers({ "x-frame-options": "DENY" })
    );
    expect(merged).toBe(response);
    expect(merged.headers.get("x-middleware-rewrite")).toBe("/en");
    expect(merged.headers.get("x-frame-options")).toBe("DENY");
  });
});
