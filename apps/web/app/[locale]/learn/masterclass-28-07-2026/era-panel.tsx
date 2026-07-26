import { Expandable } from "../../components/expandable";
import { Heading, Subheading } from "../../components/text";

interface EraPanelProps {
  children: React.ReactNode;
  /** Omit with `expandLabel` when an era makes its case on the page instead. */
  deepCut?: React.ReactNode;
  expandLabel?: string;
  name: string;
  reality: string;
  years: string;
}

export function EraPanel({
  years,
  name,
  reality,
  expandLabel,
  deepCut,
  children,
}: EraPanelProps) {
  return (
    <section className="fade-in animate-in duration-300">
      <Subheading>{years}</Subheading>
      <Heading as="h2" className="mt-3 text-4xl sm:text-5xl">
        {name}
      </Heading>
      <p className="mt-5 max-w-2xl text-foreground/75 text-lg leading-8">
        {reality}
      </p>
      <div className="mt-10">{children}</div>
      {expandLabel && deepCut ? (
        <Expandable label={expandLabel}>{deepCut}</Expandable>
      ) : null}
    </section>
  );
}
