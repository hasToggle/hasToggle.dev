"use client";

import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { useState } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { LivePanel } from "../live-panel";
import { WIPE_CHIP } from "./copy";
import { StateCard } from "./state-card";
import { VarCard } from "./var-card";

interface StatePanelProps {
  references: React.ReactNode;
}

/**
 * The client owner of the state exhibit's chrome. The gauge stays `live`:
 * nothing here makes a server round trip — every event is a client render,
 * which is the exhibit's whole subject. The deck's one action re-renders
 * the panel, so both cards run again: the left card's variable is wiped,
 * the right card's state survives, and the result chip files the outcome.
 */
export function StatePanel({ references }: StatePanelProps) {
  const [narrate, setNarrate] = useState(false);
  const [pass, setPass] = useState(1);

  const revealed = pass > 1;

  const viewControls = (
    <div className="flex items-center gap-2.5">
      <label
        className="cursor-pointer select-none font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]"
        htmlFor="state-narrate"
      >
        narrate
      </label>
      <Switch
        checked={narrate}
        id="state-narrate"
        onCheckedChange={setNarrate}
      />
    </div>
  );

  const deck = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <MarketingButton
        onClick={() => setPass((current) => current + 1)}
        type="button"
        variant="outline"
      >
        Re-render the panel
      </MarketingButton>
      {/* Reserved so the reveal never moves the row; `invisible` keeps it
          out of the a11y tree until it's true (the rebake deck's pattern). */}
      <span
        aria-hidden={!revealed}
        className={cn(
          "flex items-center gap-3",
          revealed ? undefined : "invisible"
        )}
      >
        <span
          aria-hidden="true"
          className="select-none font-mono text-muted-foreground/50"
        >
          →
        </span>
        <span className="rounded-md border border-foreground/15 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground tracking-wider">
          {WIPE_CHIP}
        </span>
      </span>
    </div>
  );

  return (
    <LivePanel deck={deck} references={references} viewControls={viewControls}>
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <VarCard panelPass={pass} />
          <StateCard narrate={narrate} panelPass={pass} />
        </div>
        {/* The seam, narrated: what neither card can say alone. */}
        <p className="font-mono text-muted-foreground text-xs/5">
          a state variable is a value React keeps between calls — and setting it
          is permission to call the component again.
        </p>
      </div>
    </LivePanel>
  );
}
