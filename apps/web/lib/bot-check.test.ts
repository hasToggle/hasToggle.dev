import { afterEach, describe, expect, mock, test } from "bun:test";

const checkBotId = mock(async () => ({ isBot: false }));
mock.module("botid/server", () => ({ checkBotId }));

const { looksAutomated } = await import("./bot-check");
const { BOT_CHECK_LEVEL, PROTECTED_ROUTES } = await import("./bot-protected");

afterEach(() => {
  checkBotId.mockReset();
});

describe("looksAutomated", () => {
  test("passes on BotID's verdict", async () => {
    checkBotId.mockResolvedValue({ isBot: true });
    expect(await looksAutomated()).toBe(true);
    checkBotId.mockResolvedValue({ isBot: false });
    expect(await looksAutomated()).toBe(false);
  });

  // The client and the server must name the same level or the check fails
  // for everyone, so both read it from the one constant.
  test("asks for the level the client was told to solve", async () => {
    checkBotId.mockResolvedValue({ isBot: false });
    await looksAutomated();
    expect(checkBotId).toHaveBeenCalledWith({
      advancedOptions: { checkLevel: BOT_CHECK_LEVEL },
    });
    for (const route of PROTECTED_ROUTES) {
      expect(route.advancedOptions.checkLevel).toBe(BOT_CHECK_LEVEL);
    }
  });

  // A BotID outage, or a project without OIDC, must not close the waitlist.
  // The rate limits are still behind it.
  test("lets the request through when the check itself fails", async () => {
    checkBotId.mockRejectedValue(new Error("no OIDC token"));
    expect(await looksAutomated()).toBe(false);
  });
});

describe("PROTECTED_ROUTES", () => {
  test("covers the two forms that send mail, and nothing a mail client posts to", () => {
    const paths = PROTECTED_ROUTES.map((r) => `${r.method} ${r.path}`);
    expect(paths).toEqual(["POST /api/confirm", "POST /contact"]);
  });
});
