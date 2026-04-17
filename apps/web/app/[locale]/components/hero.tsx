import { Container } from "./container";
import { Gradient } from "./gradient";
import { MarketingButton } from "./marketing-button";
import { MetaAside } from "./meta-aside";
import { Navbar } from "./navbar";

const CHAPTERS: readonly { href: string; label: string; n: string }[] = [
  { n: "01", label: "understanding", href: "#misconception-01" },
  { n: "02", label: "defaults", href: "#misconception-02" },
  { n: "03", label: "feel", href: "#misconception-03" },
  { n: "04", label: "complexity", href: "#misconception-04" },
];

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden rounded-b-4xl">
        <Gradient className="absolute inset-0" />
      </div>
      <Container className="relative">
        <Navbar variant="dark" />
        <div className="pt-16 pb-16 sm:pt-24 sm:pb-20 md:pt-32 md:pb-24">
          <h1 className="max-w-64 font-display font-medium text-6xl/[0.9] text-ht-blue-200 tracking-tight sm:max-w-sm sm:text-8xl/[0.8] md:max-w-md md:text-9xl/[0.8] lg:max-w-full">
            AI makes you more.
            <a
              aria-label="See footnote"
              className="ml-1 inline-block align-top font-mono font-normal text-ht-cyan-300/80 text-xl tracking-normal no-underline hover:text-ht-cyan-200 sm:text-2xl md:text-3xl"
              href="#hero-footnote-1"
            >
              <sup>1</sup>
            </a>
          </h1>
          <p className="mt-8 max-w-lg font-medium text-gray-50/90 text-xl/7 sm:text-2xl/8">
            For developers who want to think sharper, not just ship faster.
          </p>
          <div className="mt-12 flex flex-col items-start gap-x-8 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center">
            <MarketingButton href="#digest">
              Get the weekly misconception buster
            </MarketingButton>
            <MetaAside className="sm:max-w-xs" dark>
              This is the email capture. You knew it was coming.
            </MetaAside>
          </div>
        </div>

        <nav
          aria-label="Misconceptions"
          className="mb-12 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4"
        >
          {CHAPTERS.map((chapter) => (
            <a
              className="group flex items-baseline gap-2 border-ht-blue-200/20 border-t pt-3 font-mono text-ht-blue-200/60 text-sm tracking-wide transition-colors hover:border-ht-blue-200/60 hover:text-ht-blue-100"
              href={chapter.href}
              key={chapter.n}
            >
              <span className="tabular-nums">{chapter.n}</span>
              <span className="truncate">{chapter.label}</span>
            </a>
          ))}
        </nav>

        <div className="pb-10" id="hero-footnote-1">
          <MetaAside dark noMarker variant="block">
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
