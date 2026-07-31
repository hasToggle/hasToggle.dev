"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Heading, Subheading } from "../../components/text";
import { RhythmFigure } from "./rhythm-figure";

const HOW_TO_WATCH = [
  "No coding background required. The whole story works without it.",
  "You'll leave knowing what engineers do all day now that machines write the code — and which part of the job never changed.",
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

      <dl className="mt-8 max-w-2xl space-y-4 border-foreground/15 border-l-2 pl-4">
        <div>
          <dt className="font-mono text-foreground/90 text-sm">
            agentic{" "}
            <span className="text-muted-foreground">
              · from <em>agent</em> — one who acts.
            </span>
          </dt>
          <dd className="mt-1 text-base text-foreground/70 leading-7">
            Software that doesn&apos;t just answer. It does things: reads your
            files, writes code, runs the tests, tries again.
          </dd>
        </div>
        <div>
          <dt className="font-mono text-foreground/90 text-sm">
            agentic engineering
          </dt>
          <dd className="mt-1 text-base text-foreground/70 leading-7">
            The practice of planning and directing such agents, rather than
            typing the code yourself.
          </dd>
        </div>
      </dl>

      <p className="mt-6 max-w-2xl text-base text-foreground/55 leading-7">
        Software isn&apos;t written the way it was three years ago. In 2022, an
        AI model couldn&apos;t reliably answer a question. Today, engineers hand
        entire features to agents and move on to planning the next one. Nobody
        designed the road that led here. This is the story of how we arrived —
        told as it happened, one barely useful model at a time.
      </p>

      <RhythmFigure />

      <p className="mt-8 max-w-2xl text-balance text-foreground/75 text-xl leading-9">
        I&apos;m Eric — principal engineer, web-development coach. All of the
        code I ship today is written by LLMs I direct. What they write, I still
        answer for.
      </p>

      <p className="mt-6 max-w-2xl text-base text-foreground/75 leading-7">
        Three things before we start:
      </p>

      <ul className="mt-4 max-w-2xl space-y-2">
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

      <Button className="mt-10" onClick={onBegin} size="lg" type="button">
        Begin →
      </Button>
    </section>
  );
}
