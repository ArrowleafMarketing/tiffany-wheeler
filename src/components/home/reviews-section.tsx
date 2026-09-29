import { Quote } from "lucide-react";
import family07Src from "@/assets/images/lifestyle/family-07.jpg";
import { AutoScrollRow } from "@/components/home/auto-scroll-row";
import { ReviewCard, curlyQuotes, reviewerName } from "@/components/product/review-card";
import { ButtonLink } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { WRITE_REVIEW_HREF } from "@/content/pdp";
import { bythewayTestimonial, featuredReviewRefs, pickReviews, reviewsCopy } from "@/content/reviews";
import { getProduct, getReviews } from "@/lib/commerce";
import { fromStatic } from "@/lib/images";
import { HANDLES, productPath } from "@/lib/store-config";

const grandmaStill = fromStatic(family07Src, "Grandmother and granddaughters smiling over Nephite Christmas");

/**
 * Homepage §2.8: rating summary, a featured quote beside a family still, and
 * verbatim Nephite Christmas reviews. The featured quote is Kim and John
 * Bytheway's only once their permission is on file (CLAIMS.bythewayTestimonial);
 * until then it's the first featured customer review. The other reviews scroll
 * past endlessly in one row of same-size cards.
 */
export async function ReviewsSection() {
  const [nc, all] = await Promise.all([
    getProduct(HANDLES.nephiteChristmas),
    getReviews(HANDLES.nephiteChristmas),
  ]);
  const picked = pickReviews(all, featuredReviewRefs);
  const site = nc?.ratings.find((r) => r.source === "site" && r.count > 0);
  const pdp = productPath(HANDLES.nephiteChristmas);

  const bytheway = bythewayTestimonial.show ? bythewayTestimonial : null;
  const [lead, ...rest] = picked;
  const featuredReview = bytheway ? null : lead;
  const cards = bytheway ? picked : rest;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-20 bg-cream py-12 sm:py-20">
      <div className="container-page">
        <SectionHeading id="reviews-heading" title={reviewsCopy.heading} />
        {site ? (
          <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center font-semibold text-ink sm:mt-4">
            <Stars value={site.value} size={20} />
            <span>{reviewsCopy.summary(site.value.toFixed(1), site.count)}</span>
          </p>
        ) : null}

        {bytheway || featuredReview ? (
          <div className="mt-7 grid overflow-hidden rounded-(--radius-card) bg-night shadow-lift sm:mt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="relative aspect-[2/1] sm:aspect-video md:aspect-auto md:min-h-80">
              <Img
                image={grandmaStill}
                sizes="(min-width: 1216px) 36rem, (min-width: 768px) 48vw, 100vw"
                className="absolute inset-0 size-full object-cover object-[60%_45%]"
              />
            </div>
            <figure className="flex flex-col justify-center px-5 py-6 sm:px-10 sm:py-12">
              <Quote aria-hidden className="size-8 text-gold sm:size-9" strokeWidth={1.5} />
              {featuredReview ? (
                <p className="mt-3 flex items-center gap-2">
                  <Stars value={featuredReview.rating} size={16} />
                  <span aria-hidden className="text-sm font-semibold tabular-nums text-white">
                    {featuredReview.rating.toFixed(1)}
                  </span>
                </p>
              ) : null}
              <blockquote className="mt-3 font-display text-lg leading-snug text-white sm:mt-4 sm:text-2xl">
                <p>“{bytheway ? bytheway.quote : curlyQuotes(featuredReview?.body ?? "")}”</p>
              </blockquote>
              <figcaption className="mt-4 sm:mt-5">
                <span className="font-semibold text-gold">
                  — {bytheway ? bytheway.name : reviewerName(featuredReview?.author ?? "")}
                </span>
                {bytheway?.note ? <span className="mt-1 block text-sm text-white/70">{bytheway.note}</span> : null}
              </figcaption>
            </figure>
          </div>
        ) : null}

        {cards.length ? (
          <div className="mt-6 sm:mt-10">
            <AutoScrollRow duration={cards.length * 9} labels={reviewsCopy.row}>
              {cards.map((review) => (
                // Same size for every card: the text is clamped and the name sits at the bottom.
                <ReviewCard
                  key={review.id}
                  review={review}
                  className="h-[19rem] w-[18rem] sm:w-80 [&_blockquote_p]:line-clamp-5 [&_figcaption]:mt-auto [&_figcaption]:h-[5rem] [&_figcaption]:content-start [&_figcaption]:pt-4"
                />
              ))}
            </AutoScrollRow>
          </div>
        ) : null}

        <div className="mt-1 flex flex-col items-center justify-center gap-1 sm:mt-4 sm:flex-row sm:gap-3">
          {site ? (
            <ButtonLink href={`${pdp}#reviews`} variant="outline" className="w-full sm:w-auto">
              {reviewsCopy.readAll(site.count)}
            </ButtonLink>
          ) : null}
          {/* Same destination as the product page's own button (no review app yet). Not on phones:
              cold visitors there need the buy path, and reviewers can use the product page. */}
          <ButtonLink href={WRITE_REVIEW_HREF} prefetch={false} variant="ghost" className="max-sm:hidden">
            {reviewsCopy.write}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
