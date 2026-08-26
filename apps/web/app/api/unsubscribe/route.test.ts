import { describe, expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { GET } from "./route";

describe("/api/unsubscribe", () => {
  test("rejects a request without a token", async () => {
    const response = await GET(
      new NextRequest("http://localhost:3001/api/unsubscribe")
    );
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toContain("valid unsubscribe link");
  });
});
