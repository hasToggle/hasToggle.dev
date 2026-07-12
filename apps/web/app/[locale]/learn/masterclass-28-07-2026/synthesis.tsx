import { Heading, Subheading } from "../../components/text";

export function Synthesis() {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>Where this leaves you</Subheading>
      <Heading as="h2" className="mt-3 text-4xl sm:text-5xl">
        The model changed. You didn&apos;t.
      </Heading>
      <div className="mt-8 max-w-2xl space-y-5 text-foreground/75 text-lg leading-8">
        <p>
          Skepticism, then guarded fascination, then the trust pivot, then
          architectural liberation. Four eras, four postures — and one constant
          underneath all of them.
        </p>
        <p>
          Across every era, the thing that made the work <em>yours</em> was
          never the syntax. It was the judgment: what to ask, what to trust,
          where to draw the boundary, what counts as done.
        </p>
        <div className="rounded-xl border border-foreground/10 p-5">
          <p className="text-base text-foreground/75">
            One more thing. The page you&apos;re standing in was built by the
            process it describes: a design spec I wrote, an implementation plan
            Claude wrote, and tests that read the code so nobody had to. The
            documents are real, and dated:
          </p>
          <ul className="mt-4 space-y-1 font-mono text-muted-foreground text-xs">
            <li>docs/superpowers/specs/2026-06-29-masterclass-four-eras-design.md</li>
            <li>docs/superpowers/plans/2026-06-29-masterclass-four-eras.md</li>
            <li>apps/web/…/masterclass-28-07-2026/demos/**/*.test.ts</li>
          </ul>
          <p className="mt-4 text-foreground/55 text-sm italic">
            The exhibit is its own final exhibit.
          </p>
        </div>
        <p className="font-display text-2xl text-foreground italic">
          AI produces the artifact. You hold the meaning.
        </p>
      </div>
    </section>
  );
}
