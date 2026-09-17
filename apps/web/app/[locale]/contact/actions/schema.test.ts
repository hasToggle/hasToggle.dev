import { describe, expect, test } from "bun:test";
import { parseContact } from "./schema";

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
}

describe("parseContact", () => {
  test("accepts a filled form and normalises the address", () => {
    const parsed = parseContact(
      form({ email: " Eric@Example.COM ", message: "hi", name: "Eric" })
    );
    expect(parsed).toEqual({
      email: "eric@example.com",
      message: "hi",
      name: "Eric",
    });
  });

  test("rejects a missing field, a blank field, or a bad address", () => {
    expect(parseContact(form({ email: "a@b.co", name: "x" }))).toBeNull();
    expect(
      parseContact(form({ email: "a@b.co", message: "   ", name: "x" }))
    ).toBeNull();
    expect(
      parseContact(form({ email: "not-mail", message: "hi", name: "x" }))
    ).toBeNull();
  });

  test("rejects a name that spans lines", () => {
    expect(
      parseContact(form({ email: "a@b.co", message: "hi", name: "x\nBcc: y" }))
    ).toBeNull();
  });

  test("rejects oversized input", () => {
    expect(
      parseContact(
        form({ email: "a@b.co", message: "m".repeat(5001), name: "x" })
      )
    ).toBeNull();
    expect(
      parseContact(
        form({ email: "a@b.co", message: "hi", name: "n".repeat(121) })
      )
    ).toBeNull();
  });
});
