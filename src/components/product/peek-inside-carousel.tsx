"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageProps } from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { Image, PeekSpread } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { carouselCopy } from "@/content/home-story";

type Props = {
  /** Accessible name of the carousel, e.g. “Inside Nephite Christmas”. Not rendered visibly: the parent section owns the heading. */
  title: string;
  spreads: PeekSpread[];
};

/** At or above this width:height ratio an image is a two-page spread (it gets a center fold). */
const SPREAD_RATIO = 1.5;
/** Inner width of a slide at its widest: max-w-5xl minus the card padding and border. */
const MAX_INNER_PX = 974;
const QUALITY = 85;
/** Below this width a spread with `mobilePages` becomes two single-page slides (Tailwind's sm). */
const PHONE_QUERY = "(max-width: 639.98px)";

const ratio = (img: Image) => img.width / img.height;
const pct = (n: number) => `${Math.round(n * 10000) / 100}%`;

type Slide = {
  key: string;
  spread: number;
  /** Phones only: which half of a split spread this slide is. */
  side: "left" | "right" | null;
  /** Rendered only below 640px: the right-hand page of a split spread. */
  mobileOnly: boolean;
  /** Below 640px. */
  mobile: Image;
  /** From 640px up (the same object as `mobile` when there is no page crop). */
  desktop: Image;
  alt: string;
  /** Where the fold shadow sits on phones. */
  mobileFold: "left" | "right" | "center" | null;
  caption?: string;
  quote?: string;
  /** On phones the quote moves to the right-hand page slide. */
  quoteDesktopOnly: boolean;
};

function buildSlides(spreads: PeekSpread[]): Slide[] {
  return spreads.flatMap((s, i): Slide[] => {
    if (!s.mobilePages) {
      return [
        {
          key: `${i}`,
          spread: i,
          side: null,
          mobileOnly: false,
          mobile: s.image,
          desktop: s.image,
          alt: s.image.alt,
          mobileFold: ratio(s.image) >= SPREAD_RATIO ? "center" : null,
          caption: s.caption,
          quote: s.quote,
          quoteDesktopOnly: false,
        },
      ];
    }
    const [left, right] = s.mobilePages;
    // Both halves carry the caption, so every card reads the same way; the
    // right-hand page adds the line from the book under it.
    return [
      {
        key: `${i}`,
        spread: i,
        side: "left",
        mobileOnly: false,
        mobile: left,
        desktop: s.image,
        alt: s.image.alt,
        mobileFold: "right",
        caption: s.caption,
        quote: s.quote,
        quoteDesktopOnly: Boolean(s.quote),
      },
      {
        key: `${i}-r`,
        spread: i,
        side: "right",
        mobileOnly: true,
        mobile: right,
        desktop: right,
        alt: right.alt,
        mobileFold: "left",
        caption: s.caption,
        quote: s.quote,
        quoteDesktopOnly: false,
      },
    ];
  });
}

