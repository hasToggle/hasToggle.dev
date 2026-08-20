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

// The collapsed box is reserved at the longest label's width, so the row's
// layout never depends on which theme happens to be active. Derived rather
// than named, so renaming an option keeps the reservation honest.
const WIDEST = OPTIONS.reduce((widest, option) =>
  option.label.length > widest.label.length ? option : widest
);

// One group on the page, so a literal name is enough and beats a generated
// id that would have to survive the mount gate below.
const GROUP = "theme";

// Horizontal padding is left out: the resting chip wears it, the folded ones
// drop it to zero so they collapse to nothing instead of to 20px of air.
const CHIP =
  "flex items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full py-1 font-mono font-semibold text-[0.7rem] uppercase tracking-[0.16em]";

// Written out rather than interpolated from a shared string: Tailwind scans
// the source for whole class names, and `group-hover:${OPEN}` produces none.
const OPEN = "max-w-40 px-2.5 opacity-100";
const FOLDED = cn(
  "max-w-0 px-0 opacity-0",
  "group-hover:max-w-40 group-hover:px-2.5 group-hover:opacity-100",
  "group-focus-within:max-w-40 group-focus-within:px-2.5 group-focus-within:opacity-100"
);

function ChipContent({ Icon, label }: { Icon: typeof SunIcon; label: string }) {
  return (
    <>
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
      {label}
    </>
  );
}

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
          without a line of keyboard code here. The folded options stay in
          the DOM and stay focusable — they are clipped, not removed, so a
          screen reader is told about all three whatever the pointer is
          doing. */}
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
          CHIP,
          "motion-safe:transition-[max-width,padding,opacity] motion-safe:duration-200",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-ht-cyan-600 peer-focus-visible:outline-offset-2 dark:peer-focus-visible:outline-ht-cyan-400",
          selected
            ? // The active chip is the filled one, and the pill behind it
              // takes the page colour. Filling it with `bg-background`
              // instead reads as raised in light mode and sunken in dark,
              // where the page is darker than `bg-muted` rather than
              // lighter.
              cn(OPEN, "bg-muted text-foreground")
            : // Hover for the mouse, focus-within for the keyboard and for
              // the tap that lands on the resting chip. Hover alone would
              // make this unreachable on the phone — which is the width that
              // wanted it folded in the first place.
              cn(FOLDED, "text-muted-foreground hover:text-foreground")
        )}
      >
        <ChipContent Icon={Icon} label={label} />
      </span>
    </label>
  );
}

/**
 * The theme control: light, dark, or follow the OS. At rest it shows only the
 * mode in force — a readout that happens to be pressable, the same move the
 * exhibits' state gauge makes. Hover, focus or tap it and the other two
 * unfold to its left.
 *
 * The unfolding is an overlay, not a reflow. Expanded, the group is wider
 * than the gap between the wordmark and the right edge on a phone, so laying
 * it out in flow would shove the logo around every time a pointer crossed
 * it. An invisible box holds the resting footprint; the group itself is
 * absolute and opaque, and passes over the logo when it opens.
 *
 * It renders nothing until mounted. The choice lives in localStorage, so the
 * server cannot know it — a server-rendered control would either mark the
 * wrong option for a frame or, with JavaScript off, sit there being a switch
 * that switches nothing.
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
      <div className="group relative flex justify-end">
        {/* Reserves the resting footprint. Same nesting as the real group so
            the two boxes agree without either one hardcoding a width. */}
        <div
          aria-hidden="true"
          className="invisible flex rounded-full border p-0.5"
        >
          <span className={cn(CHIP, "px-2.5")}>
            <ChipContent Icon={WIDEST.Icon} label={WIDEST.label} />
          </span>
        </div>
        {/* An explicit radiogroup rather than a fieldset: `sr-only` positions
            the legend absolutely, and Chrome then stops treating it as the
            fieldset's name — the word "Theme" ends up loose in the a11y tree
            instead of labelling the group. The radios' shared `name` is what
            gives the arrow keys their behaviour, so nothing is lost here. */}
        <div
          aria-label="Theme"
          className="absolute top-0 right-0 z-20 flex items-center rounded-full border border-foreground/10 bg-background p-0.5"
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
      </div>
    </PlusGridItem>
  );
}
