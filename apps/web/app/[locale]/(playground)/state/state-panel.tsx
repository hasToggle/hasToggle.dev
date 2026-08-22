"use client";

import { Switch } from "@repo/design-system/components/ui/switch";
import { useState } from "react";
import { LivePanel } from "../live-panel";
import { StateCard } from "./state-card";

interface StatePanelProps {
  references: React.ReactNode;
  /** Server-highlighted source for the card's back face. */
  replayCode: React.ReactNode;
}

/**
 * The client owner of the state exhibit's chrome. The gauge stays `live`:
 * nothing here makes a server round trip — every event is a client render,
 * which is the exhibit's whole subject. No deck: the exhibit's one action
 * is the +1, and that is the specimen, not a control.
 */
export function StatePanel({ references, replayCode }: StatePanelProps) {
  const [narrate, setNarrate] = useState(false);

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

  return (
    <LivePanel references={references} viewControls={viewControls}>
      <div className="flex flex-col gap-5">
        <div className="mx-auto w-full max-w-xl">
          <StateCard narrate={narrate} replayCode={replayCode} />
        </div>
        {/* The seam, narrated: the one fact the replay acts out. */}
        <p className="font-mono text-muted-foreground text-xs/5">
          a state variable is a value React keeps between calls — and setting it
          is permission to call the component again.
        </p>
      </div>
    </LivePanel>
  );
}
