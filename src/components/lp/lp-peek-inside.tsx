import { VideoPlayer, type VideoSource } from "@/components/home/video-player";
import { PeekInsideCarousel } from "@/components/product/peek-inside-carousel";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { trailer as trailerStory } from "@/content/home-story";
import { lpTrailerCopy as copy } from "@/content/lp";
import { PDP_COPY } from "@/content/pdp";
import type { Image, PeekSpread } from "@/lib/commerce/types";

// The vertical 9:16 cut of the 30s trailer, the same edit the ads use
// (public/video/README.md). AV1 first; browsers that can't decode it skip to H.264.
const sources: VideoSource[] = [
  // 16-second cut (the full-length files live in assets/derived/video-full/).
  { src: "/video/hero-mobile-preview.mp4", type: "video/mp4" },
];
const poster: Image = { url: "/video/hero-mobile-poster.jpg", width: 1080, height: 1920, alt: copy.posterAlt };

// Rendered widths of the portrait frame: 9.5rem on phones, 12rem from sm, 17rem from lg.
const POSTER_SIZES = "(min-width: 1024px) 17rem, (min-width: 640px) 12rem, 9.5rem";

type Props = {
  title: string;
  spreads: PeekSpread[];
};

/**
 * The book's own pages (swipeable spreads, single pages on phones) and the
 * vertical trailer beside them. Both are click/swipe to load: the carousel
 * mounts images as they come near, and the video downloads nothing but its
 * poster until someone presses play (preload="none").
 */
export function LpPeekInside({ title, spreads }: Props) {
  return (
    <section aria-labelledby="lp-peek-heading" id="peek-inside" className="scroll-mt-24 bg-cream-deep py-12 sm:py-16">
      <div className="container-page">
        <SectionHeading id="lp-peek-heading" title={PDP_COPY.sections.peekInside} subtitle={PDP_COPY.peekIntro} />
        <div className="mt-7 grid grid-cols-1 gap-10 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:gap-10">
          <PeekInsideCarousel title={PDP_COPY.peekLabel(title)} spreads={spreads} />

          <div className="grid grid-cols-[minmax(0,1fr)_9.5rem] items-center gap-x-4 gap-y-4 sm:mx-auto sm:w-full sm:max-w-xl sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-x-6 lg:mx-0 lg:max-w-none lg:grid-cols-1">
            <div>
              <h3 className="text-xl font-semibold leading-snug sm:text-2xl">{copy.heading}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-body sm:text-base">{copy.sub}</p>
            </div>
            <VideoPlayer
              videoId="trailer-vertical"
              videoTitle={copy.videoTitle}
              sources={sources}
              poster={<Img image={poster} sizes={POSTER_SIZES} className="size-full object-cover" />}
              playLabel={copy.playLabel}
              playDescription={copy.playDescription}
              fallbackHref="/video/hero-mobile-preview.mp4"
              size="compact"
              className="aspect-9/16 w-full rounded-(--radius-card) shadow-lift ring-1 ring-black/5"
            />
            {/* What the trailer shows, in words (WCAG 1.2.1: the vertical cut has no audio). */}
            <p className="col-span-2 text-sm leading-relaxed text-muted lg:col-span-1">
              <span className="font-semibold text-ink">{trailerStory.description.title}: </span>
              {trailerStory.description.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
