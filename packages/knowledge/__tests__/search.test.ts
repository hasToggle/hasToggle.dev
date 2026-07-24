import { describe, expect, test } from "bun:test";
import {
  buildFactsSearchPipeline,
  FACTS_SEARCH_INDEX_NAME,
  factsSearchIndexDefinition,
} from "../search";

describe("factsSearchIndexDefinition", () => {
  test("maps exactly the fields the pipeline filters on", () => {
    expect(factsSearchIndexDefinition.mappings.fields).toHaveProperty("text");
    expect(factsSearchIndexDefinition.mappings.fields.tenantId.type).toBe(
      "token"
    );
    expect(factsSearchIndexDefinition.mappings.fields.category.type).toBe(
      "token"
    );
    expect(factsSearchIndexDefinition.mappings.dynamic).toBe(false);
  });
});

describe("buildFactsSearchPipeline", () => {
  test("always filters by tenant and excludes superseded facts by default", () => {
    const pipeline = buildFactsSearchPipeline({
      query: "Workshop Präferenz",
      tenantId: "test-tenant",
    });
    const search = pipeline[0]?.$search;
    expect(search.index).toBe(FACTS_SEARCH_INDEX_NAME);
    expect(search.compound.filter).toContainEqual({
      equals: { path: "tenantId", value: "test-tenant" },
    });
    expect(pipeline).toContainEqual({
      $match: { supersededBy: null, validUntil: null },
    });
    expect(pipeline.at(-1)).toEqual({ $limit: 20 });
  });

  test("adds category filter and respects includeSuperseded + limit", () => {
    const pipeline = buildFactsSearchPipeline({
      category: "decision-process",
      includeSuperseded: true,
      limit: 5,
      query: "Budget",
      tenantId: "test-tenant",
    });
    expect(pipeline[0]?.$search.compound.filter).toContainEqual({
      equals: { path: "category", value: "decision-process" },
    });
    expect(
      pipeline.some(
        (stage) => "$match" in stage && stage.$match.supersededBy === null
      )
    ).toBe(false);
    expect(pipeline.at(-1)).toEqual({ $limit: 5 });
  });
});
