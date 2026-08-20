import { Separator } from "@repo/design-system/components/ui/separator";
import { HeroReadout } from "../(playground)/hero-readout";
import { Container } from "./container";
import { HeroAsterisk } from "./hero-asterisk";
import { HeroFootnoteBody } from "./hero-footnote";
import { MarketingButton } from "./marketing-button";
import { MetaAside } from "./meta-aside";
import { Navbar } from "./navbar";

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

        {/* The contents row lives outside the hero now (contents-nav.tsx),
            so it can pin to the viewport — sticky is bounded by its parent,
            and inside this container it would stick for zero pixels. */}
        <div className="md:hidden" id="hero-footnote-1">
          <Separator className="bg-foreground/10" />
          <div className="pt-8 pb-16">
            <MetaAside noMarker variant="block">
              <HeroFootnoteBody />
            </MetaAside>
          </div>
        </div>
      </Container>
    </div>
  );
}
