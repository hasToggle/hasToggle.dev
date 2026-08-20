"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useTheme } from "@repo/design-system/providers/theme";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PlusGridItem } from "./plus-grid";

// The symbols everyone already reads as these three things. They carry the
// meaning for a visitor scanning the corner; the words carry it for anyone
// who finds a sun and a monitor ambiguous. Two channels, one control — the
// redundancy design.md asks for instead of a per-audience mode.
const OPTIONS = [
  { Icon: SunIcon, label: "light", value: "light" },
  { Icon: MoonIcon, label: "dark", value: "dark" },
  { Icon: MonitorIcon, label: "system", value: "system" },
] as const;

// One group on the page, so a literal name is enough and beats a generated
// id that would have to survive the mount gate below.
const GROUP = "theme";

function ThemeOption({
  Icon,
  label,
  selected,
  value,
}: {
  Icon: typeof SunIcon;
  label: string;
  selected: boolean;
  value: string;
}) {
  const { setTheme } = useTheme();
  const select = useCallback(() => setTheme(value), [setTheme, value]);

  return (
    <label className="cursor-pointer">
      {/* A real radio group: the platform gives one tab stop, arrow-key
          movement between the three, and the right role and checked state
          without a line of keyboard code here. */}
      <input
        checked={selected}
        className="peer sr-only"
        name={GROUP}
        onChange={select}
        type="radio"
        value={value}
      />
      <span
        className={cn(
          // `py-1.5`, not `py-1`: with the labels hidden below `sm` these are
          // 34px-wide icon chips, and `py-1` left them 22px tall — under the
          // 24px floor WCAG 2.5.8 puts on a touch target.
          "flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono font-semibold text-[0.7rem] uppercase tracking-[0.16em] transition-colors",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-ht-cyan-600 peer-focus-visible:outline-offset-2 dark:peer-focus-visible:outline-ht-cyan-400",
          selected
            ? // The active chip is the filled one, and the pill behind it
              // takes the page colour. Filling it with `bg-background`
              // instead reads as raised in light mode and sunken in dark,
              // where the page is darker than `bg-muted` rather than
              // lighter.
              "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon
          aria-hidden="true"
          className="size-3.5 shrink-0"
          strokeWidth={2}
        />
        {/* `sr-only`, not `hidden`: below `sm` there is no room beside the
            wordmark for three labels, but a display-none label would take
            the radio's accessible name down with it. This keeps the word in
            the a11y tree at every width and only stops painting it. */}
        <span className="sr-only sm:not-sr-only">{label}</span>
      </span>
    </label>
  );
}

/**
 * The theme control: light, dark, or follow the OS. All three positions are
 * visible at once — which one is active is the fact worth showing, and one
 * click is the whole interaction.
 *
 * Nothing here moves or unfolds. An earlier version collapsed to the active
 * mode and expanded on hover, which shifted the active chip up to 165px
 * sideways for two of the three modes: the group is pinned to the right
 * edge, so only the last option in the row can hold still while the others
 * appear. Below `sm` the labels go quiet instead, which buys the same width
 * without moving anything.
 *
 * It renders nothing until mounted. The choice lives in localStorage, so the
 * server cannot know it — a server-rendered control would either mark the
 * wrong option for a frame or, with JavaScript off, sit there being a switch
 * that switches nothing. Nothing shifts when it appears: the row is
 * `justify-between` with the logo setting its height, so this arrives in
 * empty space at the right edge.
 */
export function ThemeSwitch({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <PlusGridItem className="py-3" variant={variant}>
      {/* An explicit radiogroup rather than a fieldset: `sr-only` positions
          the legend absolutely, and Chrome then stops treating it as the
          fieldset's name — the word "Theme" ends up loose in the a11y tree
          instead of labelling the group. The radios' shared `name` is what
          gives the arrow keys their behaviour, so nothing is lost here. */}
      <div
        aria-label="Theme"
        className="flex items-center rounded-full border border-foreground/10 bg-background p-0.5"
        role="radiogroup"
      >
        {OPTIONS.map((option) => (
          <ThemeOption
            Icon={option.Icon}
            key={option.value}
            label={option.label}
            selected={theme === option.value}
            value={option.value}
          />
        ))}
      </div>
    </PlusGridItem>
  );
}
