import { describe, expect, test } from "bun:test";
import {
  chapterBySlug,
  LATEST,
  NEXT_UP,
  prevNext,
  READING_ORDER,
  SECTIONS,
  SHIPPED,
  STILL_TO_BUILD,
  SYLLABUS,
  sectionEntries,
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

const EXPECTED_CHAPTERS: readonly string[] = [
  "The boundary",
  "The cache",
  "The stream",
  "The mutation",
  "The image",
  "The state",
];

/** Shelf order — SECTIONS, then registry order inside a shelf. */
const EXPECTED_READING_ORDER: readonly string[] = [
  "boundary",
  "state",
  "caching",
  "streaming",
  "server-actions",
  "og-images",
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

  test("no entry carries a displayable ordinal", () => {
    // Arrival order is an artifact; nothing derived from it reaches a page.
    for (const entry of SYLLABUS) {
      expect(Object.keys(entry)).not.toContain("n");
    }
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

  test("nav labels match the contents bar, in arrival order", () => {
    const labels = SHIPPED.map((chapter) => chapter.navLabel);
    expect(labels).toEqual([...EXPECTED_CHAPTERS]);
  });

  test("the latest shipped chapter is the state exhibit", () => {
    expect(LATEST.slug).toBe("state");
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

describe("shelves", () => {
  test("the shelves partition the whole syllabus, none empty", () => {
    const total = SECTIONS.reduce(
      (sum, section) => sum + sectionEntries(section.id).length,
      0
    );
    expect(total).toBe(SYLLABUS.length);
    for (const section of SECTIONS) {
      expect(sectionEntries(section.id).length).toBeGreaterThan(0);
    }
  });

  test("a shelf keeps its entries in accession/registry order", () => {
    const routing = sectionEntries("routing").map((entry) => entry.topic);
    expect(routing[0]).toBe("navigation & prefetching");
    expect(routing).toContain("view transitions");
  });
});

describe("reading order", () => {
  test("is shelf order, not arrival order", () => {
    expect(READING_ORDER.map((chapter) => chapter.slug)).toEqual([
      ...EXPECTED_READING_ORDER,
    ]);
  });

  test("holds every shipped chapter exactly once", () => {
    expect(READING_ORDER).toHaveLength(SHIPPED.length);
    expect(new Set(READING_ORDER).size).toBe(SHIPPED.length);
  });

  test("groups each shelf contiguously, in SECTIONS order", () => {
    const shelves = READING_ORDER.map((chapter) => chapter.section);
    const firstSeen = [...new Set(shelves)];
    expect(firstSeen).toEqual(
      SECTIONS.map((section) => section.id).filter((id) => shelves.includes(id))
    );
    // Contiguous: a shelf id never reappears after another one intervenes.
    expect(shelves).toEqual(
      firstSeen.flatMap((id) => shelves.filter((shelf) => shelf === id))
    );
  });
});

describe("chapter lookup", () => {
  test("finds shipped chapters by slug", () => {
    expect(chapterBySlug("caching")?.navLabel).toBe("The cache");
    expect(chapterBySlug("navigation")).toBeUndefined();
    expect(chapterBySlug("nope")).toBeUndefined();
  });

  test("prev/next walk shelf order, shipped chapters only", () => {
    expect(prevNext("boundary")).toEqual({
      next: chapterBySlug("state"),
      prev: undefined,
    });
    expect(prevNext("state")).toEqual({
      next: chapterBySlug("caching"),
      prev: chapterBySlug("boundary"),
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
