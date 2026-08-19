import { Separator } from "@repo/design-system/components/ui/separator";
import { HeroReadout } from "../(playground)/hero-readout";
import { Container } from "./container";
import { HeroAsterisk } from "./hero-asterisk";
import { HeroFootnoteBody } from "./hero-footnote";
import { MarketingButton } from "./marketing-button";
import { MetaAside } from "./meta-aside";
import { Navbar } from "./navbar";

const CHAPTERS: readonly { href: string; label: string; n: string }[] = [
  { href: "#demo-01", label: "The boundary", n: "01" },
  { href: "#demo-02", label: "The shell", n: "02" },
  { href: "#demo-03", label: "The stream", n: "03" },
  { href: "#demo-04", label: "The mutation", n: "04" },
  { href: "#demo-05", label: "The image", n: "05" },
];

export function Hero() {
  return (
    <div className="relative">
      <Container className="relative">
        <Navbar variant="light" />
        {/* The load sequence states the thesis one line at a time. Delays are
            small and the whole run is under a second — long enough to read as
            deliberate, short enough that nobody waits on it. */}
        <div className="pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-24">
          <p className="ht-enter mb-8 max-w-2xl font-medium text-foreground/70 text-lg/7 sm:text-xl/8">
            The unofficial live playground for Next.js and Vercel.
          </p>
          <h1
            className="ht-enter max-w-4xl font-display font-medium text-6xl/[0.95] text-foreground tracking-tight sm:text-7xl/[0.95] md:text-8xl/[0.95]"
            style={{ "--ht-delay": "80ms" } as React.CSSProperties}
          >
            Watch it run.
            <HeroAsterisk />
          </h1>
          <p
            className="ht-enter mt-8 max-w-xl font-medium text-muted-foreground text-xl/8 sm:text-2xl/9"
            style={{ "--ht-delay": "180ms" } as React.CSSProperties}
          >
            For developers who learn by poking things.
          </p>
          <div
            className="ht-enter mt-12 flex flex-col items-start gap-x-8 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center"
            style={{ "--ht-delay": "280ms" } as React.CSSProperties}
          >
            <MarketingButton href="#demo-01">Start poking</MarketingButton>
            <MetaAside className="sm:max-w-xs">
              Nothing on this page is a mockup. We checked twice.
            </MetaAside>
          </div>
          <div
            className="ht-enter mt-12 max-w-xl"
            style={{ "--ht-delay": "380ms" } as React.CSSProperties}
          >
            <HeroReadout />
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
          <ol className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {CHAPTERS.map((chapter) => (
              <li key={chapter.n}>
                <a
                  className="group flex items-baseline gap-3 text-foreground/70 transition-colors hover:text-foreground"
                  href={chapter.href}
                >
                  <span className="font-mono text-muted-foreground text-sm tabular-nums transition-colors group-hover:text-ht-cyan-700 dark:group-hover:text-ht-cyan-300">
                    {chapter.n}
                  </span>
                  {/* The rule draws itself in on hover rather than appearing:
                      the same movement the reveals use, at link scale. */}
                  <span className="font-display text-base tracking-tight underline decoration-1 decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-300 group-hover:decoration-ht-cyan-700/70 dark:group-hover:decoration-ht-cyan-300/70">
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
            <HeroFootnoteBody />
          </MetaAside>
        </div>
      </Container>
    </div>
  );
}
