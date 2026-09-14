import { Resend } from "resend";
import { keys } from "./keys";

export const resend = new Resend(keys().RESEND_TOKEN);

export type { WebhookEventPayload } from "resend";
