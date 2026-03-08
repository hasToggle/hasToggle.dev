import type { Metadata } from "next";
import { CounterDesktop } from "./(counter)/counter-desktop";
import { CounterMobile } from "./(counter)/counter-mobile";
import { MisconceptionWrapper } from "./(demos)/misconception-wrapper";
import { Container } from "./components/container";
import { FrequentlyAskedQuestions } from "./components/faqs";
import { Footer } from "./components/footer";
import { Gradient } from "./components/gradient";
import { MarketingButton } from "./components/marketing-button";
import { Navbar } from "./components/navbar";
import { Heading } from "./components/text";

export const metadata: Metadata = {
  title: "hasToggle - It's time to switch on your coding skills!",
  description:
    "Level up your coding skills by learning modern web development.",
};

function Hero() {
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 inset-ring inset-ring-black/5 bottom-0 rounded-4xl" />
      <Container className="relative">
        <Navbar variant="dark" />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className="max-w-64 font-display font-medium text-6xl/[0.9] text-ht-blue-200 tracking-tight sm:max-w-sm sm:text-8xl/[0.8] md:max-w-md md:text-9xl/[0.8] lg:max-w-full">
            Build more. Type less.
          </h1>
          <p className="mt-8 max-w-lg font-medium text-gray-50/90 text-xl/7 sm:text-2xl/8">
            Learn to build production web apps by directing AI — not memorizing
            syntax. hasToggle teaches you to orchestrate, review, and ship.
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <MarketingButton href="#digest">
              Get the weekly misconception buster
            </MarketingButton>
          </div>
        </div>
      </Container>
    </div>
  );
}

function MisconceptionDemos() {
  return (
    <div>
      {/* Demo 1: React State */}
      <MisconceptionWrapper
        hook="AI writes the code so I don't need to understand it."
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

      {/* Demo 2: Optimistic Updates — placeholder */}
      <div className="bg-gray-900">
        <MisconceptionWrapper
          hook="The user can wait."
          reality="Perceived quality comes from UX patterns like optimistic updates. AI can implement them — but you need to know to ask."
        >
          <p className="text-gray-400">Demo coming soon</p>
        </MisconceptionWrapper>
      </div>

      {/* Demo 3: Just a Button — link to existing page */}
      <MisconceptionWrapper
        hook="It's just a button, how hard can it be?"
        reality="A button is a full-stack concern: validation, optimistic UI, error handling, auth, and database access."
      >
        <p className="text-gray-500">
          <a className="underline" href="/misconceptions/just-a-button">
            Explore the full demo →
          </a>
        </p>
      </MisconceptionWrapper>
    </div>
  );
}

function About() {
  return (
    <section>
      <Container className="py-24">
        <Heading as="h2">About section coming soon</Heading>
      </Container>
    </section>
  );
}

function DigestCTA() {
  return (
    <section>
      <Container className="py-24">
        <Heading as="h2">Digest CTA coming soon</Heading>
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
        <About />
        <DigestCTA />
        <FrequentlyAskedQuestions />
      </main>
      <Footer />
    </div>
  );
}
