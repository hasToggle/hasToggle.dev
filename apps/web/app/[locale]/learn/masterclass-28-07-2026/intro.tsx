"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { MetaAside } from "../../components/meta-aside";
import { Heading, Subheading } from "../../components/text";
import { RhythmFigure } from "./rhythm-figure";

const HOW_TO_WATCH = [
  "Three rooms of history, one workshop, one horizon — walk them in order.",
  "Everything is playable, and nothing breaks.",
  "The tech changes in every room. The vibe changes more — that arc is the real story.",
] as const;

export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>Masterclass on agentic engineering · 2026-07-28</Subheading>
      <Heading
        as="h1"
        className="mt-4 text-balance text-5xl sm:text-6xl md:text-7xl"
      >
        Agentic Engineering
      </Heading>

      <p className="mt-8 max-w-2xl text-balance text-foreground/75 text-xl leading-9">
        I&apos;m a principal engineer, and I burn through two of the largest
        Claude Code subscriptions there are — plans built so heavy professional
        users never run out. Read that as an instrument, not a boast: it tells
        you the altitude and speed this report was written at.
      </p>

      <p className="mt-4 max-w-2xl text-base text-foreground/55 leading-7">
        Agentic engineering is something we arrived at — it wasn&apos;t possible
        four years ago, and nobody was asking for it. This masterclass recounts
        how we got here: lived experience, against the history of how the models
        grew up and how engineers&apos; minds had to move. Every step was shaped
        by what the model could barely do — and by how people learned to use it.
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
