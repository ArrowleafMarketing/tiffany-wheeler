import wavingBoyStill from "@/assets/images/art/waving-boy-still.webp";
import { cartCopy } from "@/content/cart";
import { getProducts } from "@/lib/commerce";
import type { Product, Variant } from "@/lib/commerce/types";
import { formatMonthDay } from "@/lib/delivery";
import { fromStatic } from "@/lib/images";
import { getCurrentSeason } from "@/lib/season";
import {
  CLAIMS,
  FREE_SHIPPING_THRESHOLD,
  HANDLES,
  HANDLING_BUSINESS_DAYS,
  SIGNED_EXTRA_BUSINESS_DAYS,
} from "@/lib/store-config";
import { CartDrawer } from "./cart-drawer";
import type { CartDrawerData, UpsellItem } from "./cart-drawer-data";

/** The first available variant of `handle` (matching `pick`, when given), as an upsell. */
function upsell(
  products: Product[],
  handle: string,
  pick: (v: Variant) => boolean = () => true,
): UpsellItem | null {
  const product = products.find((p) => p.handle === handle);
  const variant = product?.variants.find((v) => v.availableForSale && pick(v));
  if (!product || !variant) return null;
  return {
    handle: product.handle,
    title: product.title,
    shortTitle: cartCopy.upsells.shortTitles[product.handle] ?? product.title,
    variantId: variant.id,
    variantTitle: variant.title,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    image: product.images[0] ?? null,
  };
}

/**
 * Server wrapper for the cart drawer: reads the cached catalog and season (both
 * part of the static shell) and hands the client drawer plain data. Render it
 * once, inside <CartProvider>.
 */
export async function CartDrawerRoot() {
  const [products, season] = await Promise.all([getProducts(), getCurrentSeason()]);
  const christmasMode = season.mode === "christmas";
  const signedOrderBy = season.christmas.signedOrderBy;
  const priorityBy = season.christmas.priorityOrderBy;
  const priorityOpen = CLAIMS.priorityShipping && priorityBy !== null && season.today <= priorityBy;

  const data: CartDrawerData = {
    threshold: CLAIMS.freeShipping ? FREE_SHIPPING_THRESHOLD : null,
    christmasOrderBy: christmasMode && season.orderBy ? formatMonthDay(season.orderBy) : null,
    christmasLate: season.mode === "christmas-last-minute" ? (priorityOpen ? "priority" : "late") : null,
    // Only while it's confirmed and there's still time to sign before Christmas.
    signedCopies:
      CLAIMS.signedCopies && signedOrderBy && season.today <= signedOrderBy
        ? {
            shipTime: `${HANDLING_BUSINESS_DAYS.min + SIGNED_EXTRA_BUSINESS_DAYS}–${HANDLING_BUSINESS_DAYS.max + SIGNED_EXTRA_BUSINESS_DAYS} business days`,
            orderBy: christmasMode ? formatMonthDay(signedOrderBy) : null,
          }
        : null,
    products: Object.fromEntries(
      products.map((p) => [p.handle, { holiday: p.holiday, madeToOrder: p.tags.includes("made-to-order") }]),
    ),
    includes: Object.fromEntries(
      products.flatMap((p) =>
        p.variants
          .filter((v) => v.components?.length)
          .map((v) => [v.id, (v.components ?? []).map((c) => c.productHandle)]),
      ),
    ),
    completeSet: upsell(products, HANDLES.completeSet),
    nephiteChristmas: upsell(products, HANDLES.nephiteChristmas),
    easterJourney: upsell(products, HANDLES.easterJourney),
    starOrnament: upsell(products, HANDLES.starOrnament),
    doveOrnament: upsell(products, HANDLES.doveOrnament),
    coloringBook: upsell(products, HANDLES.coloringBook, (v) => v.requiresShipping),
    puzzle: upsell(products, HANDLES.puzzle),
    // A still first frame (224 px, ~16 KB) instead of the 762 KB animation:
    // next/image passes animated WebP through unresized, and a looping image
    // with no pause control fails WCAG 2.2.2. No blur placeholder needed.
    mascot: { ...fromStatic(wavingBoyStill, cartCopy.empty.mascotAlt), blurDataURL: undefined },
  };

  return <CartDrawer data={data} />;
}
