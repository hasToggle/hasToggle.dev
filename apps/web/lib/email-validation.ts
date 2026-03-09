// Email validation pipeline: format → disposable domain blocklist → Abstract API deliverability.
// Each layer short-circuits on failure, so expensive checks only run after cheaper ones pass.

import { log } from "@repo/observability/log";
import disposableDomains from "disposable-email-domains";
import { z } from "zod";

const disposableSet = new Set(disposableDomains);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationFailureReason =
  | "invalid_format"
  | "disposable"
  | "undeliverable";

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: ValidationFailureReason };

const TRUSTED_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "fastmail.com",
  "hey.com",
  "aol.com",
  "zoho.com",
  "yandex.com",
  "mail.com",
]);

const AbstractApiResponse = z.object({
  deliverability: z.enum(["DELIVERABLE", "UNDELIVERABLE", "RISKY", "UNKNOWN"]),
});

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) {
    return false;
  }
  return disposableSet.has(domain);
}

async function checkEmailDeliverability(
  email: string
): Promise<ValidationResult> {
  // Lazy import to avoid triggering env validation at module load (enables unit testing)
  const { env } = await import("@/env");
  const apiKey = env.ABSTRACT_API_KEY;
  const domain = email.split("@")[1]?.toLowerCase();

  if (!apiKey) {
    log.warn(
      "ABSTRACT_API_KEY is not configured — email deliverability checks are disabled"
    );
    return { valid: true };
  }

  if (!domain || TRUSTED_DOMAINS.has(domain)) {
    return { valid: true };
  }

  try {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) {
      log.warn(
        `Email deliverability API returned HTTP ${response.status} for domain "${domain}". Failing open.`
      );
      return { valid: true };
    }

    const raw = await response.json();
    const parsed = AbstractApiResponse.safeParse(raw);

    if (!parsed.success) {
      log.warn(
        `Unexpected Abstract API response shape for domain "${domain}": ${JSON.stringify(raw)}`
      );
      return { valid: true };
    }

    if (parsed.data.deliverability === "UNDELIVERABLE") {
      return { valid: false, reason: "undeliverable" };
    }

    return { valid: true };
  } catch (error) {
    log.error(
      `Email deliverability check failed for domain "${domain}": ${error instanceof Error ? error.message : String(error)}`
    );
    return { valid: true };
  }
}

export async function validateEmail(email: string): Promise<ValidationResult> {
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return { valid: false, reason: "invalid_format" };
  }

  if (isDisposableEmail(email)) {
    return { valid: false, reason: "disposable" };
  }

  return await checkEmailDeliverability(email);
}
