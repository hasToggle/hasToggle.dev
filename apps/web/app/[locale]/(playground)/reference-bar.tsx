import { SectionLink } from "./section-link";

interface ReferenceBarProps {
  /** The code drawer (a CodeBlock with variant="bar"). */
  children: React.ReactNode;
  docsHref: string;
  sourceHref: string;
}

/**
 * The instrument's bottom zone — a status bar, like the one every editor
 * ends in. The code drawer's disclosure sits on the left; docs and source
 * links pin to the right, absolutely positioned over the summary row so
 * clicking them never toggles the drawer. Row height matches the chrome
 * header (h-11), so the chassis opens and closes on the same beat.
 */
export function ReferenceBar({
  children,
  docsHref,
  sourceHref,
}: ReferenceBarProps) {
  return (
    <div className="relative">
      {children}
      <div className="absolute top-0 right-0 flex h-11 items-center gap-5 px-4 sm:px-5">
        <SectionLink href={docsHref} label="docs" />
        <SectionLink href={sourceHref} label="source" />
      </div>
    </div>
  );
}
