export interface Item {
  id: string;
  label: string;
}

export const INITIAL_ITEMS: readonly Item[] = [
  { id: "tests", label: "Write tests" },
  { id: "persistence", label: "Wire up persistence" },
  { id: "errors", label: "Add error handling" },
  { id: "races", label: "Handle race conditions" },
  { id: "verify", label: "Verify completion" },
  { id: "docs", label: "Document the API" },
];
