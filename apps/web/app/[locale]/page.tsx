import { Separator } from "@repo/design-system/components/ui/separator";
import type { Metadata } from "next";
import { CounterDesktop } from "./(counter)/counter-desktop";
import { CounterMobile } from "./(counter)/counter-mobile";
import { MisconceptionWrapper } from "./(demos)/misconception-wrapper";
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

export const metadata: Metadata = {
  title: "hasToggle — AI makes you more.",
  description:
    "For developers who want to think sharper, not just ship faster. Weekly misconception busters about AI and web development.",
};

function MisconceptionDemos() {
  return (
    <div>
      {/* Demo 1: React State */}
      <MisconceptionWrapper
        hook="AI writes the code so I don't need to understand it."
        id="misconception-01"
        meta="86% of developers have shipped code they couldn't explain. We made that number up. But you believed it for a second."
        number={1}
        reality="AI helps you type code, but you still need to understand how things work. Watch how React re-runs your function to get updated values."
      >
        <div className="relative aspect-1216/768">
          <div className="lg:hidden">
            <CounterMobile />
          </div>
          <div className="hidden lg:block">
            <CounterDesktop />
          </div>
        </div>
      </MisconceptionWrapper>

      <SectionDivider />

      {/* Demo 2: Destructive Defaults — essay */}
      <MisconceptionWrapper
        dark
        hook="I told AI exactly what I wanted."
        id="misconception-02"
        meta="And the question you didn't ask is the one that shipped to production."
        number={2}
        reality="AI builds what you ask for. Not what you need. The gap between those is your job."
        status="essay"
      >
        <Expandable
          dark
          label={
            'Did you know? "The safest brake is the one that\'s always on."'
          }
        >
          <div className="space-y-4 text-gray-400">
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
            <MetaAside className="mt-4" dark noMarker>
              * A trait that, in software, is distressingly rare and
              disproportionately valuable.
            </MetaAside>
            <MetaAside dark noMarker>
              ** The other one shipped to production on a Friday.
            </MetaAside>
          </div>
        </Expandable>
        <MetaAside className="mt-8" dark>
          When the answer is always there, the question stops getting asked.
        </MetaAside>
      </MisconceptionWrapper>

      <SectionDivider />

      {/* Demo 3: Optimistic Updates — sketch */}
      <MisconceptionWrapper
        hook="Drag it, drop it, done."
        id="misconception-03"
        meta="The dev's mental model in five syllables. Confident. Wrong."
        number={3}
        reality="Correct and good are not the same thing. Optimistic updates exist because users trust what they see, not what the server says later."
        status="sketch"
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-gray-400/40 border-dashed px-8 py-14 text-center"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent 0 11px, rgba(100,100,100,0.045) 11px 12px)",
          }}
        >
          <MetaAside className="inline-block">
            the demo isn&apos;t built yet. the misconception still is.
          </MetaAside>
        </div>
      </MisconceptionWrapper>

      <SectionDivider />

      {/* Demo 4: Just a Button — three-panel perspective view */}
      <MisconceptionWrapper
        hook="It's just a button."
        id="misconception-04"
        meta="The word 'just' has mass-produced more missed deadlines than any project management tool in history."
        number={4}
        reality="A button is a vertical slice through your entire application. It touches the client, the server, the database, the auth layer, and the user's trust. The only simple thing about it is how it looks."
      >
        <div className="grid gap-8 text-muted-foreground md:grid-cols-3">
          <div>
            <p className="mb-2 font-medium font-mono text-[0.7rem] text-foreground uppercase tracking-[0.2em]">
              The PM sees
            </p>
            <p className="leading-7">
              A button. &ldquo;Add to cart.&rdquo; Half a day, tops. What&apos;s
              the hold-up?
            </p>
          </div>
          <div>
            <p className="mb-2 font-medium font-mono text-[0.7rem] text-foreground uppercase tracking-[0.2em]">
              The developer sees
            </p>
            <p className="leading-7">
              Client-side validation. Loading state. Optimistic update. Error
              handling. Auth check. Server action. Database write. Cache
              revalidation. Race condition if the user double-clicks.
            </p>
          </div>
          <div>
            <p className="mb-2 font-medium font-mono text-[0.7rem] text-foreground uppercase tracking-[0.2em]">
              The user sees
            </p>
            <p className="leading-7">
              Nothing happened. <em>Clicks again.</em> Two items in cart.{" "}
              <em>Refreshes.</em> Zero items in cart.
            </p>
          </div>
        </div>
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
    heading: "More, not less.",
    body: "AI is the most powerful tool individual developers have ever had. It handles cognitive load so you can focus on what actually matters — architecture, product decisions, and shipping. You're not being replaced. You're being extended.",
  },
  {
    numeral: "II",
    heading: "The easy answer is the trap.",
    body: "AI is about to be right often enough that checking feels like overhead. That's the moment the skill disappears. The developers who stay sharp are the ones who keep asking \u201Cis this actually right?\u201D even when nothing is forcing them to.",
  },
  {
    numeral: "III",
    heading: "The surface reading is never the whole story.",
    body: (
      <>
        A button is never just a button.* A passing test doesn&apos;t mean
        correct code. A confident answer isn&apos;t a true answer. The best
        engineers aren&apos;t the ones who know the most. They&apos;re the ones
        who assume the least.
      </>
    ),
  },
];

function Values() {
  return (
    <Container className="py-24 sm:py-32">
      <div className="mb-16 max-w-2xl">
        <Subheading>What we believe</Subheading>
        <MetaAside className="mt-3">
          Most About sections exist so the founder can talk about themselves.
          This one exists because we thought you&apos;d want to know what
          you&apos;re getting into.
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
              {value.numeral === "III" && (
                <MetaAside className="mt-3" noMarker>
                  * See Demo 4. We warned you.
                </MetaAside>
              )}
            </div>
          </li>
        ))}
      </ol>
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
            The weekly digest
          </Subheading>
          <Heading
            as="h3"
            className="mt-3 text-balance text-4xl sm:text-5xl"
            id="digest-heading"
          >
            Every Monday, we prove you wrong about something.
          </Heading>
          <p className="mt-6 max-w-xl text-balance text-foreground/75 text-lg leading-8">
            One misconception about AI or web development — what it is, why
            it&apos;s wrong, and what&apos;s actually true. Short, practical,
            and designed to leave you sharper than you were before you opened
            it.
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
        <Values />
        <DigestCTA />
        <FrequentlyAskedQuestions />
      </main>
      <Footer />
    </div>
  );
}
