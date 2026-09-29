import { Bird, MoonStar, Music, Sparkles, type LucideIcon } from "lucide-react";
import doveSrc from "@/assets/images/art/dove.webp";
import jacobDrawsSrc from "@/assets/images/art/nc-jacob-draws.jpg";
import { curlyQuotes, reviewerName } from "@/components/product/review-card";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { whyFamilies, type Reason } from "@/content/home-story";
import { doveProofRef, pickReviews } from "@/content/reviews";
import { getReviews } from "@/lib/commerce";
import { fromStatic } from "@/lib/images";
import { HANDLES } from "@/lib/store-config";

const icons: Record<Reason["icon"], LucideIcon> = {
  rhythm: Music,
  dove: Bird,
  night: Sparkles,
  "christmas-eve": MoonStar,
};

const jacobDraws = fromStatic(jacobDrawsSrc, whyFamilies.imageAlt);
const dove = fromStatic(doveSrc, "");

/**
 * Homepage §2.5, with the strongest §2.10 use case folded in: four reasons,
 * Jacob drawing, and a one-line proof from a real review.
 */
export async function WhyFamilies() {
  const reviews = await getReviews(HANDLES.nephiteChristmas);
  const [proof] = pickReviews(reviews, [doveProofRef]);

  return (
    <section aria-labelledby="why-families-heading" className="overflow-hidden bg-paper py-12 sm:py-20">
      <div className="container-page grid items-center gap-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 lg:gap-20">
        {/* Phones skip the art (Peek Inside shows the pages) to keep the page short. */}
        <div className="relative mx-auto w-full max-w-72 max-sm:hidden md:max-w-sm">
          {/* The art has a white ground and is cropped at its left and bottom edges: multiply
              lays it onto the card, and the card's edges make the crop look intentional. */}
          <div className="overflow-hidden rounded-[2rem] bg-butter pt-8 pr-8 shadow-soft">
            <Img
              image={jacobDraws}
              sizes="(min-width: 768px) 22rem, 16rem"
              className="h-auto w-full mix-blend-multiply"
            />
          </div>
          <Img
            image={dove}
            alt=""
            sizes="6rem"
            className="absolute -top-8 -right-3 h-auto w-20 rotate-12 drop-shadow-[0_6px_10px_rgb(40_25_5/0.15)] md:-right-8 md:w-24"
          />
        </div>

        <div>
          <SectionHeading id="why-families-heading" title={whyFamilies.heading} align="left" />
          <ol data-reveal-stagger className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
            {whyFamilies.reasons.map((reason) => {
              const Icon = icons[reason.icon];
              return (
                <li key={reason.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-periwinkle-light text-periwinkle-text sm:size-12">
                    <Icon aria-hidden className="size-5 sm:size-6" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold leading-snug sm:text-xl">{reason.title}</h3>
                    <p className="mt-1 leading-relaxed text-body">{reason.line}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-muted sm:pl-16">{whyFamilies.alsoFor}</p>

          {/* Phones skip the proof line: the same review is one of the cards on the page. */}
          {proof ? (
            <figure className="mt-7 border-l-4 border-butter-deep pl-4 max-sm:hidden">
              <blockquote className="font-display text-lg leading-snug text-ink sm:text-xl">
                <p>“{curlyQuotes(proof.body)}”</p>
              </blockquote>
              <figcaption className="mt-2 flex items-center gap-2 text-sm text-muted">
                <Stars value={proof.rating} size={14} />
                <span aria-hidden className="font-semibold tabular-nums text-ink">
                  {proof.rating.toFixed(1)}
                </span>
                <span>— {reviewerName(proof.author)}</span>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}
