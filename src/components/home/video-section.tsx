import { ChevronDown } from "lucide-react";
import nightSkySrc from "@/assets/images/art/nc-night-bg.jpg";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { readAloud, readAloudCopy, trailer, videoCaptions } from "@/content/home-story";
import { getProduct } from "@/lib/commerce";
import type { Image } from "@/lib/commerce/types";
import { fromStatic } from "@/lib/images";
import { formatMoney, toNumber } from "@/lib/money";
import { HANDLES } from "@/lib/store-config";
import { VideoPlayer, type VideoSource, type VideoTrack } from "./video-player";

// Encodes and posters live in public/video (see public/video/README.md).
const trailerSources: VideoSource[] = [
  { src: "/video/trailer-preview-720.mp4", type: "video/mp4", media: "(max-width: 767px)" },
  { src: "/video/trailer-preview-1080.mp4", type: "video/mp4" },
];
const readAloudSources: VideoSource[] = [{ src: "/video/readaloud-clip.mp4", type: "video/mp4" }];

/** A captions track for each .vtt that exists (none yet; see videoCaptions in home-story). */
const captionsFor = (src: string | null): VideoTrack[] =>
  src ? [{ src, srcLang: videoCaptions.srcLang, label: videoCaptions.label }] : [];

const trailerPoster: Image = { url: "/video/hero-poster.jpg", width: 1920, height: 1080, alt: trailer.posterAlt };
const nightSky = fromStatic(nightSkySrc, "");

/**
 * Homepage §2.7: the 30s family trailer and the read-aloud excerpt, both
 * click-to-play with sound. Until caption files exist, the trailer has a
 * visible text description and the read-aloud a transcript of the pages read.
 */
