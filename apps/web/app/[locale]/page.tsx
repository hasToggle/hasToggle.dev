import type { Metadata } from "next";
import { CounterDesktop } from "./(counter)/counter-desktop";
import { CounterMobile } from "./(counter)/counter-mobile";
import { BentoCardWithState } from "./(curriculum-preview)/bento-card-with-state";
import LocalUnicorn from "./(storage)/local-unicorn";
import { AnimatedEmojiTextBackground } from "./components/animated-text-background";
import { BentoCard } from "./components/bento-card";
import { BentoSection } from "./components/bento-section";
import { ColorfulLogs } from "./components/colorful-logs";
import { Confetti } from "./components/confetti";
import { Container } from "./components/container";
import { FrequentlyAskedQuestions } from "./components/faqs";
import { Footer } from "./components/footer";
import { Gradient } from "./components/gradient";
import { Testimonial } from "./components/hazel-testimonial";
import {
  InsiderJokeDesktop,
  InsiderJokeMobile,
} from "./components/insider-joke";
import { LinkedAvatars } from "./components/linked-avatars";
import { LogoTimeline } from "./components/logo-timeline";
import { MarketingButton } from "./components/marketing-button";
import { Navbar } from "./components/navbar";
import { Testimonials } from "./components/testimonials";
import { Heading, Subheading } from "./components/text";

export const metadata: Metadata = {
  title: "hasToggle - It's time to switch on your coding skills!",
  description:
    "Level up your coding skills by learning modern web development.",
};

function Hero() {
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 inset-ring inset-ring-black/5 bottom-0 rounded-4xl" />
      <ColorfulLogs />
      <Container className="relative">
        <Navbar variant="dark" />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className="max-w-64 font-display font-medium text-6xl/[0.9] text-ht-blue-200 tracking-tight sm:max-w-sm sm:text-8xl/[0.8] md:max-w-md md:text-9xl/[0.8] lg:max-w-full">
            <span className="inline-flex flex-wrap items-baseline gap-x-2">
              <span className="mr-3 whitespace-nowrap">It&apos;s time</span>
              <span className="flex items-baseline whitespace-nowrap">
                to <AnimatedEmojiTextBackground />
              </span>
            </span>
          </h1>
          <p className="mt-8 max-w-lg font-medium text-gray-50/90 text-xl/7 sm:text-2xl/8">
            Become a junior web developer and build your skills, from the first
            line of code to crafting pro-level web apps with Next.js.
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <MarketingButton href="#digest">
              Get coding tips every Monday
            </MarketingButton>
          </div>
        </div>
      </Container>
    </div>
  );
}

function FeatureSection() {
  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Heading as="h2" className="max-w-3xl">
          For beginners, squirrels, and everything in between 🐿️
        </Heading>
        <div
          className="relative mt-10 aspect-[1216/768] [--radius:0.75rem] sm:mt-16"
          style={{ "--width": 1216, "--height": 768 } as React.CSSProperties}
        >
          <div className="-inset-[var(--padding)] absolute rounded-[calc(var(--radius)+var(--padding))] shadow-sm ring-1 ring-black/5 [--padding:0.5rem]" />
          <div className="lg:hidden">
            <CounterMobile />
          </div>
          <div className="hidden lg:block">
            <CounterDesktop />
          </div>
        </div>
      </Container>
    </div>
  );
}

function DarkBentoSection() {
  return (
    <div className="mx-2 mt-2 rounded-4xl bg-gray-900 py-32">
      <Container>
        <Subheading dark>Curriculum</Subheading>
        <Heading as="h3" className="mt-2 max-w-3xl" dark>
          A curriculum that fuels curiosity and builds skills.
        </Heading>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <BentoCard
            className="max-lg:rounded-t-4xl lg:col-span-4 lg:rounded-tl-4xl"
            dark
            description="Horses, unicorns, or just a simple list of numbers - learn about SQL and NoSQL databases and store anything you want."
            eyebrow="Storage"
            graphic={<LocalUnicorn />}
            title="Learn to read and write data"
          />
          <BentoCard
            className="!overflow-visible z-10 lg:col-span-2 lg:rounded-tr-4xl"
            dark
            description="Follow a clear path to master the tools and skills for your web development journey."
            eyebrow="Developer Journey"
            graphic={<LogoTimeline />}
            title="Explore web technologies"
          />
          <BentoCard
            className="lg:col-span-2 lg:rounded-bl-4xl"
            dark
            description="Discover the power of TailwindCSS to craft stunning, responsive designs effortlessly."
            eyebrow="Styling Reinvented"
            graphic={<LinkedAvatars />}
            title="Master TailwindCSS"
          />
          <BentoCardWithState
            className="max-lg:rounded-b-4xl lg:col-span-4 lg:rounded-br-4xl"
            dark
            description="At the heart of modern web development is JavaScript. It powers everything from the most basic web pages to the most complex web applications."
            eyebrow="Language"
            title="JavaScript"
          />
        </div>
      </Container>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <div className="bg-gradient-to-b from-50% from-white to-gray-100 py-32">
          <FeatureSection />
          <BentoSection />
        </div>
        <DarkBentoSection />
        <Testimonial />
        <div className="mx-2 mt-2 rounded-4xl bg-gray-900 py-32">
          <Container>
            <Subheading dark>Be part of the conversation</Subheading>
            <Heading as="h3" className="mt-2 max-w-3xl" dark>
              Get insider jokes.
            </Heading>
            <p className="mt-4 text-gray-400 text-lg">
              Ever tried explaining web development at a party? It's like
              describing a circus where HTML is the ringmaster, CSS is the
              makeup artist, and JavaScript is that one clown who won't stop
              poking everything.
            </p>
            <div className="lg:hidden">
              <InsiderJokeMobile />
            </div>
            <div className="hidden lg:block">
              <InsiderJokeDesktop />
            </div>
          </Container>
        </div>
      </main>
      <Testimonials />
      <FrequentlyAskedQuestions />
      <Footer />
      <Confetti />
    </div>
  );
}
