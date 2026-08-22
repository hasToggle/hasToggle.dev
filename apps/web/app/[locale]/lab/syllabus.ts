/**
 * The syllabus registry — the single source of truth for the lab's shape.
 *
 * One entry per chapter, in accession order: shipped chapters first (the
 * array order is the ship order), then the one landing next Monday, then
 * the topics still to build. Everything that lists chapters derives from
 * here — the contents bar, the landing roadmap, prev/next, the sitemap,
 * per-page metadata — so shipping a chapter is one entry flip: planned →
 * next → shipped, belief and navLabel added, nothing else to keep in sync.
 *
 * Ship order is historical; the contents page displays the collection by
 * section instead, shelved the way the React / Next.js / Vercel docs
 * carve the territory. An entry's accession number never changes when its
 * shelf does.
 *
 * Beliefs are prose held in TS strings, so typographic marks are written
 * directly (voice.md §8): U+2019 apostrophes, U+201C/U+201D quotes.
 */

export type SectionId =
  | "components"
  | "data"
  | "interface"
  | "platform"
  | "routing";

export interface Section {
  readonly id: SectionId;
  readonly label: string;
}

/**
 * The contents page's shelves, in learning-arc order: what a component is
 * and where it runs, then data, then the router, then what a page wears,
 * then the platform under all of it.
 */
export const SECTIONS: readonly Section[] = [
  { id: "components", label: "components & state" },
  { id: "data", label: "data & caching" },
  { id: "routing", label: "routing & navigation" },
  { id: "interface", label: "metadata & assets" },
  { id: "platform", label: "the platform" },
];

interface ChapterCore {
  /** Accession number: assigned when a chapter enters the numbered queue, never reused. */
  readonly n: string;
  /** The shelf the contents page files this under — display structure, not ship order. */
  readonly section: SectionId;
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
  readonly section: SectionId;
  readonly status: "planned";
  readonly topic: string;
}

export type SyllabusEntry = NextChapter | PlannedTopic | ShippedChapter;

export const SYLLABUS: readonly SyllabusEntry[] = [
  {
    belief: "I’ll put “use client” on it, to be safe.",
    n: "01",
    navLabel: "The boundary",
    section: "components",
    slug: "boundary",
    status: "shipped",
    topic: "server & client components",
  },
  {
    belief: "It’s either cached or it isn’t.",
    n: "02",
    navLabel: "The cache",
    section: "data",
    slug: "caching",
    status: "shipped",
    topic: "caching & revalidation",
  },
  {
    belief: "I’ll fetch it all first, then render.",
    n: "03",
    navLabel: "The stream",
    section: "data",
    slug: "streaming",
    status: "shipped",
    topic: "streaming & suspense",
  },
  {
    belief: "You need an API route for that.",
    n: "04",
    navLabel: "The mutation",
    section: "data",
    slug: "server-actions",
    status: "shipped",
    topic: "server actions & cookies",
  },
  {
    belief: "I’ll need to design a card for every page.",
    n: "05",
    navLabel: "The image",
    section: "interface",
    slug: "og-images",
    status: "shipped",
    topic: "imageresponse & route handlers",
  },
  {
    belief: "I don’t need state for a simple counter.",
    n: "06",
    navLabel: "The state",
    section: "components",
    slug: "state",
    status: "shipped",
    topic: "useState & re-renders",
  },
  {
    n: "07",
    section: "routing",
    slug: "navigation",
    status: "next",
    topic: "navigation & prefetching",
  },
  { section: "routing", status: "planned", topic: "dynamic routes & params" },
  {
    section: "interface",
    status: "planned",
    topic: "next/image, fonts & the asset pipeline",
  },
  {
    section: "interface",
    status: "planned",
    topic: "metadata, sitemaps & SEO",
  },
  {
    section: "data",
    status: "planned",
    topic: "optimistic UI & useActionState",
  },
  {
    section: "routing",
    status: "planned",
    topic: "proxy, redirects & rewrites",
  },
  {
    section: "routing",
    status: "planned",
    topic: "error, not-found & recovery",
  },
  {
    section: "routing",
    status: "planned",
    topic: "parallel & intercepted routes",
  },
  { section: "routing", status: "planned", topic: "i18n & locale routing" },
  { section: "routing", status: "planned", topic: "view transitions" },
  { section: "data", status: "planned", topic: "ISR & pages baked on demand" },
  {
    section: "platform",
    status: "planned",
    topic: "edge network & geolocation",
  },
  {
    section: "platform",
    status: "planned",
    topic: "feature flags & Edge Config",
  },
  {
    section: "platform",
    status: "planned",
    topic: "web vitals, measured live",
  },
  {
    section: "platform",
    status: "planned",
    topic: "preview deploys & instant rollback",
  },
  {
    section: "platform",
    status: "planned",
    topic: "cron, queues & background work",
  },
  {
    section: "platform",
    status: "planned",
    topic: "blob, key-value & Postgres",
  },
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

/** One shelf of the contents page, in the registry's accession order. */
export function sectionEntries(id: SectionId): readonly SyllabusEntry[] {
  return SYLLABUS.filter((entry) => entry.section === id);
}

const lastShipped = SHIPPED.at(-1);
if (!lastShipped) {
  throw new Error("syllabus: no shipped chapters — the lab has no contents");
}

/** The newest shipped chapter — what /latest points at. */
export const LATEST: ShippedChapter = lastShipped;

export function chapterBySlug(slug: string): ShippedChapter | undefined {
  return SHIPPED.find((chapter) => chapter.slug === slug);
}

/** For call sites that hold a slug the registry must know — a typo is a build-time crash, not a silent gap. */
export function requireChapter(slug: string): ShippedChapter {
  const chapter = chapterBySlug(slug);
  if (!chapter) {
    throw new Error(`syllabus: no shipped chapter with slug "${slug}"`);
  }
  return chapter;
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
