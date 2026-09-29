import { Quote } from "lucide-react";
import { ReviewCard } from "@/components/product/review-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { PDP_COPY } from "@/content/pdp";
import { bythewayTestimonial, reviewsCopy } from "@/content/reviews";
import type { Rating, Review } from "@/lib/commerce/types";
import { CLAIMS } from "@/lib/store-config";

type Props = {
  /** Nephite Christmas's own site rating (count and value from the catalog, never typed). */
  rating?: Rating;
  /** The page's picks, verbatim (with the deck's trims) from getReviews(). */
  reviews: Review[];
};

/**
 * Four real reviews, plus Kim and John Bytheway's note only once written
 * permission is on file (CLAIMS.bythewayTestimonial), with the FTC disclosure
 * when they received the book free. No Amazon line: it sends price-sensitive
 * visitors to a cheaper listing.
 */
export function LpReviews({ rating, reviews }: Props) {
  if (reviews.length === 0) return null;
  const bytheway = CLAIMS.bythewayTestimonial ? bythewayTestimonial : null;
  const bythewayNote =
    bytheway?.note ?? (CLAIMS.bythewayComplimentaryCopy ? PDP_COPY.reviews.complimentary : null);

  return (
    <section id="reviews" aria-labelledby="lp-reviews-heading" className="scroll-mt-24 bg-cream py-12 sm:py-16">
      <div className="container-page">
        <SectionHeading id="lp-reviews-heading" title={reviewsCopy.heading} />
        {rating ? (
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-body">
            <Stars value={rating.value} size={18} label={PDP_COPY.ratingAria(rating.value.toFixed(1), rating.count)} />
            <span aria-hidden className="font-semibold text-ink">
              {reviewsCopy.summary(rating.value.toFixed(1), rating.count)}
            </span>
          </p>
        ) : null}

        {bytheway ? (
          <figure className="mx-auto mt-8 max-w-3xl rounded-(--radius-card) bg-night px-6 py-7 text-white shadow-lift sm:px-10">
            <Quote aria-hidden className="size-8 text-gold" strokeWidth={1.5} />
            <blockquote className="mt-3 font-display text-lg leading-snug sm:text-xl">
              <p>“{bytheway.quote}”</p>
            </blockquote>
            <figcaption className="mt-4">
              <span className="font-semibold text-gold">— {bytheway.name}</span>
              {bythewayNote ? <span className="mt-1 block text-sm text-white/75">{bythewayNote}</span> : null}
            </figcaption>
          </figure>
        ) : null}

        <ul className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.id} className="grid">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
