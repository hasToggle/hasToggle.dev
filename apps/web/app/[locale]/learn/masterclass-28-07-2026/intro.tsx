"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Heading, Subheading } from "../../components/text";

export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>A masterclass · 2026-07-28</Subheading>
      <Heading
        as="h1"
        className="mt-4 text-balance text-5xl sm:text-6xl md:text-7xl"
      >
        The Four Eras of Developer–AI Interaction
      </Heading>
      <p className="mt-8 max-w-2xl text-balance text-foreground/75 text-xl leading-9">
        Your role is shifting — from writing code syntax to architecting
        AI-native ecosystems. We&apos;ll walk four eras of how we work with
        these models. Watch the tech change. Watch the{" "}
        <em>vibe</em> change more.
      </p>
      <p className="mt-4 max-w-2xl text-foreground/55 text-base leading-7">
        Skepticism → guarded fascination → the trust pivot → architectural
        liberation. The model kept changing. The thing that makes the work
        yours didn&apos;t.
      </p>
      <Button className="mt-10" onClick={onBegin} size="lg" type="button">
        Begin →
      </Button>
    </section>
  );
}
