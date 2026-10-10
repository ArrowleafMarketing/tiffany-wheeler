import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { mockProvider } from "./mock/provider";
import type { CommerceProvider } from "./provider";
import { shopifyConfigured } from "./shopify/client";
import { shopifyProvider } from "./shopify/provider";
import type { ProductQuery } from "./types";

/**
 * The live store is Shopify (src/lib/commerce/shopify), used whenever its keys
 * are set. Without them, or with COMMERCE_PROVIDER=mock, the sample catalog runs.
 */
export const commerce: CommerceProvider =
  shopifyConfigured && process.env.COMMERCE_PROVIDER !== "mock" ? shopifyProvider : mockProvider;

// Cached catalog reads for Server Components. Product data is shared by every
// visitor, so it belongs in the static shell. The "catalog" profile (next.config.ts)
// refreshes it from Shopify every few minutes, so sales set there show up quickly.

export async function getProduct(handle: string) {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", `product:${handle}`);
  return commerce.getProduct(handle);
}

export async function getProducts(query: ProductQuery = {}) {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");
  return commerce.getProducts(query);
}

export async function getReviews(productHandle: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("reviews", `reviews:${productHandle}`);
  return commerce.getReviews(productHandle);
}

export type * from "./types";