function subscribePhone(onChange: () => void) {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const isPhoneNow = () => window.matchMedia(PHONE_QUERY).matches;
const isPhoneOnServer = () => false;

/**
 * Horizontal scroll-snap carousel of book spreads, each on a paper card with a
 * soft center fold. Below 640px a spread with `mobilePages` becomes two
 * consecutive single-page slides ("left page", "right page"). The track is
 * focusable: Left/Right arrows, Home and End turn the page.
 *
 * Loading: nothing here is ever eager or preloaded (the carousel always sits
 * below the fold). The first slide's image is lazy; the next two only mount
 * once the track comes within about a screen of the viewport, and further ones
 * as the visitor reaches them. Slides without their image yet still carry the
 * alt text, so screen readers never meet an empty slide.
 */
export function PeekInsideCarousel({ title, spreads }: Props) {
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(spreads.length <= 1);
  // Browsers treat every slide of a horizontal track as "near" the viewport, so
  // loading="lazy" alone would fetch every spread. Images mount only up to two
  // slides past the furthest one reached, and only once the track is close.
  const [reach, setReach] = useState(0);
  const near = useRef(false);
  const phone = useSyncExternalStore(subscribePhone, isPhoneNow, isPhoneOnServer);

  const total = spreads.length;
  const slides = buildSlides(spreads);
  // The slides actually shown at this width (phones add the right-hand pages).
  const visible = phone ? slides : slides.filter((s) => !s.mobileOnly);

  const labelOf = (slide: Slide | undefined) => {
    if (!slide) return carouselCopy.position(1, total);
    return phone && slide.side
      ? carouselCopy.pagePosition(slide.spread + 1, total, slide.side)
      : carouselCopy.position(slide.spread + 1, total);
  };

  // The widest image sets each breakpoint's frame; narrower ones sit centered in it,
  // so every slide has the same height and nothing shifts while images load.
  const desktopStage = total ? Math.max(...spreads.map((s) => ratio(s.image))) : 1;
  const pageRatios = spreads.flatMap((s) => (s.mobilePages ? s.mobilePages.map(ratio) : []));
  const mobileStage = pageRatios.length ? Math.max(...pageRatios) : desktopStage;

  const shownSlides = useCallback(() => {
    const track = trackRef.current;
    if (!track) return [];
    return Array.from(track.querySelectorAll<HTMLElement>("[data-slide]")).filter((el) => el.offsetWidth > 0);
  }, []);

  const currentIndex = useCallback((els: HTMLElement[]) => {
    const track = trackRef.current;
    if (!track || els.length === 0) return 0;
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) return els.length - 1;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    els.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    return best;
  }, []);

  const sync = useCallback(() => {
    const els = shownSlides();
    if (els.length === 0) return;
    const i = currentIndex(els);
    setActiveIndex(i);
    setAtStart(i === 0);
    setAtEnd(i === els.length - 1);
    if (!near.current) return;
    const index = Number(els[i].dataset.index ?? 0);
    setReach((r) => Math.max(r, index + 2));
  }, [currentIndex, shownSlides]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = requestAnimationFrame(sync);
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sync]);

  // Mount the next two slides' images only once the track is within about a screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || near.current) return;
    if (typeof IntersectionObserver === "undefined") {
      near.current = true;
      const frame = requestAnimationFrame(sync);
      return () => cancelAnimationFrame(frame);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.current = true;
        io.disconnect();
        sync();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(track);
    return () => io.disconnect();
  }, [sync]);

  const go = useCallback(
    (to: "prev" | "next" | "first" | "last") => {
      const track = trackRef.current;
      const els = shownSlides();
      if (!track || els.length === 0) return;
      const current = currentIndex(els);
      const target = to === "first" ? 0 : to === "last" ? els.length - 1 : current + (to === "next" ? 1 : -1);
      const el = els[Math.max(0, Math.min(els.length - 1, target))];
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({
        left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [currentIndex, shownSlides],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const action = (
      { ArrowLeft: "prev", ArrowRight: "next", Home: "first", End: "last" } as const
    )[e.key as "ArrowLeft" | "ArrowRight" | "Home" | "End"];
    if (!action) return;
    e.preventDefault();
    go(action);
  };

  if (total === 0) return null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div
        ref={trackRef}
        id={trackId}
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="scrollbar-none relative -mx-4 flex items-start snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 py-3 focus-visible:outline-offset-[-3px] sm:-mx-3 sm:items-stretch sm:gap-6 sm:px-3"
      >
        {slides.map((slide, i) => (
          <SlideCard
            key={slide.key}
            slide={slide}
            index={i}
            showImage={i <= reach}
            label={labelOf(slide)}
            desktopStage={desktopStage}
            mobileStage={mobileStage}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p aria-live="polite" aria-atomic="true" className="text-sm font-semibold tabular-nums text-ink">
            {labelOf(visible[activeIndex])}
          </p>
          <p aria-hidden className="font-hand text-lg leading-tight text-periwinkle-text sm:hidden">
            {carouselCopy.mobileHint}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <ArrowButton label={carouselCopy.previous} controls={trackId} disabled={atStart} onClick={() => go("prev")}>
            <ChevronLeft aria-hidden className="size-5" />
          </ArrowButton>
          <ArrowButton label={carouselCopy.next} controls={trackId} disabled={atEnd} onClick={() => go("next")}>
            <ChevronRight aria-hidden className="size-5" />
          </ArrowButton>
        </div>
      </div>
    </div>
  );
}

/**
 * aria-disabled rather than `disabled`: a disabled button drops keyboard focus
 * to <body> the moment the last (or first) slide is reached.
 */
function ArrowButton({
  label,
  controls,
  disabled,
  onClick,
  children,
}: {
  label: string;
  controls: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={controls}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onClick();
      }}
      className="grid size-12 place-items-center rounded-full border-2 border-ink/15 bg-paper text-ink shadow-soft transition-colors hover:border-ink/30 hover:bg-white aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:shadow-none aria-disabled:hover:border-ink/15 aria-disabled:hover:bg-paper"
    >
      {children}
    </button>
  );
}

function SlideCard({
  slide,
  index,
  showImage,
  label,
  desktopStage,
  mobileStage,
}: {
  slide: Slide;
  index: number;
  showImage: boolean;
  label: string;
  desktopStage: number;
  mobileStage: number;
}) {
  const rm = ratio(slide.mobile);
  const rd = ratio(slide.desktop);
  // Share of the frame's width the image fills (1 = full width).
  const wm = Math.min(1, rm / mobileStage);
  const wd = Math.min(1, rd / desktopStage);
  const artDirected = slide.mobile !== slide.desktop;

  // Phones: the slide is 88% of the track, minus its padding (about 76vw on a 375px screen).
  const mobileSize = `${Math.round(76 * wm)}vw`;
  const desktopSizes = [`(min-width: 1088px) ${Math.round(MAX_INNER_PX * wd)}px`, `${Math.round(88 * wd)}vw`];

  // Always lazy: React preloads any server-rendered <img> that isn't, and this sits far below the fold.
  const common = { alt: slide.alt, quality: QUALITY, loading: "lazy" } as const;
  const { props: img } = getImageProps({
    ...common,
    src: slide.mobile.url,
    width: slide.mobile.width,
    height: slide.mobile.height,
    sizes: artDirected ? mobileSize : [desktopSizes[0], `(min-width: 640px) ${desktopSizes[1]}`, mobileSize].join(", "),
  });
  const desktopSource = artDirected
    ? getImageProps({
        ...common,
        src: slide.desktop.url,
        width: slide.desktop.width,
        height: slide.desktop.height,
        sizes: desktopSizes.join(", "),
      }).props
    : null;

  const vars = {
    "--stage-m": `${mobileStage}`,
    "--stage-d": `${desktopStage}`,
    "--ar-m": `${rm}`,
    "--ar-d": `${rd}`,
    "--w-m": pct(wm),
    "--w-d": pct(wd),
  } as CSSProperties;

  // A plain <img> is required inside <picture>; its srcset comes from getImageProps (optimized).
  // eslint-disable-next-line @next/next/no-img-element
  const image = <img {...img} alt={slide.alt} className="absolute inset-0 size-full object-cover" />;

  return (
    <div
      data-slide
      data-index={index}
      data-spread={slide.spread}
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      className={cn(
        "flex w-[88%] shrink-0 snap-center flex-col rounded-(--radius-card) border border-line bg-paper p-3 shadow-soft sm:w-full sm:p-6",
        slide.mobileOnly && "sm:hidden",
      )}
      style={vars}
    >
      <div className="flex aspect-(--stage-m) items-center justify-center sm:aspect-(--stage-d)">
        <div className="relative aspect-(--ar-m) w-(--w-m) overflow-hidden rounded-[3px] bg-cream-deep shadow-book sm:aspect-(--ar-d) sm:w-(--w-d)">
          {!showImage ? (
            // The image mounts as the visitor gets close; until then its description is still there.
            <span className="sr-only">{slide.alt}</span>
          ) : desktopSource ? (
            <picture>
              <source media="(min-width: 640px)" srcSet={desktopSource.srcSet} sizes={desktopSource.sizes} />
              {image}
            </picture>
          ) : (
            image
          )}
          <Fold mobile={slide.mobileFold} desktop={!slide.mobileOnly && rd >= SPREAD_RATIO} />
        </div>
      </div>

      <div className="mt-3 px-1 text-center sm:mt-5">
        {slide.caption ? (
          <p className="font-display text-lg font-semibold leading-snug text-ink sm:text-xl">{slide.caption}</p>
        ) : null}
        {slide.quote ? (
          <p
            className={cn(
              "mx-auto mt-1.5 max-w-2xl font-display text-base leading-relaxed text-body",
              !slide.caption && "mt-0",
              slide.quoteDesktopOnly && "max-sm:hidden",
            )}
          >
            {slide.quote}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const FOLD = {
  center:
    "bg-[linear-gradient(90deg,transparent_44%,rgb(40_25_5/0.07)_48%,rgb(40_25_5/0.2)_50%,rgb(255_255_255/0.1)_50.4%,rgb(40_25_5/0.06)_52%,transparent_56%)]",
  right: "bg-[linear-gradient(270deg,rgb(40_25_5/0.2),rgb(40_25_5/0.06)_4%,transparent_10%)]",
  left: "bg-[linear-gradient(90deg,rgb(40_25_5/0.2),rgb(40_25_5/0.06)_4%,transparent_10%)]",
} as const;

/** Soft fold shadow: down the middle of a spread, or on the binding edge of a single page (phones). */
function Fold({ mobile, desktop }: { mobile: Slide["mobileFold"]; desktop: boolean }) {
  return (
    <>
      {mobile ? <div aria-hidden className={cn("pointer-events-none absolute inset-0 sm:hidden", FOLD[mobile])} /> : null}
      {desktop ? <div aria-hidden className={cn("pointer-events-none absolute inset-0 max-sm:hidden", FOLD.center)} /> : null}
    </>
  );
}
