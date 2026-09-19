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
const updateOne = spyOn(database.subscriber, "updateOne");
const createContact = spyOn(resend.contacts, "create");

afterEach(() => {
  for (const spy of [
    list,
    removeContact,
    find,
    deleteMany,
    updateOne,
    createContact,
  ]) {
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

  // A confirmation whose contact Resend refused is ours to repair. The
  // person opted in; however long the repair takes, it never turns into
  // a deletion.
  describe("a confirmed subscriber whose contact was never created", () => {
    const listed = {
      data: {
        data: [{ email: "stays@example.com", id: "c1", unsubscribed: false }],
        has_more: false,
        object: "list",
      },
      error: null,
    };
    const rows = [
      { _id: "s1", contactCreatedAt: new Date(0), email: "stays@example.com" },
      { _id: "s2", contactCreatedAt: null, email: "unmirrored@example.com" },
    ];

    test("is given the contact instead of being deleted", async () => {
      list.mockResolvedValue(listed as never);
      find.mockReturnValue({ toArray: () => Promise.resolve(rows) } as never);
      createContact.mockResolvedValue({
        data: { id: "c2" },
        error: null,
      } as never);
      updateOne.mockResolvedValue({} as never);
      deleteMany.mockResolvedValue({ deletedCount: 0 } as never);

      const response = await post(`Bearer ${SECRET}`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(createContact).toHaveBeenCalledTimes(1);
      expect(createContact.mock.calls[0]?.[0]).toMatchObject({
        email: "unmirrored@example.com",
      });
      const [filter, update] = updateOne.mock.calls[0] ?? [];
      expect(filter).toEqual({ _id: "s2" });
      expect(
        (update as { $set: { contactCreatedAt: unknown } }).$set
          .contactCreatedAt
      ).toBeInstanceOf(Date);
      expect(removeContact).not.toHaveBeenCalled();
      expect(body.mirrored).toBe(1);
      expect(body.removed.orphaned).toBe(0);
    });

    test("is kept, unmarked, when Resend refuses again", async () => {
      list.mockResolvedValue(listed as never);
      find.mockReturnValue({ toArray: () => Promise.resolve(rows) } as never);
      createContact.mockResolvedValue({
        data: null,
        error: { message: "slow down", name: "rate_limit_exceeded" },
      } as never);
      deleteMany.mockResolvedValue({ deletedCount: 0 } as never);

      const response = await post(`Bearer ${SECRET}`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(updateOne).not.toHaveBeenCalled();
      expect(removeContact).not.toHaveBeenCalled();
      expect(body.mirrored).toBe(0);
      expect(body.removed.orphaned).toBe(0);
    });

    test("is only marked when the contact turns out to exist", async () => {
      list.mockResolvedValue({
        ...listed,
        data: {
          ...listed.data,
          data: [
            ...listed.data.data,
            { email: "unmirrored@example.com", id: "c2", unsubscribed: false },
          ],
        },
      } as never);
      find.mockReturnValue({ toArray: () => Promise.resolve(rows) } as never);
      updateOne.mockResolvedValue({} as never);
      deleteMany.mockResolvedValue({ deletedCount: 0 } as never);

      await post(`Bearer ${SECRET}`);

      expect(createContact).not.toHaveBeenCalled();
      expect(updateOne).toHaveBeenCalledTimes(1);
    });
  });

  test("leaves a contact created moments ago to the next run", async () => {
    list.mockResolvedValue({
      data: {
        data: [{ email: "stays@example.com", id: "c1", unsubscribed: false }],
        has_more: false,
        object: "list",
      },
      error: null,
    } as never);
    find.mockReturnValue({
      toArray: () =>
        Promise.resolve([
          { _id: "s1", email: "stays@example.com" },
          { _id: "s2", contactCreatedAt: new Date(), email: "new@example.com" },
        ]),
    } as never);
    deleteMany.mockResolvedValue({ deletedCount: 0 } as never);

    const response = await post(`Bearer ${SECRET}`);
    const body = await response.json();

    expect(removeContact).not.toHaveBeenCalled();
    expect(body.removed.orphaned).toBe(0);
  });

  test("reads every page of the listing before calling anyone orphaned", async () => {
    const page = (email: string, id: string, more: boolean) => ({
      data: {
        data: [{ email, id, unsubscribed: false }],
        has_more: more,
        object: "list",
      },
      error: null,
    });
    list
      .mockResolvedValueOnce(page("one@example.com", "c1", true) as never)
      .mockResolvedValueOnce(page("two@example.com", "c2", false) as never);
    find.mockReturnValue({
      toArray: () =>
        Promise.resolve([
          { _id: "s1", email: "one@example.com" },
          { _id: "s2", email: "two@example.com" },
        ]),
    } as never);
    deleteMany.mockResolvedValue({ deletedCount: 0 } as never);

    const response = await post(`Bearer ${SECRET}`);
    const body = await response.json();

    expect(list).toHaveBeenCalledTimes(2);
    expect(list.mock.calls[1]?.[0]).toMatchObject({ after: "c1" });
    expect(body.contacts).toBe(2);
    expect(body.removed.orphaned).toBe(0);
  });

  test("deletes nobody when the listing fails partway", async () => {
    list
      .mockResolvedValueOnce({
        data: {
          data: [{ email: "one@example.com", id: "c1", unsubscribed: false }],
          has_more: true,
          object: "list",
        },
        error: null,
      } as never)
      .mockResolvedValueOnce({
        data: null,
        error: { message: "slow down", name: "rate_limit_exceeded" },
      } as never);
    find.mockReturnValue({
      toArray: () =>
        Promise.resolve([
          { _id: "s1", email: "one@example.com" },
          { _id: "s2", email: "two@example.com" },
        ]),
    } as never);

    const response = await post(`Bearer ${SECRET}`);

    expect(response.status).toBe(500);
    expect(removeContact).not.toHaveBeenCalled();
    expect(deleteMany).not.toHaveBeenCalled();
  });
});
