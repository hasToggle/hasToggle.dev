"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { MetaAside } from "../../components/meta-aside";
import { Heading, Subheading } from "../../components/text";
import { RhythmFigure } from "./rhythm-figure";

const HOW_TO_WATCH = [
  "Every claim is demonstrated, every demo is playable, every statistic has a source. Click anything — nothing breaks.",
  "No coding background required. This is built so that someone who has never wondered how software gets made can follow the whole story.",
  "It begins in 2019 with a machine that could only continue your sentence, turns in 2024, and ends with an honest look at what this means for the people who build software.",
] as const;

export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>A masterclass · 2026-07-28</Subheading>
      <Heading
        as="h1"
        className="mt-4 text-balance text-5xl sm:text-6xl md:text-7xl"
      >
        Agentic Engineering
      </Heading>

      <p className="mt-8 max-w-2xl text-balance text-foreground/75 text-xl leading-9">
        I&apos;m Eric — principal engineer, web-development coach. All of the
        code I ship today is written by LLMs I direct. What they write, I still
        answer for.
      </p>

      <p className="mt-4 max-w-2xl text-base text-foreground/55 leading-7">
        Software isn&apos;t written the way it was three years ago. In 2022, an
        AI model couldn&apos;t reliably answer a question. Today, engineers
        hand entire features to agents that write, test, and check the code on
        their own — while the engineer plans the next thing. The practice has a
        name: agentic engineering. Nobody designed the road that led here. This
        is the story of how we arrived — told as it happened, and checked
        against real data.
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
        Engineers: the folds marked ▸ are for you.
      </MetaAside>

      <Button className="mt-10" onClick={onBegin} size="lg" type="button">
        Begin →
      </Button>
    </section>
  );
}
