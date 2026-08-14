import { Container } from "../components/container";
import { MetaAside } from "../components/meta-aside";
import { Heading, Subheading } from "../components/text";

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
  /** Syllabus position, e.g. "01". The order is the curriculum. */
  chapter: string;
  children: React.ReactNode;
  /** Official documentation this demo is a lab bench for. */
  docs: DemoLink;
  id: string;
  intro: React.ReactNode;
  meta?: React.ReactNode;
  /** Path inside this repo, relative to repo root, for the GitHub source link. */
  sourcePath: string;
  topic: string;
}

const GITHUB_BASE = "https://github.com/hasToggle/hasToggle.dev/tree/main/";

function SectionLink({ href, label }: DemoLink) {
  return (
    <a
      className="group inline-flex items-baseline gap-2 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <span
        aria-hidden="true"
        className="text-ht-cyan-700/70 transition-colors group-hover:text-ht-cyan-700 dark:text-ht-cyan-300/70 dark:group-hover:text-ht-cyan-300"
      >
        ↗
      </span>
      {label}
    </a>
  );
}

/**
 * The rail every exhibit hangs off. Just the number: the eyebrow beside it
 * already names the topic, and the margin is quieter for holding one thing.
 */
function SectionRail({ chapter }: { chapter: string }) {
  return (
    <div className="text-right lg:block">
      <span className="font-mono text-4xl text-muted-foreground/40 tabular-nums leading-none tracking-tight lg:text-5xl">
        {chapter}
      </span>
    </div>
  );
}

/**
 * Editorial wrapper for one exhibit. It opens with a belief and answers it
 * with a running instrument — the same shape the weekly digest uses, so the
 * page and the email teach in one voice.
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
          <SectionRail chapter={chapter} />
          <div className="ht-reveal">
            <Subheading>{topic}</Subheading>
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
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
              <SectionLink href={docs.href} label={`docs: ${docs.label}`} />
              <SectionLink
                href={`${GITHUB_BASE}${encodeURI(sourcePath)}`}
                label="source on GitHub"
              />
            </div>
            {meta ? (
              <MetaAside className="mt-8 max-w-2xl">{meta}</MetaAside>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
