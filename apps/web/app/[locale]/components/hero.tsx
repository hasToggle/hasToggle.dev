import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/design-system/components/ui/hover-card";
import { Separator } from "@repo/design-system/components/ui/separator";
import { Container } from "./container";
import { MarketingButton } from "./marketing-button";
import { MetaAside } from "./meta-aside";
import { Navbar } from "./navbar";

const CHAPTERS: readonly { href: string; label: string; n: string }[] = [
  { n: "01", label: "Understanding", href: "#misconception-01" },
  { n: "02", label: "Defaults", href: "#misconception-02" },
  { n: "03", label: "Feel", href: "#misconception-03" },
  { n: "04", label: "Complexity", href: "#misconception-04" },
];

export function Hero() {
  return (
    <div className="relative">
      <Container className="relative">
        <Navbar variant="light" />
        <div className="pt-20 pb-20 sm:pt-28 sm:pb-24 md:pt-36 md:pb-28">
          <h1 className="max-w-4xl font-display font-medium text-6xl/[0.95] text-foreground tracking-tight sm:text-7xl/[0.95] md:text-8xl/[0.95]">
            AI makes you more.
            <HoverCard closeDelay={100} openDelay={100}>
              <HoverCardTrigger asChild>
                <sup className="ml-1 inline-block cursor-help align-top font-mono font-normal text-ht-cyan-700/70 text-xl tracking-normal hover:text-ht-cyan-700 sm:text-2xl dark:text-ht-cyan-300/85 dark:hover:text-ht-cyan-200">
                  1
                </sup>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-80 border-ht-cyan-700/20 dark:border-ht-cyan-500/30"
                side="bottom"
              >
                <p className="font-mono text-ht-cyan-900/80 text-sm/6 dark:text-ht-cyan-300/90">
                  <span aria-hidden="true" className="select-none opacity-70">
                    1&nbsp;
                  </span>
                  More of what you already are. Which is the good news and the
                  warning.
                </p>
              </HoverCardContent>
            </HoverCard>
          </h1>
          <p className="mt-8 max-w-xl font-medium text-muted-foreground text-xl/8 sm:text-2xl/9">
            For developers who want to think sharper, not just ship faster.
          </p>
          <div className="mt-12 flex flex-col items-start gap-x-8 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center">
            <MarketingButton href="#digest">
              Get the weekly misconception buster
            </MarketingButton>
            <MetaAside className="sm:max-w-xs">
              This is the email capture. You knew it was coming.
            </MetaAside>
          </div>
        </div>

        <Separator className="bg-foreground/10" />

        <section aria-labelledby="contents-heading" className="py-10 md:py-12">
          <h2
            className="mb-6 font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]"
            id="contents-heading"
          >
            Contents
          </h2>
          <ol className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-4">
            {CHAPTERS.map((chapter) => (
              <li key={chapter.n}>
                <a
                  className="group flex items-baseline gap-3 text-foreground/70 transition-colors hover:text-foreground"
                  href={chapter.href}
                >
                  <span className="font-mono text-muted-foreground text-sm tabular-nums transition-colors group-hover:text-ht-cyan-700 dark:group-hover:text-ht-cyan-300">
                    {chapter.n}
                  </span>
                  <span className="font-display text-base tracking-tight">
                    {chapter.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <Separator className="bg-foreground/10" />

        <div className="pt-8 pb-16 md:hidden" id="hero-footnote-1">
          <MetaAside noMarker variant="block">
            <span aria-hidden="true" className="select-none opacity-70">
              1&nbsp;
            </span>
            More of what you already are. Which is the good news and the
            warning.
          </MetaAside>
        </div>
      </Container>
    </div>
  );
}
