export type IntentId = "juniors" | "ai-skills" | "pay" | "trust";

export const INTENTS: readonly {
  id: IntentId;
  label: string;
  question: string;
  keywords: string[];
}[] = [
  {
    id: "juniors",
    keywords: ["junior", "entry", "young", "taking", "jobs", "grads"],
    label: "Is AI taking junior dev jobs?",
    question: "Is AI taking junior developer jobs?",
  },
  {
    id: "ai-skills",
    keywords: ["role", "grow", "fastest", "career", "hiring"],
    label: "Fastest-growing roles",
    question: "Which roles are growing fastest right now?",
  },
  {
    id: "pay",
    keywords: ["pay", "salary", "wage", "premium", "money", "earn"],
    label: "Does AI skill pay?",
    question: "What's the AI wage premium?",
  },
  {
    id: "trust",
    keywords: ["trust", "adoption", "reliable", "distrust", "frustrat"],
    label: "Do devs even trust AI?",
    question: "Do developers actually trust AI?",
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
