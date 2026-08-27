/**
 * Every string the boundary instrument shows, in the instrument register:
 * lowercase, middot-separated, mechanism facts only. The panel never
 * narrates its own construction (design.md §4, 2026-08-27) — each line
 * states something about where components run, not about how this demo
 * manages to show it.
 *
 * Prose strings carry typographic marks directly (voice.md §8); anything
 * quoting real code or real error text keeps straight quotes.
 */

/** The instrument's three states, in the order the deck walks them. */
export type Beat = "hydrated" | "refused" | "rest";

/** The file's first line, worn on the card the way a file wears it. */
export const DIRECTIVE_LINES: Record<Beat, string> = {
  hydrated: '"use client";',
  refused: "// no directive",
  rest: "// no directive",
};

/** Which side of the boundary the card is on, for the badge. */
export const SIDES: Record<Beat, "client" | "server"> = {
  hydrated: "client",
  refused: "server",
  rest: "server",
};

/** The rows under the card: capabilities at rest, then costs. */
export const FACTS: Record<Beat, readonly string[]> = {
  hydrated: [
    "bought: useState, useEffect, onClick",
    "paid: React + this component, downloaded by every visitor",
    "paid: the database call and the API key this file could reach a beat ago",
  ],
  refused: [
    "the build stopped here — nothing shipped",
    "onClick fails the same way: the click arrives after the server has hung up",
    "the error names its fix: one directive",
  ],
  rest: [
    "runs in Node: databases, secrets, the filesystem",
    "ships 0 kB of JavaScript",
    "renders once, returns HTML, and is gone",
  ],
};

/** The seam under the card — the one fact each state proves. */
export const SEAMS: Record<Beat, string> = {
  hydrated:
    "the directive claims the whole file, and every file it imports · the line is drawn at build time, not per render",
  refused:
    "useState keeps a value between renders · a render that happens once has no between",
  rest: "no directive · a Server Component, like every file that doesn’t say otherwise",
};

/**
 * The refusal, verbatim. This is the exact string Turbopack prints when a
 * file without the directive asks for useState — read out of the next-swc
 * binary, 2026-08-27, so the truth pass can check the panel against the
 * real error. Straight quotes throughout: it quotes the compiler.
 */
export const REFUSAL_ERROR =
  'You\'re importing a component that needs `useState`. This React Hook only works in a Client Component. To fix, mark the file (or its parent) with the `"use client"` directive.';

/** The overlay's file line — the card's own name, where dev points. */
export const REFUSAL_FILE = "./card.tsx";

/** Deck step one: the change everyone makes. */
export const STEP_ONE_LABEL = "Add a counter";
export const STEP_ONE_DETAIL = "useState + onClick";

/** Deck step two: the fix the error just named. Real code, straight quotes. */
export const STEP_TWO_LABEL = '"use client"';

/** Chrome, top-right: instrument housekeeping, disabled at rest. */
export const RESET_LABEL = "reset";
