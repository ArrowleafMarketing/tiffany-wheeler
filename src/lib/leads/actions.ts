"use server";

import { emailCaptureCopy } from "@/content/home-bottom";

// Email capture (lead magnet + footer signup). Mock today: validates, logs and
// returns a message. Server Actions are reachable by direct POST, so every input
// is validated here, whatever the client did.
//
// TODO(klaviyo): subscribe the profile with Klaviyo's Subscribe Profiles API
// (list: "Nephite Christmas Activity Pack", custom source = `source`), let the
// list's welcome flow email the four printables, and add rate limiting.

export type SubscribeResult = {
  ok: boolean;
  message: string;
  /** The submitted email, echoed back so the input keeps its value after an error. */
  email?: string;
};

/** State shape for `useActionState(subscribe, null)`. */
export type SubscribeState = SubscribeResult | null;

const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const SOURCE_PATTERN = /^[a-z0-9-]{1,40}$/;
/**
 * Hidden field a person never sees or fills; bots usually do. Keep in sync with
 * email-capture-form.tsx ("use server" files may only export async functions).
 */
const HONEYPOT_FIELD = "favorite_color";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function mask(email: string): string {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}***@${domain}`;
}

/**
 * Use with `useActionState(subscribe, null)`. Form fields: `email` (required),
 * `source` (e.g. "home", "footer", "freebies"), `variant` ("section" | "compact",
 * picks the success copy) and the honeypot.
 */
export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeResult> {
  const { section, compact, errors } = emailCaptureCopy;
  if (!(formData instanceof FormData)) return { ok: false, message: errors.server };

  const variant = field(formData, "variant") === "compact" ? "compact" : "section";
  const success = variant === "compact" ? compact.success : section.success;
  const rawEmail = field(formData, "email").trim();

  // Bots get the same success response, so they learn nothing, but nothing is stored.
  if (field(formData, HONEYPOT_FIELD).trim() !== "") return { ok: true, message: success };

  const email = rawEmail.toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false, message: errors.invalid, email: rawEmail.slice(0, MAX_EMAIL_LENGTH) };
  }

  const rawSource = field(formData, "source");
  const source = SOURCE_PATTERN.test(rawSource) ? rawSource : "unknown";

  try {
    // Mock "provider": log only (masked, so full addresses don't land in logs).
    console.info(`[lead] subscribe (mock) email=${mask(email)} source=${source} variant=${variant}`);
    return { ok: true, message: success };
  } catch {
    return { ok: false, message: errors.server, email: rawEmail };
  }
}
