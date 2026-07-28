export interface FileModel {
  lines: string[];
}

export interface Suggestion {
  code: string[];
  fixLine: string;
  insertAfterLine: number;
  missingRef: string;
}

export const INITIAL_FILE: FileModel = {
  lines: [
    "function applyDiscount(cart, code) {",
    "  const rate = DISCOUNTS[code];",
    "  return cart.total * (1 - rate);",
    "}",
  ],
};

// The assistant only saw the selection — it invents `logEvent`, which this
// file never imports or defines. Applying compiles a reference to nothing.
export const SUGGESTION: Suggestion = {
  code: [
    "  if (!(code in DISCOUNTS)) {",
    '    logEvent("bad_discount_code", { code });',
    '    throw new Error("Unknown discount code");',
    "  }",
  ],
  fixLine: 'import { logEvent } from "./analytics";',
  insertAfterLine: 1,
  missingRef: "logEvent",
};
