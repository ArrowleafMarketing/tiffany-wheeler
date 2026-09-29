import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { mockProvider } from "./mock/provider";
import type { CommerceProvider } from "./provider";
import type { ProductQuery } from "./types";

/** Swap to the Shopify provider once it exists (COMMERCE_PROVIDER=shopify). */
export const commerce: CommerceProvider = mockProvider;

// Cached catalog reads for Server Components. Product data is shared by every
// visitor, so it belongs in the static shell; a Shopify webhook will call
// revalidateTag("products", { expire: 0 }) when anything changes.

export async function getProduct(handle: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${handle}`);
  return commerce.getProduct(handle);
}

export async function getProducts(query: ProductQuery = {}) {
  "use cache";
  cacheLife("hours");
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
