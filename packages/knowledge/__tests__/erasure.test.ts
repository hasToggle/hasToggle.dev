import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { MongoClient, ObjectId } from "mongodb";
import { ensureIndexes, getCollections } from "../collections";
import { erasePerson } from "../erasure";

const uri = process.env.MONGODB_TEST_URI;
const TENANT = "test-tenant";
const now = () => ({ createdAt: new Date(), updatedAt: new Date() });
const annaIdentifiersPattern = /Anna Schmidt|anna@mueller\.de/i;
const annaNamePattern = /Anna Schmidt/i;

describe.skipIf(!uri)("erasePerson", () => {
  const client = new MongoClient(uri ?? "mongodb://localhost:27017");
  const db = client.db("knowledge_test_erasure");
  const personId = new ObjectId();
  const orgId = new ObjectId();
  const voiceSourceId = new ObjectId(); // only person-facts → becomes orphaned
  const mixedSourceId = new ObjectId(); // person + org facts → redacted only

  beforeAll(async () => {
    await client.connect();
    await db.dropDatabase();
    await ensureIndexes(db);
    const { organizations, people, sources, facts, proposals } =
      getCollections(db);

    await organizations.insertOne({
      _id: orgId,
      domains: [],
      name: "Müller GmbH",
      status: "active",
      tenantId: TENANT,
      ...now(),
    });
    await people.insertOne({
      _id: personId,
      emails: ["anna@mueller.de"],
      name: "Anna Schmidt",
      organizationId: orgId,
      tenantId: TENANT,
      ...now(),
    });
    await sources.insertOne({
      _id: voiceSourceId,
      audio: {
        blobUrl: "https://blob.example/voice1.m4a",
        contentType: "audio/mp4",
      },
      capturedBy: "user_ceo1",
      content: "Anna Schmidt sagte, das Budget kommt von anna@mueller.de.",
      status: "reviewed",
      tenantId: TENANT,
      type: "voice",
      ...now(),
    });
    await sources.insertOne({
      _id: mixedSourceId,
      capturedBy: "user_ceo2",
      content: "Anna Schmidt und die Geschäftsführung planen das Q3-Programm.",
      email: {
        forwardedBy: "ceo@seminarco.de",
        gmailMessageId: "msg-1",
        originalSender: "anna@mueller.de",
        sentAt: new Date(),
        subject: "Q3 mit Anna Schmidt",
      },
      status: "reviewed",
      tenantId: TENANT,
      type: "email",
      ...now(),
    });
    await facts.insertMany([
      {
        _id: new ObjectId(),
        anchors: { personId },
        category: "preference",
        confidence: 0.9,
        confirmedBy: "user_ceo1",
        sourceId: voiceSourceId,
        tenantId: TENANT,
        text: "Anna bevorzugt Workshops.",
        ...now(),
      },
      {
        _id: new ObjectId(),
        anchors: { organizationId: orgId, personId },
        category: "decision-process",
        confidence: 0.8,
        confirmedBy: "user_ceo1",
        sourceId: mixedSourceId,
        tenantId: TENANT,
        text: "Anna entscheidet über Budgets.",
        ...now(),
      },
      {
        _id: new ObjectId(),
        anchors: { organizationId: orgId },
        category: "background",
        confidence: 0.9,
        confirmedBy: "user_ceo2",
        sourceId: mixedSourceId,
        tenantId: TENANT,
        text: "Firma plant Q3-Programm.",
        ...now(),
      },
    ]);
    await proposals.insertOne({
      _id: new ObjectId(),
      entityDrafts: [],
      factDrafts: [
        {
          anchors: { personId },
          category: "relationship",
          confidence: 0.7,
          resolution: { status: "pending" },
          text: "Anna wechselt die Rolle.",
        },
      ],
      kind: "ingestion",
      status: "open",
      tenantId: TENANT,
      ...now(),
    });
  });

  afterAll(async () => {
    await db.dropDatabase();
    await client.close();
  });

  test("cascades: facts deleted, sources redacted, person gone, drafts discarded", async () => {
    const report = await erasePerson(db, TENANT, personId);
    expect(report.personDeleted).toBe(true);
    expect(report.factsDeleted).toBe(2);
    expect(report.sourcesRedacted).toBe(2);
    expect(report.redactionSkipped).toBe(false);
    expect(report.orphanedAudioBlobUrls).toEqual([
      "https://blob.example/voice1.m4a",
    ]);

    const { people, facts, sources, proposals } = getCollections(db);
    expect(await people.findOne({ _id: personId })).toBeNull();

    // org-only fact survives
    expect(await facts.countDocuments({ tenantId: TENANT })).toBe(1);

    // no identifier remains in any source text field
    const voice = await sources.findOne({ _id: voiceSourceId });
    expect(voice?.content).not.toMatch(annaIdentifiersPattern);
    expect(voice?.content).toContain("[REDACTED]");
    const mixed = await sources.findOne({ _id: mixedSourceId });
    expect(mixed?.email?.subject).not.toMatch(annaNamePattern);
    expect(mixed?.email?.originalSender).toBe("[REDACTED]");

    // pending draft about the person is discarded
    const proposal = await proposals.findOne({ tenantId: TENANT });
    expect(proposal?.factDrafts[0]?.resolution.status).toBe("discarded");
  });

  test("is a no-op for an unknown person", async () => {
    const report = await erasePerson(db, TENANT, new ObjectId());
    expect(report.personDeleted).toBe(false);
    expect(report.factsDeleted).toBe(0);
    expect(report.redactionSkipped).toBe(false);
  });

  test("skips redaction when the person has no usable identifiers", async () => {
    const { people, sources } = getCollections(db);
    const shortPersonId = new ObjectId();
    await people.insertOne({
      _id: shortPersonId,
      emails: [],
      name: "Al",
      tenantId: TENANT,
      ...now(),
    });

    const before = await sources.findOne({ _id: mixedSourceId });
    const report = await erasePerson(db, TENANT, shortPersonId);
    expect(report.personDeleted).toBe(true);
    expect(report.sourcesRedacted).toBe(0);
    expect(report.redactionSkipped).toBe(true);

    const after = await sources.findOne({ _id: mixedSourceId });
    expect(after?.content).toBe(before?.content);
    expect(after?.email?.originalSender).toBe(before?.email?.originalSender);
  });
});
