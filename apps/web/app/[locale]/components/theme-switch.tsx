"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useTheme } from "@repo/design-system/providers/theme";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
          // cyan-700 in light, not the 600 this started on: 600 measures
          // 2.32:1 against a white page, under the 3:1 WCAG 1.4.11 asks of a
          // focus indicator. 700 is the first step that clears it (3.22:1)
          // and still reads as the brand cyan — 800 passes wider but goes
          // teal. Dark keeps 400, which is already 13.95:1 on this page.
          "peer-focus-visible:outline-2 peer-focus-visible:outline-ht-cyan-700 peer-focus-visible:outline-offset-2 dark:peer-focus-visible:outline-ht-cyan-400",
          selected
            ? // Inverted, not a tinted fill. `--muted` sits 1.09:1 from
              // `--background`, so every subtle grey this palette can make
              // leaves the selected state under the 3:1 WCAG 1.4.11 wants —
              // `foreground/30` tops out at 2.05:1. Inverting clears it at
              // 19.8:1 and borrows the treatment MarketingButton already
              // uses: a black pill in light, a white one in dark. With the
              // labels always quiet, the fill is most of what says which
              // mode is on.
              "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon
          aria-hidden="true"
          className="size-3.5 shrink-0"
          strokeWidth={2}
        />
        {/* `sr-only`, not `hidden`: the compact pill never paints the words,
            but a display-none label would take the radio's accessible name
            down with it. The word stays in the a11y tree at every width. */}
        <span className="sr-only">{label}</span>
      </span>
    </label>
  );
}

/**
 * The theme control: light, dark, or follow the OS. All three positions are
 * visible at once — which one is active is the fact worth showing, and one
 * click is the whole interaction. Icon-only by design: it lives in the
 * footer's utility row now (the top nav's corners belong to navigation),
 * where three labeled chips would out-shout the social icons beside it.
 *
 * Nothing here moves or unfolds. An earlier version collapsed to the active
 * mode and expanded on hover, which shifted the active chip sideways for
 * two of the three modes; the labels went quiet instead, and stayed quiet
 * when the control moved down here.
 *
 * It renders nothing until mounted. The choice lives in localStorage, so the
 * server cannot know it — a server-rendered control would either mark the
 * wrong option for a frame or, with JavaScript off, sit there being a switch
 * that switches nothing. Nothing shifts when it appears: the social icons
 * set the row's height, and the pill arrives in the space beside them.
 */
export function ThemeSwitch() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    // An explicit radiogroup rather than a fieldset: `sr-only` positions
    // the legend absolutely, and Chrome then stops treating it as the
    // fieldset's name — the word "Theme" ends up loose in the a11y tree
    // instead of labelling the group. The radios' shared `name` is what
    // gives the arrow keys their behaviour, so nothing is lost here.
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
  );
}
