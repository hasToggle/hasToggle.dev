import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { NextRequest } from "next/server";
import { POST } from "./route";

const SECRET = "test-reconcile-secret-that-is-long-enough";

const list = spyOn(resend.contacts, "list");
const removeContact = spyOn(resend.contacts, "remove");
const find = spyOn(database.subscriber, "find");
const deleteOne = spyOn(database.subscriber, "deleteOne");
const deleteMany = spyOn(database.subscriber, "deleteMany");

afterEach(() => {
  for (const spy of [list, removeContact, find, deleteOne, deleteMany]) {
    spy.mockReset();
  }
});

function post(authorization?: string) {
  return POST(
    new NextRequest("http://localhost:3001/api/reconcile", {
      headers: authorization ? { authorization } : {},
      method: "POST",
    })
  );
}

describe("/api/reconcile", () => {
  test("rejects a missing or wrong bearer token", async () => {
    expect((await post()).status).toBe(401);
    expect((await post("Bearer nope")).status).toBe(401);
    expect(list).not.toHaveBeenCalled();
  });

  test("removes flagged, orphaned and stale unconfirmed subscribers", async () => {
    list.mockResolvedValue({
      data: {
        data: [
          { email: "stays@example.com", id: "c1", unsubscribed: false },
          { email: "flagged@example.com", id: "c2", unsubscribed: true },
        ],
        has_more: false,
        object: "list",
      },
      error: null,
    } as never);
    removeContact.mockResolvedValue({ data: null, error: null } as never);
    find.mockReturnValue({
      toArray: () =>
        Promise.resolve([
          { email: "stays@example.com" },
          { email: "flagged@example.com" },
          { email: "orphan@example.com" },
        ]),
    } as never);
    deleteOne.mockResolvedValue({ deletedCount: 1 } as never);
    deleteMany.mockResolvedValue({ deletedCount: 2 } as never);

    const response = await post(`Bearer ${SECRET}`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(deleteOne.mock.calls.map(([f]) => f?.email).sort()).toEqual([
      "flagged@example.com",
      "orphan@example.com",
    ]);
    expect(body.removed).toEqual({
      orphaned: 1,
      unconfirmed: 2,
      unsubscribed: 1,
    });
  });
});
