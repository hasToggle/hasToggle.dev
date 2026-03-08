import disposableDomains from "disposable-email-domains";

const disposableSet = new Set(disposableDomains);

type ValidationResult =
  | { valid: true }
  | { valid: false; reason: "invalid_format" | "disposable" | "undeliverable" };

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

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) {
    return false;
  }
  return disposableSet.has(domain);
}

export async function checkEmailDeliverability(
  email: string,
  apiKey: string
): Promise<ValidationResult> {
  const domain = email.split("@")[1]?.toLowerCase();

  // Skip API check for well-known domains or when no key configured
  if (!(apiKey && domain) || TRUSTED_DOMAINS.has(domain)) {
    return { valid: true };
  }

  try {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      // Fail open — don't block signups if the API is down
      return { valid: true };
    }

    const data = await response.json();

    if (data.deliverability === "UNDELIVERABLE") {
      return { valid: false, reason: "undeliverable" };
    }

    return { valid: true };
  } catch {
    // Fail open on network errors
    return { valid: true };
  }
}

export async function validateEmail(
  email: string,
  apiKey?: string
): Promise<ValidationResult> {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { valid: false, reason: "invalid_format" };
  }

  if (isDisposableEmail(email)) {
    return { valid: false, reason: "disposable" };
  }

  if (apiKey) {
    return await checkEmailDeliverability(email, apiKey);
  }

  return { valid: true };
}
