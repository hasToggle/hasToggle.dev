import type { Metadata } from "next";
import { env } from "@/env";
import { Container } from "../components/container";
import { Footer } from "../components/footer";
import { Link } from "../components/marketing-link";
import { MetaAside } from "../components/meta-aside";
import { Navbar } from "../components/navbar";
import { prevNext, type ShippedChapter } from "./syllabus";

/**
 * The shared frame for a chapter page: site chrome above and below, the
 * making-of aside, and the reading-order links. The exhibit itself arrives
 * as children — the same wrapper the landing page renders, with its belief
 * promoted to the page's h1.
 */

const ASIDE_LINK_CLASS =
  "underline decoration-ht-cyan-700/40 underline-offset-2 transition-colors hover:decoration-ht-cyan-700";

/** Chapter metadata derives from the registry: the belief is the title, and /api/og draws its card. */
export function chapterMetadata(chapter: ShippedChapter): Metadata {
  return {
    description: `The real thing, running: ${chapter.topic}. Poke it, break it, read the code that did it — a chapter of the hasToggle lab.`,
    metadataBase: new URL(env.NEXT_PUBLIC_WEB_URL),
    openGraph: {
      images: [
        {
          height: 630,
          url: `/api/og?title=${encodeURIComponent(chapter.belief)}`,
          width: 1200,
        },
      ],
    },
    title: `${chapter.belief} — the hasToggle lab`,
    twitter: {
      card: "summary_large_image",
    },
  };
}

function MakingOf({ commitsHref }: { commitsHref: string }) {
  return (
    <Container className="pb-10">
      <div className="grid gap-x-12 lg:grid-cols-[7rem_minmax(0,1fr)]">
        <div aria-hidden="true" />
        <MetaAside className="max-w-2xl" variant="block">
          Built in the open:{" "}
          <a
            className={ASIDE_LINK_CLASS}
            href={commitsHref}
            rel="noreferrer"
            target="_blank"
          >
            every commit behind this chapter
          </a>{" "}
          and{" "}
          <a
            className={ASIDE_LINK_CLASS}
            href="https://github.com/hasToggle/hasToggle.dev-checkpoints"
            rel="noreferrer"
            target="_blank"
          >
            the prompts that produced them
          </a>{" "}
          are public.
        </MetaAside>
      </div>
    </Container>
  );
}

/** The book's page-turn: neighbors in reading order, shipped chapters only. */
function ChapterTurn({ slug }: { slug: string }) {
  const { next, prev } = prevNext(slug);

  return (
    <Container className="pb-20 sm:pb-24">
      <div className="grid gap-x-12 lg:grid-cols-[7rem_minmax(0,1fr)]">
        <div aria-hidden="true" />
        <nav
          aria-label="Chapter order"
          className="flex max-w-3xl items-baseline justify-between border-foreground/10 border-t pt-6 font-mono text-muted-foreground text-sm/6"
        >
          {prev ? (
            <Link
              className="transition-colors hover:text-foreground"
              href={`/lab/${prev.slug}`}
            >
              ← {prev.n} · {prev.navLabel}
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {next ? (
            <Link
              className="transition-colors hover:text-foreground"
              href={`/lab/${next.slug}`}
            >
              {next.n} · {next.navLabel} →
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      </div>
    </Container>
  );
}

export function ChapterShell({
  chapter,
  children,
  commitsHref,
}: {
  chapter: ShippedChapter;
  children: React.ReactNode;
  commitsHref: string;
}) {
  // Same clip as the landing page: the scroll-driven reveals inside the
  // exhibit resolve against the viewport, not a scroll container.
  return (
    <div className="overflow-x-clip">
      <Container>
        <Navbar variant="light" />
      </Container>
      <main>
        {children}
        <MakingOf commitsHref={commitsHref} />
        <ChapterTurn slug={chapter.slug} />
      </main>
      <Footer />
    </div>
  );
}
