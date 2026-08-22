import type { Metadata } from "next";
import { Suspense } from "react";
import { env } from "@/env";
import { BoundaryIndexValue } from "../(playground)/boundary/index-value";
import { ImageIndexValue } from "../(playground)/image/index-value";
import { MutationIndexValue } from "../(playground)/mutation/index-value";
import { ShellIndexValue } from "../(playground)/shell/index-value";
import { StreamIndexValue } from "../(playground)/stream/index-value";
import { Container } from "../components/container";
import { Digest } from "../components/digest";
import { Footer } from "../components/footer";
import { Link } from "../components/marketing-link";
import { Navbar } from "../components/navbar";
import { Heading, Subheading } from "../components/text";
import {
  type NextChapter,
  type PlannedTopic,
  SECTIONS,
  type Section,
  type ShippedChapter,
  sectionEntries,
} from "./syllabus";

export const metadata: Metadata = {
  description:
    "Every chapter of the lab: what’s running, what lands Monday, what’s still to build.",
  metadataBase: new URL(env.NEXT_PUBLIC_WEB_URL),
  openGraph: {
    images: [
      {
        height: 630,
        url: `/api/og?title=${encodeURIComponent("The lab: contents.")}`,
        width: 1200,
      },
    ],
  },
  title: "Contents — the hasToggle lab",
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * Live readings are opt-in per chapter: one true value from the running
 * exhibit, or nothing. Each renders inside its own Suspense boundary, so a
 * per-visitor reading (the press count) streams in without costing the rest
 * of the page its prerender.
 */
const INDEX_VALUES: Partial<Record<string, () => React.ReactNode>> = {
  boundary: BoundaryIndexValue,
  caching: ShellIndexValue,
  "og-images": ImageIndexValue,
  "server-actions": MutationIndexValue,
  streaming: StreamIndexValue,
};

function IndexValueFallback() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-16 self-center rounded bg-foreground/10 motion-safe:animate-pulse"
    />
  );
}

function ChapterRow({ chapter }: { chapter: ShippedChapter }) {
  const IndexValue = INDEX_VALUES[chapter.slug];

  return (
    <li className="border-foreground/10 border-b first:border-t">
      <Link
        className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]"
        href={`/lab/${chapter.slug}`}
      >
        <span className="font-mono text-muted-foreground text-xs tabular-nums transition-colors group-hover:text-ht-cyan-700 dark:group-hover:text-ht-cyan-300">
          {chapter.n}
        </span>
        <span className="font-medium text-foreground text-xl tracking-tight underline decoration-1 decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-300 group-hover:decoration-ht-cyan-700/70 dark:group-hover:decoration-ht-cyan-300/70">
          {chapter.belief}
        </span>
        {IndexValue ? (
          <span className="hidden font-mono text-muted-foreground text-xs sm:inline-flex sm:justify-self-end">
            <Suspense fallback={<IndexValueFallback />}>
              <IndexValue />
            </Suspense>
          </span>
        ) : null}
        <span className="col-start-2 mt-1 font-mono text-muted-foreground/80 text-xs">
          {chapter.topic}
        </span>
      </Link>
    </li>
  );
}

function NextRow({ entry }: { entry: NextChapter }) {
  return (
    <li className="border-foreground/10 border-b first:border-t">
      {/* No belief yet — a chapter states its belief when it ships. Until
          Monday the row is just the topic. */}
      <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]">
        <span className="font-mono text-muted-foreground/60 text-xs tabular-nums">
          {entry.n}
        </span>
        <span className="font-medium text-foreground/60 text-xl tracking-tight">
          {entry.topic}
        </span>
        <span className="col-start-2 font-mono text-ht-cyan-700 text-xs sm:col-start-3 sm:justify-self-end dark:text-ht-cyan-300">
          lands Monday
        </span>
      </div>
    </li>
  );
}

/**
 * One shelf of the collection. Ship order is historical — the shelves are
 * the structure, carved the way the React / Next.js / Vercel docs carve
 * the territory — so chapters keep their accession numbers while sitting
 * with their kin.
 */
function Shelf({ section }: { section: Section }) {
  const entries = sectionEntries(section.id);
  const chapters = entries.filter(
    (entry): entry is NextChapter | ShippedChapter => entry.status !== "planned"
  );
  const planned = entries.filter(
    (entry): entry is PlannedTopic => entry.status === "planned"
  );

  return (
    <section aria-labelledby={`shelf-${section.id}`} className="mt-12">
      <Subheading as="h2" id={`shelf-${section.id}`}>
        {section.label}
      </Subheading>
      {chapters.length > 0 ? (
        <ol className="mt-3 max-w-3xl">
          {chapters.map((entry) =>
            entry.status === "shipped" ? (
              <ChapterRow chapter={entry} key={entry.slug} />
            ) : (
              <NextRow entry={entry} key={entry.slug} />
            )
          )}
        </ol>
      ) : null}
      {planned.length > 0 ? (
        <ul className="mt-4 grid max-w-3xl grid-cols-1 gap-x-12 gap-y-3 font-mono text-muted-foreground text-sm/6 sm:grid-cols-2">
          {planned.map((entry) => (
            <li className="flex items-baseline gap-3" key={entry.topic}>
              <span
                aria-hidden="true"
                className="select-none text-ht-cyan-700/60 dark:text-ht-cyan-300/60"
              >
                +
              </span>
              {entry.topic}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/**
 * The lab's contents page: the syllabus made navigable. Shipped chapters
 * are rows whose link text is the belief — an index of things you were
 * sure about — with the topic identifier alongside; the chapter landing
 * next Monday sits with its shelf, and the still-to-build topics keep the
 * roadmap's + rows. One registry, one source of truth.
 */
export default function LabContentsPage() {
  return (
    <div className="overflow-x-clip">
      <Container>
        <Navbar variant="light" />
      </Container>
      <main>
        <Container className="pt-16 pb-20 sm:pt-24 sm:pb-24">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[7rem_minmax(0,1fr)]">
            <div aria-hidden="true" />
            <div>
              <Subheading as="div">The lab</Subheading>
              <Heading
                as="h1"
                className="mt-3 text-balance text-4xl sm:text-5xl md:text-6xl"
              >
                Contents.
              </Heading>
              <p className="mt-6 max-w-2xl text-foreground/75 text-lg leading-8">
                Every chapter opens on something developers say — to ourselves,
                or to each other — and runs the real feature next to it. The
                plan is everything Next.js can do, and as much of Vercel as can
                be proved from inside a web page.
              </p>

              {SECTIONS.map((section) => (
                <Shelf key={section.id} section={section} />
              ))}

              <div className="mt-20 max-w-3xl border-foreground/10 border-t pt-10">
                <Subheading as="div">The weekly build</Subheading>
                <p className="mt-3 max-w-xl text-foreground/75 text-lg leading-8">
                  A new chapter every Monday. The write-up lands in your inbox.
                </p>
                <div className="mt-6 max-w-md">
                  <Digest />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
