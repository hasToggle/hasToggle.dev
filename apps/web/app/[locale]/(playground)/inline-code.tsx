/**
 * Inline code for the exhibit prose. The explicit `font-mono` class matters:
 * the marketing tree swaps `.font-mono` to JetBrains Mono, and a bare <code>
 * tag would fall back to a different mono and read like a typo.
 *
 * When a space follows this element, write it as `&#32;` — the build drops a
 * literal space directly after an inline element (verified in the prerendered
 * HTML), and Biome rewrites `{" "}` back into exactly that doomed form.
 */
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="whitespace-nowrap rounded-md border border-foreground/10 bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  );
}
