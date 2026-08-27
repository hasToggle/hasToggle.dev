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

/** The instrument's four states, in the order the deck walks them. */
export type Beat = "crossed" | "refused" | "rest" | "split";

/** The file's first line, worn on the card the way a file wears it. */
export const DIRECTIVE_LINES: Record<Beat, string> = {
  crossed: '"use client";',
  refused: "// no directive",
  rest: "// no directive",
  split: "// no directive",
};

/** Which side of the boundary card.tsx itself is on, for the badge. */
export const SIDES: Record<Beat, "client" | "server"> = {
  crossed: "client",
  refused: "server",
  rest: "server",
  split: "server",
};

/** The rows under the card: capabilities, the stop, the bill, the split. */
export const FACTS: Record<Beat, readonly string[]> = {
  crossed: [
    "the intent: keep the fetch on the server, give the click to the browser",
    "the directive moves files whole — there is no line for half a file",
    "both sides at once takes two files",
  ],
  refused: [
    "the intent: let the visitor copy the hash — one small click",
    "a click needs a listener in the browser, and this file never ships there",
    "the error offers a one-line fix",
  ],
  rest: [
    "runs in Node: databases, secrets, the filesystem",
    "ships 0 kB of JavaScript",
    "renders once, returns HTML, and is gone",
  ],
  split: [
    '"use client" moved into copy-button.tsx — one directive, one small file',
    "the fetch stayed in Node.js — cached once, served to everyone",
    "shipped to the browser: the button, and only the button",
  ],
};

/** The seam under the card — the one fact each state proves. */
export const SEAMS: Record<Beat, string> = {
  crossed:
    "the directive claims the whole file, and every file it imports · the line is drawn at build time, not per render",
  refused:
    "useState keeps a value between renders · a render that happens once has no between",
  rest: "no directive · a Server Component, like every file that doesn’t say otherwise",
  split:
    "a Server Component can import a Client Component · the directive sits on the smallest file that needs it",
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

/**
 * The second refusal, also verbatim from the next-swc binary
 * (2026-08-27): what Turbopack prints when the first error's suggested
 * fix — the directive on the whole file — meets the "use cache" the file
 * already had. Its second sentence names the real fix, which is the
 * deck's step three.
 */
export const CROSSED_ERROR =
  'It is not allowed to define inline "use cache" annotated functions in Client Components.\nTo use "use cache" functions in a Client Component, you can either export them from a separate file with "use cache" or "use server" at the top, or pass them down through props from a Server Component.';

/** Deck step one: the change the hash itself asks for. */
export const STEP_ONE_LABEL = "Add a copy button";
export const STEP_ONE_DETAIL = "useState + onClick";

/** Deck step two: the fix the error just named. Real code, straight quotes. */
export const STEP_TWO_LABEL = '"use client"';

/** Deck step three: the fix no error message suggests. */
export const STEP_THREE_LABEL = "Extract the button";
export const STEP_THREE_DETAIL = "copy-button.tsx";

/** Chrome, top-right: instrument housekeeping, disabled at rest. */
export const RESET_LABEL = "reset";
