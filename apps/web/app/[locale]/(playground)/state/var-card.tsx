"use client";

/**
 * BANKED — not rendered by the state chapter. Eric's call (2026-08-21): the lab
 * is not the place for the local-variable demo; it belongs to the /learn
 * state lesson, where the narrative runs variables → state change vs.
 * rendering in an SPA → useState as the solution to both. This card is
 * that lesson's first specimen, kept working and tested beside the
 * chapter whose counterpart it is (design.md §5).
 */

import { useEffect, useRef } from "react";
import { StateCardShell } from "./card";
import { varProofClicked, varProofDeclared } from "./copy";

// The render tally lives outside the component on purpose: a value inside
// would be re-declared by the very renders it is meant to count. Written to
// the badge after paint, never rendered by JSX, so hydration has nothing to
// disagree with. (React's dev StrictMode double-invokes renders; the tally
// is honest in production.)
let renderTally = 0;

interface VarCardProps {
  /**
   * The panel's render pass, threaded through as a prop so the React
   * Compiler cannot memoize this card away when the deck re-renders the
   * panel — the wipe is the lesson, and a skipped render would hide it.
   */
  panelPass: number;
}

/**
 * The card with no state anywhere in it — that is the experiment. The
 * click handler genuinely increments the render's `let count`; the proof
 * line below the number is written to the DOM by hand, because React was
 * never told anything changed and is not coming back to write it.
 */
export function VarCard({ panelPass }: VarCardProps) {
  renderTally += 1;
  const renderNumber = renderTally;

  // Born in this call, dies with it. Every render of this card starts a
  // fresh one at zero — including the renders the deck button causes.
  let count = 0;

  const proofRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  // After every paint, the instruments report this render honestly: the
  // badge names the pass, the proof line reads the variable as the render
  // left it — freshly re-declared to 0.
  useEffect(() => {
    if (badgeRef.current) {
      badgeRef.current.textContent = `render #${renderNumber}`;
    }
    if (proofRef.current) {
      proofRef.current.textContent = varProofDeclared(renderNumber);
    }
  });

  const handleClick = () => {
    count += 1;
    if (proofRef.current) {
      proofRef.current.textContent = varProofClicked(count);
    }
  };

  return (
    <StateCardShell
      facts={[
        "the click runs — count += 1 really happens",
        "React isn’t told, so nothing repaints",
        "the next render re-declares let count = 0",
      ]}
      pill="let count"
      title={`var-card.tsx · pass ${panelPass}`}
      tone="plain"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <button
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-primary px-4 py-[calc(0.5rem-1px)] font-medium text-base text-primary-foreground shadow-md hover:bg-primary/90"
            onClick={handleClick}
            type="button"
          >
            +1
          </button>
          <p className="font-display font-medium text-2xl text-foreground tabular-nums tracking-tight">
            {count}
          </p>
          <span
            className="ml-auto font-mono text-[0.65rem] text-muted-foreground/70"
            ref={badgeRef}
          />
        </div>
        <p className="min-h-5 font-mono text-muted-foreground text-xs/5">
          <span ref={proofRef}>{varProofDeclared(1)}</span>
        </p>
      </div>
    </StateCardShell>
  );
}
