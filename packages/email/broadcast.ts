import { render } from "@react-email/render";
import type { Digest } from "@repo/database/types";
import DigestEmail from "./templates/digest";

/**
 * Resend's per-recipient unsubscribe placeholder. Broadcast HTML must carry
 * it verbatim; Resend substitutes each contact's link at send time and adds
 * the one-click List-Unsubscribe headers itself.
 */
export const RESEND_UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}";

export type DigestContent = Pick<
  Digest,
  "content" | "misconception" | "series" | "title"
>;

/** The broadcast body for a digest: rendered once, personalised by Resend. */
export async function renderDigestBroadcast(digest: DigestContent) {
  const html = await render(
    DigestEmail({
      content: digest.content,
      misconception: digest.misconception,
      series: digest.series,
      title: digest.title,
      unsubscribeUrl: RESEND_UNSUBSCRIBE_URL,
    })
  );

  return { html, name: digest.title, subject: digest.title };
}
