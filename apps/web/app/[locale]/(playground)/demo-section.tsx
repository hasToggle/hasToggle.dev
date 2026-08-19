import { Container } from "../components/container";
import { MetaAside } from "../components/meta-aside";
import { Heading, Subheading } from "../components/text";
import { SectionLink } from "./section-link";

interface DemoLink {
  href: string;
  label: string;
}

interface DemoSectionProps {
  /**
   * The sentence a developer has actually said about this feature, set as the
   * exhibit's heading. Everything below it is the answer.
   */
  belief: string;
  /** Build-order position, e.g. "02" — carried in the eyebrow, not a numeral. */
  chapter: string;
  children: React.ReactNode;
  /**
   * Legacy reference links, rendered below the panel. Migrated exhibits omit
   * both and carry their references inside the instrument's reference bar.
   */
  docs?: DemoLink;
  id: string;
  intro: React.ReactNode;
  meta?: React.ReactNode;
  /** Path inside this repo, relative to repo root, for the GitHub source link. */
  sourcePath?: string;
  topic: string;
}

const GITHUB_BASE = "https://github.com/hasToggle/hasToggle.dev/tree/main/";

/**
 * Editorial wrapper for one exhibit. It opens with a belief and answers it
 * with a running instrument — the same shape the weekly digest uses, so the
 * page and the email teach in one voice.
 *
 * The build order rides in the eyebrow (`02 · caching & revalidation`), the
 * way engineers read identifiers — the watermark chapter numeral read as
 * course furniture and is retired. The empty rail column keeps the page on
 * one left edge. The aside is set as a code comment, because that is what
 * it is: a note an engineer left in this codebase.
 */
export function DemoSection({
  belief,
  chapter,
  children,
  docs,
  id,
  intro,
  meta,
  sourcePath,
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
            <Subheading>
              <span className="text-muted-foreground/60 tabular-nums">
                {chapter}
              </span>
              <span
                aria-hidden="true"
                className="px-2 text-muted-foreground/40"
              >
                ·
              </span>
              {topic}
            </Subheading>
            <Heading
              as="h2"
              className="mt-3 max-w-2xl text-balance text-3xl/[1.1] sm:text-4xl/[1.1] md:text-5xl/[1.05]"
              id={`${id}-heading`}
            >
              {belief}
            </Heading>
            <div className="mt-6 max-w-2xl space-y-4 text-foreground/75 text-lg leading-8">
              {intro}
            </div>
            <div className="mt-10 max-w-3xl">{children}</div>
            {docs && sourcePath ? (
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
                <SectionLink href={docs.href} label={`docs: ${docs.label}`} />
                <SectionLink
                  href={`${GITHUB_BASE}${encodeURI(sourcePath)}`}
                  label="source on GitHub"
                />
              </div>
            ) : null}
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
