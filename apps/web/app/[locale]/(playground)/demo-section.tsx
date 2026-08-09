import { Container } from "../components/container";
import { MetaAside } from "../components/meta-aside";
import { Heading, Subheading } from "../components/text";

interface DemoLink {
  href: string;
  label: string;
}

interface DemoSectionProps {
  /** Syllabus position, e.g. "01". The order is the curriculum. */
  chapter: string;
  children: React.ReactNode;
  /** Official documentation this demo is a lab bench for. */
  docs: DemoLink;
  hook: string;
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
 * Editorial wrapper for one exhibit: numbered rail on the left, prose and the
 * live panel on the right, docs and source links at the bottom. Numbers mean
 * something here — the sections build on each other like a syllabus.
 */
export function DemoSection({
  chapter,
  children,
  docs,
  hook,
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
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[7rem_minmax(0,1fr)]">
          <div>
            <span className="font-mono text-muted-foreground/60 text-sm tracking-[0.25em] lg:block lg:text-right">
              {chapter}
            </span>
          </div>
          <div>
            <Subheading>{topic}</Subheading>
            <Heading
              as="h2"
              className="mt-3 max-w-2xl text-balance text-3xl sm:text-4xl md:text-5xl"
              id={`${id}-heading`}
            >
              {hook}
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
