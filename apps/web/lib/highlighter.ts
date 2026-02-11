import { createHighlighter } from "shiki";

let highlighterInstance: ReturnType<typeof createHighlighter> | null = null;

export function initHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = createHighlighter({
      themes: ["ayu-dark"],
      langs: ["jsx", "tsx"],
    });
  }
  return highlighterInstance;
}
