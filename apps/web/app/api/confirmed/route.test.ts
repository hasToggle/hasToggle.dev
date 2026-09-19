import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { NextRequest } from "next/server";
import { generateTokenHash } from "@/lib/token";
import { GET, POST } from "./route";

const findOne = spyOn(database.subscriber, "findOne");
const updateOne = spyOn(database.subscriber, "updateOne");
const createContact = spyOn(resend.contacts, "create");

afterEach(() => {
  findOne.mockReset();
  updateOne.mockReset();
  createContact.mockReset();
});

const TOKEN = "plain-token";

function subscriber(overrides: Record<string, unknown>) {
  return {
    _id: "sub-1",
    createdAt: new Date(),
    email: "user@example.com",
    emailVerified: null,
    image: null,
    name: null,
    role: "user",
    token: generateTokenHash(TOKEN),
    tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
    ...overrides,
  };
}

type Row = ReturnType<typeof subscriber> | null;

function arrange(existing: Row) {
  findOne.mockResolvedValue(existing as never);
  updateOne.mockResolvedValue({} as never);
  createContact.mockResolvedValue({
    data: { id: "contact-id" },
    error: null,
  } as never);
}

function get(existing: Row, token = TOKEN) {
  arrange(existing);
  return GET(
    new NextRequest(`http://localhost:3001/api/confirmed?token=${token}`)
  );
}

function post(existing: Row, token: string | null = TOKEN) {
  arrange(existing);
  const form = new URLSearchParams(token ? { token } : {});
  return POST(
    new NextRequest("https://hastoggle.test/api/confirmed", {
      body: form.toString(),
      headers: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
    })
  );
}

const written = () =>
  (updateOne.mock.calls[0]?.[1] as { $set?: Record<string, unknown> })?.$set ??
  {};

// The link in the mail is a GET, and a GET confirms nobody: mail scanners
// follow links before people do. It hands the token to the page with the
// button; the button's POST is the opt-in.
describe("GET /api/confirmed", () => {
  test("sends a live link on to the button and writes nothing", async () => {
    const response = await get(subscriber({}));
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/confirm");
    expect(updateOne).not.toHaveBeenCalled();
    expect(createContact).not.toHaveBeenCalled();
  });

  test("hands the token over in a cookie, not in the page address", async () => {
    const response = await get(subscriber({}));
    const cookie = response.headers.get("Set-Cookie") ?? "";
    expect(cookie).toContain(`confirming=${TOKEN}`);
    expect(cookie).toContain("Path=/confirm");
    expect(cookie).toContain("HttpOnly");
  });

  test("lands a used link on the confirmed page", async () => {
    const response = await get(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null })
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/confirmed");
    expect(updateOne).not.toHaveBeenCalled();
  });

  test("rejects an expired, unknown or missing token", async () => {
    const expired = subscriber({ tokenExpiresAt: new Date(Date.now() - 1000) });
    expect((await get(expired)).status).toBe(400);
    expect((await get(null)).status).toBe(400);
    expect((await get(subscriber({}), "")).status).toBe(400);
  });
});

describe("POST /api/confirmed", () => {
  test("confirms a live token and lands on the confirmed page", async () => {
    const response = await post(subscriber({}));
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/confirmed");
    expect(updateOne).toHaveBeenCalledTimes(1);
    expect(written().emailVerified).toBeInstanceOf(Date);
    expect(written().contactCreatedAt).toBeInstanceOf(Date);
  });

  test("hands the confirmed page a short-lived, secure ticket", async () => {
    const response = await post(subscriber({}));
    const cookie = response.headers.get("Set-Cookie") ?? "";
    expect(cookie).toContain("confirmed=1");
    expect(cookie).toContain("Path=/confirmed");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Max-Age=300");
    expect(cookie).toContain("Secure");
  });

  // The reconcile run reads this null as a contact it still owes, never
  // as a departure.
  test("still confirms when Resend refuses the contact, and records the debt", async () => {
    arrange(subscriber({}));
    createContact.mockResolvedValue({
      data: null,
      error: { message: "slow down", name: "rate_limit_exceeded" },
    } as never);
    const response = await POST(
      new NextRequest("https://hastoggle.test/api/confirmed", {
        body: `token=${TOKEN}`,
        headers: { "content-type": "application/x-www-form-urlencoded" },
        method: "POST",
      })
    );
    expect(response.status).toBe(303);
    expect(written().emailVerified).toBeInstanceOf(Date);
    expect(written().contactCreatedAt).toBeNull();
  });

  test("a second press writes nothing and never re-creates the contact", async () => {
    const response = await post(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null })
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/confirmed");
    expect(updateOne).not.toHaveBeenCalled();
    expect(createContact).not.toHaveBeenCalled();
  });

  test("rejects an expired, unknown or missing token", async () => {
    const expired = subscriber({ tokenExpiresAt: new Date(Date.now() - 1000) });
    expect((await post(expired)).status).toBe(400);
    expect((await post(null)).status).toBe(400);
    expect((await post(subscriber({}), null)).status).toBe(400);
    expect(updateOne).not.toHaveBeenCalled();
  });

  test("answers 400, not 500, to a body that is not a form", async () => {
    arrange(subscriber({}));
    const response = await POST(
      new NextRequest("https://hastoggle.test/api/confirmed", {
        body: "{",
        headers: { "content-type": "application/json" },
        method: "POST",
      })
    );
    expect(response.status).toBe(400);
  });

  test("answers 500 when the database write fails", async () => {
    arrange(subscriber({}));
    updateOne.mockRejectedValue(new Error("down") as never);
    const response = await POST(
      new NextRequest("https://hastoggle.test/api/confirmed", {
        body: `token=${TOKEN}`,
        headers: { "content-type": "application/x-www-form-urlencoded" },
        method: "POST",
      })
    );
    expect(response.status).toBe(500);
  });
});
