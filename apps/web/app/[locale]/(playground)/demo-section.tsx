import { Container } from "../components/container";
import { MetaAside } from "../components/meta-aside";
import { Heading, Subheading } from "../components/text";

interface DemoSectionProps {
  /**
   * The sentence a developer has actually said about this feature, set as the
   * exhibit's heading. Everything below it is the answer.
   */
  belief: string;
  children: React.ReactNode;
  /**
   * "h1" on a chapter page, where the belief is the page's title; the landing
   * page keeps the default "h2". The eyebrow drops to a non-heading element
   * under an h1 so nothing outranks the title.
   */
  headingAs?: "h1" | "h2";
  id: string;
  intro: React.ReactNode;
  meta?: React.ReactNode;
  /** The chapter's short name, e.g. "The boundary" — the eyebrow's first half. */
  navLabel: string;
  topic: string;
}

/**
 * Editorial wrapper for one exhibit. It opens with a belief and answers it
 * with a running instrument — the same shape the weekly digest uses, so the
 * page and the email teach in one voice.
 *
 * The eyebrow names the chapter and its topic (`the cache · caching &
 * revalidation`) — two identifiers, no numeral. Build order is an artifact
 * of which week the work happened and is shown nowhere. The empty rail
 * column keeps the page on one left edge. The aside is set as a code
 * comment, because that is what it is: a note an engineer left in this
 * codebase.
 */
export function DemoSection({
  belief,
  children,
  headingAs = "h2",
  id,
  intro,
  meta,
  navLabel,
  topic,
}: DemoSectionProps) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-16 py-20 sm:py-24"
      id={id}
    >
      <Container>
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[7rem_minmax(0,1fr)]">
          <div aria-hidden="true" />
          <div className="ht-reveal">
            <Subheading as={headingAs === "h1" ? "div" : "h2"}>
              <span className="text-muted-foreground/60">{navLabel}</span>
              <span
                aria-hidden="true"
                className="px-2 text-muted-foreground/40"
              >
                ·
              </span>
              {topic}
            </Subheading>
            <Heading
              as={headingAs}
              className="mt-3 max-w-2xl text-balance text-3xl/[1.1] sm:text-4xl/[1.1] md:text-5xl/[1.05]"
              id={`${id}-heading`}
            >
              {belief}
            </Heading>
            <div className="mt-6 max-w-2xl space-y-4 text-foreground/75 text-lg leading-8">
              {intro}
            </div>
            <div className="mt-10 max-w-3xl">{children}</div>
            {meta ? (
              <MetaAside className="mt-8 max-w-2xl" variant="comment">
                {meta}
              </MetaAside>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
