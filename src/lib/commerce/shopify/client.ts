import "server-only";

/**
 * Minimal Shopify Storefront API client (server only). Uses the Headless
 * channel's private token, which must never reach the browser. Settings come
 * from .env.local locally and from the Vercel project's environment variables.
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const version = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-07";
const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

export const shopifyConfigured = Boolean(domain && token);

export class ShopifyError extends Error {}

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!domain || !token) throw new ShopifyError("Shopify isn’t configured (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_PRIVATE_TOKEN)");
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Shopify-Storefront-Private-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new ShopifyError(`Storefront API ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  return json.data as T;
}

/** Throws when a cart mutation reports user errors (sold out, invalid quantity…). */
export function assertNoUserErrors(errors: { message: string }[] | undefined) {
  if (errors?.length) throw new ShopifyError(errors.map((e) => e.message).join("; "));
}
