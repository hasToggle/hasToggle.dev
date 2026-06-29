export type IntentId = "ai-skills" | "pay" | "stacks" | "rising";

export const INTENTS: readonly {
  id: IntentId;
  label: string;
  question: string;
  keywords: string[];
}[] = [
  {
    id: "ai-skills",
    label: "Most-wanted AI-eng skills",
    question: "What AI-engineering skills are most in demand?",
    keywords: ["skill", "demand", "wanted", "ai", "rag", "agent"],
  },
  {
    id: "pay",
    label: "Full-stack vs AI-eng pay",
    question: "How does full-stack pay compare to AI-engineering pay?",
    keywords: ["pay", "salary", "compensation", "money", "compare"],
  },
  {
    id: "stacks",
    label: "Junior-friendly stacks",
    question: "Which stacks are most junior-friendly?",
    keywords: ["stack", "learn", "framework", "tech", "junior-friendly"],
  },
  {
    id: "rising",
    label: "What's rising, 2024 → 2026",
    question: "What is rising from 2024 to 2026?",
    keywords: ["rising", "trend", "growing", "2024", "2025", "2026", "future"],
  },
] as const;

const FALLBACK: IntentId = "ai-skills";

export function matchIntent(question: string): {
  id: IntentId;
  matched: boolean;
} {
  const q = question.toLowerCase();
  let best: { id: IntentId; score: number } = { id: FALLBACK, score: 0 };
  for (const intent of INTENTS) {
    const score = intent.keywords.reduce(
      (acc, kw) => acc + (q.includes(kw) ? 1 : 0),
      0
    );
    if (score > best.score) {
      best = { id: intent.id, score };
    }
  }
  return { id: best.id, matched: best.score > 0 };
}
