import { SHIPPED } from "../lab/syllabus";
import { Container } from "./container";

/**
 * The landing page renders exactly these five exhibits inline (the demo
 * imports in page.tsx are the source of truth); chapters that shipped
 * later live in the lab only. With site navigation in the top nav, this bar is
 * pure in-page anchors — the shop window's own contents.
 */
const LANDING_SLUGS: ReadonlySet<string> = new Set([
  "boundary",
  "caching",
  "og-images",
  "server-actions",
  "streaming",
]);

const CHAPTERS: readonly { href: string; label: string; slug: string }[] =
  SHIPPED.filter((chapter) => LANDING_SLUGS.has(chapter.slug)).map(
    (chapter) => ({
      href: `#demo-${chapter.slug}`,
      label: chapter.navLabel,
      slug: chapter.slug,
    })
  );

/**
 * The contents row, slim enough to pin. It sits where the hero's contents
 * grid used to and sticks to the viewport top while the visitor is among
 * the exhibits — its parent in page.tsx ends after the last exhibit, so sticky
 * positioning releases it there and the roadmap onward scrolls nav-free.
 * Zero JavaScript: it is simply there, then pinned, then gone.
 *
 * One horizontal row at every viewport; on phones it scrolls sideways
 * instead of wrapping, so the pinned cost stays one line tall. Exhibit
 * sections carry `scroll-mt-16`, which clears the bar on anchor jumps.
 */
export function ContentsNav() {
  return (
    <nav
      aria-label="Contents"
      className="sticky top-0 z-40 border-foreground/10 border-y bg-background/90 backdrop-blur-sm"
    >
      <Container>
        {/* The same rail grid the exhibits sit in: the label drifts into the
            gutter the exhibit rail leaves empty, right-aligned toward the
            content, and the first link takes the content
            column's left edge — links are the row; the label is margin
            furniture. The nav keeps its accessible name on mobile, where the
            rail collapses and the label with it. */}
        <div className="lg:grid lg:grid-cols-[7rem_minmax(0,1fr)] lg:items-baseline lg:gap-x-12">
          <div className="hidden py-3.5 text-right lg:block">
            <span className="font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
              contents
            </span>
          </div>
          <div className="flex max-w-3xl items-baseline gap-x-7 overflow-x-auto whitespace-nowrap py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Desktop distributes the links across the full row — the same
              rhythm the hero's five-column grid had — instead of leaving a
              left-aligned stub with dead space to its right. The mobile
              scroll-row keeps plain gaps: justify-between is a no-op once
              the content overflows. */}
            <ol className="flex flex-1 items-baseline gap-x-7 md:justify-between">
              {CHAPTERS.map((chapter) => (
                <li className="shrink-0" key={chapter.slug}>
                  <a
                    className="group flex items-baseline gap-2 text-foreground/70 transition-colors hover:text-foreground"
                    href={chapter.href}
                  >
                    {/* The rule draws itself in on hover — the same movement
                      the reveals use, at link scale. */}
                    <span className="font-display text-sm tracking-tight underline decoration-1 decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-300 group-hover:decoration-ht-cyan-700/70 dark:group-hover:decoration-ht-cyan-300/70">
                      {chapter.label}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </nav>
  );
}
