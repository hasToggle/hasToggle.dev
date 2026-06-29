import { Expandable } from "../../components/expandable";
import { Heading, Subheading } from "../../components/text";

interface EraPanelProps {
  era: string;
  years: string;
  name: string;
  reality: string;
  vibe: string;
  expandLabel: string;
  deepCut: React.ReactNode;
  children: React.ReactNode;
}

export function EraPanel({
  era,
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
      <Subheading>
        {era} · {years}
      </Subheading>
      <Heading as="h2" className="mt-3 text-4xl sm:text-5xl">
        {name}
      </Heading>
      <p className="mt-5 max-w-2xl text-foreground/75 text-lg leading-8">
        {reality}
      </p>
      <p className="mt-3 font-display text-ht-cyan-700 text-xl italic dark:text-ht-cyan-300">
        Vibe: {vibe}
      </p>
      <div className="mt-10">{children}</div>
      <Expandable label={expandLabel}>{deepCut}</Expandable>
    </section>
  );
}
