/**
 * The narration strings for the state exhibit, in the instrument register:
 * lowercase, middot-separated, real identifiers, no adjectives. The replay
 * writes them into the DOM by hand as it walks the source, so they live
 * here where a test can hold them still.
 */

/** The function line, where the walk begins: React runs it all again. */
export function stepRender(renderNumber: number): string {
  return `render #${renderNumber} · React runs StateCard() again, top to bottom`;
}

/** The useState line: the kept value comes back. */
export function stepReturns(asked: number): string {
  return `useState returns ${asked} — the value React kept`;
}

/** The JSX line that paints the count. */
export function stepPaints(asked: number): string {
  return `paints ${asked}`;
}

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
