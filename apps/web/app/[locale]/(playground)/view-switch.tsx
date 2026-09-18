"use client";

import { Switch } from "@repo/design-system/components/ui/switch";

interface ViewSwitchProps {
  checked: boolean;
  disabled?: boolean;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

/**
 * The instrument's view control: one labelled switch in the chrome corner
 * every editor keeps its view toggles in (design.md §1). Panels differ in
 * what the switch means — slow motion, request view — never in how it
 * looks.
 */
export function ViewSwitch({
  checked,
  disabled,
  id,
  label,
  onCheckedChange,
}: ViewSwitchProps) {
  return (
    <div className="flex items-center gap-2.5">
      <label
        className="cursor-pointer select-none font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]"
        htmlFor={id}
      >
        {label}
      </label>
      <Switch
        checked={checked}
        disabled={disabled}
        id={id}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
