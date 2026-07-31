import type { Document } from "mongodb";
import { currentlyValidFilter, type FactCategory } from "./schemas/facts";

export const FACTS_SEARCH_INDEX_NAME = "facts_search";

// Atlas Search index over facts: full-text on the statement, token filters
// for tenant and category. dynamic:false — nothing else is searchable.
export const factsSearchIndexDefinition = {
  mappings: {
    dynamic: false,
    fields: {
      category: { type: "token" },
      tenantId: { type: "token" },
      text: { type: "string" },
    },
  },
} as const;

export interface FactsSearchOptions {
  category?: FactCategory;
  includeSuperseded?: boolean;
  limit?: number;
  query: string;
  tenantId: string;
}

export const buildFactsSearchPipeline = ({
  tenantId,
  query,
  category,
  includeSuperseded = false,
  limit = 20,
}: FactsSearchOptions): Document[] => {
  const filter: Document[] = [
    { equals: { path: "tenantId", value: tenantId } },
  ];
  if (category) {
    filter.push({ equals: { path: "category", value: category } });
  }

  const pipeline: Document[] = [
    {
      $search: {
        compound: {
          filter,
          must: [{ text: { fuzzy: { maxEdits: 1 }, path: "text", query } }],
        },
        index: FACTS_SEARCH_INDEX_NAME,
      },
    },
  ];

  if (!includeSuperseded) {
    pipeline.push({ $match: currentlyValidFilter });
  }

  pipeline.push({ $limit: limit });
  return pipeline;
};
