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
});

describe("validateEmail", () => {
  test("rejects invalid format", async () => {
    const result = await validateEmail("not-an-email");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("invalid_format");
  });

  test("rejects disposable emails", async () => {
    const result = await validateEmail("test@mailinator.com");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("disposable");
  });

  test("accepts legitimate emails", async () => {
    const result = await validateEmail("test@gmail.com");
    expect(result.valid).toBe(true);
  });
});
