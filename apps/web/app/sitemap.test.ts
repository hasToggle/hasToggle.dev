import { describe, expect, test } from "bun:test";
import { sitemapPaths } from "./sitemap";

describe("sitemapPaths", () => {
  test("lists the site's pages and nothing that is not one", () => {
    const paths = sitemapPaths();
    expect(paths).toContain("/");
    expect(paths).toContain("/lab");
    expect(paths).toContain("/blog");
    expect(paths).toContain("/contact");
    expect(paths).toContain("/legal/privacy");
    expect(paths).not.toContain("/fonts");
    expect(paths).not.toContain("/confirmed");
  });

  test("carries every shipped chapter", () => {
    expect(sitemapPaths()).toContain("/lab/state");
  });

  test("has no duplicates", () => {
    const paths = sitemapPaths();
    expect(new Set(paths).size).toBe(paths.length);
  });
});
