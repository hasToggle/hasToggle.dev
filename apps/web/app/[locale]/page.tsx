import { Separator } from "@repo/design-system/components/ui/separator";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DEFAULT_OG_TITLE } from "@/app/api/og/title";
import { env } from "@/env";
import { ClientCard } from "./(playground)/boundary/client-card";
import { ServerCard } from "./(playground)/boundary/server-card";
import {
  CLIENT_CARD_SOURCE,
  SERVER_CARD_SOURCE,
} from "./(playground)/boundary/source";
import { CodeBlock } from "./(playground)/code-block";
import { DemoSection } from "./(playground)/demo-section";
import { OgDemo } from "./(playground)/image/og-demo";
import { OG_SOURCE } from "./(playground)/image/source";
import { InlineCode } from "./(playground)/inline-code";
import { LivePanel } from "./(playground)/live-panel";
import {
  PressCount,
  PressCountFallback,
} from "./(playground)/mutation/press-count";
import { PressForm } from "./(playground)/mutation/press-form";
import { MUTATION_SOURCE } from "./(playground)/mutation/source";
import { getBake } from "./(playground)/shell/bake";
import { BakedStamp } from "./(playground)/shell/baked-stamp";
import { RebakePanel } from "./(playground)/shell/rebake-panel";
import { SHELL_SOURCE } from "./(playground)/shell/source";
import {
  RerunButton,
  RerunButtonFallback,
} from "./(playground)/stream/rerun-button";
import { STREAM_SOURCE } from "./(playground)/stream/source";
import {
  StreamRows,
  StreamRowsFallback,
} from "./(playground)/stream/stream-rows";
import { Container } from "./components/container";
import { Digest } from "./components/digest";
import { FrequentlyAskedQuestions } from "./components/faqs";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { MarketingButton } from "./components/marketing-button";
import { MetaAside } from "./components/meta-aside";
import { Heading, Subheading } from "./components/text";

function SectionDivider() {
  return (
    <Container>
      <Separator className="bg-foreground/10" />
    </Container>
  );
}

function PartDivider() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="flex items-center justify-center gap-6">
        <Separator className="flex-1 bg-foreground/10" />
        <span
          aria-hidden="true"
          className="select-none font-mono text-muted-foreground/60 text-sm tracking-[0.25em]"
        >
          §
        </span>
        <Separator className="flex-1 bg-foreground/10" />
      </div>
    </Container>
  );
}

export const metadata: Metadata = {
  description:
    "Every exhibit takes something developers are sure about and runs the real feature next to it: the server/client boundary, caching, streaming, Server Actions, generated images. Poke it, break it, read the code that did it. New exhibit every Monday.",
  // Resolves the relative /api/og image below to an absolute URL in the
  // rendered og:image tag — crawlers don't do relative.
  metadataBase: new URL(env.NEXT_PUBLIC_WEB_URL),
  openGraph: {
    images: [
      {
        height: 630,
        url: `/api/og?title=${encodeURIComponent(DEFAULT_OG_TITLE)}`,
        width: 1200,
      },
    ],
  },
  title: "hasToggle — the unofficial live playground for Next.js & Vercel",
  twitter: {
    card: "summary_large_image",
  },
};

interface PageProps {
  searchParams: Promise<{ stream?: string }>;
}

function BoundaryDemo() {
  return (
    <DemoSection
      belief="I’ll put “use client” on it, to be safe."
      chapter="01"
      docs={{
        href: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
        label: "Server and Client Components",
      }}
      id="demo-01"
      intro={
        <>
          <p>
            Safer than what? We reached for it the same way, for about a year,
            before anyone made us say what it was protecting against. Every
            component in the App Router already runs on the server.{" "}
            <InlineCode>&quot;use client&quot;</InlineCode>&#32;is not a
            precaution, it&rsquo;s a purchase — for that file and everything it
            imports. You buy useState, useEffect and onClick. You pay with the
            database call you can no longer make from here, the API key you can
            no longer read, and however much React your visitor downloads on
            their phone.
          </p>
          <p>
            One of these cards rendered in Node.js and arrived as finished HTML.
            The other hydrated in your tab and is waiting for a click. Only one
            of them knows what version of Node it is running on.
          </p>
        </>
      }
      meta={
        <>
          The error that sends everyone here is &ldquo;useState only works in a
          Client Component&rdquo;. The server isn&rsquo;t being difficult. It
          has no clicks to listen for.
        </>
      }
      sourcePath="apps/web/app/[locale]/(playground)/boundary"
      topic="server & client components"
    >
      <LivePanel
        label="two components, one page"
        readout="boundary drawn at the import graph · props cross it as serialized data"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <ServerCard />
          <ClientCard />
        </div>
      </LivePanel>
      <CodeBlock code={SERVER_CARD_SOURCE} file="server-card.tsx" />
      <CodeBlock code={CLIENT_CARD_SOURCE} file="client-card.tsx" />
    </DemoSection>
  );
}

