import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
const db = client.db();
const digests = db.collection("digests");

const [, , command, ...args] = process.argv;

async function main() {
  try {
    await client.connect();

    switch (command) {
      case "create": {
        const title = args[0] || "Untitled Draft";
        const result = await digests.insertOne({
          title,
          misconception: "",
          content: "",
          status: "draft",
          sentAt: null,
          scheduledFor: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`Created digest: ${result.insertedId}`);
        break;
      }

      case "update": {
        const id = args[0];
        if (!id) {
          console.error(
            "Usage: bun digest update <id> --title '...' --misconception '...' --content '...' --series-name '...' --series-part N"
          );
          process.exit(1);
        }

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
          }
        }

        await digests.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );
        console.log(`Updated digest: ${id}`);
        break;
      }

      case "schedule": {
        const id = args[0];
        const dateStr = args[1];
        if (!id) {
          console.error(
            "Usage: bun digest schedule <id> [YYYY-MM-DDTHH:mm]"
          );
          process.exit(1);
        }

        const scheduledFor = dateStr ? new Date(dateStr) : getNextMonday();
        await digests.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "scheduled",
              scheduledFor,
              updatedAt: new Date(),
            },
          }
        );
        console.log(
          `Scheduled digest ${id} for ${scheduledFor.toISOString()}`
        );
        break;
      }

      case "list": {
        const allDigests = await digests
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        if (allDigests.length === 0) {
          console.log("No digests found.");
          break;
        }

        for (const d of allDigests) {
          const series = d.series
            ? ` [${d.series.name} #${d.series.part}]`
            : "";
          const scheduled = d.scheduledFor
            ? ` → ${d.scheduledFor.toISOString().split("T")[0]}`
            : "";
          console.log(
            `${d._id} | ${d.status.padEnd(9)} | ${d.title}${series}${scheduled}`
          );
        }
        break;
      }

      case "send": {
        const id = args[0];
        if (!id) {
          console.error("Usage: bun digest send <id>");
          process.exit(1);
        }

        const digest = await digests.findOne({ _id: new ObjectId(id) });
        if (!digest) {
          console.error(`Digest ${id} not found`);
          process.exit(1);
        }

        if (digest.status === "sent") {
          console.error(`Digest ${id} has already been sent`);
          process.exit(1);
        }

        // Import Resend and send to audience
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_TOKEN);

        // Get all verified subscribers
        const subscribers = await db
          .collection("subscribers")
          .find({ emailVerified: { $ne: null } })
          .toArray();

        if (subscribers.length === 0) {
          console.log("No verified subscribers to send to.");
          break;
        }

        console.log(`Sending to ${subscribers.length} subscribers...`);

        // Send emails in batches
        const emails = subscribers.map((s) => s.email);
        const { data, error } = await resend.batch.send(
          emails.map((to) => ({
            from: process.env.RESEND_FROM!,
            to,
            subject: digest.title,
            html: `<h1>${digest.title}</h1><p><em>Misconception: "${digest.misconception}"</em></p><hr/><div>${digest.content}</div>`,
          }))
        );

        if (error) {
          console.error("Failed to send:", error);
          process.exit(1);
        }

        await digests.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "sent",
              sentAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );

        console.log(
          `Sent digest ${id} to ${subscribers.length} subscribers`
        );
        break;
      }

      default:
        console.log("Usage: bun digest <create|update|schedule|list|send>");
        console.log("");
        console.log("Commands:");
        console.log(
          "  create [title]                    Create a draft digest"
        );
        console.log(
          "  update <id> --title '...' ...     Update digest fields"
        );
        console.log(
          "  schedule <id> [datetime]          Schedule for sending"
        );
        console.log(
          "  list                              List all digests"
        );
        console.log(
          "  send <id>                         Send to subscribers"
        );
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
