import { DASHBOARD_CACHE } from "./cache";
import { type IntentId, matchIntent } from "./match";
import type { RenderSpec } from "./render-spec";

/**
 * The seam. In the shipped build this reads the curated cache of real,
 * pre-generated json-render specs. A future live LLM implementation can sit
 * behind this same signature and must fall back to the cache on any failure.
 */
export function generateDashboard(question: string): {
  intent: IntentId;
  spec: RenderSpec;
  matched: boolean;
} {
  const { id, matched } = matchIntent(question);
  return { intent: id, matched, spec: DASHBOARD_CACHE[id] };
}
