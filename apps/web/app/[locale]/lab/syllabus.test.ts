import { describe, expect, test } from "bun:test";
import {
  chapterBySlug,
  LATEST,
  NEXT_UP,
  prevNext,
  SHIPPED,
  STILL_TO_BUILD,
  SYLLABUS,
} from "./syllabus";

/**
 * The landing page rendered these two lists as hand-maintained literals
 * before the registry existed. The registry must reproduce them exactly —
 * that equality is what "landing visually unchanged" means.
 */
const LEGACY_UPCOMING: readonly string[] = [
  "navigation & prefetching",
  "dynamic routes & params",
  "next/image, fonts & the asset pipeline",
  "metadata, sitemaps & SEO",
  "optimistic UI & useActionState",
  "proxy, redirects & rewrites",
  "error, not-found & recovery",
  "parallel & intercepted routes",
  "i18n & locale routing",
  "view transitions",
  "ISR & pages baked on demand",
  "edge network & geolocation",
  "feature flags & Edge Config",
  "web vitals, measured live",
  "preview deploys & instant rollback",
  "cron, queues & background work",
  "blob, key-value & Postgres",
];

const URL_SAFE_SLUG = /^[a-z][a-z0-9-]*$/;

const LEGACY_CHAPTERS: readonly { label: string; n: string }[] = [
  { label: "The boundary", n: "01" },
  { label: "The cache", n: "02" },
  { label: "The stream", n: "03" },
  { label: "The mutation", n: "04" },
  { label: "The image", n: "05" },
];

describe("syllabus order", () => {
  test("shipped chapters come first, then the next one, then planned topics", () => {
    const statuses = SYLLABUS.map((entry) => entry.status);
    const firstNext = statuses.indexOf("next");
    const firstPlanned = statuses.indexOf("planned");
    const lastShipped = statuses.lastIndexOf("shipped");

    expect(lastShipped).toBeLessThan(firstNext);
    expect(firstNext).toBeLessThan(firstPlanned);
  });

  test("exactly one chapter is next", () => {
    const nextEntries = SYLLABUS.filter((entry) => entry.status === "next");
    expect(nextEntries).toHaveLength(1);
  });

  test("accession numbers are zero-padded and strictly sequential", () => {
    const numbered = SYLLABUS.flatMap((entry) =>
      entry.status === "planned" ? [] : [entry.n]
    );
    const expected = numbered.map((_, index) =>
      String(index + 1).padStart(2, "0")
    );
    expect(numbered).toEqual(expected);
  });

  test("slugs are unique and url-safe", () => {
    const slugs = SYLLABUS.flatMap((entry) =>
      entry.status === "planned" ? [] : [entry.slug]
    );
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(URL_SAFE_SLUG);
    }
  });
});

describe("shipped chapters", () => {
  test("every shipped chapter states its belief with typographic marks", () => {
    for (const chapter of SHIPPED) {
      expect(chapter.belief.length).toBeGreaterThan(0);
      // voice.md §8: prose apostrophes are U+2019, never U+0027.
      expect(chapter.belief).not.toContain("'");
    }
  });

  test("nav labels and numbers match what the contents bar always showed", () => {
    const chapters = SHIPPED.map((chapter) => ({
      label: chapter.navLabel,
      n: chapter.n,
    }));
    expect(chapters).toEqual([...LEGACY_CHAPTERS]);
  });

  test("the latest shipped chapter is the image exhibit", () => {
    expect(LATEST.slug).toBe("og-images");
    expect(LATEST.n).toBe("05");
  });
});

describe("still to build", () => {
  test("reproduces the landing roadmap list exactly", () => {
    expect([...STILL_TO_BUILD]).toEqual([...LEGACY_UPCOMING]);
  });

  test("leads with the chapter that lands next", () => {
    expect(NEXT_UP?.topic).toBe(STILL_TO_BUILD[0]);
  });
});

describe("chapter lookup", () => {
  test("finds shipped chapters by slug", () => {
    expect(chapterBySlug("caching")?.n).toBe("02");
    expect(chapterBySlug("navigation")).toBeUndefined();
    expect(chapterBySlug("nope")).toBeUndefined();
  });

  test("prev/next walk the shipped chapters only", () => {
    expect(prevNext("boundary")).toEqual({
      next: chapterBySlug("caching"),
      prev: undefined,
    });
    expect(prevNext("streaming")).toEqual({
      next: chapterBySlug("server-actions"),
      prev: chapterBySlug("caching"),
    });
    expect(prevNext("og-images")).toEqual({
      next: undefined,
      prev: chapterBySlug("server-actions"),
    });
    expect(prevNext("navigation")).toEqual({});
  });
});
