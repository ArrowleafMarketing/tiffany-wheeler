import { selectHeroCopy } from "@/components/home/hero";
import { DEFAULT_SET_LINE, homeStickyBarCopy as copy } from "@/content/home-top";
import { getProduct } from "@/lib/commerce";
import type { ButtonVariant } from "@/components/ui/button";
import { formatMoney, toNumber } from "@/lib/money";
import { getCurrentSeason } from "@/lib/season";
import { CLAIMS, FREE_SHIPPING_THRESHOLD, HANDLES } from "@/lib/store-config";
import { HomeStickyBarIsland } from "./home-sticky-bar-island";

/**
 * The homepage's sticky mobile bar (copy deck §4.3). It sells whatever the
 * hero's primary button sells this season: the Complete Set in Christmas mode
 * ("Both books · $49.99 · Ships free" + Add to Cart), the PDF in the last
 * days before Christmas, Easter Journey from Christmas to Easter.
 */
export async function HomeStickyBar() {
  const season = await getCurrentSeason();
  const hero = selectHeroCopy(season);
  const action = hero.primary;
  if (!action.add) return null;
  const product = await getProduct(action.add);
  const variant = product?.variants.find((v) => v.availableForSale) ?? product?.variants[0];
  if (!product || !variant || !variant.availableForSale) return null;

  const isSet = product.handle === HANDLES.completeSet;
  const price = toNumber(variant.price);
  // Follows the hero's set line: the Priority hero leaves out "Ships free" because Priority costs extra.
  const heroSaysFree = !isSet || (hero.setLine ?? DEFAULT_SET_LINE).includes("shipsFree");
  const shipsFree =
    heroSaysFree && CLAIMS.freeShipping && variant.requiresShipping && price >= FREE_SHIPPING_THRESHOLD;
  const tone: ButtonVariant = isSet ? "accent" : "primary";

  return (
    <HomeStickyBarIsland
      label={copy.label}
      name={isSet ? copy.setName : (product.shortTitle ?? product.title)}
      price={formatMoney(variant.price)}
      extra={shipsFree ? copy.shipsFree : undefined}
      cta={copy.cta}
      tone={tone}
      item={{
        variantId: variant.id,
        productHandle: product.handle,
        productTitle: product.title,
        variantTitle: variant.title,
        price,
        available: variant.availableForSale,
      }}
    />
  );
}
