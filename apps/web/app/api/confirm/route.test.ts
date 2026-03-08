import { describe, expect, test } from "bun:test";

const BASE_URL = "http://localhost:3001";

describe("/api/confirm", () => {
  test("rejects disposable email addresses", async () => {
    const response = await fetch(`${BASE_URL}/api/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@mailinator.com" }),
    });
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error.message).toContain("doesn't look quite right");
  });

  test("rejects invalid email format", async () => {
    const response = await fetch(`${BASE_URL}/api/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    expect(response.status).toBe(400);
  });
});
