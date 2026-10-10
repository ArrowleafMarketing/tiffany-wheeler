import { Truck } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Img } from "@/components/ui/img";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { closingCtaCopy as copy, completeSetBarCopy, fill } from "@/content/home-top";
import { reviewsCopy } from "@/content/reviews";
import { getProduct } from "@/lib/commerce";
import { formatDate } from "@/lib/delivery";
import { formatMoney, toNumber } from "@/lib/money";
import { getCurrentSeason } from "@/lib/season";
import { HANDLES } from "@/lib/store-config";

/**
 * The last buy prompt on the homepage, for readers who scrolled all the way:
 * the set (with its real "if bought separately" price), Get Both Books and a
 * direct Just Nephite Christmas. The order-by line only shows while the
 * standard Christmas cutoff is ahead (real date from the season, never a timer).
 */
export async function ClosingCta() {
  const [season, set, nc] = await Promise.all([
    getCurrentSeason(),
    getProduct(HANDLES.completeSet),
    getProduct(HANDLES.nephiteChristmas),
  ]);
  const setVariant = set?.variants.find((v) => v.availableForSale) ?? set?.variants[0];
  const ncVariant = nc?.variants.find((v) => v.availableForSale) ?? nc?.variants[0];
  if (!set || !setVariant) return null;

  const hasCompare =
    setVariant.compareAtPrice !== null && toNumber(setVariant.compareAtPrice) > toNumber(setVariant.price);
  const orderBy =
    season.mode === "christmas" && season.orderBy ? fill(copy.orderBy, { date: formatDate(season.orderBy) }) : null;
  const rating = nc?.ratings.find((r) => r.source === "site" && r.count > 0);
  const image = set.images[0];

  return (
    <section aria-labelledby="closing-cta-title" className="bg-cream py-12 sm:py-16">
      <div className="container-page">
        <div className="mx-auto grid max-w-5xl gap-x-8 rounded-(--radius-card) bg-butter p-5 shadow-soft ring-1 ring-butter-deep sm:p-8 md:grid-cols-[14rem_minmax(0,1fr)] md:items-center lg:grid-cols-[18rem_minmax(0,1fr)] lg:p-10">
          {/* Phones: the set image sits beside the heading; from md it's the left column. */}
          <div className="flex items-center gap-4 md:contents">
            {image ? (
              <div className="w-24 shrink-0 overflow-hidden rounded-2xl shadow-lift ring-4 ring-paper/70 md:row-span-2 md:w-full">
                <Img image={image} alt="" sizes="(min-width: 1024px) 288px, (min-width: 768px) 224px, 96px" className="h-auto w-full" />
              </div>
            ) : null}
            <div className="min-w-0 md:self-end">
              <p className="font-hand text-xl leading-none text-periwinkle-text sm:text-2xl">{copy.eyebrow}</p>
              <h2 id="closing-cta-title" className="mt-1.5 text-2xl font-semibold leading-[1.15] tracking-[-0.01em] sm:text-3xl">
                {copy.headline}
              </h2>
            </div>
          </div>

          <div className="mt-4 md:mt-3 md:self-start">
            <p className="text-sm font-semibold text-ink">{copy.includes}</p>

            <div className="mt-2 flex flex-col items-start gap-1">
              <Price
                price={setVariant.price}
                compareAtPrice={setVariant.compareAtPrice}
                reason={setVariant.compareAtReason}
                size="lg"
                hideBundleLabel={hasCompare}
              />
              {hasCompare && setVariant.compareAtPrice ? (
                <p className="text-sm text-body">
                  {fill(completeSetBarCopy.priceLabel.separately, { compareAt: formatMoney(setVariant.compareAtPrice) })}
                </p>
              ) : null}
            </div>

            {/* While these are on screen, the sticky mobile bar stays hidden. */}
            <div data-sticky-hide className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <AddToCartButton
                variantId={setVariant.id}
                productHandle={set.handle}
                productTitle={set.title}
                variantTitle={setVariant.title}
                price={toNumber(setVariant.price)}
                available={setVariant.availableForSale}
                variant="accent"
                size="lg"
                className="w-full sm:w-auto"
              >
                {`${copy.primary} — ${formatMoney(setVariant.price)}`}
              </AddToCartButton>
              {nc && ncVariant ? (
                <AddToCartButton
                  variantId={ncVariant.id}
                  productHandle={nc.handle}
                  productTitle={nc.title}
                  variantTitle={ncVariant.title}
                  price={toNumber(ncVariant.price)}
                  available={ncVariant.availableForSale}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {`${copy.secondary} — ${formatMoney(ncVariant.price)}`}
                </AddToCartButton>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col items-start gap-1.5 text-sm text-body">
              {rating ? (
                <p className="flex flex-wrap items-center gap-x-2">
                  <Stars value={rating.value} size={15} />
                  <span>{reviewsCopy.summary(rating.value.toFixed(1), rating.count)}</span>
                </p>
              ) : null}
              {orderBy ? (
                <p className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <Truck aria-hidden className="size-4 shrink-0 text-forest" strokeWidth={1.75} />
                  {orderBy}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
