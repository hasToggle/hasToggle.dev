// One-time / idempotent setup against the real Atlas cluster:
//   KNOWLEDGE_MONGODB_URI=... bun scripts/setup-indexes.ts
// Creates regular indexes everywhere; the Atlas Search index requires an
// Atlas cluster (M0+) and fails on plain mongod — that error is surfaced.
import { MongoClient } from "mongodb";
import { ensureIndexes } from "../collections";
import { FACTS_SEARCH_INDEX_NAME, factsSearchIndexDefinition } from "../search";

(async () => {
  const uri = process.env.KNOWLEDGE_MONGODB_URI;
  if (!uri) {
    console.error("KNOWLEDGE_MONGODB_URI is required");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  const db = client.db(process.env.KNOWLEDGE_MONGODB_DB ?? "knowledge");

  await ensureIndexes(db);
  console.log("Regular indexes ensured.");

  const existing = await db
    .collection("facts")
    .listSearchIndexes()
    .toArray()
    .catch(() => []);

  if (existing.some((index) => index.name === FACTS_SEARCH_INDEX_NAME)) {
    console.log(`Search index "${FACTS_SEARCH_INDEX_NAME}" already exists.`);
  } else {
    await db.collection("facts").createSearchIndex({
      definition: factsSearchIndexDefinition,
      name: FACTS_SEARCH_INDEX_NAME,
    });
    console.log(
      `Search index "${FACTS_SEARCH_INDEX_NAME}" created (builds async).`
    );
  }

  await client.close();
})();
