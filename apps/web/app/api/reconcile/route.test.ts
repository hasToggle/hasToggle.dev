import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { NextRequest } from "next/server";
import { orphansLookWrong, POST } from "./route";

const SECRET = "test-reconcile-secret-that-is-long-enough";

const list = spyOn(resend.contacts, "list");
const removeContact = spyOn(resend.contacts, "remove");
const find = spyOn(database.subscriber, "find");
const deleteMany = spyOn(database.subscriber, "deleteMany");

afterEach(() => {
  for (const spy of [list, removeContact, find, deleteMany]) {
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

describe("orphansLookWrong", () => {
  test("refuses an empty listing while subscribers exist", () => {
    expect(orphansLookWrong(40, 0, 40)).toBe(true);
  });

  test("allows a handful of departures on a small list", () => {
    expect(orphansLookWrong(6, 1, 5)).toBe(false);
    expect(orphansLookWrong(6, 1, 6)).toBe(true);
  });

  test("refuses losing more than half of a large list at once", () => {
    expect(orphansLookWrong(1000, 400, 500)).toBe(false);
    expect(orphansLookWrong(1000, 400, 501)).toBe(true);
  });

  test("an empty database has nothing to protect", () => {
    expect(orphansLookWrong(0, 0, 0)).toBe(false);
  });
});

describe("/api/reconcile", () => {
  test("refuses to delete anyone when Resend lists no contacts", async () => {
    list.mockResolvedValue({
      data: { data: [], has_more: false, object: "list" },
      error: null,
    } as never);
    find.mockReturnValue({
      toArray: () =>
        Promise.resolve([
          { email: "one@example.com" },
          { email: "two@example.com" },
        ]),
    } as never);

    const response = await post(`Bearer ${SECRET}`);

    expect(response.status).toBe(409);
    expect(deleteMany).not.toHaveBeenCalled();
  });

  test("rejects a missing or wrong bearer token", async () => {
    expect((await post()).status).toBe(401);
    expect((await post("Bearer nope")).status).toBe(401);
    expect(list).not.toHaveBeenCalled();
  });

  test("matches a legacy mixed-case row to its lowercase contact", async () => {
    list.mockResolvedValue({
      data: {
        data: [{ email: "legacy@example.com", id: "c1", unsubscribed: false }],
        has_more: false,
        object: "list",
      },
      error: null,
    } as never);
    removeContact.mockResolvedValue({ data: null, error: null } as never);
    find.mockReturnValue({
      toArray: () => Promise.resolve([{ email: "Legacy@Example.com" }]),
    } as never);
    deleteMany.mockResolvedValue({ deletedCount: 0 } as never);

    const response = await post(`Bearer ${SECRET}`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.removed.orphaned).toBe(0);
    expect(removeContact).not.toHaveBeenCalled();
  });

  test("reports a refused removal instead of counting it as done", async () => {
    list.mockResolvedValue({
      data: {
        data: [{ email: "flagged@example.com", id: "c1", unsubscribed: true }],
        has_more: false,
        object: "list",
      },
      error: null,
    } as never);
    removeContact.mockResolvedValue({
      data: null,
      error: {
        message: "slow down",
        name: "rate_limit_exceeded",
        statusCode: 429,
      },
    } as never);
    find.mockReturnValue({
      toArray: () => Promise.resolve([{ email: "flagged@example.com" }]),
    } as never);
    deleteMany.mockResolvedValue({ deletedCount: 1 } as never);

    const response = await post(`Bearer ${SECRET}`);

    expect(response.status).toBe(500);
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
    // Per-address erasures answer 1; the stale-unconfirmed sweep answers 2.
    deleteMany.mockImplementation(((filter: { email?: string }) =>
      Promise.resolve({ deletedCount: filter.email ? 1 : 2 })) as never);

    const response = await post(`Bearer ${SECRET}`);
    const body = await response.json();

    expect(response.status).toBe(200);
    const erased = deleteMany.mock.calls
      .map(([f]) => (f as { email?: string }).email)
      .filter(Boolean)
      .sort();
    expect(erased).toEqual(["flagged@example.com", "orphan@example.com"]);
    expect(body.removed).toEqual({
      orphaned: 1,
      unconfirmed: 2,
      unsubscribed: 1,
    });
  });
});
