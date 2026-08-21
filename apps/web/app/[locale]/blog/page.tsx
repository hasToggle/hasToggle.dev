import { getBlogPosts } from "@repo/cms";
import type { Blog, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import type { Metadata } from "next";
import { env } from "@/env";
import { Container } from "../components/container";
import { Footer } from "../components/footer";
import { Link } from "../components/marketing-link";
import { Navbar } from "../components/navbar";
import { Heading, Subheading } from "../components/text";

export const metadata: Metadata = {
  description:
    "Web development, told as stories — with props, a professor or two, and at least one avocado. Fundamentals are welcome here.",
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
 * write-ups and never will be — the standfirst states the lane, and the
 * lab link in the footer covers the way back to the machinery.
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
                Articles.
              </Heading>
              <p className="mt-6 max-w-2xl text-foreground/75 text-lg leading-8">
                Web development, told as stories — with props, a professor or
                two, and at least one avocado. Fundamentals are welcome here.
              </p>

              <ul className="mt-14 max-w-3xl">
                {posts.map((post) => (
                  <li
                    className="border-foreground/10 border-b first:border-t"
                    key={post.slug}
                  >
                    <Link
                      className="group block py-6"
                      href={`/blog/${post.slug}`}
                    >
                      <p className="font-mono text-muted-foreground/80 text-xs">
                        {formatDate(post.date)}
                      </p>
                      <h2 className="mt-2 font-medium text-2xl text-foreground tracking-tight underline decoration-1 decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-300 group-hover:decoration-ht-cyan-700/70 dark:group-hover:decoration-ht-cyan-300/70">
                        {post.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-base text-foreground/75 leading-7">
                        {post.description}
                      </p>
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
