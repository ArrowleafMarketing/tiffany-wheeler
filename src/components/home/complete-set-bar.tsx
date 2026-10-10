import { Truck } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Img } from "@/components/ui/img";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { completeSetBarCopy as copy, fill } from "@/content/home-top";
import { reviewsCopy } from "@/content/reviews";
import { getProduct } from "@/lib/commerce";
import { formatMoney, toNumber } from "@/lib/money";
import { CLAIMS, FREE_SHIPPING_THRESHOLD, HANDLES, productPath } from "@/lib/store-config";

/** The butter-yellow Complete Set offer under the book cards (copy deck §2.4). */
export async function CompleteSetBar() {
  const [set, nc] = await Promise.all([getProduct(HANDLES.completeSet), getProduct(HANDLES.nephiteChristmas)]);
  const variant = set?.variants.find((v) => v.availableForSale) ?? set?.variants[0];
  if (!set || !variant) return null;

  const price = toNumber(variant.price);
  const compareAt = variant.compareAtPrice ? toNumber(variant.compareAtPrice) : 0;
  const hasSavings = compareAt > price;
  const priceLabel = [
    hasSavings && variant.compareAtPrice
      ? fill(copy.priceLabel.separately, { compareAt: formatMoney(variant.compareAtPrice) })
      : null,
    // "You save {savings}" is left out here: the Save pill next to the price already says it.
    CLAIMS.freeShipping && price >= FREE_SHIPPING_THRESHOLD ? copy.priceLabel.freeShipping : null,
  ].filter(Boolean);
  const image = set.images[0];
  // Stars next to the price, named for the book they belong to (the set has no reviews of its own).
  const rating = nc?.ratings.find((r) => r.source === "site" && r.count > 0);

  return (
    <section aria-labelledby="complete-set-heading" id="complete-set" className="bg-cream pb-12 pt-5 sm:pb-20 sm:pt-8">
      <div className="container-page">
        <div className="relative isolate grid items-center gap-4 overflow-hidden rounded-(--radius-card) bg-butter p-5 shadow-soft ring-1 ring-butter-deep sm:gap-6 sm:p-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-x-10 md:gap-y-0 lg:p-10">
          {/* soft highlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 -z-10 size-96 rounded-full bg-radial from-paper/80 to-transparent to-70%"
          />
          {/* Phones: a smaller set image beside the heading; from md the image is the left column. */}
          <div className="flex items-center gap-4 text-left sm:flex-col sm:text-center md:contents">
            {image ? (
              <Link
                href={productPath(set.handle)}
                tabIndex={-1}
                aria-hidden
                prefetch={false}
                className="block w-28 shrink-0 overflow-hidden rounded-2xl shadow-lift ring-4 ring-paper/70 sm:w-full sm:max-w-sm md:row-span-2 md:max-w-none"
              >
                <Img image={image} alt="" sizes="(min-width: 1024px) 440px, (min-width: 768px) 38vw, (min-width: 640px) 24rem, 7rem" className="h-auto w-full" />
              </Link>
            ) : null}
            <div className="min-w-0 md:self-end md:text-left">
              <Badge tone="ember">{copy.badge}</Badge>
              <h2 id="complete-set-heading" className="mt-2 text-2xl font-semibold leading-[1.1] tracking-[-0.01em] sm:mt-3 sm:text-4xl">
                {copy.headline}
              </h2>
            </div>
          </div>

          <div className="sm:text-center md:self-start md:text-left">
            <p className="text-base leading-relaxed text-body sm:text-lg md:mt-3">{copy.sub}</p>
            <p className="mt-3 text-sm font-semibold text-ink">{copy.includes}</p>

            <div className="mt-4 flex flex-col items-start gap-1.5 sm:items-center md:items-start">
              <Price price={variant.price} compareAtPrice={variant.compareAtPrice} reason={variant.compareAtReason} size="xl" hideBundleLabel />
              {priceLabel.length ? <p className="text-sm text-body">{priceLabel.join(" · ")}</p> : null}
              {rating ? (
                <p className="flex flex-wrap items-center gap-x-2 text-sm text-body sm:justify-center md:justify-start">
                  <Stars value={rating.value} size={15} />
                  <span>{reviewsCopy.summary(rating.value.toFixed(1), rating.count)}</span>
                </p>
              ) : null}
            </div>

            {/* While this button is on screen, the sticky mobile bar stays hidden (HomeStickyBar). */}
            <div data-sticky-hide className="mt-5 flex flex-col items-start gap-2.5 sm:items-center md:items-start">
              <AddToCartButton
                variantId={variant.id}
                productHandle={set.handle}
                productTitle={set.title}
                variantTitle={variant.title}
                price={price}
                available={variant.availableForSale}
                variant="accent"
                size="lg"
                className="w-full sm:w-auto"
              >
                {`${copy.cta} — ${formatMoney(variant.price)}`}
              </AddToCartButton>
              <p className="inline-flex items-center gap-1.5 text-sm text-body">
                <Truck aria-hidden className="size-4 shrink-0 text-forest" strokeWidth={1.75} />
                {copy.microline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
