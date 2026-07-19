"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { MetaAside } from "../../components/meta-aside";
import { Heading, Subheading } from "../../components/text";
import { RhythmFigure } from "./rhythm-figure";

const HOW_TO_WATCH = [
  "Everything on this page is a working model, not a screenshot. Click, drag, replay — you can't break anything.",
  "It's built to follow the talk, and to stand alone. Open it again in a month; nothing will have gone dark.",
  "We start in 2019, with a machine that could only continue your sentence. We end with the machines that wrote software with me this morning.",
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
        I&apos;m a principal engineer. Most of the code I ship now is written
        by machines I direct — enough that I pay twice for a subscription built
        for people who are never supposed to run out, and still spend some
        afternoons waiting for the meter. Everything on this page comes from
        that daily work. Nothing here is secondhand.
      </p>

      <p className="mt-4 max-w-2xl text-base text-foreground/55 leading-7">
        Agentic engineering is something we arrived at. It wasn&apos;t possible
        four years ago, and nobody was asking for it. What follows is how we
        got here — lived experience, set against the history of how the models
        grew up and how engineers&apos; minds had to move. Every step was
        shaped by what the model could barely do, and by how people learned to
        use it.
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
