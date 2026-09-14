import "server-only";

import { MongoClient } from "mongodb";
import { keys } from "./keys";
import type { Digest, Subscriber } from "./types";

const globalForMongo = global as unknown as { mongo: MongoClient };

const client =
  globalForMongo.mongo ||
  new MongoClient(keys().MONGODB_URI, {
    appName: "app-database",
    connectTimeoutMS: 10_000,
    maxIdleTimeMS: 30_000,
    // Every warm serverless instance holds its own pool, and small Atlas tiers
    // cap at 500 connections cluster-wide — keep each instance's share small.
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 60_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongo = client;
}

// The database is the one named in MONGODB_URI's path; `subscribers` and
// `digests` live there.
const db = client.db();

export const database = {
  client,
  digest: db.collection<Digest>("digests"),
  subscriber: db.collection<Subscriber>("subscribers"),
};

// biome-ignore lint/performance/noBarrelFile: Package API re-export pattern for clean import surface
export { createId } from "@paralleldrive/cuid2";
export { ObjectId } from "mongodb";
export * from "./types";
