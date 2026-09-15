import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { NextRequest } from "next/server";
import { POST } from "./route";

// The preload mocks @repo/database and @repo/email once for every test file;
// spying on those shared objects keeps this file's behaviour from leaking.
const verify = spyOn(resend.webhooks, "verify");
const deleteMany = spyOn(database.subscriber, "deleteMany");
const removeContact = spyOn(resend.contacts, "remove");

afterEach(() => {
  verify.mockReset();
  deleteMany.mockReset();
  removeContact.mockReset();
});

function deletedEmails() {
  return deleteMany.mock.calls.map(([filter]) => filter?.email);
}

function post(event?: unknown) {
  if (event) {
    verify.mockReturnValue(event as never);
  } else {
    verify.mockImplementation(() => {
      throw new Error("Invalid signature");
    });
  }
  deleteMany.mockResolvedValue({ deletedCount: 1 } as never);
  removeContact.mockResolvedValue({
    data: null,
    error: { message: "", name: "not_found", statusCode: 404 },
  } as never);
  return POST(
    new NextRequest("http://localhost:3001/api/webhooks/resend", {
      body: "{}",
      headers: {
        "svix-id": "msg_1",
        "svix-signature": "v1,sig",
        "svix-timestamp": "1",
      },
      method: "POST",
    })
  );
}

describe("/api/webhooks/resend", () => {
  test("rejects a payload that fails verification", async () => {
    const response = await post();
    expect(response.status).toBe(400);
    expect(deletedEmails()).toEqual([]);
  });

  test("deletes a contact Resend has flagged unsubscribed", async () => {
    const response = await post({
      data: { email: "left@example.com", unsubscribed: true },
      type: "contact.updated",
    });
    expect(response.status).toBe(200);
    expect(deletedEmails()).toEqual(["left@example.com"]);
    expect(removeContact.mock.calls[0]?.[0]).toEqual({
      email: "left@example.com",
    });
  });

  test("ignores a contact update that is not an unsubscribe", async () => {
    await post({
      data: { email: "stays@example.com", unsubscribed: false },
      type: "contact.updated",
    });
    expect(deletedEmails()).toEqual([]);
  });

  test("deletes on a permanent bounce but not a transient one", async () => {
    await post({
      data: { bounce: { type: "Transient" }, to: ["soft@example.com"] },
      type: "email.bounced",
    });
    expect(deletedEmails()).toEqual([]);

    await post({
      data: { bounce: { type: "Permanent" }, to: ["hard@example.com"] },
      type: "email.bounced",
    });
    expect(deletedEmails()).toEqual(["hard@example.com"]);
  });

  test("deletes on a spam complaint", async () => {
    await post({
      data: { to: ["complained@example.com"] },
      type: "email.complained",
    });
    expect(deletedEmails()).toEqual(["complained@example.com"]);
  });
});
