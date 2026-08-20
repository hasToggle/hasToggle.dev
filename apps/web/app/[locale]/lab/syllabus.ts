/**
 * The syllabus registry — the single source of truth for the lab's shape.
 *
 * One entry per chapter, in accession order: shipped chapters first (the
 * array order is the reading order), then the one landing next Monday,
 * then the topics still to build. Everything that lists chapters derives
 * from here — the contents bar, the landing roadmap, prev/next, the
 * sitemap, per-page metadata — so shipping a chapter is one entry flip:
 * planned → next → shipped, belief and navLabel added, nothing else to
 * keep in sync.
 *
 * Beliefs are prose held in TS strings, so typographic marks are written
 * directly (voice.md §8): U+2019 apostrophes, U+201C/U+201D quotes.
 */

interface ChapterCore {
  /** Accession number: assigned when a chapter enters the numbered queue, never reused. */
  readonly n: string;
  /** The chapter's URL segment under /lab — short, topical, stable forever. */
  readonly slug: string;
  /** The eyebrow identifier, lowercase: "caching & revalidation". */
  readonly topic: string;
}

export interface ShippedChapter extends ChapterCore {
  /** The exhibit title — a belief the reader holds, in their words. */
  readonly belief: string;
  /** The short label the contents bar and prev/next links wear. */
  readonly navLabel: string;
  readonly status: "shipped";
}

export interface NextChapter extends ChapterCore {
  readonly status: "next";
}

export interface PlannedTopic {
  readonly status: "planned";
  readonly topic: string;
}

export type SyllabusEntry = NextChapter | PlannedTopic | ShippedChapter;

export const SYLLABUS: readonly SyllabusEntry[] = [
  {
    belief: "I’ll put “use client” on it, to be safe.",
    n: "01",
    navLabel: "The boundary",
    slug: "boundary",
    status: "shipped",
    topic: "server & client components",
  },
  {
    belief: "It’s either cached or it isn’t.",
    n: "02",
    navLabel: "The cache",
    slug: "caching",
    status: "shipped",
    topic: "caching & revalidation",
  },
  {
    belief: "I’ll fetch it all first, then render.",
    n: "03",
    navLabel: "The stream",
    slug: "streaming",
    status: "shipped",
    topic: "streaming & suspense",
  },
  {
    belief: "You need an API route for that.",
    n: "04",
    navLabel: "The mutation",
    slug: "server-actions",
    status: "shipped",
    topic: "server actions & cookies",
  },
  {
    belief: "I’ll need to design a card for every page.",
    n: "05",
    navLabel: "The image",
    slug: "og-images",
    status: "shipped",
    topic: "imageresponse & route handlers",
  },
  {
    n: "06",
    slug: "navigation",
    status: "next",
    topic: "navigation & prefetching",
  },
  { status: "planned", topic: "dynamic routes & params" },
  { status: "planned", topic: "next/image, fonts & the asset pipeline" },
  { status: "planned", topic: "metadata, sitemaps & SEO" },
  { status: "planned", topic: "optimistic UI & useActionState" },
  { status: "planned", topic: "proxy, redirects & rewrites" },
  { status: "planned", topic: "error, not-found & recovery" },
  { status: "planned", topic: "parallel & intercepted routes" },
  { status: "planned", topic: "i18n & locale routing" },
  { status: "planned", topic: "view transitions" },
  { status: "planned", topic: "ISR & pages baked on demand" },
  { status: "planned", topic: "edge network & geolocation" },
  { status: "planned", topic: "feature flags & Edge Config" },
  { status: "planned", topic: "web vitals, measured live" },
  { status: "planned", topic: "preview deploys & instant rollback" },
  { status: "planned", topic: "cron, queues & background work" },
  { status: "planned", topic: "blob, key-value & Postgres" },
];

export const SHIPPED: readonly ShippedChapter[] = SYLLABUS.filter(
  (entry): entry is ShippedChapter => entry.status === "shipped"
);

export const NEXT_UP: NextChapter | undefined = SYLLABUS.find(
  (entry): entry is NextChapter => entry.status === "next"
);

/** Topics not yet shipped, in syllabus order — the landing roadmap list. */
export const STILL_TO_BUILD: readonly string[] = SYLLABUS.flatMap((entry) =>
  entry.status === "shipped" ? [] : [entry.topic]
);

const lastShipped = SHIPPED.at(-1);
if (!lastShipped) {
  throw new Error("syllabus: no shipped chapters — the lab has no contents");
}

/** The newest shipped chapter — what /latest points at. */
export const LATEST: ShippedChapter = lastShipped;

export function chapterBySlug(slug: string): ShippedChapter | undefined {
  return SHIPPED.find((chapter) => chapter.slug === slug);
}

/** Reading-order neighbors among shipped chapters only. */
export function prevNext(slug: string): {
  next?: ShippedChapter;
  prev?: ShippedChapter;
} {
  const index = SHIPPED.findIndex((chapter) => chapter.slug === slug);
  if (index === -1) {
    return {};
  }
  return { next: SHIPPED[index + 1], prev: SHIPPED[index - 1] };
}
