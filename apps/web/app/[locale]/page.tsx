import { Separator } from "@repo/design-system/components/ui/separator";
import type { Metadata } from "next";
import { Completion } from "./(demos)/completion";
import { Mirror } from "./(demos)/mirror";
import { MisconceptionWrapper } from "./(demos)/misconception-wrapper";
import { Plausibility } from "./(demos)/plausibility";
import { Container } from "./components/container";
import { Digest } from "./components/digest";
import { Expandable } from "./components/expandable";
import { FrequentlyAskedQuestions } from "./components/faqs";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
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
  title: "hasToggle — AI makes you more.",
  description:
    "For developers who'd rather own the answer than borrow it. Every Monday, one thing built — code, demo, or walkthrough — made with AI, finished by judgment.",
};

function MisconceptionDemos() {
  return (
    <div>
      {/* Demo 1: Plausibility — grammar without meaning */}
      <MisconceptionWrapper
        hook="It's grounded in the docs. It has to be right."
        id="misconception-01"
        meta="What you're about to watch is exactly what AI does every time you ask it anything. We're just slowing it down enough that you can see it."
        number={1}
        question="Where is the time actually going?"
        tag="The Question"
      >
        <Plausibility />
      </MisconceptionWrapper>

      <SectionDivider />

      {/* Demo 2: Destructive Defaults — essay */}
      <MisconceptionWrapper
        hook="I told AI exactly what I wanted."
        id="misconception-02"
        meta="And the question you didn't ask is the one that shipped to production."
        number={2}
        reality="AI builds what you ask for. Not what you need. The gap between those is your job."
        tag="The Contract"
      >
        <Expandable
          label={
            'Did you know? "The safest brake is the one that\'s always on."'
          }
        >
          <div className="space-y-4 text-foreground/75 leading-7">
            <p>
              Heavy trucks use air brakes. This is interesting for a reason that
              has nothing to do with trucks and everything to do with the demo
              you just saw.
            </p>
            <p>
              In a car, you press the brake pedal and fluid pushes the pads
              against the wheels. If the fluid leaks out, you have no brakes.
              This is what engineers call a &ldquo;failure mode,&rdquo; and what
              passengers call &ldquo;screaming.&rdquo;
            </p>
            <p>
              Truck engineers, being the sort of people who think about what
              happens when things go wrong&thinsp;*&thinsp;— looked at this and
              made a decision that seems obvious in hindsight and brilliant in
              foresight: they reversed it. In a truck, massive springs hold the
              brakes <em>on</em> by default. Air pressure is what{" "}
              <em>releases</em> them. If a line is cut, if the compressor dies,
              if anything fails at all, the springs do what springs do and the
              truck stops.
            </p>
            <p>
              The safe state isn&apos;t something the system has to achieve.
              It&apos;s where the system already is.
            </p>
            <p>
              Now look at the demo above. A developer asked AI to &ldquo;handle
              errors.&rdquo; AI handled them. By deleting the records. Nobody
              asked &ldquo;what should the <em>default</em> be when something
              goes wrong?&rdquo; — and so the default became the worst possible
              thing, delivered with the quiet confidence of a system that is
              working exactly as instructed.
            </p>
            <p>
              The truck engineer and the software developer faced the same
              question. One of them thought about it first.&thinsp;**
            </p>
            <MetaAside className="mt-4" noMarker>
              * A trait that, in software, is distressingly rare and
              disproportionately valuable.
            </MetaAside>
            <MetaAside noMarker>
              ** The other one shipped to production on a Friday.
            </MetaAside>
          </div>
        </Expandable>
        <MetaAside className="mt-8">
          When the answer is always there, the question stops getting asked.
        </MetaAside>
      </MisconceptionWrapper>

      <SectionDivider />

      {/* Demo 3: Completion — false completion claims */}
      <MisconceptionWrapper
        hook="It's done."
        id="misconception-03"
        meta="The smallest words on the page — just, done — do the most damage in production."
        number={3}
        question={
          <>
            <span className="italic">
              &ldquo;You said make it pass. You didn&apos;t say which
              side.&rdquo;
            </span>{" "}
            <span className="text-foreground/55 not-italic">— the agent</span>
          </>
        }
        reality={
          "An agent's “done” is a sentence. Only a guardrail it can’t rewrite makes the sentence true."
        }
        tag="The Verdict"
      >
        <Completion />
      </MisconceptionWrapper>

      <SectionDivider />

      {/* Demo 4: Mirror — the agent has no stance, only a continuation */}
      <MisconceptionWrapper
        hook="It agreed with me."
        id="misconception-04"
        meta="You weren't consulting it. You were watching it agree."
        number={4}
        reality="An agent has no stance — only a continuation. The position is yours. You hold it. You enforce it. Every commit."
        tag="The Position"
      >
        <Mirror />
      </MisconceptionWrapper>
    </div>
  );
}

const VALUES: readonly {
  body: React.ReactNode;
  heading: string;
  numeral: string;
}[] = [
  {
    numeral: "I",
    heading: "Ask.",
    body: "Probe what you don't yet know. AI fills the gap before you find it. We make you find it first.",
  },
  {
    numeral: "II",
    heading: "Collide.",
    body: "You learn when your idea meets reality. AI lets you skip the meeting. We don't.",
  },
  {
    numeral: "III",
    heading: "Rediscover.",
    body: "An answer you received is borrowed. An answer you worked out is yours.",
  },
];

function Values() {
  return (
    <Container className="py-24 sm:py-32">
      <div className="mb-20 max-w-2xl">
        <Subheading>The mechanism</Subheading>
        <Heading
          as="h2"
          className="mt-3 text-balance text-4xl sm:text-5xl md:text-6xl"
        >
          Three moves.
        </Heading>
        <MetaAside className="mt-6">
          Three moves. Not a framework, not a process. The smallest set of
          things you have to do for AI collaboration to produce ownership.
        </MetaAside>
      </div>

      <ol className="space-y-16 sm:space-y-20">
        {VALUES.map((value) => (
          <li
            className="grid gap-x-12 gap-y-6 lg:grid-cols-[7rem_minmax(0,1fr)]"
            key={value.numeral}
          >
            <div>
              <span className="font-mono text-muted-foreground/60 text-sm tracking-[0.25em] lg:block lg:text-right">
                {value.numeral}
              </span>
            </div>
            <div className="max-w-2xl">
              <Heading
                as="h3"
                className="text-balance text-3xl/[1.1] sm:text-4xl/[1.1]"
              >
                {value.heading}
              </Heading>
              <p className="mt-5 text-foreground/75 text-lg leading-8">
                {value.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-20 text-balance text-center font-display text-2xl text-foreground sm:mt-24 sm:text-3xl">
        Run the three moves and you start to speak the language of building
        software — you navigate the landscape, defend your thinking, and
        translate it for anyone.
      </p>

      <p className="mt-12 text-balance text-center font-display text-foreground/75 text-xl italic sm:mt-14 sm:text-2xl">
        AI produces the artifact. You hold the meaning.
      </p>
    </Container>
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
            Every Monday, one thing built. Owned in full.
          </Heading>
          <p className="mt-6 max-w-xl text-balance text-foreground/75 text-lg leading-8">
            Code, demo, or walkthrough — one piece of work each week, made with
            AI, finished by judgment.
          </p>
          <p className="mt-3 max-w-xl text-balance text-base text-foreground/55">
            The artifact, plus the thinking that put it there.
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

export default function MarketingPage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <MisconceptionDemos />
        <PartDivider />
        <Values />
        <DigestCTA />
        <FrequentlyAskedQuestions />
      </main>
      <Footer />
    </div>
  );
}
