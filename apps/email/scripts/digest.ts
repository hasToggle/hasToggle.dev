import type { Digest } from "@repo/database/types";
import { renderDigestBroadcast } from "@repo/email/broadcast";
import { MongoClient, ObjectId } from "mongodb";

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
const db = client.db();
const digests = db.collection<Digest>("digests");

const [, , command, ...args] = process.argv;

async function handleCreate() {
  const title = args[0] || "Untitled Draft";
  const result = await digests.insertOne({
    _id: new ObjectId(),
    broadcastId: null,
    content: "",
    createdAt: new Date(),
    misconception: "",
    scheduledFor: null,
    sentAt: null,
    status: "draft",
    title,
    updatedAt: new Date(),
  });
  console.log(`Created digest: ${result.insertedId}`);
}

function parseUpdateFlags(): Record<string, unknown> {
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    switch (flag) {
      case "--title":
        updates.title = value;
        break;
      case "--misconception":
        updates.misconception = value;
        break;
      case "--content":
        updates.content = value;
        break;
      case "--series-name":
        updates["series.name"] = value;
        break;
      case "--series-part":
        updates["series.part"] = Number.parseInt(value, 10);
        break;
      default:
        break;
    }
  }
  return updates;
}

async function handleUpdate() {
  const [id] = args;
  if (!id) {
    console.error(
      "Usage: bun digest update <id> --title '...' --misconception '...' --content '...' --series-name '...' --series-part N"
    );
    process.exit(1);
  }

  const updates = parseUpdateFlags();
  await digests.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log(`Updated digest: ${id}`);
}

async function handleSchedule() {
  const [id, dateStr] = args;
  if (!id) {
    console.error("Usage: bun digest schedule <id> [YYYY-MM-DDTHH:mm]");
    process.exit(1);
  }

  const scheduledFor = dateStr ? new Date(dateStr) : getNextMonday();
  await digests.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        scheduledFor,
        status: "scheduled",
        updatedAt: new Date(),
      },
    }
  );
  console.log(`Scheduled digest ${id} for ${scheduledFor.toISOString()}`);
}

async function handleList() {
  const allDigests = await digests.find({}).sort({ createdAt: -1 }).toArray();

  if (allDigests.length === 0) {
    console.log("No digests found.");
    return;
  }

  for (const d of allDigests) {
    const series = d.series ? ` [${d.series.name} #${d.series.part}]` : "";
    const scheduled = d.scheduledFor
      ? ` → ${d.scheduledFor.toISOString().split("T")[0]}`
      : "";
    console.log(
      `${d._id} | ${d.status.padEnd(9)} | ${d.title}${series}${scheduled}`
    );
  }
}

async function handleSend() {
  const [id] = args;
  if (!id) {
    console.error("Usage: bun digest send <id>");
    process.exit(1);
  }

  const digest = await digests.findOne({ _id: new ObjectId(id) });
  if (!digest) {
    console.error(`Digest ${id} not found`);
    process.exit(1);
  }

  if (digest.status === "sent" || digest.broadcastId) {
    console.error(
      `Digest ${id} already went out as broadcast ${digest.broadcastId}`
    );
    process.exit(1);
  }

  const { RESEND_FROM, RESEND_SEGMENT_ID, RESEND_TOKEN } = process.env;
  if (!(RESEND_FROM && RESEND_SEGMENT_ID && RESEND_TOKEN)) {
    console.error(
      "RESEND_FROM, RESEND_SEGMENT_ID and RESEND_TOKEN are required"
    );
    process.exit(1);
  }

  const { Resend } = await import("resend");
  const resend = new Resend(RESEND_TOKEN);

  // A broadcast, not a batch: Resend fans out to the segment, skips
  // unsubscribed and suppressed contacts, paces the send, and substitutes
  // each recipient's unsubscribe link for the placeholder in the HTML.
  const { html, name, subject } = await renderDigestBroadcast(digest);

  // A schedule set in the future is honoured; a past one sends now.
  const scheduledAt =
    digest.status === "scheduled" &&
    digest.scheduledFor &&
    digest.scheduledFor.getTime() > Date.now()
      ? digest.scheduledFor.toISOString()
      : undefined;

  const { data, error } = await resend.broadcasts.create({
    from: RESEND_FROM,
    html,
    name,
    scheduledAt,
    segmentId: RESEND_SEGMENT_ID,
    send: true,
    subject,
  });

  if (error) {
    console.error("Failed to send:", error);
    process.exit(1);
  }

  await digests.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: scheduledAt
        ? { broadcastId: data.id, updatedAt: new Date() }
        : {
            broadcastId: data.id,
            sentAt: new Date(),
            status: "sent",
            updatedAt: new Date(),
          },
    }
  );

  console.log(
    scheduledAt
      ? `Scheduled broadcast ${data.id} for ${scheduledAt}`
      : `Sent broadcast ${data.id}`
  );
}

function printHelp() {
  console.log("Usage: bun digest <create|update|schedule|list|send>");
  console.log("");
  console.log("Commands:");
  console.log("  create [title]                    Create a draft digest");
  console.log("  update <id> --title '...' ...     Update digest fields");
  console.log("  schedule <id> [datetime]          Schedule for sending");
  console.log("  list                              List all digests");
  console.log("  send <id>                         Send as a Resend broadcast");
}

async function main() {
  try {
    await client.connect();

    switch (command) {
      case "create":
        await handleCreate();
        break;
      case "update":
        await handleUpdate();
        break;
      case "schedule":
        await handleSchedule();
        break;
      case "list":
        await handleList();
        break;
      case "send":
        await handleSend();
        break;
      default:
        printHelp();
    }
  } finally {
    await client.close();
  }
}

function getNextMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0);
  return nextMonday;
}

main();
