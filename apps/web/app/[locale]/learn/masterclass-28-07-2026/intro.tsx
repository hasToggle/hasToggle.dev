"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Heading, Subheading } from "../../components/text";
import { MetaAside } from "../../components/meta-aside";
import { RhythmFigure } from "./rhythm-figure";

const HOW_TO_WATCH = [
  "You'll walk four rooms, one era each. Everything is playable, and nothing breaks.",
  "The tech changes in every room. The vibe changes more — that arc is the real story.",
  "Go at your own pace. The page works with me on stage or without me.",
] as const;

export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>A field report · 2026-07-28</Subheading>
      <Heading
        as="h1"
        className="mt-4 text-balance text-5xl sm:text-6xl md:text-7xl"
      >
        The Four Eras of Developer–AI Interaction
      </Heading>

      <p className="mt-8 max-w-2xl text-balance text-foreground/75 text-xl leading-9">
        I&apos;m a principal engineer, and I burn through two of the largest
        Claude Code subscriptions there are — plans built so heavy professional
        users never run out. Read that as an instrument, not a boast: it tells
        you the altitude and speed this report was written at.
      </p>

      <p className="mt-4 max-w-2xl text-foreground/55 text-base leading-7">
        Your role is shifting — from writing code syntax to architecting
        AI-native ecosystems. We&apos;ll walk four eras of how that happened.
        Skepticism → guarded fascination → the trust pivot → architectural
        liberation. The model kept changing. The thing that makes the work
        yours didn&apos;t.
      </p>

      <RhythmFigure />

      <ul className="mt-8 max-w-2xl space-y-2">
        {HOW_TO_WATCH.map((line) => (
          <li
            className="flex gap-3 text-base text-foreground/70 leading-7"
            key={line}
          >
            <span
              aria-hidden="true"
              className="select-none font-mono text-muted-foreground/60"
            >
              ·
            </span>
            {line}
          </li>
        ))}
      </ul>

      <MetaAside className="mt-6 max-w-2xl">
        Engineers: the fine print under each demo is for you.
      </MetaAside>

      <Button className="mt-10" onClick={onBegin} size="lg" type="button">
        Begin →
      </Button>
    </section>
  );
}
