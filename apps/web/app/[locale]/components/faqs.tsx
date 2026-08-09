import { Separator } from "@repo/design-system/components/ui/separator";
import { Container } from "./container";
import { MetaAside } from "./meta-aside";
import { Heading, Subheading } from "./text";

const faqs: {
  answer: string;
  meta?: string;
  question: string;
}[] = [
  {
    answer:
      "A place to find out what happens when you press things. Each exhibit pairs a demo with its source — press the button, watch the cache expire, read the code that did it. The plan is to cover everything Next.js and Vercel can do, one exhibit at a time. The official docs are good; this is the lab bench that belongs next to them.",
    question: "What exactly am I looking at?",
  },
  {
    answer:
      "The playground is free. Completely, permanently, no-asterisk free. The paid thing is coaching: small cohorts where you build production apps with me on exactly these topics, AI workflow included. The page teaches; the cohort makes it stick.",
    meta: "See? We told you what we’re selling. Most landing pages hide that part.",
    question: "Is this free?",
  },
  {
    answer:
      "Anyone from “I want to build things but don’t code yet” to “I have opinions about caching strategies”. If you’ve ever refreshed a page wondering why your update didn’t show up, or sprinkled “use client” everywhere just to be safe, you’re the audience. Beginners get footing. Seniors get a reference they can poke.",
    question: "Who is this for?",
  },
  {
    answer:
      "Do read the docs — we link them from every exhibit, on purpose. But reading about streaming and watching three skeletons resolve in delay order are different kinds of knowing. Docs tell you how it works. A playground lets you find out what happens.",
    question: "Why not just read the docs?",
  },
  {
    answer:
      "In public, with AI. The repo is on GitHub. The building happens in Conductor, with Claude Code doing the typing, and the process — prompts, checkpoints, wrong turns included — is being published alongside via Entire.io. This site is its own biggest demo.",
    meta: "The AI writes the code. The judgment about what ships stays human. That division of labor is the actual curriculum.",
    question: "How is this site built?",
  },
  {
    answer:
      "One new exhibit and its write-up: what it shows, why it matters, when to reach for it. Five minutes, no filler, and unsubscribing stays one click away.",
    question: "What lands in my inbox on Monday?",
  },
];

function FaqItem({
  question,
  answer,
  meta,
}: {
  question: string;
  answer: string;
  meta?: string;
}) {
  return (
    <div className="grid gap-x-12 gap-y-4 py-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <h3 className="font-display font-medium text-foreground text-xl leading-tight tracking-tight sm:text-2xl">
        {question}
      </h3>
      <div className="max-w-2xl">
        <p className="text-base text-foreground/75 leading-8">{answer}</p>
        {meta ? <MetaAside className="mt-3">{meta}</MetaAside> : null}
      </div>
    </div>
  );
}

export function FrequentlyAskedQuestions() {
  return (
    <section
      aria-labelledby="faq-title"
      className="relative bg-muted/40 py-24 sm:py-32"
      id="faq"
    >
      <Container>
        <div className="mb-16 max-w-2xl">
          <Subheading id="faq-title">Frequently asked questions</Subheading>
          <Heading
            as="h2"
            className="mt-3 text-balance text-4xl sm:text-5xl md:text-6xl"
          >
            Your questions answered.
          </Heading>
        </div>

        <div id="faqs">
          {faqs.map((faq, index) => (
            <div key={faq.question}>
              {index > 0 && <Separator className="bg-foreground/10" />}
              <FaqItem
                answer={faq.answer}
                meta={faq.meta}
                question={faq.question}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