export async function VideoSection() {
  const nc = await getProduct(HANDLES.nephiteChristmas);
  const variant = nc?.variants.find((v) => v.availableForSale) ?? nc?.variants[0];
  const rating = nc?.ratings.find((r) => r.source === "site" && r.count > 0);
  const ra = readAloudCopy();
  const readAloudPoster: Image = { url: "/video/readaloud-poster.jpg", width: 720, height: 1280, alt: ra.posterAlt };

  /** "Finish the story at home": price, stars and Add to Cart. Shared by both videos. */
  const endCardFor = (line: string) =>
    nc && variant ? (
      <>
        <p className="font-hand text-2xl leading-none text-gold">{line}</p>
        <p className="font-display text-lg leading-snug font-semibold text-white">
          {readAloud.endCard.product(nc.title, formatMoney(variant.price))}
        </p>
        {rating ? (
          <p className="flex items-center gap-1.5 text-xs text-white/80">
            <Stars value={rating.value} size={13} />
            <span aria-hidden className="font-semibold text-white">
              {rating.value.toFixed(1)}
            </span>
            <span>
              ({rating.count}
              <span className="sr-only"> reviews</span>)
            </span>
          </p>
        ) : null}
        <AddToCartButton
          variantId={variant.id}
          productHandle={nc.handle}
          productTitle={nc.title}
          variantTitle={variant.title}
          price={toNumber(variant.price)}
          available={variant.availableForSale}
          variant="night"
          block
          className="max-w-56"
        />
      </>
    ) : undefined;

  return (
    <section aria-labelledby="video-heading" className="relative isolate overflow-hidden bg-night py-12 sm:py-20">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Img image={nightSky} alt="" sizes="100vw" quality={60} className="size-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-linear-to-b from-night/40 via-night/80 to-night" />
      </div>

      <div className="container-page">
        <SectionHeading id="video-heading" title={trailer.heading} subtitle={trailer.sub} align="left" inverted />

        {/*
          From lg the two frames share one height: the columns are split 16/9 : 9/16,
          the same ratio as the frames' own aspect ratios.
        */}
        <div className="mt-6 grid gap-10 sm:mt-8 lg:grid-cols-[minmax(0,1.7778fr)_minmax(0,0.5625fr)] lg:gap-6">
          <div>
            <VideoPlayer
              videoId="trailer"
              videoTitle={trailer.videoTitle}
              sources={trailerSources}
              tracks={captionsFor(videoCaptions.trailer)}
              poster={
                <Img
                  image={trailerPoster}
                  sizes="(min-width: 1280px) 53rem, (min-width: 1024px) 68vw, 100vw"
                  className="size-full object-cover"
                />
              }
              playLabel={trailer.playLabel}
              playDescription={trailer.playAriaLabel}
              endCard={endCardFor(trailer.endCard.line)}
              endCardLabel={trailer.endCardLabel}
              replayLabel={trailer.replay}
              fallbackHref="/video/trailer-preview-720.mp4"
              className="aspect-video rounded-(--radius-card) shadow-lift ring-1 ring-white/10"
            />
            {/* Text description of what the trailer shows (WCAG 1.2.3). */}
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
              <span className="font-semibold text-white">{trailer.description.title}: </span>
              {trailer.description.body}
            </p>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-x-5 gap-y-4 sm:mx-auto sm:w-full sm:max-w-xl sm:grid-cols-[minmax(0,1fr)_11rem] lg:mx-0 lg:max-w-none lg:grid-cols-1 lg:items-start">
            {/* Phones: heading beside the frame. From lg: frame first, so its top lines up with the trailer's. */}
            <div className="lg:order-2">
              <h3 className="text-2xl font-semibold text-white lg:text-xl">{ra.heading}</h3>
              <p className="mt-2 text-white/80">{ra.sub}</p>
            </div>
            <VideoPlayer
              videoId="readaloud"
              videoTitle={readAloud.videoTitle}
              sources={readAloudSources}
              tracks={captionsFor(videoCaptions.readAloud)}
              poster={
                <Img
                  image={readAloudPoster}
                  sizes="(min-width: 1280px) 17rem, (min-width: 1024px) 14rem, (min-width: 640px) 11rem, 8.5rem"
                  className="size-full object-cover"
                />
              }
              playLabel={readAloud.playLabel}
              playDescription={readAloud.playAriaLabel(readAloud.durationSpoken)}
              endCard={endCardFor(readAloud.endCard.line)}
              endCardLabel={readAloud.endCardLabel}
              replayLabel={readAloud.replay}
              fallbackHref="/video/readaloud-clip.mp4"
              size="compact"
              className="aspect-9/16 w-full rounded-(--radius-card) shadow-lift ring-1 ring-white/10 lg:order-1"
            />
            {/* Transcript of the read-aloud (the pages read are the book's own text). */}
            <details className="group col-span-2 rounded-(--radius-card) bg-white/5 ring-1 ring-white/15 lg:order-3 lg:col-span-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                {readAloud.transcript.summary}
                <ChevronDown aria-hidden className="size-5 shrink-0 text-gold transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-white/85">
                <p className="text-white/70">{readAloud.transcript.note}</p>
                <blockquote className="space-y-1.5 border-l-2 border-gold/60 pl-3 font-display text-base text-white">
                  {readAloud.transcript.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </blockquote>
              </div>
            </details>
          </div>
        </div>

        {/* The section's own call to action, for viewers who didn't play either video to the end. */}
        {nc && variant ? (
          <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-8 sm:flex-row sm:justify-center sm:gap-4">
            <AddToCartButton
              variantId={variant.id}
              productHandle={nc.handle}
              productTitle={nc.title}
              variantTitle={variant.title}
              price={toNumber(variant.price)}
              available={variant.availableForSale}
              variant="night"
              size="lg"
              className="w-full sm:w-auto"
            >
              {readAloud.endCard.product(`Get ${nc.title}`, formatMoney(variant.price))}
            </AddToCartButton>
            <a
              href="#peek-inside"
              className="inline-flex min-h-11 items-center font-semibold text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
            >
              {trailer.cta.lookInside}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
