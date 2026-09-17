import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { NextRequest } from "next/server";
import { generateTokenHash } from "@/lib/token";
import { GET } from "./route";

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
    email: "eric@example.com",
    emailVerified: null,
    image: null,
    name: null,
    role: "user",
    token: generateTokenHash(TOKEN),
    tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
    ...overrides,
  };
}

function get(existing: ReturnType<typeof subscriber> | null, token = TOKEN) {
  findOne.mockResolvedValue(existing as never);
  updateOne.mockResolvedValue({} as never);
  createContact.mockResolvedValue({
    data: { id: "contact-id" },
    error: null,
  } as never);
  return GET(
    new NextRequest(`http://localhost:3001/api/confirmed?token=${token}`)
  );
}

describe("/api/confirmed", () => {
  test("confirms a live link and lands on the confirmed page", async () => {
    const response = await get(subscriber({}));
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/confirmed");
    expect(updateOne).toHaveBeenCalledTimes(1);
  });

  test("hands the confirmed page a short-lived ticket", async () => {
    const response = await get(subscriber({}));
    const cookie = response.headers.get("Set-Cookie") ?? "";
    expect(cookie).toContain("confirmed=1");
    expect(cookie).toContain("Path=/confirmed");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Max-Age=300");
  });

  test("lands a second click of a used link on the confirmed page", async () => {
    const response = await get(
      subscriber({ emailVerified: new Date(), tokenExpiresAt: null })
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/confirmed");
    expect(updateOne).not.toHaveBeenCalled();
    expect(createContact).not.toHaveBeenCalled();
  });

  test("rejects an expired link that was never confirmed", async () => {
    const response = await get(
      subscriber({ tokenExpiresAt: new Date(Date.now() - 1000) })
    );
    expect(response.status).toBe(400);
  });

  test("rejects an unknown token", async () => {
    const response = await get(null);
    expect(response.status).toBe(400);
  });
});
