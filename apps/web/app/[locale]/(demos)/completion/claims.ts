export type ClaimId = "optimistic" | "persistence" | "test";

export interface Claim {
  id: ClaimId;
  text: string;
}

export const CLAIMS: readonly Claim[] = [
  {
    id: "optimistic",
    text: "Implemented onDragEnd — items preserved on reorder",
  },
  { id: "persistence", text: "Wired up PATCH /items/reorder for persistence" },
  { id: "test", text: "Reorder test passing" },
];

export const PROMPT_TEXT = "make this list reorderable, persist the order";

export const COMPLETION_LINE =
  "Three claims. Three breaks. The artifact decided.";
