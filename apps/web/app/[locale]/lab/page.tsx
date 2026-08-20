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
import { NEXT_UP, type PlannedTopic, SHIPPED, SYLLABUS } from "./syllabus";

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

const planned = SYLLABUS.filter(
  (entry): entry is PlannedTopic => entry.status === "planned"
);

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

/**
 * The lab's contents page: the syllabus made navigable. Shipped chapters
 * are rows whose link text is the belief — an index of things you were
 * sure about — with the topic identifier alongside. The chapter landing
 * next Monday sits below them, then the still-to-build topics in the same
 * `+` rows the landing roadmap renders. One list, one source of truth.
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
                The plan is everything Next.js can do, and as much of Vercel as
                can be proved from inside a web page. One chapter at a time, in
                public.
              </p>

              <ol aria-label="Chapters" className="mt-14 max-w-3xl">
                {SHIPPED.map((chapter) => {
                  const IndexValue = INDEX_VALUES[chapter.slug];

                  return (
                    <li
                      className="border-foreground/10 border-b first:border-t"
                      key={chapter.slug}
                    >
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
                })}
                {NEXT_UP ? (
                  <li className="border-foreground/10 border-b">
                    {/* No belief yet — a chapter states its belief when it
                        ships. Until Monday the row is just the topic. */}
                    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]">
                      <span className="font-mono text-muted-foreground/60 text-xs tabular-nums">
                        {NEXT_UP.n}
                      </span>
                      <span className="font-medium text-foreground/60 text-xl tracking-tight">
                        {NEXT_UP.topic}
                      </span>
                      <span className="col-start-2 font-mono text-ht-cyan-700 text-xs sm:col-start-3 sm:justify-self-end dark:text-ht-cyan-300">
                        lands Monday
                      </span>
                    </div>
                  </li>
                ) : null}
              </ol>

              <ul className="mt-10 grid max-w-3xl grid-cols-1 gap-x-12 gap-y-3 font-mono text-muted-foreground text-sm/6 sm:grid-cols-2">
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
