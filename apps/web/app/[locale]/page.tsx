import { Separator } from "@repo/design-system/components/ui/separator";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DEFAULT_OG_TITLE } from "@/app/api/og/title";
import { env } from "@/env";
import { ClientCard } from "./(playground)/boundary/client-card";
import { ServerCard } from "./(playground)/boundary/server-card";
import { BOUNDARY_SOURCE } from "./(playground)/boundary/source";
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
import { ReferenceBar } from "./(playground)/reference-bar";
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
import { ContentsNav } from "./components/contents-nav";
import { Digest } from "./components/digest";
import { FrequentlyAskedQuestions } from "./components/faqs";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { MetaAside } from "./components/meta-aside";
import { SeatsCta } from "./components/seats-cta";
import { Heading, Subheading } from "./components/text";
import { STILL_TO_BUILD } from "./lab/syllabus";

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
            Watch the two cards below. One rendered in Node.js and arrived as
            finished HTML — done before you got here. The other arrived as
            JavaScript and woke up in your tab — the waking is called hydration
            — and its button is waiting for a click. Only one of them is running
            Node, and it prints the version to prove it.
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
      topic="server & client components"
    >
      <LivePanel
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/server-and-client-components"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/boundary"
          >
            <CodeBlock
              code={BOUNDARY_SOURCE}
              file="server-card.tsx + client-card.tsx"
            />
          </ReferenceBar>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <ServerCard />
            <ClientCard />
          </div>
          {/* The seam, narrated: the one fact neither card can state alone. */}
          <p className="font-mono text-muted-foreground text-xs/5">
            props cross the boundary as serialized data — the import graph
            decides which side a component runs on.
          </p>
        </div>
      </LivePanel>
    </DemoSection>
  );
}

async function ShellDemo() {
  const bake = await getBake();

  return (
    <DemoSection
      belief="It’s either cached or it isn’t."
      chapter="02"
      id="demo-02"
      intro={
        <>
          <p>
            We believed it, too — hit or miss, there or not. But
            &ldquo;cached&rdquo; is not a state a page is in; it is a bake with
            a lifespan. <InlineCode>use cache</InlineCode>&#32;bakes a
            component&rsquo;s output into the page&rsquo;s static shell — one
            copy, served to everyone — and a cache tag is the handle you pull to
            throw that copy away. Pulling it empties the shelf and lights no
            oven. The fresh page is baked when the next request asks for one,
            and not a moment before.
          </p>
          <p>
            The stamp below is that copy — this page&rsquo;s own cache entry,
            wearing a six-character fingerprint so you can tell one bake from
            the next. Press the button and a fresh bake lands for every visitor,
            in the time it takes the label to change back. It feels like one
            event.
          </p>
          <p>
            It is three. Flip the switch and run it again in slow motion — the
            panel narrates each event as it happens. Watch the color: it changes
            twice, not once, and that gap is what your cache logs are naming.
            Press the button here and the next request logs{" "}
            <InlineCode>REVALIDATED</InlineCode> — reason:{" "}
            <InlineCode>tag-based deletion</InlineCode> — because that request
            was the refill. <InlineCode>STALE</InlineCode> is the same gap
            handled softly: the old bake served while a fresh one is in the
            oven.
          </p>
        </>
      }
      meta={
        <>
          In your app, the two renders behind one press would read the same
          database and agree — no visitor would ever see the seam. The bake here
          is a random color value precisely so two renders can never agree.
          Watching a cache work requires caching something that never repeats.
        </>
      }
      topic="caching & revalidation"
    >
      {/* The client panel owns the instrument chrome here, because the
          header gauge and the display's pending treatment follow its
          transitions. The stamp stays a Server Component, threaded through
          as a prop — the composition exhibit one teaches. No label (the
          intro names the subject once) and no readout strip: cacheTag and
          cacheLife are visible in the bake.ts source, one drawer down in
          the reference bar, which is the spec plate a reader who wants
          identifiers actually opens. */}
      <RebakePanel
        currentId={bake.id}
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/caching"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/shell"
          >
            <CodeBlock
              code={SHELL_SOURCE}
              file="bake.ts + actions.ts + the ask"
            />
          </ReferenceBar>
        }
        stamp={<BakedStamp bake={bake} />}
      />
    </DemoSection>
  );
}

