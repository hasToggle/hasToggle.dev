import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  getLegalPage,
  getLegalSlugs,
  mdxComponents,
  TableOfContents,
} from "@repo/cms";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

interface LegalPageProperties {
  readonly params: Promise<{
    slug: string;
  }>;
}

// The legal frontmatter carries only title and description; compiling the
// MDX to read them is expensive, so the metadata fields get their own
// cached, serializable lookup.
async function getLegalMeta(
  slug: string
): Promise<{ description: string; title: string } | null> {
  "use cache";
  cacheTag("legal");
  cacheLife("max");

  const page = await getLegalPage(slug);
  return page ? { description: page.description, title: page.title } : null;
}

export const generateMetadata = async ({
  params,
}: LegalPageProperties): Promise<Metadata> => {
  const { slug } = await params;
  const page = await getLegalMeta(slug);

  if (!page) {
    return {};
  }

  return createMetadata(page);
};

export const generateStaticParams = (): { slug: string }[] =>
  getLegalSlugs().map((slug) => ({ slug }));

/**
 * The MDX pipeline (evaluate + Shiki) calls timers internally, so the
 * rendered document lives in a `use cache` scope. The sidebar date has
 * always shown "today" here (no date in the frontmatter) — now it's
 * explicitly the bake date, refreshed with the cache.
 */
async function LegalArticle({ slug }: { slug: string }) {
  "use cache";
  cacheTag("legal");
  cacheLife("days");

  const page = await getLegalPage(slug);

  if (!page) {
    return null;
  }

  const Content = page.content;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <Link
        className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
        href="/"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Home
      </Link>
      <h1 className="scroll-m-20 text-balance font-extrabold text-4xl tracking-tight lg:text-5xl">
        {page.title}
      </h1>
      <p className="text-balance leading-7 [&:not(:first-child)]:mt-6">
        {page.description}
      </p>
      <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row">
        <div className="sm:flex-1">
          <div className="prose prose-neutral dark:prose-invert">
            <Content components={mdxComponents} />
          </div>
        </div>
        <div className="sticky top-24 hidden shrink-0 md:block">
          <Sidebar
            date={new Date()}
            readingTime={`${page.readingTime} min read`}
            toc={<TableOfContents entries={page.toc} />}
          />
        </div>
      </div>
    </div>
  );
}

const LegalPageRoute = async ({ params }: LegalPageProperties) => {
  const { slug } = await params;

  if (!getLegalSlugs().includes(slug)) {
    notFound();
  }

  return <LegalArticle slug={slug} />;
};

export default LegalPageRoute;
