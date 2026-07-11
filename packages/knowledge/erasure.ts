import type { Db, ObjectId, WithId } from "mongodb";
import { getCollections } from "./collections";
import type { Source } from "./schemas/sources";

const REDACTED = "[REDACTED]";

export interface ErasureReport {
  factsDeleted: number;
  orphanedAudioBlobUrls: string[];
  personDeleted: boolean;
  sourcesRedacted: number;
}

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const erasePerson = async (
  db: Db,
  tenantId: string,
  personId: ObjectId
): Promise<ErasureReport> => {
  const { people, facts, sources, proposals } = getCollections(db);

  const person = await people.findOne({ _id: personId, tenantId });
  if (!person) {
    return {
      factsDeleted: 0,
      orphanedAudioBlobUrls: [],
      personDeleted: false,
      sourcesRedacted: 0,
    };
  }

  // 1. Delete every fact anchored to the person; remember affected sources.
  const personFactFilter = { "anchors.personId": personId, tenantId };
  const affectedSourceIds = await facts.distinct("sourceId", personFactFilter);
  const { deletedCount: factsDeleted } =
    await facts.deleteMany(personFactFilter);

  // 2. Discard pending fact drafts about the person in open proposals.
  await proposals.updateMany(
    { status: "open", tenantId },
    { $set: { "factDrafts.$[draft].resolution.status": "discarded" } },
    { arrayFilters: [{ "draft.anchors.personId": personId }] }
  );

  // 3. Redact the person's identifiers wherever they appear in source text.
  //    Redaction, not deletion: a source may cover other entities too.
  const identifiers = [person.name, ...person.emails].filter(
    (identifier) => identifier.length > 2
  );
  // Guard: an empty identifier list would build the pattern /(?:)/gi, which
  // matches every position in every string — the find below would then match
  // (and redact) every source in the tenant. Skip redaction entirely instead.
  let mentioningSources: WithId<Source>[] = [];
  if (identifiers.length > 0) {
    const pattern = new RegExp(identifiers.map(escapeRegex).join("|"), "gi");
    mentioningSources = await sources
      .find({
        $or: [
          { content: { $regex: pattern } },
          { "email.subject": { $regex: pattern } },
          { "email.originalSender": { $regex: pattern } },
        ],
        tenantId,
      })
      .toArray();

    for (const source of mentioningSources) {
      // biome-ignore lint/performance/noAwaitInLoops: sequential redaction is deliberate — erasure is a rare admin operation over a small set of sources
      await sources.updateOne(
        { _id: source._id, tenantId },
        {
          $set: {
            ...(source.content
              ? { content: source.content.replace(pattern, REDACTED) }
              : {}),
            ...(source.email
              ? {
                  "email.originalSender": pattern.test(
                    source.email.originalSender
                  )
                    ? REDACTED
                    : source.email.originalSender,
                  "email.subject": source.email.subject.replace(
                    pattern,
                    REDACTED
                  ),
                }
              : {}),
            updatedAt: new Date(),
          },
        }
      );
    }
  }

  // 4. Report audio blobs whose source no longer backs any fact — the caller
  //    (app layer) deletes them from Vercel Blob.
  const orphanedAudioBlobUrls: string[] = [];
  for (const sourceId of affectedSourceIds) {
    // biome-ignore lint/performance/noAwaitInLoops: per-source count must run after fact deletion; the affected-source set is small
    const remaining = await facts.countDocuments({ sourceId, tenantId });
    if (remaining === 0) {
      const source = await sources.findOne({ _id: sourceId, tenantId });
      if (source?.audio) {
        orphanedAudioBlobUrls.push(source.audio.blobUrl);
      }
    }
  }

  // 5. Delete the person document itself.
  await people.deleteOne({ _id: personId, tenantId });

  return {
    factsDeleted,
    orphanedAudioBlobUrls,
    personDeleted: true,
    sourcesRedacted: mentioningSources.length,
  };
};
