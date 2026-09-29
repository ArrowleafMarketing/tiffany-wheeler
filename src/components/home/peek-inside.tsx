import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { PeekInsideCarousel } from "@/components/product/peek-inside-carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { peekInside } from "@/content/home-story";
import { reviewsCopy } from "@/content/reviews";
import { getProduct, type Product } from "@/lib/commerce";
import { formatMoney, toNumber } from "@/lib/money";
import { getCurrentSeason } from "@/lib/season";
import { HANDLES } from "@/lib/store-config";
import { PeekInsideTabs, type PeekTab } from "./peek-inside-tabs";

const siteRating = (p: Product | null) => p?.ratings.find((r) => r.source === "site" && r.count > 0);

/** A taste, not the whole book: the first spreads of each. */
const PREVIEW_SPREADS = 5;

/** Homepage §2.6: tabbed spreads from both books (the season's book first), then the Complete Set CTA. */
export async function PeekInside() {
  const [season, nc, ej, set] = await Promise.all([
    getCurrentSeason(),
    getProduct(HANDLES.nephiteChristmas),
    getProduct(HANDLES.easterJourney),
    getProduct(HANDLES.completeSet),
  ]);

  const tabs: PeekTab[] = [];
  for (const book of [nc, ej]) {
    if (!book?.peekInside?.length) continue;
    tabs.push({
      id: book.holiday ?? book.handle,
      label: book.title,
      panel: (
        <>
          <PeekInsideCarousel title={peekInside.carouselTitle(book.title)} spreads={book.peekInside.slice(0, PREVIEW_SPREADS)} />
        </>
      ),
    });
  }
  if (tabs.length === 0) return null;

  const setVariant = set?.variants.find((v) => v.availableForSale) ?? set?.variants[0];
  const rating = siteRating(set) ?? siteRating(nc);

  return (
    <section
      id="peek-inside"
      aria-labelledby="peek-inside-heading"
      className="scroll-mt-20 bg-cream-deep py-12 sm:py-20"
    >
      <div className="container-page">
        <SectionHeading id="peek-inside-heading" title={peekInside.heading} subtitle={peekInside.intro} />

        <div className="mt-6 sm:mt-10">
          <PeekInsideTabs tabs={tabs} defaultTab={season.featured} label={peekInside.tablistLabel} />
        </div>

        {set && setVariant ? (
          // data-sticky-hide: keeps the sticky bar's (identical) button out of view while this one is on screen.
          <div data-sticky-hide className="mt-8 flex flex-col items-center gap-3 text-center sm:mt-10">
            <AddToCartButton
              variantId={setVariant.id}
              productHandle={set.handle}
              productTitle={set.title}
              variantTitle={setVariant.title}
              price={toNumber(setVariant.price)}
              available={setVariant.availableForSale}
              variant="accent"
              size="lg"
              className="w-full max-w-sm"
            >
              {peekInside.cta(formatMoney(setVariant.price))}
            </AddToCartButton>
            {rating ? (
              <p className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-body">
                <Stars value={rating.value} size={15} />
                <span>{reviewsCopy.summary(rating.value.toFixed(1), rating.count)}</span>
              </p>
            ) : null}
            <Link
              href="/shop"
              prefetch={false}
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-periwinkle-text underline-offset-4 hover:underline"
            >
              {peekInside.secondaryLink}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
