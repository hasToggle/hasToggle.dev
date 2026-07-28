export interface LadderStage {
  /** Renders the count as an estimate rather than a tally. */
  approx?: boolean;
  artifact: "diff" | "plan" | "design";
  /** the artifact's rendered lines (mono) */
  body: readonly string[];
  line: string;
  /**
   * Lines of text this year's artifact asks a human to read. The diff counts
   * every changed line, not just the ones shown; the plan counts the detail
   * under each step, not the five headlines it lists. Same unit all three
   * years, so the bar comparing them is honest.
   */
  lines: number;
  read: string;
  year: "2024" | "2025" | "2026";
}

export const LADDER_STAGES: readonly LadderStage[] = [
  {
    artifact: "diff",
    body: [
      "+ import { validateDiscount } from './validation';",
      "+",
      "+ export function applyDiscount(cart, code) {",
      "+   const result = validateDiscount(code);",
      "+   if (!result.valid) {",
      "+     return { ...cart, discount: 0, warning: result.reason };",
      "+   }",
      "+   return { ...cart, discount: result.amount };",
      "+ }",
      "- export function applyDiscount(cart, code) {",
      "-   return { ...cart, discount: DISCOUNTS[code] };",
      "- }",
      "+ export function validateDiscount(code) {",
      "+   if (typeof code !== 'string' || code.length === 0) {",
      "+     return { valid: false, reason: 'empty code' };",
      "+   }",
      "+   const known = DISCOUNTS[code.toUpperCase()];",
      "+   if (known === undefined) {",
      "+     return { valid: false, reason: 'unknown code' };",
      "+   }",
      "+   return { valid: true, amount: known };",
      "+ }",
      "+ describe('validateDiscount', () => {",
      "+   test('rejects an unknown code', () => { … });",
      "+   test('rejects an empty code', () => { … });",
      "+   test('accepts a known code', () => { … });",
      "+ });",
      "  // …214 more lines",
    ],
    line: "Plan mode, then a wall of diffs. I read every generated line like a literature student. I have a literature degree. I did not expect to use it on diffs.",
    // 27 lines shown, 214 more behind the fold.
    lines: 241,
    read: "I checked every line.",
    year: "2024",
  },
  {
    approx: true,
    artifact: "plan",
    body: [
      "1. Extract validation into validateDiscount(code)",
      "2. Unknown / empty codes fail soft — cart survives, warning attached",
      "3. Wire into applyDiscount; never throw at checkout",
      "4. Tests first: unknown, empty, known, case-insensitive",
      "5. Migrate call sites; delete the naked DISCOUNTS lookup",
    ],
    line: "The design was mine; Claude wrote the implementation plan. I reviewed intentions, not artifacts.",
    // Not the five headlines below — everything written under them, which was
    // still about half a diff's worth of reading.
    lines: 120,
    read: "I reviewed the plan.",
    year: "2025",
  },
  {
    artifact: "design",
    body: [
      "Design: a discount code a customer mistypes must never",
      "break checkout. Validation owns that guarantee; tests own",
      "the proof.",
    ],
    line: "I plan the design. Claude writes the implementation plan. TDD runs the execution — tests read the code, I don't.",
    lines: 3,
    read: "I read the design. Tests read the code.",
    year: "2026",
  },
];
