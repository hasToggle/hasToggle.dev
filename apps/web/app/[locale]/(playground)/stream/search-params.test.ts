import { describe, expect, test } from "bun:test";
import { loadStreamSearchParams, streamHref } from "./search-params";
import { DEFAULT_STRATEGY, STRATEGY_ORDER } from "./strategy";

const mode = (raw?: string) =>
  loadStreamSearchParams(raw === undefined ? {} : { mode: raw }).mode;

describe("the ?mode= param", () => {
  test("a missing param opens on the arrangement the title describes", () => {
    expect(mode()).toBe("parts");
    expect(mode("")).toBe("parts");
    expect(DEFAULT_STRATEGY).toBe("parts");
  });

  test("the three arrangements pass through", () => {
    expect(mode("blocking")).toBe("blocking");
    expect(mode("loading")).toBe("loading");
    expect(mode("parts")).toBe("parts");
  });

  test("rejects everything a URL bar can invent", () => {
    expect(mode("Parts")).toBe("parts");
    expect(mode("stream")).toBe("parts");
    expect(mode("__proto__")).toBe("parts");
    expect(mode("constructor")).toBe("parts");
    expect(mode(" parts")).toBe("parts");
  });
});

describe("the ?stream= param", () => {
  test("reads a run id and refuses anything else", () => {
    expect(loadStreamSearchParams({ stream: "7" }).stream).toBe(7);
    expect(loadStreamSearchParams({ stream: "1e3" }).stream).toBe(0);
    expect(loadStreamSearchParams({}).stream).toBe(0);
  });

  test("both params come off one URL together", () => {
    expect(loadStreamSearchParams("?mode=loading&stream=12")).toEqual({
      mode: "loading",
      stream: 12,
    });
  });
});

describe("the URL a press navigates to", () => {
  test("writes both params and keeps the rest of the query", () => {
    expect(streamHref("/lab/streaming?x=1", { mode: "parts", stream: 3 })).toBe(
      "/lab/streaming?x=1&mode=parts&stream=3"
    );
  });

  test("round-trips through the loader", () => {
    const href = streamHref("/", { mode: "blocking", stream: 42 });
    expect(loadStreamSearchParams(href.slice(1))).toEqual({
      mode: "blocking",
      stream: 42,
    });
  });
});

describe("the arrangements", () => {
  test("are shown least to most streaming", () => {
    expect(STRATEGY_ORDER).toEqual(["blocking", "loading", "parts"]);
  });
});
