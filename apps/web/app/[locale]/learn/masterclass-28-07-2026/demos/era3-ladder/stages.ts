export interface LadderStage {
  artifact: "diff" | "plan" | "design";
  /** the artifact's rendered lines (mono) */
  body: readonly string[];
  line: string;
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
    read: "I read the code.",
    year: "2024",
  },
  {
    artifact: "plan",
    body: [
      "1. Extract validation into validateDiscount(code)",
      "2. Unknown / empty codes fail soft — cart survives, warning attached",
      "3. Wire into applyDiscount; never throw at checkout",
      "4. Tests first: unknown, empty, known, case-insensitive",
      "5. Migrate call sites; delete the naked DISCOUNTS lookup",
    ],
    line: "The design was mine; Claude wrote the implementation plan. I reviewed intentions, not artifacts.",
    read: "I read the plan.",
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
    read: "I read the design. Tests read the code.",
    year: "2026",
  },
];
