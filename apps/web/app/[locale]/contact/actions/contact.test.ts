import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { resend } from "@repo/email";
import { contact } from "./contact";

const send = spyOn(resend.emails, "send");

afterEach(() => {
  send.mockReset();
});

function form() {
  const data = new FormData();
  data.set("name", "A Visitor");
  data.set("email", "user@example.com");
  data.set("message", "A message long enough to pass the schema.");
  return data;
}

describe("contact action", () => {
  test("sends nothing for a request BotID calls automated", async () => {
    const botid = await import("botid/server");
    const verdict = spyOn(botid, "checkBotId").mockResolvedValue({
      isBot: true,
    } as never);
    // Other files share this spy; count from here.
    verdict.mockClear();
    const state = await contact({}, form());
    const asked = verdict.mock.calls.length;
    verdict.mockRestore();

    expect(state.success).toBeUndefined();
    expect(state.error).toBeString();
    expect(send).not.toHaveBeenCalled();
    expect(asked).toBe(1);
  });
});
