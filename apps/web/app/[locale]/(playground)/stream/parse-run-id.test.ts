import { describe, expect, test } from "bun:test";
import { MAX_RUN_ID, parseRunId } from "./parse-run-id";

describe("parseRunId", () => {
  test("missing param means run zero", () => {
    expect(parseRunId(undefined)).toBe(0);
    expect(parseRunId("")).toBe(0);
  });

  test("plain integers pass through", () => {
    expect(parseRunId("0")).toBe(0);
    expect(parseRunId("7")).toBe(7);
    expect(parseRunId("42")).toBe(42);
  });

  test("caps at MAX_RUN_ID", () => {
    expect(parseRunId("999")).toBe(MAX_RUN_ID);
  });

  test("rejects everything a URL bar can invent", () => {
    expect(parseRunId("-1")).toBe(0);
    expect(parseRunId("3.5")).toBe(0);
    expect(parseRunId("1e3")).toBe(0);
    expect(parseRunId("0x10")).toBe(0);
    expect(parseRunId("banana")).toBe(0);
    expect(parseRunId("12345")).toBe(0);
    expect(parseRunId(" 4")).toBe(0);
    expect(parseRunId("Infinity")).toBe(0);
  });
});
