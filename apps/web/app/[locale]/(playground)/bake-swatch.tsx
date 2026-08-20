import { cn } from "@repo/design-system/lib/utils";

interface BakeSwatchProps {
  className?: string;
  /** The six-hex-char bake fingerprint — a CSS color by construction. */
  id: string;
}

/**
 * The color the fingerprint spells. A bake id is six hex characters, which
 * is to say a CSS color, so the swatch renders the literal value — nothing
 * derived, nothing truncated. It is deliberately unlabeled: the hex beside
 * it remains the information, this is the at-a-glance copy of it, and
 * working out that the chip *is* the hash is left as a pleasure.
 *
 * `aria-hidden` because the channel is redundant by design — screen readers
 * and colorblind visitors lose nothing but the glance.
 */
export function BakeSwatch({ className, id }: BakeSwatchProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        // The hairline border keeps a near-white bake visible on the panel
        // background; `em` sizing scales the chip with its context, from the
        // stamp headline down to a readout line.
        "inline-block size-[0.55em] rounded-[0.12em] border border-foreground/20",
        className
      )}
      style={{ backgroundColor: `#${id}` }}
    />
  );
}
