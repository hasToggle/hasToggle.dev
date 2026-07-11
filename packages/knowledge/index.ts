// biome-ignore-all lint/performance/noBarrelFile: Package API re-export pattern for clean import surface

export { getKnowledgeDb } from "./client";
export type { KnowledgeCollections } from "./collections";
export { ensureIndexes, getCollections } from "./collections";
export type { ErasureReport } from "./erasure";
export { erasePerson } from "./erasure";
export { keys } from "./keys";
export type { Engagement, Organization, Person } from "./schemas/entities";
export {
  engagementSchema,
  engagementStatusValues,
  organizationSchema,
  organizationStatusValues,
  personSchema,
} from "./schemas/entities";
export type { Fact, FactAnchors, FactCategory } from "./schemas/facts";
export {
  factAnchorsSchema,
  factCategoryValues,
  factSchema,
} from "./schemas/facts";
export type { EntityDraft, FactDraft, Proposal } from "./schemas/proposals";
export {
  entityDraftSchema,
  factDraftSchema,
  proposalSchema,
} from "./schemas/proposals";
export type { Source } from "./schemas/sources";
export { sourceSchema, sourceStatusValues } from "./schemas/sources";
export type { FactsSearchOptions } from "./search";
export {
  buildFactsSearchPipeline,
  FACTS_SEARCH_INDEX_NAME,
  factsSearchIndexDefinition,
} from "./search";
