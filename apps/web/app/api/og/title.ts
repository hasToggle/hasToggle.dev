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

/** The route URL for a page's card, for `openGraph.images`. */
export function ogImageUrl(title: string): string {
  return `/api/og?title=${encodeURIComponent(title)}`;
}
