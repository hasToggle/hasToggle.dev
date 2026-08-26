import { getBlogPosts } from "@repo/cms";
import type { Blog, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import type { Metadata } from "next";
import Image from "next/image";
import { env } from "@/env";
import { Container } from "../components/container";
import { Footer } from "../components/footer";
import { Link } from "../components/marketing-link";
import { Navbar } from "../components/navbar";
import { Heading, Subheading } from "../components/text";

export const metadata: Metadata = {
  description:
    "Written from experience, wrong turns included. Nothing is too out-of-scope to deserve a story.",
  metadataBase: new URL(env.NEXT_PUBLIC_WEB_URL),
  openGraph: {
    images: [
      {
        height: 630,
        url: `/api/og?title=${encodeURIComponent("Web development, told as stories.")}`,
        width: 1200,
      },
    ],
  },
  title: "Articles — hasToggle",
  twitter: {
    card: "summary_large_image",
  },
};

const formatDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);

/**
 * The blog's index, in the house list grammar. Articles are not chapter
 * write-ups and never will be — the headline states the lane, and the
 * lab link in the footer covers the way back to the machinery. Each row
 * carries the post's image as a thumbnail; the alt is empty on purpose,
 * because the picture sits inside the same link as the title.
 */
export default function BlogIndexPage() {
  const posts = getBlogPosts();

  const jsonLd: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
  };

  return (
    <div className="overflow-x-clip">
      <JsonLd code={jsonLd} />
      <Container>
        <Navbar variant="light" />
      </Container>
      <main>
        <Container className="pt-16 pb-20 sm:pt-24 sm:pb-24">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[7rem_minmax(0,1fr)]">
            <div aria-hidden="true" />
            <div>
              <Subheading as="div">The blog</Subheading>
              <Heading
                as="h1"
                className="mt-3 text-balance text-4xl sm:text-5xl md:text-6xl"
              >
                Web development, told as stories.
              </Heading>
              <p className="mt-6 max-w-2xl text-foreground/75 text-lg leading-8">
                Written from experience, wrong turns included. Nothing is too
                out-of-scope to deserve a story.
              </p>

              <ul className="mt-14 max-w-3xl">
                {posts.map((post) => (
                  <li
                    className="border-foreground/10 border-b first:border-t"
                    key={post.slug}
                  >
                    <Link
                      className="group flex flex-col-reverse gap-5 py-6 sm:flex-row sm:items-start sm:gap-8"
                      href={`/blog/${post.slug}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-muted-foreground text-xs">
                          {formatDate(post.date)}
                        </p>
                        <h2 className="mt-2 font-medium text-2xl text-foreground tracking-tight underline decoration-1 decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-300 group-hover:decoration-ht-cyan-700/70 dark:group-hover:decoration-ht-cyan-300/70">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-base text-foreground/75 leading-7">
                          {post.description}
                        </p>
                      </div>
                      {post.image ? (
                        <Image
                          alt=""
                          className="aspect-[2/1] w-full shrink-0 rounded-lg border border-foreground/10 object-cover sm:w-56"
                          height={224}
                          sizes="(min-width: 640px) 14rem, 100vw"
                          src={post.image}
                          width={448}
                        />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
