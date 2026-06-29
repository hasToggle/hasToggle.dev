import type { Band } from "./selector";

export interface PromptSeed {
  id: string;
  label: string;
  isQuestion: boolean;
  prefix: string;
  continuations: Record<Band, string>;
}

export const PROMPTS: readonly PromptSeed[] = [
  {
    id: "reverse-fn",
    label: "A half-written function",
    isQuestion: false,
    prefix: "function reverseList(items) {\n  return ",
    continuations: {
      low: "items.reverse();\n}\n\nfunction reverseList(items) {\n  return items.reverse();\n}\n",
      mid: "items.slice().reverse();\n}\n\n// reverse a string too\nfunction reverseStr(s) {\n  return s.split('')",
      high: "items.reduceRight((a,b)=>[...a,b],[]);\n}\n\nconst x = 🦆; // TODO: ship it\nexport default function App(){return",
    },
  },
  {
    id: "how-do-i",
    label: "A question (watch what happens)",
    isQuestion: true,
    prefix: "// how do I reverse a list in JavaScript?\n",
    continuations: {
      low: "// how do I sort a list in JavaScript?\n// how do I filter a list in JavaScript?\n// how do I",
      mid: "// and how do I do it without mutating the original?\n// is reverse() stable?\n// why does this matter?\n",
      high: "// how do I reverse time? how do I reverse a decision?\n// what is a list, really? who is asking?\n",
    },
  },
] as const;
