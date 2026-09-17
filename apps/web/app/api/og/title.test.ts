import { describe, expect, test } from "bun:test";
import { SHIPPED } from "@/app/[locale]/lab/syllabus";
import {
  DEFAULT_OG_TITLE,
  OG_TITLES,
  ogImageUrl,
  PAGE_OG_TITLES,
  resolveTitle,
} from "./title";

// The longest line that still fits the card at its smallest type size.
const MAX_TITLE_LENGTH = 70;

describe("resolveTitle", () => {
  test("absent or empty input falls back to the site line", () => {
    expect(resolveTitle(null)).toBe(DEFAULT_OG_TITLE);
    expect(resolveTitle(undefined)).toBe(DEFAULT_OG_TITLE);
    expect(resolveTitle("")).toBe(DEFAULT_OG_TITLE);
  });

  test("a page's title passes through", () => {
    for (const title of OG_TITLES) {
      expect(resolveTitle(title)).toBe(title);
    }
  });

  test("anything else falls back to the site line", () => {
    expect(resolveTitle("Ship it")).toBe(DEFAULT_OG_TITLE);
    expect(resolveTitle(` ${DEFAULT_OG_TITLE}`)).toBe(DEFAULT_OG_TITLE);
    expect(resolveTitle(SHIPPED[0]?.title.toUpperCase())).toBe(
      DEFAULT_OG_TITLE
    );
  });
});

describe("the cards on offer", () => {
  test("cover every chapter and every fixed page, once each", () => {
    for (const chapter of SHIPPED) {
      expect(OG_TITLES).toContain(chapter.title);
    }
    for (const title of Object.values(PAGE_OG_TITLES)) {
      expect(OG_TITLES).toContain(title);
    }
    expect(new Set(OG_TITLES).size).toBe(OG_TITLES.length);
  });

  test("each fits the card", () => {
    for (const title of OG_TITLES) {
      expect(title.length).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
    }
  });

  test("the route URL round-trips a title", () => {
    const url = new URL(ogImageUrl(PAGE_OG_TITLES.contact), "http://x");
    expect(resolveTitle(url.searchParams.get("title"))).toBe(
      PAGE_OG_TITLES.contact
    );
  });
});
