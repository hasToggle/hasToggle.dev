import { cn } from "@repo/design-system/lib/utils";

/**
 * The outline variant's `disabled:` look, re-expressed for `aria-disabled` —
 * a locked deck step stays a real, focusable element, so keyboard and
 * screen-reader users don't lose their place when its lock state flips.
 * See MarketingButton's `outline` variant.
 *
 * The hover override earns its place: a natively disabled button is
 * excluded from `:hover` matching, but an `aria-disabled` one is still
 * live, so the variant's `hover:bg-muted` would light up a button that
 * does nothing.
 */
export const LOCKED_LOOK = cn(
  "aria-disabled:bg-transparent aria-disabled:opacity-40",
  "aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent"
);
