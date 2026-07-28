import type { Band } from "./selector";

export interface PromptSeed {
  continuations: Record<Band, string>;
  id: string;
  instructAnswers: Record<Band, string>;
  isQuestion: boolean;
  label: string;
  prefix: string;
}

/**
 * The console reserves this much room so the Run button never moves when a
 * completion lands. `completions.test.ts` fails if any prefix + completion
 * would overflow either dimension — so new copy breaks the build rather than
 * quietly reintroducing the jump.
 *
 * The column reservation holds at the projector widths this demo is designed
 * for (roughly 760px and up). Below that the output panel's text wraps, the
 * line-count reservation is exceeded, and the panel scrolls instead — which
 * the design spec accepts as the narrow-viewport fallback. `OUTPUT_LINES`
 * itself has no such caveat: it holds at every width, since wrapping only
 * ever adds lines on narrow viewports, and the widest renderings are already
 * accounted for above.
 */
export const OUTPUT_LINES = 9;
export const OUTPUT_COLUMNS = 72;

export const PROMPTS: readonly PromptSeed[] = [
  {
    continuations: {
      high: "items.reduceRight((a,b)=>[...a,b],[]);\n}\n\nconst x = 🦆; // TODO: ship it\nexport default function App(){return",
      low: "items.reverse();\n}\n\nfunction reverseList(items) {\n  return items.reverse();\n}\n",
      mid: "items.slice().reverse();\n}\n\n// reverse a string too\nfunction reverseStr(s) {\n  return s.split('')",
    },
    id: "reverse-fn",
    instructAnswers: {
      high: "items.slice().reverse();\n}\n\n// slice() copies first — the original survives. reverse() alone\n// would not. Newer runtimes have toReversed(), which copies for you.\n// Whether you needed a reversed copy is a separate question entirely.",
      low: "items.slice().reverse();\n}\n\n// slice() copies first, so the original array is untouched.",
      mid: "items.slice().reverse();\n}\n\n// slice() copies the array first, so the original is left untouched.\n// reverse() on its own would mutate it in place.",
    },
    isQuestion: false,
    label: "a half-written function",
    prefix: "function reverseList(items) {\n  return ",
  },
  {
    continuations: {
      high: "// how do I reverse time? how do I reverse a decision?\n// what is a list, really? who is asking?\n",
      low: "// how do I sort a list in JavaScript?\n// how do I filter a list in JavaScript?\n// how do I",
      mid: "// and how do I do it without mutating the original?\n// is reverse() stable?\n// why does this matter?\n",
    },
    id: "how-do-i",
    instructAnswers: {
      high: "Copy it first, then reverse:\n\nconst reversed = items.slice().reverse();\n\nreverse() alone mutates in place. If your runtime is recent enough,\ntoReversed() does the copying for you. And if the list is large\nenough to worry about, you probably wanted an iterator instead.",
      low: "Use slice() to copy the array, then reverse():\n\nconst reversed = items.slice().reverse();\n\nCalling reverse() alone would mutate the original.",
      mid: "Copy the array first, then reverse it:\n\nconst reversed = items.slice().reverse();\n\nreverse() on its own mutates the array in place, which is\nrarely what you want.",
    },
    isQuestion: true,
    label: "a question",
    prefix: "// how do I reverse a list in JavaScript?\n",
  },
] as const;
