"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useCallback, useState } from "react";
import { MarketingButton } from "../../components/marketing-button";
import { LivePanel } from "../live-panel";
import { LOCKED_LOOK } from "../locked-look";
import { StableStack } from "../stable-stack";
import { FileCard } from "./card";
import type { Beat } from "./copy";
import {
  RESET_LABEL,
  SEAMS,
  SIDE_NAMES,
  STEP_DETAIL,
  STEP_LABEL,
} from "./copy";

// The nudge: while the step is pressable it wears the boundary's own
// orange on its ring, so the hand knows where the sequence starts.
const ARMED_LOOK = "ring-ht-orange-700/50 dark:ring-ht-orange-500/50";

const TERM_LOOK: Record<"client" | "server", string> = {
  client: "text-ht-orange-800 dark:text-ht-orange-300",
  server: "text-ht-cyan-800 dark:text-ht-cyan-300",
};

const TERM_SIDES = new Map<string, "client" | "server">([
  [SIDE_NAMES.server, "server"],
  [SIDE_NAMES.client, "client"],
]);

const TERM_PATTERN = new RegExp(
  `(${SIDE_NAMES.server}|${SIDE_NAMES.client})`,
  "g"
);

/**
 * The seam with its two residency terms colored like the lines they name:
 * "Server Component" in the outer ring's cyan, "Client Component" in the
 * inner ring's orange. The seam reads as the diagram's legend without a
 * legend being drawn; the plain string stays intact for screen readers.
 */
function Seam({ text }: { text: string }) {
  const parts = text.split(TERM_PATTERN);
  let offset = 0;
  return (
    <>
      {parts.map((part) => {
        const key = `${offset}-${part}`;
        offset += part.length;
        const side = TERM_SIDES.get(part);
        return side ? (
          <span className={cn("font-semibold", TERM_LOOK[side])} key={key}>
            {part}
          </span>
        ) : (
          <span key={key}>{part}</span>
        );
      })}
    </>
  );
}

/** Ghost-stack order for height reservation. */
const ALL_BEATS: readonly Beat[] = ["rest", "split"];

interface BoundaryPanelProps {
  references: React.ReactNode;
  /**
   * The rest beat's body, rendered on the server and handed across the
   * boundary as a finished slot — a client component cannot render a
   * Server Component, only be handed one.
   */
  serverCard: React.ReactNode;
  /**
   * The split beat's body: the same Server Component, now importing the
   * copy-button client island. Also server-rendered, also a slot.
   */
  splitCard: React.ReactNode;
}

/**
 * The client owner of the boundary instrument. The gauge stays `live`:
 * nothing here makes a server round trip — both server slots arrived with
 * the page, and the step between them is a client render.
 *
 * Two states: a Server Component doing the work developers expect of one,
 * then the same component with a copy button — which lands in its own
 * file, inside its own line, while the fetch stays where it was. Reset is
 * instrument housekeeping, not a subject action, so it sits in the chrome
 * and stays locked at rest (design.md §4, 2026-08-27).
 */
export function BoundaryPanel({
  references,
  serverCard,
  splitCard,
}: BoundaryPanelProps) {
  const [beat, setBeat] = useState<Beat>("rest");

  const handleReset = useCallback(() => setBeat("rest"), []);
  const handleStep = useCallback(() => setBeat("split"), []);

  const viewControls = (
    <button
      aria-disabled={beat === "rest"}
      className={cn(
        "cursor-pointer select-none font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground",
        "aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:text-muted-foreground"
      )}
      onClick={handleReset}
      type="button"
    >
      {RESET_LABEL} <span aria-hidden="true">↺</span>
    </button>
  );

  const deck = (
    <div className="flex flex-wrap items-center gap-3">
      <MarketingButton
        aria-disabled={beat !== "rest"}
        className={cn(LOCKED_LOOK, beat === "rest" && ARMED_LOOK)}
        onClick={handleStep}
        variant="outline"
      >
        {STEP_LABEL}
        <span className="ml-2 font-mono text-muted-foreground text-xs">
          {STEP_DETAIL}
        </span>
      </MarketingButton>
    </div>
  );

  return (
    <LivePanel deck={deck} references={references} viewControls={viewControls}>
      <div className="flex flex-col gap-5">
        {/* Both cards stacked in one grid cell, the inactive one invisible
            but still holding its space — so the instrument is always as
            tall as its taller beat and the deck never moves. Same
            reservation trick as StableStack, at card scale. The active wrapper's key flips on activation, so the
            split card's landing wash (.ht-land) replays on each arrival. */}
        <div className="grid">
          {ALL_BEATS.map((b) => {
            const active = b === beat;
            return (
              <div
                aria-hidden={!active}
                className={cn(
                  "[grid-area:1/1]",
                  active ? b === "split" && "ht-land" : "invisible"
                )}
                key={`${b}-${active}`}
              >
                <FileCard beat={b}>
                  {b === "rest" && serverCard}
                  {b === "split" && splitCard}
                </FileCard>
              </div>
            );
          })}
        </div>
        {/* The seam, narrated: the one fact the current beat proves. The
            ghost reserves the taller seam's height for the same reason. */}
        <StableStack
          active={beat}
          as="p"
          className="font-mono text-muted-foreground text-xs/5"
          role="status"
          variants={ALL_BEATS.map((b) => ({
            key: b,
            node: <Seam text={SEAMS[b]} />,
          }))}
        />
      </div>
    </LivePanel>
  );
}