async function ShellDemo() {
  const bake = await getBake();

  return (
    <DemoSection
      belief="I cleared the cache, so the page is fresh now."
      chapter="02"
      docs={{
        href: "https://nextjs.org/docs/app/getting-started/caching",
        label: "Caching",
      }}
      id="demo-02"
      intro={
        <>
          <p>
            You cleared it. Nothing refilled it.{" "}
            <InlineCode>use cache</InlineCode>&#32;bakes a component&rsquo;s
            output into the page&rsquo;s static shell. A cache tag is the handle
            you pull to throw that entry away — pulling it does not put anything
            back, and the page is only fresh once something does.
          </p>
          <p>
            The stamp below is this page&rsquo;s own cache entry — one entry,
            shared by every visitor. Press the button and it is gone, for all of
            them, immediately.
          </p>
          <p>
            Then fetch what is actually cached now. The fingerprint moves twice,
            not once, and the gap between those two moves is where every
            &ldquo;but I already revalidated it&rdquo; ticket lives.
          </p>
        </>
      }
      meta={
        <>
          The ritual: clear the cache, hard refresh, clear it again, open an
          incognito window, ask a colleague to load it. Five steps, three of
          which quietly refill the entry you just cleared.
        </>
      }
      sourcePath="apps/web/app/[locale]/(playground)/shell"
      topic="caching & revalidation"
    >
      <LivePanel
        label="this page’s own cache"
        readout={
          <>
            cacheTag(&quot;landing-shell&quot;) · cacheLife(&quot;days&quot;) ·
            one entry, shared by every visitor
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <BakedStamp bake={bake} />
          <RebakePanel currentId={bake.id} />
        </div>
      </LivePanel>
      <CodeBlock code={SHELL_SOURCE} file="bake.ts + actions.ts" />
    </DemoSection>
  );
}

function StreamDemo({ searchParams }: PageProps) {
  return (
    <DemoSection
      belief="I’ll fetch it all first, then render."
      chapter="03"
      docs={{
        href: "https://nextjs.org/docs/app/api-reference/file-conventions/loading",
        label: "Streaming and loading UI",
      }}
      id="demo-03"
      intro={
        <>
          <p>
            Not any more. The static shell ships immediately, each slow part
            shows its fallback, and the server streams finished HTML into place
            over the same response as each part finishes. Nothing waits for
            everything.
          </p>
          <p>
            These three rows are slow on purpose. The delays are hardcoded — the
            only faked thing on this page — but the streaming is not: each row
            is a Server Component that genuinely finishes on the server and
            lands when it is done. Run it again and watch the order hold. What
            you are seeing is the server finishing, not an animation pretending
            to.
          </p>
        </>
      }
      meta={
        <>
          loading.tsx is this same mechanism wearing route-sized clothes. One
          file, and the whole segment gets a fallback.
        </>
      }
      sourcePath="apps/web/app/[locale]/(playground)/stream"
      topic="streaming & suspense"
    >
      <LivePanel
        label="the server, cooking"
        readout="3 Suspense boundaries · re-keyed by ?stream= · the shell never waited for any of them"
      >
        <div className="flex flex-col gap-5">
          <Suspense
            fallback={
              <>
                <RerunButtonFallback />
                <StreamRowsFallback />
              </>
            }
          >
            <RerunButton />
            <StreamRows searchParams={searchParams} />
          </Suspense>
        </div>
      </LivePanel>
      <CodeBlock code={STREAM_SOURCE} file="slow-row.tsx" />
    </DemoSection>
  );
}

function MutationDemo() {
  return (
    <DemoSection
      belief="You need an API route for that."
      chapter="04"
      docs={{
        href: "https://nextjs.org/docs/app/getting-started/updating-data",
        label: "Updating data with Server Actions",
      }}
      id="demo-04"
      intro={
        <>
          <p>
            You need a function. A Server Action lives on the server and plugs
            straight into a form&rsquo;s <InlineCode>action</InlineCode>: no
            endpoint to design, no fetch to write, no JSON contract to keep in
            sync. The form calls the function, the function mutates, and Next.js
            re-renders the page around the result.
          </p>
          <p>
            This one increments a counter held in an httpOnly cookie, read back
            by a Server Component. The JavaScript in your tab never touches that
            value, and could not if it tried.
          </p>
        </>
      }
      meta={
        <>
          Somewhere a tutorial is teaching you to build{" "}
          <InlineCode>/api/increment</InlineCode>. It will teach you to validate
          the request body, handle the 405, and write a fetch wrapper with a
          retry. All of it correct. All of it in service of adding one to a
          number.
        </>
      }
      sourcePath="apps/web/app/[locale]/(playground)/mutation"
      topic="server actions & cookies"
    >
      <LivePanel
        label="your cookie, read server-side"
        readout="httpOnly cookie · written by a Server Action · the page re-renders itself"
      >
        <div className="flex flex-col gap-6">
          <Suspense fallback={<PressCountFallback />}>
            <PressCount />
          </Suspense>
          <PressForm />
        </div>
      </LivePanel>
      <CodeBlock code={MUTATION_SOURCE} file="actions.ts + press-form.tsx" />
    </DemoSection>
  );
}

function ImageDemo() {
  return (
    <DemoSection
      belief="I’ll need to design a card for every page."
      chapter="05"
      docs={{
        href: "https://nextjs.org/docs/app/api-reference/functions/image-response",
        label: "ImageResponse",
      }}
      id="demo-05"
      intro={
        <>
          <p>
            You&rsquo;ll design one. <InlineCode>ImageResponse</InlineCode>
            &#32;renders JSX to a PNG at request time, and it is a route handler
            like any other — query in, image out. One file draws the card for
            every page you will ever publish.
          </p>
          <p>
            Type a title and the server draws it. The same endpoint drew the
            link preview for this page — paste the URL into Slack and check us
            against it.
          </p>
        </>
      }
      meta={
        <>
          Every repo has an og-image-final-v2.png in it somewhere, quietly out
          of date since the last time the headline changed. Nobody is coming to
          update it, and now nobody has to.
        </>
      }
      sourcePath="apps/web/app/api/og"
      topic="imageresponse & route handlers"
    >
      <LivePanel
        label="/api/og"
        readout="route handler · JSX → Satori (flexbox only) → PNG · rendered per request, cached by nobody"
      >
        <OgDemo />
      </LivePanel>
      <CodeBlock code={OG_SOURCE} file="app/api/og/route.tsx" />
    </DemoSection>
  );
}

const UPCOMING: readonly string[] = [
  "navigation & prefetching",
  "dynamic routes & params",
  "next/image, fonts & the asset pipeline",
  "metadata, sitemaps & SEO",
  "optimistic UI & useActionState",
  "proxy, redirects & rewrites",
  "error, not-found & recovery",
  "parallel & intercepted routes",
  "i18n & locale routing",
  "view transitions",
  "ISR & pages baked on demand",
  "edge network & geolocation",
  "feature flags & Edge Config",
  "web vitals, measured live",
  "preview deploys & instant rollback",
  "cron, queues & background work",
  "blob, key-value & Postgres",
];

function Roadmap() {
  return (
    <section aria-labelledby="roadmap-heading" id="roadmap">
      <Container className="py-24 sm:py-32">
        {/* The empty rail keeps the page on one left edge without numbering a
            section that isn't an exhibit. */}
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[7rem_minmax(0,1fr)]">
          <div aria-hidden="true" />
          <div className="ht-reveal">
            <Subheading>The syllabus grows</Subheading>
            <Heading
              as="h2"
              className="mt-3 max-w-2xl text-balance text-4xl sm:text-5xl md:text-6xl"
              id="roadmap-heading"
            >
              Still to build.
            </Heading>
            <p className="mt-6 max-w-2xl text-foreground/75 text-lg leading-8">
              The plan is everything Next.js can do, and as much of Vercel as
              can be proved from inside a web page. One exhibit at a time, in
              public.
            </p>

            <ul className="mt-14 grid max-w-3xl grid-cols-1 gap-x-12 gap-y-3 font-mono text-muted-foreground text-sm/6 sm:grid-cols-2">
              {UPCOMING.map((item) => (
                <li className="flex items-baseline gap-3" key={item}>
                  <span
                    aria-hidden="true"
                    className="select-none text-ht-cyan-700/60 dark:text-ht-cyan-300/60"
                  >
                    +
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <MetaAside className="mt-16 max-w-2xl" variant="block">
              Built in the open: the{" "}
              <a
                className="underline decoration-ht-cyan-700/40 underline-offset-2 transition-colors hover:decoration-ht-cyan-700"
                href="https://github.com/hasToggle/hasToggle.dev"
                rel="noreferrer"
                target="_blank"
              >
                repo is public
              </a>
              , and the building is done with AI — Conductor orchestrating
              Claude Code, with the process published alongside via Entire.io.
              You get the playground and the making-of.
            </MetaAside>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Cohort() {
  return (
    <section aria-labelledby="cohort-heading" id="cohort">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[7rem_minmax(0,1fr)]">
          <div aria-hidden="true" />
          <div className="ht-reveal max-w-2xl">
            <Subheading id="cohort-heading">The cohort</Subheading>
            <Heading as="h2" className="mt-3 text-balance text-4xl sm:text-5xl">
              Some things move faster with a coach.
            </Heading>
            <p className="mt-6 text-foreground/75 text-lg leading-8">
              I spent years as a lead web coach in bootcamps, watching the same
              walls catch everyone — hydration, caching, the boundary, all the
              exhibits above. The playground shows you the wall. The cohort gets
              you over it: small paid groups, building production apps on
              exactly these topics, with the same AI workflow that built this
              page.
            </p>
            <div className="mt-8 flex flex-col items-start gap-x-8 gap-y-4 sm:flex-row sm:items-center">
              <MarketingButton href="#digest">
                Tell me when seats open
              </MarketingButton>
              <MetaAside className="sm:max-w-xs">
                Paid, small, and honest about both.
              </MetaAside>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function DigestCTA() {
  return (
    <section
      aria-labelledby="digest-heading"
      className="relative bg-ht-cyan-50/80 py-24 sm:py-32 dark:bg-ht-cyan-950/30"
      id="digest"
    >
      <Container>
        <div className="ht-reveal mx-auto flex max-w-2xl flex-col items-center text-center">
          <Subheading className="text-ht-cyan-800/80 dark:text-ht-cyan-300/80">
            The weekly build
          </Subheading>
          <Heading
            as="h3"
            className="mt-3 text-balance text-4xl sm:text-5xl"
            id="digest-heading"
          >
            One new exhibit every Monday.
          </Heading>
          <p className="mt-6 max-w-xl text-balance text-foreground/75 text-lg leading-8">
            A new demo lands on this page. The write-up lands in your inbox:
            what it shows, why it matters, when to reach for it.
          </p>
          <p className="mt-3 max-w-xl text-balance text-base text-foreground/55">
            Cohort seats open to the list first.
          </p>
          <div className="mt-10 w-full">
            <Digest />
          </div>
          <MetaAside className="mt-6">
            One email a week. Unsubscribing is one click, and it works the first
            time.
          </MetaAside>
        </div>
      </Container>
    </section>
  );
}

export default function MarketingPage({ searchParams }: PageProps) {
  // `overflow-x-clip`, not `overflow-hidden`: clipping stops the full-bleed
  // rules from widening the page, but unlike `hidden` it does not turn this
  // element into a scroll container — which is what the scroll-driven reveals
  // resolve against. See `.ht-reveal` in app/styles.css.
  return (
    <div className="overflow-x-clip">
      <Hero />
      <main>
        <BoundaryDemo />
        <SectionDivider />
        <ShellDemo />
        <SectionDivider />
        <StreamDemo searchParams={searchParams} />
        <SectionDivider />
        <MutationDemo />
        <SectionDivider />
        <ImageDemo />
        <PartDivider />
        <Roadmap />
        <SectionDivider />
        <Cohort />
        <DigestCTA />
        <FrequentlyAskedQuestions />
      </main>
      <Footer />
    </div>
  );
}
