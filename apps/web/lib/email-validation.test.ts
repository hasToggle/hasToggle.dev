import { describe, expect, test } from "bun:test";
import { isDisposableEmail, validateEmail } from "./email-validation";

describe("isDisposableEmail", () => {
  test("rejects known disposable domains", () => {
    expect(isDisposableEmail("test@mailinator.com")).toBe(true);
    expect(isDisposableEmail("test@guerrillamail.com")).toBe(true);
    expect(isDisposableEmail("test@yopmail.com")).toBe(true);
  });

  test("accepts legitimate domains", () => {
    expect(isDisposableEmail("test@gmail.com")).toBe(false);
    expect(isDisposableEmail("test@outlook.com")).toBe(false);
    expect(isDisposableEmail("test@company.co")).toBe(false);
  });

  test("is case-insensitive", () => {
    expect(isDisposableEmail("test@MAILINATOR.COM")).toBe(true);
    expect(isDisposableEmail("test@Gmail.Com")).toBe(false);
  });

  test("returns false for input without @", () => {
    expect(isDisposableEmail("no-at-sign")).toBe(false);
  });
});

describe("validateEmail", () => {
  test("rejects invalid format", async () => {
    const result = await validateEmail("not-an-email");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("invalid_format");
    }
  });

  test("rejects null and undefined", async () => {
    // @ts-expect-error testing runtime behavior with invalid input
    expect((await validateEmail(null)).valid).toBe(false);
    // @ts-expect-error testing runtime behavior with invalid input
    expect((await validateEmail(undefined)).valid).toBe(false);
  });

  test("rejects empty string", async () => {
    const result = await validateEmail("");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("invalid_format");
    }
  });

  test("rejects malformed emails that contain @", async () => {
    expect((await validateEmail("@")).valid).toBe(false);
    expect((await validateEmail("foo@")).valid).toBe(false);
    expect((await validateEmail("@bar")).valid).toBe(false);
    expect((await validateEmail("foo@bar")).valid).toBe(false);
  });

  test("rejects disposable emails", async () => {
    const result = await validateEmail("test@mailinator.com");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("disposable");
    }
  });

  test("accepts valid email addresses", async () => {
    const result = await validateEmail("user@example.com");
    expect(result.valid).toBe(true);
  });
});
