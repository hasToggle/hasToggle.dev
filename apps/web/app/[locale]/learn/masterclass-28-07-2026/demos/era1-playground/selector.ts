import { PROMPTS, type PromptSeed } from "./completions";

export type Band = "low" | "mid" | "high";

export type { PromptSeed };
export { PROMPTS };

export function bandFor(temp: number): Band {
  if (temp < 0.4) {
    return "low";
  }
  if (temp < 1.0) {
    return "mid";
  }
  return "high";
}

export function selectCompletion(id: string, temp: number): string {
  const prompt = PROMPTS.find((p) => p.id === id);
  if (!prompt) {
    return "";
  }
  return prompt.continuations[bandFor(temp)];
}
