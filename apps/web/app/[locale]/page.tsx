import { Separator } from "@repo/design-system/components/ui/separator";
import type { Metadata } from "next";
import { DEFAULT_OG_TITLE, ogImageUrl } from "@/app/api/og/title";
import { BoundaryDemo } from "./(playground)/boundary/demo";
import { MutationDemo } from "./(playground)/mutation/demo";
import { ShellDemo } from "./(playground)/shell/demo";
import { StateDemo } from "./(playground)/state/demo";
import {
  StreamDemo,
  type StreamSearchParams,
} from "./(playground)/stream/demo";
import { Container } from "./components/container";
import { ContentsNav } from "./components/contents-nav";
import { FrequentlyAskedQuestions } from "./components/faqs";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { Link } from "./components/marketing-link";
import { MetaAside } from "./components/meta-aside";
import { SeatsCta } from "./components/seats-cta";
import { Heading, Subheading } from "./components/text";
import { Waitlist } from "./components/waitlist";
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
    "Every chapter of the lab opens on something the platform can already do and runs the real feature next to it: the server/client boundary, caching, streaming, Server Actions, generated images. Press it, break it, read the code that did it.",
  openGraph: {
    images: [
      {
        height: 630,
        url: ogImageUrl(DEFAULT_OG_TITLE),
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
  searchParams: StreamSearchParams;
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
            <Subheading as="div">The syllabus grows</Subheading>
            <Heading
              as="h2"
              className="mt-3 max-w-2xl text-balance text-4xl sm:text-5xl md:text-6xl"
              id="roadmap-heading"
            >
              Still to build.
            </Heading>
            <p className="mt-6 max-w-2xl text-foreground/75 text-lg leading-8">
              The plan is everything Next.js can do, and as much of Vercel as
              can be proved from inside a web page. One chapter at a time, in
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

            <p className="mt-10 font-mono text-sm/6">
              <Link
                className="text-foreground/70 transition-colors hover:text-foreground"
                href="/lab"
              >
                the contents of the lab →
              </Link>
            </p>

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
            <Subheading as="div">The cohort</Subheading>
            <Heading
              as="h2"
              className="mt-3 text-balance text-4xl sm:text-5xl"
              id="cohort-heading"
            >
              Some things move faster with a coach.
            </Heading>
            <p className="mt-6 text-foreground/75 text-lg leading-8">
              I spent years as a lead web coach in bootcamps, watching the same
              walls catch everyone — hydration, caching, the boundary, all the
              chapters above. The playground shows you the wall. The cohort gets
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

function WaitlistCTA() {
  return (
    <section
      aria-labelledby="waitlist-heading"
      className="relative bg-ht-cyan-50/80 py-24 sm:py-32 dark:bg-ht-cyan-950/30"
      id="waitlist"
    >
      <Container>
        <div className="ht-reveal mx-auto flex max-w-2xl flex-col items-center text-center">
          <Subheading
            as="div"
            className="text-ht-cyan-900 dark:text-ht-cyan-300/80"
          >
            The waitlist
          </Subheading>
          <Heading
            as="h3"
            className="mt-3 text-balance text-4xl sm:text-5xl"
            id="waitlist-heading"
          >
            Want a seat when the cohort opens?
          </Heading>
          <p className="mt-6 max-w-xl text-balance text-foreground/75 text-lg leading-8">
            Put your address here and you hear first: when seats open, what the
            cohort will build, and which chapters in the lab it draws on.
          </p>
          <p className="mt-3 max-w-xl text-balance text-base text-foreground/55">
            Seats open to this list before anywhere else.
          </p>
          <div className="mt-10 w-full">
            <Waitlist />
          </div>
          <MetaAside className="mt-6">
            Three kinds of email: seats opened, a chapter shipped, the cohort
            changed shape. Leaving is one click, and it works the first time.
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
            when the wrapper ends after the last exhibit — the roadmap onward scrolls
            nav-free, with no JavaScript deciding anything. */}
        <div>
          <ContentsNav />
          <BoundaryDemo />
          <SectionDivider />
          <ShellDemo />
          <SectionDivider />
          <StreamDemo searchParams={searchParams} startOnView />
          <SectionDivider />
          <MutationDemo />
          <SectionDivider />
          <StateDemo />
        </div>
        <PartDivider />
        <Roadmap />
        <SectionDivider />
        <Cohort />
        <WaitlistCTA />
        <FrequentlyAskedQuestions />
      </main>
      <Footer />
    </div>
  );
}
