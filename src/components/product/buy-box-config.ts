// Builds the BuyBox configuration for a product (server side, plain data).
// Shared by the product page and the ad landing pages, so the "Choose your
// gift" tiles, prices and shipping notes are identical everywhere.

import type { BuyBoxConfig, BuyItem } from "@/components/product/buy-box";
import { FORMAT_PARAM, FORMAT_PICKERS, NC_GIFT_PICKER, SHIPPING_NOTES, VARIANT_IMAGE_INDEX } from "@/content/pdp";
import type { Product, Variant } from "@/lib/commerce/types";
import { formatMoney, toNumber } from "@/lib/money";
import { CLAIMS, FLAT_RATE_SHIPPING, FREE_SHIPPING_THRESHOLD, HANDLES } from "@/lib/store-config";

export const firstAvailable = (p: Product): Variant => p.variants.find((v) => v.availableForSale) ?? p.variants[0];

/** Ships free at this price, while the free-shipping claim is confirmed. */
export const shipsFreeAt = (variant: Variant) =>
  CLAIMS.freeShipping && variant.requiresShipping && toNumber(variant.price) >= FREE_SHIPPING_THRESHOLD;

/** This product's own site rating (a bundle's borrowed one doesn't count). */
export function ownRating(product: Product) {
  const r = product.ratings.find((x) => x.source === "site" && x.count > 0 && !x.borrowedFrom);
  return r ? { value: r.value, count: r.count } : undefined;
}

function itemFor(product: Product, variant: Variant, extra: Partial<BuyItem> = {}): BuyItem {
  return {
    key: variant.id,
    productHandle: product.handle,
    productTitle: product.title,
    name: product.shortTitle ?? product.title,
    variantId: variant.id,
    variantTitle: variant.title,
    label: product.title,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    shipsFree: shipsFreeAt(variant),
    rating: ownRating(product),
    available: variant.availableForSale,
    requiresShipping: variant.requiresShipping,
    thumbnail: product.images[0],
    ...extra,
  };
}

/** The handles `buyBoxConfig` needs as `giftOptions` for this product (fetch them alongside it). */
export function giftOptionHandles(product: Product): string[] {
  return product.handle === HANDLES.nephiteChristmas ? NC_GIFT_PICKER.options.map((o) => o.handle) : [];
}

export function buyBoxConfig(product: Product, giftOptions: Product[]): BuyBoxConfig {
  const base = { productHandle: product.handle, productTitle: product.title };

  // §3.1 “Choose your gift”: just the book, or both books, as two tiles.
  if (product.handle === HANDLES.nephiteChristmas && giftOptions.length > 1) {
    const items = NC_GIFT_PICKER.options.flatMap((option) => {
      const p = giftOptions.find((g) => g.handle === option.handle);
      if (!p) return [];
      const variant = firstAvailable(p);
      // Jump the gallery to this option's photo (the set's is in the book's gallery too).
      const imageIndex = product.images.findIndex((img) => img.url === p.images[0]?.url);
      const flatRateNote = CLAIMS.freeShipping ? SHIPPING_NOTES.flatRate(formatMoney(FLAT_RATE_SHIPPING)) : undefined;
      return [
        itemFor(p, variant, {
          label: option.label,
          tag: "tag" in option ? option.tag : undefined,
          note: shipsFreeAt(variant) ? undefined : flatRateNote,
          imageIndex: imageIndex >= 0 ? imageIndex : 0,
        }),
      ];
    });
    const [single, both] = items;
    const extra = single && both ? Math.round((toNumber(both.price) - toNumber(single.price)) * 100) / 100 : 0;
    return {
      ...base,
      items,
      defaultKey: firstAvailable(product).id,
      picker: {
        kind: "gift",
        legend: NC_GIFT_PICKER.legend,
        helper: extra > 0 ? NC_GIFT_PICKER.helper(formatMoney(extra, { trim: true })) : undefined,
      },
    };
  }

  // Format picker for multi-variant products (coloring book: Printed / PDF).
  if (product.variants.length > 1 && product.options.length > 0) {
    const option = product.options[0];
    const format = FORMAT_PICKERS[product.handle];
    const items = product.variants.map((variant) => {
      const value = variant.selectedOptions.find((o) => o.name === option.name)?.value ?? variant.title;
      const imageIndex = VARIANT_IMAGE_INDEX[product.handle]?.[value] ?? 0;
      return itemFor(product, variant, {
        label: format?.labels[value] ?? value,
        imageIndex,
        thumbnail: product.images[imageIndex] ?? product.images[0],
      });
    });
    return {
      ...base,
      items,
      defaultKey: firstAvailable(product).id,
      picker: { kind: "format", legend: option.name, helper: format?.helper },
      preselectParam: FORMAT_PARAM,
    };
  }

  const variant = firstAvailable(product);
  return { ...base, items: [itemFor(product, variant)], defaultKey: variant.id, picker: null };
}
