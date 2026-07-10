import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { MongoClient, ObjectId } from "mongodb";
import { ensureIndexes, getCollections } from "../collections";

const uri = process.env.MONGODB_TEST_URI;
const DUPLICATE_KEY_REGEX = /duplicate key/;

describe.skipIf(!uri)("collections", () => {
  const client = new MongoClient(uri ?? "mongodb://localhost:27017");
  const db = client.db("knowledge_test_collections");

  beforeAll(async () => {
    await client.connect();
    await db.dropDatabase();
    await ensureIndexes(db);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await client.close();
  });

  test("ensureIndexes is idempotent", async () => {
    await ensureIndexes(db); // second run must not throw
    const indexes = await getCollections(db).facts.indexes();
    const names = indexes.map((index) => index.name);
    expect(names).toContain("tenant_org_anchor");
    expect(names).toContain("tenant_person_anchor");
  });

  test("round-trips a typed fact document", async () => {
    const { facts } = getCollections(db);
    const orgId = new ObjectId();
    const { insertedId } = await facts.insertOne({
      _id: new ObjectId(),
      anchors: { organizationId: orgId },
      category: "preference",
      confidence: 0.9,
      confirmedBy: "user_ceo1",
      createdAt: new Date(),
      sourceId: new ObjectId(),
      tenantId: "test-tenant",
      text: "Bevorzugt Präsenz-Workshops.",
      updatedAt: new Date(),
    });
    const found = await facts.findOne({ _id: insertedId });
    expect(found?.anchors.organizationId?.equals(orgId)).toBe(true);
  });

  test("rejects duplicate gmailMessageId per tenant", async () => {
    const { sources } = getCollections(db);
    const emailSource = {
      capturedBy: "user_ceo1",
      createdAt: new Date(),
      email: {
        forwardedBy: "ceo1@seminarco.de",
        gmailMessageId: "dup-123",
        originalSender: "a@b.de",
        sentAt: new Date(),
        subject: "S",
      },
      status: "received" as const,
      tenantId: "test-tenant",
      type: "email" as const,
      updatedAt: new Date(),
    };
    await sources.insertOne({ ...emailSource, _id: new ObjectId() });
    await expect(
      sources.insertOne({ ...emailSource, _id: new ObjectId() })
    ).rejects.toThrow(DUPLICATE_KEY_REGEX);
  });
});
