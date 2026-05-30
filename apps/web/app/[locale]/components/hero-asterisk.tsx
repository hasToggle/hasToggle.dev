"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/design-system/components/ui/hover-card";

// Kept as its own client component so the Radix HoverCard trigger isn't passed
// as a Server Component child into the hero's <h1>. Doing so caused a React 19 /
// Next 16 hydration mismatch that dropped the <sup> on the client.
export function HeroAsterisk() {
  return (
    <HoverCard closeDelay={100} openDelay={100}>
      <HoverCardTrigger asChild>
        <sup className="ml-1 inline-block cursor-help align-top font-mono font-normal text-ht-cyan-700/70 text-xl tracking-normal hover:text-ht-cyan-700 sm:text-2xl dark:text-ht-cyan-300/85 dark:hover:text-ht-cyan-200">
          *
        </sup>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="w-80 border-ht-cyan-700/20 dark:border-ht-cyan-500/30"
        side="bottom"
      >
        <p className="font-mono text-ht-cyan-900/80 text-sm/6 dark:text-ht-cyan-300/90">
          <span aria-hidden="true" className="select-none opacity-70">
            *&nbsp;
          </span>
          AI doesn&apos;t make you better. It makes you bigger. It&apos;s an
          amplifier, not a compass — it has no opinion on whether you&apos;re
          pointed the right way.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