function StreamDemo({ searchParams }: PageProps) {
  return (
    <DemoSection
      belief="I’ll fetch it all first, then render."
      chapter="03"
      id="demo-03"
      intro={
        <>
          <p>
            Not any more. The static shell ships immediately, and each slow part
            leaves behind a fallback — the gray placeholder you&rsquo;ll watch
            below. As each part finishes, the server streams its finished HTML
            down the same response, and the placeholder gives way. The fast
            parts don&rsquo;t wait for the slow ones.
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
      topic="streaming & suspense"
    >
      {/* The rerun control keeps its own Suspense boundary (it reads the
          URL, which is runtime data) so the deck can hold it while the rows
          stream in the body — the rows' skeletons are the in-flight signal,
          arriving in delay order. */}
      <LivePanel
        deck={
          <Suspense fallback={<RerunButtonFallback />}>
            <RerunButton />
          </Suspense>
        }
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/api-reference/file-conventions/loading"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/stream"
          >
            <CodeBlock code={STREAM_SOURCE} file="slow-row.tsx" />
          </ReferenceBar>
        }
      >
        <Suspense fallback={<StreamRowsFallback />}>
          <StreamRows searchParams={searchParams} />
        </Suspense>
      </LivePanel>
    </DemoSection>
  );
}

function MutationDemo() {
  return (
    <DemoSection
      belief="You need an API route for that."
      chapter="04"
      id="demo-04"
      intro={
        <>
          <p>
            You need a function. A Server Action lives on the server and plugs
            straight into a form&rsquo;s <InlineCode>action</InlineCode>: no
            endpoint to design, no fetch to write, no JSON contract to keep in
            sync. Press the button below and follow the trip: the form calls the
            function, the function adds one, and Next.js re-renders the page
            around the new number.
          </p>
          <p>
            This one keeps its count in a cookie your browser carries but your
            JavaScript cannot open — that is what httpOnly means — and a Server
            Component reads it back. The JavaScript in your tab never touches
            the value, and could not if it tried.
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
      topic="server actions & cookies"
    >
      {/* The form stays in the body: it is the specimen, not instrument
          chrome — a form wired straight to a Server Action is the entire
          lesson, and moving it into the deck would file the exhibit's
          subject under controls. */}
      <LivePanel
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/getting-started/updating-data"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/%5Blocale%5D/(playground)/mutation"
          >
            <CodeBlock
              code={MUTATION_SOURCE}
              file="actions.ts + press-form.tsx"
            />
          </ReferenceBar>
        }
      >
        <div className="flex flex-col gap-6">
          <Suspense fallback={<PressCountFallback />}>
            <PressCount />
          </Suspense>
          <PressForm />
        </div>
      </LivePanel>
    </DemoSection>
  );
}

function ImageDemo() {
  return (
    <DemoSection
      belief="I’ll need to design a card for every page."
      chapter="05"
      id="demo-05"
      intro={
        <>
          <p>
            You&rsquo;ll design one. <InlineCode>ImageResponse</InlineCode>
            &#32;turns JSX — the same markup your components are made of — into
            a PNG the moment a request asks, and it is a route handler like any
            other: query in, image out. One file draws the card for every page
            you will ever publish.
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
      topic="imageresponse & route handlers"
    >
      {/* OgDemo owns the instrument: the gauge follows its fetch state, the
          title form is its deck. The reference bar threads through as a prop
          because CodeBlock renders on the server. */}
      <OgDemo
        references={
          <ReferenceBar
            docsHref="https://nextjs.org/docs/app/api-reference/functions/image-response"
            sourceHref="https://github.com/hasToggle/hasToggle.dev/tree/main/apps/web/app/api/og"
          >
            <CodeBlock code={OG_SOURCE} file="app/api/og/route.tsx" />
          </ReferenceBar>
        }
      />
    </DemoSection>
  );
}

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
              {STILL_TO_BUILD.map((item) => (
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
              Claude Code, with{" "}
              <a
                className="underline decoration-ht-cyan-700/40 underline-offset-2 transition-colors hover:decoration-ht-cyan-700"
                href="https://github.com/hasToggle/hasToggle.dev-checkpoints"
                rel="noreferrer"
                target="_blank"
              >
                every prompt and checkpoint published
              </a>{" "}
              as they happen. You get the playground and the making-of.
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
              <SeatsCta>Tell me when seats open</SeatsCta>
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
        {/* This wrapper is the contents bar's sticky bound: the bar pins to
            the viewport while the visitor is among the exhibits and releases
            when the wrapper ends after demo 05 — the roadmap onward scrolls
            nav-free, with no JavaScript deciding anything. */}
        <div>
          <ContentsNav />
          <BoundaryDemo />
          <SectionDivider />
          <ShellDemo />
          <SectionDivider />
          <StreamDemo searchParams={searchParams} />
          <SectionDivider />
          <MutationDemo />
          <SectionDivider />
          <ImageDemo />
        </div>
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
