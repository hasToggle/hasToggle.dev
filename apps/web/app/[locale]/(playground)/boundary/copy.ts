/**
 * Every string the boundary instrument shows, in the instrument register:
 * lowercase, middot-separated, mechanism facts only. The panel never
 * narrates its own construction (design.md §4, 2026-08-27) — each line
 * states something about where components run, not about how this demo
 * manages to show it.
 *
 * Prose strings carry typographic marks directly (voice.md §8); anything
 * quoting real code keeps straight quotes.
 */

/** The instrument's two states, in the order the deck walks them. */
export type Beat = "rest" | "split";

/** The file's first line, worn on the card the way a file wears it. */
export const DIRECTIVE_LINES: Record<Beat, string> = {
  rest: "// no directive",
  split: "// no directive",
};

/** Which side of the boundary card.tsx itself is on, for the badge. */
export const SIDES: Record<Beat, "client" | "server"> = {
  rest: "server",
  split: "server",
};

/**
 * The two residencies, named the way the docs name them. The badge, the
 * ring label and the seam all use these strings, and each wears its
 * side's color — cyan server, orange client — so the same term reads as
 * the same thing wherever it appears (design.md: two channels, one display).
 */
export const SIDE_NAMES: Record<"client" | "server", string> = {
  client: "Client Component",
  server: "Server Component",
};

/** The rows under the card: what the server side can do, then where each file lives. */
export const FACTS: Record<Beat, readonly string[]> = {
  rest: [
    "runs in Node.js: the database, the secrets, the filesystem",
    "ships 0 kB of JavaScript",
    "renders once, returns HTML, and is gone",
  ],
  split: [
    "card.tsx: still a Server Component, still the only file that fetches",
    "copy-button.tsx: a Client Component, three lines, one onClick",
    "the hash reaches the button as a prop, serialized, one way",
  ],
};

/** The seam under the card — the one rule each state proves. */
export const SEAMS: Record<Beat, string> = {
  rest: "the dashed line is the server · every file lives here unless its first line says otherwise",
  split:
    "a Server Component can import a Client Component · never the other way round",
};

/** The deck's one step: the change the hash itself asks for. */
export const STEP_LABEL = "Add a copy button";
export const STEP_DETAIL = "copy-button.tsx";

/** Chrome, top-right: instrument housekeeping, disabled at rest. */
export const RESET_LABEL = "reset";
