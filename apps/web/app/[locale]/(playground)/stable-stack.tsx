import { cn } from "@repo/design-system/lib/utils";
import type { ReactNode } from "react";

type Variant = string | { key: string; node: ReactNode };

interface StableStackProps extends React.ComponentPropsWithoutRef<"div"> {
  /** The variant on show; every other one is a ghost. */
  active?: string;
  as?: "div" | "p" | "span";
  /**
   * Shown instead of any variant, with every variant a ghost — for text
   * whose live form differs from its reserved one (a real clock against
   * a placeholder), where only the size has to match.
   */
  value?: ReactNode;
  /** Everything the cell could show. A string is its own key and node. */
  variants: readonly Variant[];
}

/**
 * Renders what a cell shows stacked on top of everything it could show, so
 * the cell is always as tall and as wide as its worst case and nothing
 * below it moves when the content changes. Reserving by hand means a
 * magic number per breakpoint that a copy edit silently invalidates; this
 * reserves the real thing, at whatever width the reader happens to be.
 *
 * The ghosts are `visibility: hidden`, so they take space but leave the
 * tab order, the selection, and — with `aria-hidden` — the announcement
 * alone.
 */
export function StableStack({
  active,
  as: Element = "span",
  className,
  value,
  variants,
  ...props
}: StableStackProps) {
  const showsValue = value !== undefined;
  return (
    <Element {...props} className={cn("grid", className)}>
      {variants.map((variant) => {
        const { key, node } =
          typeof variant === "string"
            ? { key: variant, node: variant }
            : variant;
        const shown = !showsValue && key === active;
        return (
          <span
            aria-hidden={!shown}
            className={cn("[grid-area:1/1]", !shown && "invisible")}
            key={key}
          >
            {node}
          </span>
        );
      })}
      {showsValue ? <span className="[grid-area:1/1]">{value}</span> : null}
    </Element>
  );
}
