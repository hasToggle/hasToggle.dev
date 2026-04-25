"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/design-system/components/ui/toggle-group";
import { cn } from "@repo/design-system/lib/utils";

const ITEM_CLASSES = cn(
  "h-9 px-4 font-mono text-sm transition-colors",
  "data-[state=on]:bg-foreground data-[state=on]:text-background",
  "data-[state=off]:text-foreground/55 data-[state=off]:hover:bg-transparent data-[state=off]:hover:text-foreground"
);

interface ToggleControlProps {
  caption: string;
  label: string;
  offLabel: string;
  onChange: (next: boolean) => void;
  onLabel: string;
  value: boolean;
}

function ToggleControl({
  caption,
  label,
  offLabel,
  onChange,
  onLabel,
  value,
}: ToggleControlProps) {
  const handleValueChange = (next: string) => {
    if (!next) {
      return;
    }
    onChange(next === "on");
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="font-medium font-mono text-[0.7rem] text-foreground/45 uppercase tracking-[0.2em]">
        {label}
      </span>
      <ToggleGroup
        aria-label={label}
        className="rounded-sm border border-border bg-background/60"
        onValueChange={handleValueChange}
        spacing={0}
        type="single"
        value={value ? "on" : "off"}
        variant="default"
      >
        <ToggleGroupItem className={ITEM_CLASSES} value="off">
          {offLabel}
        </ToggleGroupItem>
        <ToggleGroupItem className={ITEM_CLASSES} value="on">
          {onLabel}
        </ToggleGroupItem>
      </ToggleGroup>
      <p className="font-mono text-foreground/55 text-xs leading-5">
        {caption}
      </p>
    </div>
  );
}

interface TogglesProps {
  grounding: boolean;
  move: boolean;
  onGroundingChange: (next: boolean) => void;
  onMoveChange: (next: boolean) => void;
}

export function Toggles({
  grounding,
  move,
  onGroundingChange,
  onMoveChange,
}: TogglesProps) {
  return (
    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <ToggleControl
        caption="off → ask again. on → ask again, with current docs."
        label="Grounding"
        offLabel="off"
        onChange={onGroundingChange}
        onLabel="on"
        value={grounding}
      />
      <ToggleControl
        caption="re-generate → another plausible answer. re-rank → keep what was said, weigh it."
        label="Move"
        offLabel="re-generate"
        onChange={onMoveChange}
        onLabel="re-rank"
        value={move}
      />
    </div>
  );
}
