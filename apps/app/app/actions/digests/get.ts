"use server";

import { database, ObjectId } from "@repo/database";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function getPublishedDigests() {
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);

  const digests = await database.digest
    .find({
      status: "sent",
      sentAt: { $lte: sevenDaysAgo },
    })
    .sort({ sentAt: -1 })
    .toArray();

  return digests.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    misconception: d.misconception,
    series: d.series,
    sentAt: d.sentAt,
  }));
}

export async function getDigestById(id: string) {
  const digest = await database.digest.findOne({
    _id: new ObjectId(id),
  });

  if (!digest) {
    return null;
  }

  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);
  if (!digest.sentAt || digest.sentAt > sevenDaysAgo) {
    return null;
  }

  return {
    id: digest._id.toString(),
    title: digest.title,
    misconception: digest.misconception,
    content: digest.content,
    series: digest.series,
    sentAt: digest.sentAt,
  };
}
