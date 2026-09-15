import { getBlogSlugs, getLegalSlugs } from "@repo/cms";
import type { MetadataRoute } from "next";
import { env } from "@/env";
import { SHIPPED } from "./[locale]/lab/syllabus";

// Every crawlable route, listed by hand. A directory scan of `app/` used to
// stand in for this and advertised `/fonts` (an asset folder) and
// `/confirmed` (the page after the waitlist link) while missing /blog and
// /contact. The registry stays the source of truth for chapters.
const STATIC_PATHS = ["/", "/lab", "/blog", "/contact"] as const;

export function sitemapPaths(): string[] {
  return [
    ...STATIC_PATHS,
    ...SHIPPED.map((chapter) => `/lab/${chapter.slug}`),
    ...getBlogSlugs().map((slug) => `/blog/${slug}`),
    ...getLegalSlugs().map((slug) => `/legal/${slug}`),
  ];
}

const sitemap = (): MetadataRoute.Sitemap => {
  const base = new URL(env.NEXT_PUBLIC_WEB_URL);
  return sitemapPaths().map((path) => ({ url: new URL(path, base).href }));
};

export default sitemap;
