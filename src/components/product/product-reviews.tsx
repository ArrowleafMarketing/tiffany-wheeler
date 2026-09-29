import { Quote } from "lucide-react";
import { ReviewCard } from "@/components/product/review-card";
import { buttonClasses, ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import {
  FEATURED_REVIEW_ORDER,
  PDP_COPY,
  REVIEWS_VISIBLE,
  WRITE_REVIEW_HREF,
  WRITE_REVIEW_ID,
} from "@/content/pdp";
import { bythewayTestimonial } from "@/content/reviews";
import type { Product, Review } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { CLAIMS, HANDLES } from "@/lib/store-config";

type Props = {
  product: Product;
  /** Reviews to show: this product's, or Nephite Christmas's for bundles that contain it. */
  reviews: Review[];
  className?: string;
};

/** Deck order first (featured, then alternates), then newest first. */
function ordered(reviews: Review[]): Review[] {
  const rank = (r: Review) => {
    const i = FEATURED_REVIEW_ORDER.indexOf(r.author);
    return i === -1 ? FEATURED_REVIEW_ORDER.length : i;
  };
  return [...reviews].sort((a, b) => rank(a) - rank(b) || b.date.localeCompare(a.date));
}

function WriteReviewLink({ children, className }: { children: string; className?: string }) {
  return (
    <ButtonLink
      id={WRITE_REVIEW_ID}
      href={WRITE_REVIEW_HREF}
      variant="outline"
      size="sm"
      className={cn("scroll-mt-28", className)}
    >
      {children}
    </ButtonLink>
  );
}

/**
 * Reviews section (#reviews): summary, cards (3 on phones, 6 wider), a "Read all"
 * disclosure that stays in place when opened (so focus isn't lost). Works without JavaScript (native <details>).
 */
export function ProductReviews({ product, reviews, className }: Props) {
  // No reviews, no section: the page never says a product hasn't been reviewed.
  if (reviews.length === 0) return null;

  const site = product.ratings.find((r) => r.source === "site" && r.count > 0);
  const borrowedFrom = site?.borrowedFrom;
  const heading = borrowedFrom ? PDP_COPY.bundleReviews : PDP_COPY.sections.reviews;
  const sorted = ordered(reviews);
  const shown = sorted.slice(0, REVIEWS_VISIBLE.wide);
  const phoneExtra = sorted.slice(REVIEWS_VISIBLE.phone, REVIEWS_VISIBLE.wide);
  const rest = sorted.slice(REVIEWS_VISIBLE.wide);
  const aboutNc = product.handle === HANDLES.nephiteChristmas || borrowedFrom === "Nephite Christmas";
  // Named endorsement: only with written permission, and disclosed if the copy was free (FTC).
  const bytheway = CLAIMS.bythewayTestimonial && aboutNc ? bythewayTestimonial : null;
  const bythewayNote =
    bytheway?.note ?? (CLAIMS.bythewayComplimentaryCopy ? PDP_COPY.reviews.complimentary : null);

  return (
    <section
      id="reviews"
      aria-labelledby="pdp-reviews"
      className={cn("scroll-mt-24 border-t border-line bg-paper py-14 sm:py-20", className)}
    >
      <div className="container-page">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionHeading id="pdp-reviews" align="left" title={heading} />
              {site ? (
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-body">
                  <Stars
                    value={site.value}
                    size={18}
                    label={
                      borrowedFrom
                        ? PDP_COPY.ratingAriaOf(site.value.toFixed(1), site.count, borrowedFrom)
                        : PDP_COPY.ratingAria(site.value.toFixed(1), site.count)
                    }
                  />
                  <span aria-hidden className="font-semibold text-ink">
                    {borrowedFrom
                      ? PDP_COPY.ratingLinkOf(site.value.toFixed(1), site.count, borrowedFrom)
                      : PDP_COPY.ratingLink(site.value.toFixed(1), site.count)}
                  </span>
                </p>
              ) : null}
            </div>
            <WriteReviewLink className="self-start sm:self-auto">{PDP_COPY.reviews.write}</WriteReviewLink>
          </div>

          {bytheway ? (
            <figure className="mt-8 rounded-(--radius-card) bg-night px-6 py-7 text-white shadow-lift sm:px-10">
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

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((review, i) => (
              <li key={review.id} className={cn("grid", i >= REVIEWS_VISIBLE.phone && "max-sm:hidden")}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>

          {phoneExtra.length > 0 || rest.length > 0 ? (
            // The summary stays visible (its text flips), so focus never drops to <body>.
            <details className={cn("group/more mt-4", rest.length === 0 && "sm:hidden")}>
              <summary className="mx-auto block w-fit cursor-pointer list-none rounded-(--radius-btn) [&::-webkit-details-marker]:hidden">
                <span className={buttonClasses({ variant: "outline" })}>
                  <span className="group-open/more:hidden">
                    {PDP_COPY.reviews.readAll(site?.count ?? reviews.length)}
                  </span>
                  <span className="hidden group-open/more:inline">{PDP_COPY.reviews.showFewer}</span>
                </span>
              </summary>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Phones show 3 cards up top; their next 3 open here (larger screens already show them). */}
                {phoneExtra.map((review) => (
                  <li key={`phone-${review.id}`} className="grid sm:hidden">
                    <ReviewCard review={review} />
                  </li>
                ))}
                {rest.map((review) => (
                  <li key={review.id} className="grid">
                    <ReviewCard review={review} />
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
      </div>
    </section>
  );
}
