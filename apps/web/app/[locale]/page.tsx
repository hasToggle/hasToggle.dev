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
        <div className="relative mt-10 aspect-1216/768">
          <div className="lg:hidden">
            <CounterMobile />
          </div>
          <div className="hidden lg:block">
            <CounterDesktop />
          </div>
        </div>
      </MisconceptionWrapper>

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

      {/* Demo 4: Just a Button — three-panel perspective view */}
      <MisconceptionWrapper
        dark
        hook="It's just a button."
        id="misconception-04"
        meta="The word 'just' has mass-produced more missed deadlines than any project management tool in history."
        number={4}
        reality="A button is a vertical slice through your entire application. It touches the client, the server, the database, the auth layer, and the user's trust. The only simple thing about it is how it looks."
      >
        <div className="mt-8 grid gap-8 text-gray-400 md:grid-cols-3">
          <div>
            <p className="mb-2 font-semibold text-gray-200 text-sm uppercase tracking-wider">
              The PM sees
            </p>
            <p>
              A button. &ldquo;Add to cart.&rdquo; Half a day, tops. What&apos;s
              the hold-up?
            </p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-gray-200 text-sm uppercase tracking-wider">
              The developer sees
            </p>
            <p>
              Client-side validation. Loading state. Optimistic update. Error
              handling. Auth check. Server action. Database write. Cache
              revalidation. Race condition if the user double-clicks.
            </p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-gray-200 text-sm uppercase tracking-wider">
              The user sees
            </p>
            <p>
              Nothing happened. <em>Clicks again.</em> Two items in cart.{" "}
              <em>Refreshes.</em> Zero items in cart.
            </p>
          </div>
        </div>
      </MisconceptionWrapper>
    </div>
  );
}

function Values() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-2xl">
        <Subheading className="text-center">What we believe</Subheading>
        <MetaAside className="mt-2 text-center">
          Most About sections exist so the founder can talk about themselves.
          This one exists because we thought you&apos;d want to know what
          you&apos;re getting into.
        </MetaAside>

        <div className="mt-16 space-y-12">
          <div>
            <Heading as="h3" className="text-2xl sm:text-3xl">
              More, not less.
            </Heading>
            <p className="mt-4 text-lg text-muted-foreground leading-8">
              AI is the most powerful tool individual developers have ever had.
              It handles cognitive load so you can focus on what actually
              matters — architecture, product decisions, and shipping.
              You&apos;re not being replaced. You&apos;re being extended.
            </p>
          </div>

          <div>
            <Heading as="h3" className="text-2xl sm:text-3xl">
              The easy answer is the trap.
            </Heading>
            <p className="mt-4 text-lg text-muted-foreground leading-8">
              AI is about to be right often enough that checking feels like
              overhead. That&apos;s the moment the skill disappears. The
              developers who stay sharp are the ones who keep asking &ldquo;is
              this actually right?&rdquo; even when nothing is forcing them to.
            </p>
          </div>

          <div>
            <Heading as="h3" className="text-2xl sm:text-3xl">
              The surface reading is never the whole story.
            </Heading>
            <p className="mt-4 text-lg text-muted-foreground leading-8">
              A button is never just a button.* A passing test doesn&apos;t mean
              correct code. A confident answer isn&apos;t a true answer. The
              best engineers aren&apos;t the ones who know the most.
              They&apos;re the ones who assume the least.
            </p>
            <MetaAside className="mt-2">* See Demo 4. We warned you.</MetaAside>
          </div>
        </div>
      </div>
    </Container>
  );
}

function DigestCTA() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-2xl text-center" id="digest">
        <Heading as="h3">
          Every Monday, we prove you wrong about something.
        </Heading>
        <p className="mt-4 text-lg text-muted-foreground">
          One misconception about AI or web development — what it is, why
          it&apos;s wrong, and what&apos;s actually true. Short, practical, and
          designed to leave you sharper than you were before you opened it.
        </p>
        <div className="mt-8">
          <Digest />
        </div>
        <MetaAside className="mt-4">
          The fact that you&apos;re reading the fine print under an email form
          says something about you. Something good.
        </MetaAside>
      </div>
    </Container>
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
