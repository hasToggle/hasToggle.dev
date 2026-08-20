interface SectionLinkProps {
  href: string;
  label: string;
}

/** External reference in the instrument register: arrow, mono, quiet. */
export function SectionLink({ href, label }: SectionLinkProps) {
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
