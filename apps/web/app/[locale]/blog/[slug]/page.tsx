import {
  getBlogPost,
  getBlogPosts,
  getBlogSlugs,
  mdxComponents,
} from "@repo/cms";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { Container } from "../../components/container";
import { Footer } from "../../components/footer";
import { Link } from "../../components/marketing-link";
import { Navbar } from "../../components/navbar";
import { Heading, Subheading } from "../../components/text";

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const url = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

interface BlogPostProperties {
  readonly params: Promise<{
    slug: string;
  }>;
}

// Frontmatter only — no MDX compilation — so metadata stays deterministic.
const findPostMeta = (slug: string) =>
  getBlogPosts().find((post) => post.slug === slug);

export const generateMetadata = async ({
  params,
}: BlogPostProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = findPostMeta(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    description: post.description,
    image: post.image,
    title: post.title,
  });
};

export const generateStaticParams = (): { slug: string }[] =>
  getBlogSlugs().map((slug) => ({ slug }));

const formatDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);

/**
 * The MDX pipeline (evaluate + Shiki) is expensive and calls timers
 * internally, so the whole rendered article lives in a `use cache` scope:
 * compiled once per slug per deploy, served from the static shell after.
 */
async function Article({ slug }: { slug: string }) {
  "use cache";
  cacheTag("blog");
  cacheLife("max");

  const post = await getBlogPost(slug);

  if (!post) {
    return null;
  }

  const Content = post.content;

  return (
    <>
      <JsonLd
        code={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          author: post.authors.at(0)?.name,
          dateModified: post.date,
          datePublished: post.date,
          description: post.description,
          headline: post.title,
          image: post.image,
          isAccessibleForFree: true,
          mainEntityOfPage: {
            "@id": new URL(`/blog/${post.slug}`, url).toString(),
            "@type": "WebPage",
          },
        }}
      />
      <Container className="pt-16 pb-20 sm:pt-24 sm:pb-24">
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[7rem_minmax(0,1fr)]">
          <div aria-hidden="true" />
          <article className="max-w-2xl">
            <Subheading as="div">
              <Link
                className="transition-colors hover:text-foreground"
                href="/blog"
              >
                ← the blog
              </Link>
              <span aria-hidden="true" className="px-2 opacity-50">
                ·
              </span>
              {formatDate(post.date)}
              <span aria-hidden="true" className="px-2 opacity-50">
                ·
              </span>
              {post.readingTime} min read
            </Subheading>
            <Heading
              as="h1"
              className="mt-3 text-balance text-4xl/[1.1] sm:text-5xl/[1.05]"
            >
              {post.title}
            </Heading>
            <p className="mt-6 text-foreground/75 text-lg leading-8">
              {post.description}
            </p>
            {post.image ? (
              <Image
                alt={post.imageAlt}
                className="my-12 h-full w-full rounded-xl"
                height={400}
                priority
                src={post.image}
                width={800}
              />
            ) : null}
            <div className="prose prose-neutral dark:prose-invert mt-12">
              <Content components={mdxComponents} />
            </div>
          </article>
        </div>
      </Container>
    </>
  );
}

const BlogPostPage = async ({ params }: BlogPostProperties) => {
  const { slug } = await params;

  if (!getBlogSlugs().includes(slug)) {
    notFound();
  }

  return (
    <div className="overflow-x-clip">
      <Container>
        <Navbar variant="light" />
      </Container>
      <main>
        <Article slug={slug} />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
