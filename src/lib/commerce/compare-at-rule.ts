import { formatMoney, money, toNumber } from "@/lib/money";
import type { Money, Product, Variant } from "./types";

/**
 * THE price rule. Every price on the site goes through it, so a sale is set up
 * in one place: the product's prices in Shopify.
 *
 * 1. Sale: Shopify's compare-at price is above the price. The site strikes the
 *    old price and shows a "10% OFF" sticker. Start or end a sale in Shopify
 *    (Products → Bulk edit → Price / Compare-at price); nothing changes here.
 * 2. Bundle: no sale, but the bundle's books cost more bought one by one. The
 *    site strikes their current total, labelled "if bought separately", with a
 *    "Save $X" sticker. Worked out from live prices, so it stays honest while
 *    a book inside it is on sale (FTC 16 CFR 233: a comparison must be real).
 * 3. Otherwise a plain price.
 */
export type CompareAtReason = "sale" | "bundle";

const CENT = 0.004;

/** Whole-number percent off, for the sticker ("10% OFF"). */
export function percentOff(price: Money, compareAt: Money): number {
  const was = toNumber(compareAt);
  return was > 0 ? Math.round(((was - toNumber(price)) / was) * 100) : 0;
}

/** The sticker text for a deal: "10% off" for a sale, "Save $2.49" for a bundle; null without a real compare-at. */
export function dealSticker(price: Money, compareAt: Money | null | undefined, reason: CompareAtReason = "sale"): string | null {
  if (!compareAt || toNumber(compareAt) <= toNumber(price) + CENT) return null;
  return reason === "bundle" ? `Save ${formatMoney(toNumber(compareAt) - toNumber(price), { trim: true })}` : `${percentOff(price, compareAt)}% off`;
}

/** Applies the rule to every variant: sets `compareAtPrice` and `compareAtReason`. */
export function applyCompareAtRule(products: Product[]): Product[] {
  const byId = new Map<string, Variant>(products.flatMap((p) => p.variants.map((v) => [v.id, v] as const)));
  return products.map((product) => ({
    ...product,
    variants: product.variants.map((v): Variant => {
      const price = toNumber(v.price);
      if (v.compareAtPrice && toNumber(v.compareAtPrice) > price + CENT) {
        return { ...v, compareAtReason: "sale" };
      }
      if (v.components?.length) {
        const parts = v.components.map((c) => byId.get(c.variantId));
        if (parts.every(Boolean)) {
          const separately = v.components.reduce((sum, c, i) => sum + toNumber(parts[i]!.price) * c.quantity, 0);
          if (separately > price + CENT) return { ...v, compareAtPrice: money(separately), compareAtReason: "bundle" };
        }
      }
      return { ...v, compareAtPrice: null, compareAtReason: undefined };
    }),
  }));
}
