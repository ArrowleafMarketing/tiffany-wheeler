import "server-only";

import { cookies } from "next/headers";
import type { Attribute } from "@/lib/commerce/types";

export const CART_COOKIE = "tw_cart";
/** First-touch ad attribution, written client-side by src/instrumentation-client.ts. */
export const ATTRIBUTION_COOKIE = "tw_attr";

/** For `response.cookies.set(CART_COOKIE, cart.id, CART_COOKIE_OPTIONS)` in the cart Route Handler. */
export const CART_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function readCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "landing_page",
];

/** The cookie as JSON. cookies().get() has already URI-decoded it, so decode again only as a fallback. */
function parseAttribution(raw: string): Record<string, unknown> | null {
  for (const candidate of [raw, () => decodeURIComponent(raw)]) {
    try {
      const parsed: unknown = JSON.parse(typeof candidate === "string" ? candidate : candidate());
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {
      // Try the next form.
    }
  }
  return null;
}

/** Attribution captured on landing, turned into cart attributes (they end up on the order). */
export async function readAttribution(): Promise<Attribute[]> {
  const raw = (await cookies()).get(ATTRIBUTION_COOKIE)?.value;
  if (!raw) return [];
  const parsed = parseAttribution(raw);
  if (!parsed) return [];
  return ATTRIBUTION_KEYS.flatMap((key) =>
    typeof parsed[key] === "string" && parsed[key]
      ? [{ key: `_${key}`, value: String(parsed[key]).slice(0, 200) }]
      : [],
  );
}
