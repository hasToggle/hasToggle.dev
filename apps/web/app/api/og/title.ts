import type { Metadata } from "next";
import { SHIPPED } from "@/app/[locale]/lab/syllabus";

export const DEFAULT_OG_TITLE =
  "The unofficial live playground for Next.js & Vercel";

/** The cards the site's own pages ask for, besides the chapters. */
export const PAGE_OG_TITLES = {
  blog: "Web development, told as stories.",
  contact: "Write to Eric.",
  lab: "Everything Next.js can do, one chapter at a time.",
} as const;

/**
 * Every card the route will draw, in the order the image chapter offers
 * them. A card is a page's link preview, so the set is the set of pages:
 * the site line, each chapter's title, the three fixed pages. Anything
 * else falls back to the site line — the route is public, and a card
 * that says whatever the query says would be a card anyone could share.
 */
export const OG_TITLES: readonly string[] = [
  DEFAULT_OG_TITLE,
  ...SHIPPED.map((chapter) => chapter.title),
  PAGE_OG_TITLES.lab,
  PAGE_OG_TITLES.blog,
  PAGE_OG_TITLES.contact,
];

const ALLOWED = new Set(OG_TITLES);

/** The title the card will carry: the one asked for if it is a page's, else the site line. */
export function resolveTitle(raw: string | null | undefined): string {
  return raw && ALLOWED.has(raw) ? raw : DEFAULT_OG_TITLE;
}

/** A page's link preview: the card /api/og draws for it, at full size. */
export function ogCard(title: string): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      images: [{ height: 630, url: ogImageUrl(title), width: 1200 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** The route URL for a page's card, for `openGraph.images`. */
export function ogImageUrl(title: string): string {
  return `/api/og?title=${encodeURIComponent(title)}`;
}
