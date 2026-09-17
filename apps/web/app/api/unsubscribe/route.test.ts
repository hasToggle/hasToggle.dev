import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { NextRequest } from "next/server";
import { unsubscribeSignature } from "@/lib/unsubscribe-link";
import { GET, POST } from "./route";

const SECRET = "test-unsubscribe-secret-that-is-long-enough";
const ID = "sub-1";
const SIG = unsubscribeSignature(ID, SECRET);

const findOne = spyOn(database.subscriber, "findOne");
const deleteMany = spyOn(database.subscriber, "deleteMany");
const removeContact = spyOn(resend.contacts, "remove");

afterEach(() => {
  findOne.mockReset();
  deleteMany.mockReset();
  removeContact.mockReset();
});

function arm(row: { _id: string; email: string } | null) {
  findOne.mockResolvedValue(row as never);
  deleteMany.mockResolvedValue({ deletedCount: row ? 1 : 0 } as never);
  removeContact.mockResolvedValue({ data: null, error: null } as never);
}

function link(id = ID, sig = SIG) {
  return `http://localhost:3001/api/unsubscribe?id=${id}&sig=${sig}`;
}

function formPost(url: string, fields: Record<string, string>) {
  return POST(
    new NextRequest(url, {
      body: new URLSearchParams(fields).toString(),
      headers: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
    })
  );
}

describe("/api/unsubscribe", () => {
  test("a browser on the link is sent to the page, nothing deleted", async () => {
    arm({ _id: ID, email: "leaving@example.com" });
    const response = await GET(new NextRequest(link()));
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe(
      `http://localhost:3001/unsubscribe?id=${ID}&sig=${SIG}`
    );
    expect(deleteMany).not.toHaveBeenCalled();
  });

  test("refuses a link whose signature does not match", async () => {
    arm({ _id: ID, email: "leaving@example.com" });
    expect((await GET(new NextRequest(link(ID, "nope")))).status).toBe(400);
    expect((await formPost(link("sub-2", SIG), {})).status).toBe(400);
    expect(
      (await formPost("http://localhost:3001/api/unsubscribe", {})).status
    ).toBe(400);
    expect(deleteMany).not.toHaveBeenCalled();
  });

  test("the page's button removes the address and lands on the done page", async () => {
    arm({ _id: ID, email: "leaving@example.com" });
    const response = await formPost("http://localhost:3001/api/unsubscribe", {
      id: ID,
      sig: SIG,
    });
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/unsubscribe/done");
    expect(response.headers.get("Set-Cookie")).toContain("unsubscribed=1");
    expect(deleteMany.mock.calls[0]?.[0]).toEqual({
      email: "leaving@example.com",
    });
    expect(removeContact.mock.calls[0]?.[0]).toEqual({
      email: "leaving@example.com",
    });
  });

  test("a mail client's one-click request is answered in place", async () => {
    arm({ _id: ID, email: "leaving@example.com" });
    const response = await formPost(link(), {
      "List-Unsubscribe": "One-Click",
    });
    expect(response.status).toBe(200);
    expect(deleteMany).toHaveBeenCalledTimes(1);
  });

  test("an address already gone is still a success", async () => {
    arm(null);
    const response = await formPost(link(), {});
    expect(response.status).toBe(303);
    expect(deleteMany).not.toHaveBeenCalled();
  });

  test("a refused removal is a 500, not a silent success", async () => {
    arm({ _id: ID, email: "leaving@example.com" });
    removeContact.mockResolvedValue({
      data: null,
      error: { message: "slow down", name: "rate_limit_exceeded" },
    } as never);
    expect((await formPost(link(), {})).status).toBe(500);
  });
});
