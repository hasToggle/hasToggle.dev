import type { Band } from "./selector";

export interface PromptSeed {
  continuations: Record<Band, string>;
  id: string;
  instructAnswer: string;
  isQuestion: boolean;
  label: string;
  prefix: string;
}

export const PROMPTS: readonly PromptSeed[] = [
  {
    continuations: {
      high: "items.reduceRight((a,b)=>[...a,b],[]);\n}\n\nconst x = 🦆; // TODO: ship it\nexport default function App(){return",
      low: "items.reverse();\n}\n\nfunction reverseList(items) {\n  return items.reverse();\n}\n",
      mid: "items.slice().reverse();\n}\n\n// reverse a string too\nfunction reverseStr(s) {\n  return s.split('')",
    },
    id: "reverse-fn",
    instructAnswer:
      "items.slice().reverse();\n}\n\n// slice() copies first, so the original array is untouched.",
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
    instructAnswer:
      "Use slice() to copy the array, then reverse():\n\nconst reversed = items.slice().reverse();\n\nCalling reverse() alone would mutate the original.",
    isQuestion: true,
    label: "a question",
    prefix: "// how do I reverse a list in JavaScript?\n",
  },
] as const;
