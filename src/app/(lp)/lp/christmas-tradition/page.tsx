import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/home/faq-list";
import { LpAuthor } from "@/components/lp/lp-author";
import { LpFinalCta } from "@/components/lp/lp-final-cta";
import { LpHeroMedia } from "@/components/lp/lp-hero-media";
import { LpPeekInside } from "@/components/lp/lp-peek-inside";
import { LpReasons } from "@/components/lp/lp-reasons";
import { LpReviews } from "@/components/lp/lp-reviews";
import { LpValueStack } from "@/components/lp/lp-value-stack";
import { BookCover } from "@/components/product/book-cover";
import { BuyBox, BuyBoxProvider, PDP_END_ID } from "@/components/product/buy-box";
import { buyBoxConfig, giftOptionHandles } from "@/components/product/buy-box-config";
import { DeliveryPromise } from "@/components/product/delivery-promise";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { TrustStrip } from "@/components/product/trust-strip";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { faqsById } from "@/content/faq";
import {
  LP_CHRISTMAS_PATH,
  lpFaqCopy,
  lpFinalCtaCopy,
  lpHeroCopy,
  lpMeta,
  lpReviewRefs,
} from "@/content/lp";
import { BUY_BOX_TRUST, PDP_COPY } from "@/content/pdp";
import { pickReviews } from "@/content/reviews";
import { getProduct, getProducts, getReviews } from "@/lib/commerce";
import { formatMonthDay } from "@/lib/delivery";
import { getCurrentSeason } from "@/lib/season";
import { HANDLES } from "@/lib/store-config";

// Nephite Christmas paid-social landing page (docs/discovery/market-cro.md
// §6(b)). One job: buy the book (or both books). Message-matched to the ad's
// rhyme angle; no nav, no exits except the store policies. Everything is
// cached, so the page is a fully static shell served from the CDN.

export async function generateMetadata(): Promise<Metadata> {
  const book = await getProduct(HANDLES.nephiteChristmas);
  const image = book?.images[0];
  return {
    title: { absolute: lpMeta.title },
    description: lpMeta.description,
    alternates: { canonical: LP_CHRISTMAS_PATH },
    // Ad traffic only: keep it out of search so it doesn't compete with the product page.
    robots: { index: false, follow: false },
    openGraph: {
      title: lpMeta.title,
      description: lpMeta.description,
      url: LP_CHRISTMAS_PATH,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
  };
}

// Rendered widths of the hero cover (the page's LCP image), with a 3x-screen branch.
const COVER_SIZES = "(min-width: 1024px) 26rem, (min-width: 640px) 50vw, (min-resolution: 3dppx) 40vw, 58vw";
const SET_SIZES = "(min-width: 1024px) 30rem, (min-width: 640px) 60vw, 90vw";

export default async function ChristmasTraditionPage() {
  const [season, book, set, allReviews] = await Promise.all([
    getCurrentSeason(),
    getProduct(HANDLES.nephiteChristmas),
    getProduct(HANDLES.completeSet),
    getReviews(HANDLES.nephiteChristmas),
  ]);
  if (!book) notFound();

  const [giftOptions, parts] = await Promise.all([
    getProducts({ handles: giftOptionHandles(book) }),
    set ? getProducts({ handles: [HANDLES.nephiteChristmas, HANDLES.easterJourney] }) : Promise.resolve([]),
  ]);

  const config = buyBoxConfig(book, giftOptions);
  const rating = book.ratings.find((r) => r.source === "site" && r.count > 0 && !r.borrowedFrom);
  const reviews = pickReviews(allReviews, lpReviewRefs);
  const faqs = faqsById(season, lpFaqCopy.ids);
  const cover = book.images[0];
  const setImage = set?.images[0];
  const orderByNote =
    season.mode === "christmas" && season.orderBy ? lpFinalCtaCopy.orderBy(formatMonthDay(season.orderBy)) : null;

  return (
    <main id="main" className="flex-1">
      <BuyBoxProvider config={config}>
        {/* Hero + buy box: on a 390px phone the Add to Cart sits on the first screen. */}
        <section aria-labelledby="lp-title" className="bg-cream">
          <div className="container-page grid grid-cols-1 gap-4 pb-10 pt-3 sm:gap-8 sm:pb-14 sm:pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <LpHeroMedia
              bothHandle={HANDLES.completeSet}
              single={cover ? <BookCover cover={cover} sizes={COVER_SIZES} preload className="h-[86%] w-auto" /> : null}
              both={
                setImage ? (
                  <Img image={setImage} sizes={SET_SIZES} className="size-full object-contain" />
                ) : null
              }
            />

            <div className="min-w-0">
              <h1
                id="lp-title"
                className="text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.015em] sm:text-4xl lg:text-[2.75rem]"
              >
                {lpHeroCopy.title}
              </h1>

              {rating ? (
                <a
                  href="#reviews"
                  aria-label={PDP_COPY.ratingAria(rating.value.toFixed(1), rating.count)}
                  className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink hover:underline sm:mt-2"
                >
                  <span aria-hidden className="inline-flex">
                    <Stars value={rating.value} size={15} />
                  </span>
                  <span aria-hidden>{PDP_COPY.ratingLink(rating.value.toFixed(1), rating.count)}</span>
                </a>
              ) : null}

              <BuyBox
                className="mt-2 sm:mt-4"
                slots={{
                  physical: {
                    delivery: (
                      <DeliveryPromise requiresShipping holiday="christmas" pdfAlternative />
                    ),
                    below: <TrustStrip variant="inline" ids={BUY_BOX_TRUST.physical} />,
                  },
                }}
              />
            </div>
          </div>
        </section>

        {book.peekInside?.length ? <LpPeekInside title={book.title} spreads={book.peekInside.slice(0, 5)} /> : null}

        <LpReasons />

        <LpReviews rating={rating} reviews={reviews} />

        {set ? <LpValueStack set={set} parts={parts} /> : null}

        <LpAuthor />

        {faqs.length ? (
          <section aria-labelledby="lp-faq-heading" className="border-t border-line bg-paper py-12 sm:py-16">
            <div className="container-page grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-16">
              <SectionHeading id="lp-faq-heading" align="left" title={lpFaqCopy.title} />
              <FaqList items={faqs} />
            </div>
          </section>
        ) : null}

        <LpFinalCta
          eyebrow={lpFinalCtaCopy.eyebrow}
          headline={lpFinalCtaCopy.headline}
          note={orderByNote}
          below={<TrustStrip variant="inline" ids={lpFinalCtaCopy.trustIds} />}
        />

        <div id={PDP_END_ID} aria-hidden />
        <StickyBuyBar />
      </BuyBoxProvider>
    </main>
  );
}
