import { describe, expect, test } from "bun:test";
import { clientIp, createMemoryLimiter } from "./rate-limit";

describe("createMemoryLimiter", () => {
  test("allows up to the limit inside the window, then refuses", async () => {
    let now = 1000;
    const limiter = createMemoryLimiter({ limit: 2, ms: 60_000 }, () => now);
    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(false);
    now += 60_001;
    expect((await limiter.limit("a")).success).toBe(true);
  });

  test("keys are independent", async () => {
    const limiter = createMemoryLimiter({ limit: 1, ms: 60_000 }, () => 0);
    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("b")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(false);
  });

  test("a refused call does not extend the window", async () => {
    let now = 0;
    const limiter = createMemoryLimiter({ limit: 1, ms: 1000 }, () => now);
    await limiter.limit("a");
    now = 900;
    expect((await limiter.limit("a")).success).toBe(false);
    now = 1001;
    expect((await limiter.limit("a")).success).toBe(true);
  });
});

describe("clientIp", () => {
  test("prefers x-real-ip", () => {
    const headers = new Headers({
      "x-forwarded-for": "10.0.0.1, 10.0.0.2",
      "x-real-ip": "203.0.113.5",
    });
    expect(clientIp(headers)).toBe("203.0.113.5");
  });

  test("falls back to the leftmost forwarded address", () => {
    const headers = new Headers({ "x-forwarded-for": "10.0.0.1, 10.0.0.2" });
    expect(clientIp(headers)).toBe("10.0.0.1");
  });

  test("returns null rather than a shared bucket when no header is set", () => {
    expect(clientIp(new Headers())).toBeNull();
  });
});
