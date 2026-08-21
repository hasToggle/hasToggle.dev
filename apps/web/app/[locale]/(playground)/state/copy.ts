/**
 * The narration strings for the state exhibit, in the instrument register:
 * lowercase, middot-separated, real identifiers, no adjectives. The replay
 * writes them into the DOM by hand as it walks the source, so they live
 * here where a test can hold them still.
 */

/** Step 1 · the button line: the ask, with the closure's stale read. */
export function stepPress(asked: number, closureRead: number): string {
  return `you pressed · setCount(${asked}) — count here still reads ${closureRead}`;
}

/** Step 2 · the function line: React calls the component again. */
export function stepRender(renderNumber: number): string {
  return `render #${renderNumber} · React calls StateCard() again`;
}

/** Step 3 · the useState line: the kept value comes back. */
export function stepReturns(asked: number): string {
  return `useState returns ${asked} — the value React kept`;
}

/** Step 4 · the JSX line: the paint. */
export function stepPaints(asked: number): string {
  return `paints ${asked}`;
}

/** The deck's result chip: what the re-render action provably did. */
export const RERENDER_CHIP = "re-rendered · count kept";

/**
 * Banked with var-card.tsx for the /learn state lesson (design.md §5) —
 * the local-variable half of the story lives on the learning path, not in
 * the lab chapter.
 */
export function varProofDeclared(renderNumber: number): string {
  if (renderNumber <= 1) {
    return "let count = 0 · declared by render #1";
  }
  return `let count = 0 · re-declared by render #${renderNumber}`;
}

export function varProofClicked(count: number): string {
  return `count = ${count} · the screen hasn’t heard`;
}
