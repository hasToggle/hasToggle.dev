import { parseError } from "@repo/observability/error";
import { checkBotId } from "botid/server";
import { BOT_CHECK_LEVEL } from "./bot-protected";

/**
 * BotID's verdict on the current request, for the routes in
 * lib/bot-protected.ts. Outside a Vercel deployment it always says human.
 *
 * It fails open. The check needs Vercel's OIDC token and a call to Vercel,
 * and when either is missing it throws; a signup form that answers 500
 * because a bot filter is down has the priorities backwards. The failure is
 * reported, and the rate limits behind this still hold.
 */
export async function looksAutomated(): Promise<boolean> {
  try {
    const { isBot } = await checkBotId({
      advancedOptions: { checkLevel: BOT_CHECK_LEVEL },
    });
    return isBot;
  } catch (error) {
    parseError(error);
    return false;
  }
}
