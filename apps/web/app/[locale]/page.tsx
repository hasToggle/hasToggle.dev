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
import { BakedStamp } from "./(playground)/shell/baked-stamp";
import { RebakeButton } from "./(playground)/shell/rebake-button";
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
    "Interactive demos of Next.js and Vercel — caching, streaming, server actions, generated images. Press the buttons, break the cache, read the code that did it. New exhibit every Monday.",
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
  title: "hasToggle — the live playground for Next.js & Vercel",
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
      chapter="01"
      docs={{
        href: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
        label: "Server and Client Components",
      }}
      hook="Two components walk into a page."
      id="demo-01"
      intro={
        <>
          <p>
            Every component in the App Router runs on the server unless you say
            otherwise. One directive —{" "}
            <InlineCode>&quot;use client&quot;</InlineCode>&#32;— moves a
            subtree into the browser. Everything else follows from that split:
            what can read secrets, what can hold state, what ships JavaScript
            and what arrives as finished HTML.
          </p>
          <p>
            One of these cards rendered in Node.js and arrived as finished HTML.
            The other hydrated in your tab and is waiting for you to click it.
          </p>
        </>
      }
      meta={
        <>
          The error that sends everyone here is &ldquo;useState only works in a
          Client Component&rdquo;. Now you know why: the server has no clicks to
          listen for.
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

function ShellDemo() {
  return (
    <DemoSection
      chapter="02"
      docs={{
        href: "https://nextjs.org/docs/app/getting-started/caching",
        label: "Caching",
      }}
      hook="This page was baked before you arrived."
      id="demo-02"
      intro={
        <>
          <p>
            Static doesn&apos;t mean written by hand, and dynamic doesn&apos;t
            mean every visitor pays full price.{" "}
            <InlineCode>use cache</InlineCode>&#32;bakes a component&apos;s
            output into the page&apos;s static shell; a cache tag gives you a
            handle to expire it on demand.
          </p>
          <p>
            The stamp below is this page&apos;s cache entry. Press the button
            and it expires — for every visitor, instantly. Nobody ever lets you
            press this button. Go on.
          </p>
        </>
      }
      meta={
        <>
          &ldquo;Why is my page stale&rdquo; and &ldquo;why is my page
          slow&rdquo; are the same question read from opposite ends. This demo
          is both answers.
        </>
      }
      sourcePath="apps/web/app/[locale]/(playground)/shell"
      topic="caching & revalidation"
    >
      <LivePanel
        label="this page's own cache"
        readout={
          <>
            cacheTag(&quot;landing-shell&quot;) · cacheLife(&quot;days&quot;) ·
            one entry, shared by every visitor
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <BakedStamp />
          <RebakeButton />
        </div>
      </LivePanel>
      <CodeBlock code={SHELL_SOURCE} file="bake.ts + actions.ts" />
    </DemoSection>
  );
}

function StreamDemo({ searchParams }: PageProps) {
  return (
    <DemoSection
      chapter="03"
      docs={{
        href: "https://nextjs.org/docs/app/api-reference/file-conventions/loading",
        label: "Streaming and loading UI",
      }}
      hook="The page refused to wait."
      id="demo-03"
      intro={
        <>
          <p>
            Slow data used to hold the whole page hostage. With Suspense, the
            static shell ships immediately, every slow part shows its fallback,
            and the server streams finished HTML into place — over the same
            response — whenever each part is done.
          </p>
          <p>
            These three rows are slow on purpose. Watch the skeletons resolve in
            delay order — fastest first, slowest last. Then make it do it again.
          </p>
        </>
      }
      meta={
        <>
          loading.tsx is this exact mechanism wearing route-sized clothes. One
          file, and your whole segment gets a fallback.
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
      chapter="04"
      docs={{
        href: "https://nextjs.org/docs/app/getting-started/updating-data",
        label: "Updating data with Server Actions",
      }}
      hook="A form with no API route."
      id="demo-04"
      intro={
        <>
          <p>
            A Server Action is a function that lives on the server and plugs
            straight into a form&apos;s <InlineCode>action</InlineCode>. No
            endpoint to design, no fetch, no JSON contract — the form invokes
            the function, the function mutates, and Next.js re-renders the page
            with the result.
          </p>
          <p>
            This one increments a counter stored in an httpOnly cookie. The
            number is read back by a Server Component — the JavaScript in your
            tab never touches it, and couldn&apos;t if it tried.
          </p>
        </>
      }
      meta={
        <>
          Somewhere, a 2019 tutorial is still teaching you to build{" "}
          <InlineCode>/api/increment</InlineCode>. It can rest now.
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
      chapter="05"
      docs={{
        href: "https://nextjs.org/docs/app/api-reference/functions/image-response",
        label: "ImageResponse",
      }}
      hook="An image that didn't exist a second ago."
      id="demo-05"
      intro={
        <>
          <p>
            <InlineCode>ImageResponse</InlineCode>&#32;turns JSX into a PNG at
            request time — it&apos;s how sites generate a link-preview card per
            page instead of per designer. Under the hood it&apos;s a route
            handler like any other: query in, image out.
          </p>
          <p>
            Type a title and the server draws your card. The same endpoint makes
            the link preview for this page — and the pattern carries to every
            page you&apos;ll ever need a card for.
          </p>
        </>
      }
      meta={
        <>
          The fine print: it looks like CSS, but the renderer (Satori) only
          understands flexbox. Grid users will be shown the door, politely, at
          build time.
        </>
      }
      sourcePath="apps/web/app/api/og"
      topic="imageresponse & route handlers"
    >
      <LivePanel
        label="/api/og"
        readout="route handler · JSX → Satori → PNG · rendered per request, cached by nobody"
      >
        <OgDemo />
      </LivePanel>
      <CodeBlock code={OG_SOURCE} file="app/api/og/route.tsx" />
    </DemoSection>
  );
}

const UPCOMING: readonly string[] = [
  "dynamic routes & params",
  "next/image, fonts & the asset pipeline",
  "proxy, redirects & rewrites",
  "error, not-found & recovery",
  "parallel & intercepted routes",
  "ISR at scale",
  "edge network & geolocation",
  "preview deploys & instant rollback",
  "cron, queues & background work",
  "blob, KV & Postgres",
];

function Roadmap() {
  return (
    <section aria-labelledby="roadmap-heading" id="roadmap">
      <Container className="py-24 sm:py-32">
        <div className="mb-14 max-w-2xl">
          <Subheading>The syllabus grows</Subheading>
          <Heading
            as="h2"
            className="mt-3 text-balance text-4xl sm:text-5xl md:text-6xl"
            id="roadmap-heading"
          >
            Five exhibits. Dozens to go.
          </Heading>
          <p className="mt-6 text-foreground/75 text-lg leading-8">
            The plan is everything Next.js has to offer — and as much of the
            Vercel platform as can be demonstrated from inside a web page. One
            exhibit at a time, in public.
          </p>
        </div>

        <ul className="grid max-w-3xl grid-cols-1 gap-x-12 gap-y-3 font-mono text-muted-foreground text-sm/6 sm:grid-cols-2">
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

        <div className="mt-16 max-w-2xl">
          <MetaAside variant="block">
            Built in the open: the{" "}
            <a
              className="underline decoration-ht-cyan-700/40 underline-offset-2 hover:decoration-ht-cyan-700"
              href="https://github.com/hasToggle/hasToggle.dev"
              rel="noreferrer"
              target="_blank"
            >
              repo is public
            </a>
            , and the building is done with AI — Conductor orchestrating Claude
            Code, with the process published alongside via Entire.io. You get
            the playground and the making-of.
          </MetaAside>
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
          <div className="max-w-2xl">
            <Subheading id="cohort-heading">The cohort</Subheading>
            <Heading as="h2" className="mt-3 text-balance text-4xl sm:text-5xl">
              Some things move faster with a coach.
            </Heading>
            <p className="mt-6 text-foreground/75 text-lg leading-8">
              I spent years as a lead web coach in bootcamps, watching the same
              walls catch everyone — hydration, caching, the boundary, all the
              exhibits above. The playground shows you the wall. The cohort gets
              you over it: small paid groups, building production apps on
              exactly these topics, AI workflow included.
            </p>
            <div className="mt-8 flex flex-col items-start gap-x-8 gap-y-4 sm:flex-row sm:items-center">
              <MarketingButton href="#digest">
                Get first dibs on seats
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
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
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
            The fact that you&apos;re reading the fine print under an email form
            says something about you. Something good.
          </MetaAside>
        </div>
      </Container>
    </section>
  );
}

export default function MarketingPage({ searchParams }: PageProps) {
  return (
    <div className="overflow-hidden">
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
        <Cohort />
        <DigestCTA />
        <FrequentlyAskedQuestions />
      </main>
      <Footer />
    </div>
  );
}
