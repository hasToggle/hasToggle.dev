import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { NextRequest } from "next/server";
import { resetRateLimiters } from "@/lib/rate-limit";
import { POST } from "./route";

const DAY_MS = 1000 * 60 * 60 * 24;
const UNSUBSCRIBE_HEADER =
  /^<http:\/\/localhost:3001\/api\/unsubscribe\?id=[^&]+&sig=[^>]+>$/;
const SUCCESS = "Confirmation email sent. Check your inbox.";

// The preload mocks @repo/database and @repo/email once for every test file;
// spying on those shared objects keeps this file's behaviour from leaking.
const findOne = spyOn(database.subscriber, "findOne");
const updateOne = spyOn(database.subscriber, "updateOne");
const send = spyOn(resend.emails, "send");
const createContact = spyOn(resend.contacts, "create");

afterEach(() => {
  resetRateLimiters();
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

  test("keys the reminder by host, subscriber and day", async () => {
    await post(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null }),
      "eric@example.com"
    );
    const today = new Date().toISOString().slice(0, 10);
    expect(send.mock.calls[0]?.[1]?.idempotencyKey).toBe(
      `already-subscribed/localhost:3001/sub-1/${today}`
    );
  });

  test("treats a burned idempotency key as a reminder already sent", async () => {
    findOne.mockResolvedValue(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null }) as never
    );
    createContact.mockResolvedValue({
      data: { id: "contact-id" },
      error: null,
    } as never);
    send.mockResolvedValue({
      data: null,
      error: {
        message: "Same idempotency key used with a different payload",
        name: "invalid_idempotent_request",
        statusCode: 409,
      },
    } as never);

    const response = await POST(makeRequest({ email: "eric@example.com" }));
    expect(response.status).toBe(200);
    expect((await response.json()).message).toBe(SUCCESS);
  });

  test("still reports a reminder Resend actually refused", async () => {
    findOne.mockResolvedValue(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null }) as never
    );
    createContact.mockResolvedValue({
      data: { id: "contact-id" },
      error: null,
    } as never);
    send.mockResolvedValue({
      data: null,
      error: {
        message: "Too many requests",
        name: "rate_limit_exceeded",
        statusCode: 429,
      },
    } as never);

    const response = await POST(makeRequest({ email: "eric@example.com" }));
    expect(response.status).toBe(500);
  });

  test("both mails carry a signed unsubscribe link and the one-click headers", async () => {
    await post(null, "new@example.com");
    await post(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null }),
      "eric@example.com"
    );
    for (const [payload] of send.mock.calls) {
      const header = payload.headers?.["List-Unsubscribe"] ?? "";
      expect(header).toMatch(UNSUBSCRIBE_HEADER);
      expect(payload.headers?.["List-Unsubscribe-Post"]).toBe(
        "List-Unsubscribe=One-Click"
      );
    }
    expect(send.mock.calls).toHaveLength(2);
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

function postFrom(email: string, ip: string) {
  findOne.mockResolvedValue(null as never);
  updateOne.mockResolvedValue({} as never);
  send.mockResolvedValue({ data: { id: "x" }, error: null } as never);
  return POST(
    new NextRequest("http://localhost:3001/api/confirm", {
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json", "x-real-ip": ip },
      method: "POST",
    })
  );
}

// The window counts requests in order, so these cannot run in parallel.
function postSequence(
  count: number,
  make: (i: number) => Promise<Response>
): Promise<number[]> {
  return Array.from({ length: count }, (_, i) => i).reduce<Promise<number[]>>(
    async (previous, i) => [...(await previous), (await make(i)).status],
    Promise.resolve([])
  );
}

describe("/api/confirm legacy casing", () => {
  const duplicateKey = Object.assign(new Error("E11000 duplicate key"), {
    code: 11_000,
  });

  test("looks the address up under the index collation", async () => {
    await post(null, "Mixed@Example.com");
    expect(findOne.mock.calls[0]?.[1]).toEqual({
      collation: { locale: "en", strength: 2 },
    });
  });

  test("retries a rejected upsert against the legacy row and sends", async () => {
    // The lookup missed, the insert collided: the row appeared in between,
    // and is read back so the mail's unsubscribe link can name it.
    findOne
      .mockResolvedValueOnce(null as never)
      .mockResolvedValueOnce(
        subscriber({ email: "legacy@example.com" }) as never
      );
    updateOne
      .mockRejectedValueOnce(duplicateKey as never)
      .mockResolvedValueOnce({ matchedCount: 1 } as never);
    send.mockResolvedValue({ data: { id: "x" }, error: null } as never);

    const response = await POST(makeRequest({ email: "legacy@example.com" }));

    expect(response.status).toBe(200);
    expect(updateOne).toHaveBeenCalledTimes(2);
    expect(updateOne.mock.calls[1]?.[2]).toEqual({
      collation: { locale: "en", strength: 2 },
    });
    expect(sentSubjects()).toEqual(["One click and you’re on the waitlist"]);
  });

  test("fails rather than mail a token no row holds", async () => {
    findOne.mockResolvedValue(null as never);
    updateOne
      .mockRejectedValueOnce(duplicateKey as never)
      .mockResolvedValueOnce({ matchedCount: 0 } as never);

    const response = await POST(makeRequest({ email: "ghost@example.com" }));

    expect(response.status).toBe(500);
    expect(send).not.toHaveBeenCalled();
  });

  test("lets any other database error through as a 500", async () => {
    findOne.mockResolvedValue(null as never);
    updateOne.mockRejectedValueOnce(new Error("connection reset") as never);

    const response = await POST(makeRequest({ email: "down@example.com" }));

    expect(response.status).toBe(500);
    expect(updateOne).toHaveBeenCalledTimes(1);
  });
});

describe("/api/confirm limits", () => {
  test("refuses a caller that floods the form with fresh addresses", async () => {
    const ip = "198.51.100.7";
    const statuses = await postSequence(12, (i) =>
      postFrom(`flood-${i}@example.com`, ip)
    );
    expect(statuses.at(-1)).toBe(429);
    expect(send.mock.calls.length).toBeLessThan(12);
  });

  test("refuses repeated mail to one address across callers", async () => {
    const statuses = await postSequence(4, (i) =>
      postFrom("target@example.com", `192.0.2.${i}`)
    );
    expect(statuses.at(-1)).toBe(429);
    expect(send.mock.calls.length).toBe(3);
  });

  test("builds the confirmation link on the configured site for a foreign host", async () => {
    findOne.mockResolvedValue(null as never);
    updateOne.mockResolvedValue({} as never);
    send.mockResolvedValue({ data: { id: "x" }, error: null } as never);
    await POST(
      new NextRequest("https://evil.example/api/confirm", {
        body: JSON.stringify({ email: "origin@example.com" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
    );
    const react = send.mock.calls[0]?.[0].react as {
      props: { baseUrl: string };
    };
    expect(react.props.baseUrl).toBe("http://localhost:3001");
  });
});
