import { parseError } from "@repo/observability/error";
import { log } from "@repo/observability/log";
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
    const verdict = await checkBotId({
      advancedOptions: { checkLevel: BOT_CHECK_LEVEL },
    });
    // One line per check, on two low-traffic routes: without it a request
    // that got through looks the same whether BotID judged it human, was
    // told to stand aside (`bypassed`), or never saw a challenge at all.
    // None of these fields describe the visitor.
    log.info(
      `BotID: bot=${verdict.isBot} bypassed=${verdict.bypassed} verified=${verdict.isVerifiedBot} reason=${"classificationReason" in verdict ? verdict.classificationReason : "n/a"}`
    );
    return verdict.isBot;
  } catch (error) {
    parseError(error);
    return false;
  }
}
