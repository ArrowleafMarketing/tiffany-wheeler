"use server";

import { CONTACT_TOPICS, contactFormCopy } from "@/content/info";

// Contact form. Mock today: validate, log (masked) and
// return a message. Server Actions are reachable by direct POST, so every input
// is validated here whatever the client did, and nothing but the result message
// is returned.
//
// TODO(email): deliver the form to CONTACT_EMAIL through a transactional email
// provider (reply-to = the sender), e.g. Resend or a Shopify Flow webhook, and
// add rate limiting plus a bot check (Cloudflare Turnstile) before launch.

export type ContactField = "name" | "email" | "topic" | "order" | "message";

export type FormResult<F extends string> = {
  ok: boolean;
  /** Success title, or the error summary. */
  message: string;
  /** Success follow-up line. */
  detail?: string;
  fieldErrors?: Partial<Record<F, string>>;
  /** Submitted values, echoed back after an error so the fields keep them. */
  values?: Partial<Record<F, string>>;
};

export type ContactResult = FormResult<ContactField>;
/** State shape for `useActionState(sendContactMessage, null)`. */
export type ContactState = ContactResult | null;

/**
 * Hidden field people never see or fill; bots usually do. Keep in sync with
 * HONEYPOT_FIELD in contact-form.tsx ("use server" files may only export
 * async functions).
 */
const HONEYPOT_FIELD = "company_website";

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const MAX = { name: 100, email: 254, order: 40, message: 5000 } as const;
const MIN_MESSAGE = 10;

function field(formData: FormData, name: string, max: number): string {
  const value = formData.get(name);
  // Trim and cap at max + 1, so an over-long value still fails the length check.
  return typeof value === "string" ? value.trim().slice(0, max + 1) : "";
}

const validEmail = (email: string) => email.length <= MAX.email && EMAIL_PATTERN.test(email);

function mask(email: string): string {
  const [user = "", domain = ""] = email.split("@");
  return `${user.slice(0, 2)}***@${domain}`;
}

const isBot = (formData: FormData) => {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim() !== "";
};

/**
 * Contact form. Use with `useActionState(sendContactMessage, null)`.
 * Fields: name, email, topic (one of CONTACT_TOPICS), order (optional), message.
 */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactResult> {
  const copy = contactFormCopy;
  if (!(formData instanceof FormData)) return { ok: false, message: copy.errors.server };

  const values = {
    name: field(formData, "name", MAX.name),
    email: field(formData, "email", MAX.email),
    topic: field(formData, "topic", 20),
    order: field(formData, "order", MAX.order),
    message: field(formData, "message", MAX.message),
  } satisfies Record<ContactField, string>;
  const success = (email: string): ContactResult => ({
    ok: true,
    message: copy.success.title,
    detail: copy.success.body.replace("{email}", email),
  });

  // Bots get the same success response, so they learn nothing, but nothing is sent.
  if (isBot(formData)) return success(values.email);

  const fieldErrors: Partial<Record<ContactField, string>> = {};
  if (!values.name || values.name.length > MAX.name) fieldErrors.name = copy.errors.name;
  if (!validEmail(values.email)) fieldErrors.email = copy.errors.email;
  if (!CONTACT_TOPICS.some((t) => t.value === values.topic)) fieldErrors.topic = copy.errors.topic;
  if (values.order.length > MAX.order) fieldErrors.order = copy.errors.order;
  if (values.message.length < MIN_MESSAGE) fieldErrors.message = copy.errors.message;
  else if (values.message.length > MAX.message) fieldErrors.message = copy.errors.messageLong;

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: copy.errors.summary, fieldErrors, values };
  }

  try {
    // Mock delivery: log only (masked, so full addresses don't land in logs).
    console.info(
      `[contact] message (mock) from=${mask(values.email)} topic=${values.topic} order=${values.order ? "yes" : "no"} length=${values.message.length}`,
    );
    return success(values.email);
  } catch {
    return { ok: false, message: copy.errors.server, values };
  }
}

