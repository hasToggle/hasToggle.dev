import { database } from "@repo/database";

export const GET = async () => {
  await database.client.db().command({ ping: 1 });

  return new Response("OK", { status: 200 });
};
