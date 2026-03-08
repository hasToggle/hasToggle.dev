import "server-only";

import { MongoClient } from "mongodb";
import { keys } from "./keys";
import type { Digest, Subscriber } from "./types";

const globalForMongo = global as unknown as { mongo: MongoClient };

const client = globalForMongo.mongo || new MongoClient(keys().MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongo = client;
}

const db = client.db();

export const database = {
  subscriber: db.collection<Subscriber>("subscribers"),
  digest: db.collection<Digest>("digests"),
  client,
};

// biome-ignore lint/performance/noBarrelFile: Package API re-export pattern for clean import surface
export { createId } from "@paralleldrive/cuid2";
export * from "./types";
