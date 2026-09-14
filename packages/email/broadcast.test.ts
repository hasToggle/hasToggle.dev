import { describe, expect, test } from "bun:test";
import { RESEND_UNSUBSCRIBE_URL, renderDigestBroadcast } from "./broadcast";

const digest = {
  content: "The counter kept its value because the component never unmounted.",
  misconception: "State resets on every render",
  series: { name: "State", part: 2 },
  title: "What happens when you press +1",
};

describe("renderDigestBroadcast", () => {
  test("carries Resend's unsubscribe placeholder verbatim", async () => {
    const { html } = await renderDigestBroadcast(digest);
    expect(html).toContain(`href="${RESEND_UNSUBSCRIBE_URL}"`);
  });

  test("names the broadcast after the digest", async () => {
    const { name, subject } = await renderDigestBroadcast(digest);
    expect(name).toBe(digest.title);
    expect(subject).toBe(digest.title);
  });
});
