import { Expandable } from "../../components/expandable";
import { Heading, Subheading } from "../../components/text";

interface EraPanelProps {
  children: React.ReactNode;
  deepCut: React.ReactNode;
  expandLabel: string;
  name: string;
  reality: string;
  vibe?: string;
  years: string;
}

export function EraPanel({
  years,
  name,
  reality,
  vibe,
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
      {vibe && (
        <p className="mt-3 font-display text-ht-cyan-700 text-xl italic dark:text-ht-cyan-300">
          How it felt: {vibe}
        </p>
      )}
      <div className="mt-10">{children}</div>
      <Expandable label={expandLabel}>{deepCut}</Expandable>
    </section>
  );
}
