import disposableDomains from "disposable-email-domains";

const disposableSet = new Set(disposableDomains);

type ValidationResult =
  | { valid: true }
  | { valid: false; reason: "invalid_format" | "disposable" | "undeliverable" };

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return disposableSet.has(domain);
}

export async function validateEmail(email: string): Promise<ValidationResult> {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { valid: false, reason: "invalid_format" };
  }

  if (isDisposableEmail(email)) {
    return { valid: false, reason: "disposable" };
  }

  return { valid: true };
}
