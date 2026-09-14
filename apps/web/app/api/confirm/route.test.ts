import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { NextRequest } from "next/server";
import { POST } from "./route";

const DAY_MS = 1000 * 60 * 60 * 24;
const SUCCESS = "Check your inbox. One click confirms it.";

// The preload mocks @repo/database and @repo/email once for every test file;
// spying on those shared objects keeps this file's behaviour from leaking.
const findOne = spyOn(database.subscriber, "findOne");
const updateOne = spyOn(database.subscriber, "updateOne");
const send = spyOn(resend.emails, "send");
const createContact = spyOn(resend.contacts, "create");

afterEach(() => {
  findOne.mockReset();
  updateOne.mockReset();
  send.mockReset();
  createContact.mockReset();
});

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3001/api/confirm", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

function subscriber(overrides: Record<string, unknown>) {
  return {
    _id: "sub-1",
    createdAt: new Date(),
    email: "eric@example.com",
    emailVerified: null,
    image: null,
    name: null,
    role: "user",
    token: "old-hash",
    tokenExpiresAt: null,
    ...overrides,
  };
}

function post(existing: ReturnType<typeof subscriber> | null, email: string) {
  findOne.mockResolvedValue(existing as never);
  updateOne.mockResolvedValue({} as never);
  send.mockResolvedValue({ data: { id: "email-id" }, error: null } as never);
  createContact.mockResolvedValue({
    data: { id: "contact-id" },
    error: null,
  } as never);
  return POST(makeRequest({ email }));
}

function sentSubjects() {
  return send.mock.calls.map(([payload]) => payload.subject);
}

describe("/api/confirm", () => {
  test("rejects disposable email addresses", async () => {
    const response = await POST(makeRequest({ email: "test@mailinator.com" }));
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error.message).toContain("doesn't look quite right");
  });

  test("rejects invalid email format", async () => {
    const response = await POST(makeRequest({ email: "not-an-email" }));
    expect(response.status).toBe(400);
  });

  test("sends a confirmation to an address it has never seen", async () => {
    const response = await post(null, "new@example.com");
    expect(response.status).toBe(200);
    expect((await response.json()).message).toBe(SUCCESS);
    expect(sentSubjects()).toEqual(["One click and you’re on the waitlist"]);
    expect(send.mock.calls[0]?.[0].to).toEqual(["new@example.com"]);
    expect(updateOne.mock.calls[0]?.[2]).toEqual({ upsert: true });
  });

  test("normalizes the address before looking it up and sending", async () => {
    await post(null, "  New@Example.COM ");
    expect(findOne.mock.calls[0]?.[0]).toEqual({ email: "new@example.com" });
    expect(updateOne.mock.calls[0]?.[0]).toEqual({ email: "new@example.com" });
    expect(send.mock.calls[0]?.[0].to).toEqual(["new@example.com"]);
  });

  test("stays quiet when an unconfirmed address resubmits within the cooldown", async () => {
    const issuedSecondsAgo = 30;
    const response = await post(
      subscriber({
        tokenExpiresAt: new Date(Date.now() + DAY_MS - issuedSecondsAgo * 1000),
      }),
      "eric@example.com"
    );
    expect(response.status).toBe(200);
    expect((await response.json()).message).toBe(SUCCESS);
    expect(send).not.toHaveBeenCalled();
    expect(updateOne).not.toHaveBeenCalled();
  });

  test("resends with a fresh token once the cooldown has passed", async () => {
    const issuedMinutesAgo = 10;
    const response = await post(
      subscriber({
        tokenExpiresAt: new Date(
          Date.now() + DAY_MS - issuedMinutesAgo * 60 * 1000
        ),
      }),
      "eric@example.com"
    );
    expect(response.status).toBe(200);
    expect(sentSubjects()).toEqual(["One click and you’re on the waitlist"]);
    const setFields = updateOne.mock.calls[0]?.[1] as {
      $set: { token: string };
    };
    expect(setFields.$set.token).not.toBe("old-hash");
  });

  test("resends when the earlier link has already expired", async () => {
    await post(
      subscriber({ tokenExpiresAt: new Date(Date.now() - DAY_MS) }),
      "eric@example.com"
    );
    expect(sentSubjects()).toEqual(["One click and you’re on the waitlist"]);
  });

  test("tells a confirmed address it is already on the list", async () => {
    const response = await post(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null }),
      "eric@example.com"
    );
    expect(response.status).toBe(200);
    expect((await response.json()).message).toBe(SUCCESS);
    expect(sentSubjects()).toEqual(["You’re already on the waitlist"]);
    expect(updateOne).not.toHaveBeenCalled();
  });

  test("puts a confirmed address back into the Resend segment", async () => {
    await post(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null }),
      "eric@example.com"
    );
    expect(createContact.mock.calls[0]?.[0] as unknown).toEqual({
      email: "eric@example.com",
      segments: [{ id: "test-segment-id" }],
      unsubscribed: false,
    });
  });
});
