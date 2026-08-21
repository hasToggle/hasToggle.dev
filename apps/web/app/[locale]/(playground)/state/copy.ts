/**
 * The narration strings for the state exhibit, in the instrument register:
 * lowercase, middot-separated, real identifiers, no adjectives. They are
 * written into the DOM by hand (the cards explain why), so they live here
 * where a test can hold them still.
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

export function stateAskLine(asked: number, closureRead: number): string {
  return `1 · setCount(${asked}) — inside this click, count still reads ${closureRead}`;
}

export function stateRenderLine(count: number, renderNumber: number): string {
  return `2 · render #${renderNumber} — count now reads ${count}`;
}

export const WIPE_CHIP = "let count → 0 · useState count → kept";
