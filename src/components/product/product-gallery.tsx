"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { BookCover } from "@/components/product/book-cover";
import { Img } from "@/components/ui/img";
import { PDP_COPY } from "@/content/pdp";
import type { Image } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { useOptionalBuyBox } from "./buy-box";

type Props = {
  images: Image[];
  title: string;
  /** Render images[0] as a hardcover (spine, page edge, shadow) instead of a flat photo. */
  bookCover?: boolean;
  /** Shown over the top-left corner of the photo on phones (the badge row moves here to save height). */
  phoneBadge?: ReactNode;
  className?: string;
};

// The stage is 3:2 on phones (keeps price and Add to Cart on the first screen),
// 4:3 on tablets and square beside the buy box on desktop.
//
// Rendered widths: phones calc(100vw - 2rem) ≈ 92vw; tablets calc(100vw - 3rem);
// desktop the 1.08fr gallery column (≈47vw, 565px at the 1216px container).
// On 3x phones the sizes aim at 2x density (61vw ≈ two-thirds of 92vw): the extra
// pixels are invisible on a phone and cost ~40% more bytes.
const STAGE_SIZES =
  "(min-width: 1216px) 565px, (min-width: 1024px) 47vw, (min-width: 640px) 92vw, (min-resolution: 3dppx) 61vw, 92vw";

/** Stage shapes (width / height) and how much of the stage a cover may fill. */
const STAGES = {
  // Phones leave a little more headroom for the corner badge.
  base: { ratio: 3 / 2, maxW: 0.78, maxH: 0.8 },
  sm: { ratio: 4 / 3, maxW: 0.78, maxH: 0.84 },
  lg: { ratio: 1, maxW: 0.84, maxH: 0.8 },
} as const;

/** Width fraction of the stage that fits the cover inside the stage's box without cropping. */
function fit(cover: Image, stage: (typeof STAGES)[keyof typeof STAGES]): number {
  return Math.min(stage.maxW, (stage.maxH * (cover.width / cover.height)) / stage.ratio);
}

function coverLayout(cover: Image): { style: CSSProperties; sizes: string } {
  const base = fit(cover, STAGES.base);
  const sm = fit(cover, STAGES.sm);
  const lg = fit(cover, STAGES.lg);
  const pct = (f: number) => `${(f * 100).toFixed(2)}%`;
  const vw = (n: number, f: number) => `${Math.round(n * f)}vw`;
  return {
    style: { "--w-base": pct(base), "--w-sm": pct(sm), "--w-lg": pct(lg) } as CSSProperties,
    sizes: [
      `(min-width: 1216px) ${Math.round(565 * lg)}px`,
      `(min-width: 1024px) ${vw(47, lg)}`,
      `(min-width: 640px) ${vw(92, sm)}`,
      `(min-resolution: 3dppx) ${vw(61, base)}`,
      vw(92, base),
    ].join(", "),
  };
}

const noopSubscribe = () => () => {};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Swipeable product gallery: a native scroll-snap track (works without JS),
 * thumbnails and arrows from `sm` up, a counter on phones. Only the first
 * image is in the server HTML (preloaded, with a blur placeholder); the others
 * mount one slide ahead of the one in view, so off-screen slides never compete
 * with the first image. Follows the buy box's selected item image.
 */
export function ProductGallery({ images, title, bookCover, phoneBadge, className }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Furthest slide scrolled to, and slides jumped to directly (thumbnails, the
  // buy box's selection). A slide's image mounts once it is within one of those.
  const [reach, setReach] = useState(0);
  const [jumped, setJumped] = useState<ReadonlySet<number>>(() => new Set());
  // Slide 2 mounts only after hydration, so it never loads alongside the first image.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const total = images.length;
  const isMounted = (i: number) => i === 0 || (hydrated && i <= reach + 1) || jumped.has(i);

  const goTo = useCallback(
    (index: number, smooth = true) => {
      const el = trackRef.current;
      if (!el) return;
      const i = Math.max(0, Math.min(total - 1, index));
      setJumped((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
      el.scrollTo({ left: i * el.clientWidth, behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto" });
      if (!smooth) setActive(i);
    },
    [total],
  );

  // Keep `active` in sync with swipes and programmatic scrolls.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (el.clientWidth === 0) return;
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setActive(i);
        setReach((r) => Math.max(r, i));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Jump (no animation, like a media swap) to the selected item's image,
  // including a ?format=… preselection right after hydration.
  const wanted = useOptionalBuyBox()?.current.imageIndex;
  const shown = useRef(wanted);
  useEffect(() => {
    if (wanted === undefined || wanted === shown.current) return;
    shown.current = wanted;
    goTo(wanted, false);
  }, [wanted, goTo]);

  if (total === 0) return null;

  const cover = bookCover ? coverLayout(images[0]) : null;

  return (
    <div
      className={cn("min-w-0", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={PDP_COPY.gallery.label(title)}
    >
      <div className="relative">
        {/* Focusable so keyboard users can scroll it; the region above names it. */}
        <div
          ref={trackRef}
          role="group"
          tabIndex={0}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-(--radius-card) bg-cream-deep focus-visible:outline-offset-4"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              goTo(active + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              goTo(active - 1);
            }
          }}
        >
          {images.map((image, i) => (
            <div
              key={`${image.url}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={PDP_COPY.gallery.position(i + 1, total)}
              className="relative grid aspect-[3/2] w-full shrink-0 snap-center snap-always place-items-center overflow-hidden sm:aspect-[4/3] lg:aspect-square"
            >
              {!isMounted(i) ? (
                <span className="sr-only">{image.alt}</span>
              ) : i === 0 && cover ? (
                <BookCover
                  cover={image}
                  sizes={cover.sizes}
                  preload
                  blur
                  style={cover.style}
                  className="w-(--w-base) sm:w-(--w-sm) lg:w-(--w-lg)"
                />
              ) : (
                <Img
                  image={image}
                  sizes={STAGE_SIZES}
                  preload={i === 0}
                  blur={i === 0}
                  quality={85}
                  className="absolute inset-0 size-full object-contain"
                />
              )}
            </div>
          ))}
        </div>

        {phoneBadge ? (
          <div className="pointer-events-none absolute left-2 top-2 origin-top-left scale-[0.85] sm:hidden">{phoneBadge}</div>
        ) : null}

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label={PDP_COPY.gallery.previous}
              className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink shadow-soft transition-opacity hover:bg-paper disabled:opacity-0 sm:grid"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active >= total - 1}
              aria-label={PDP_COPY.gallery.next}
              className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink shadow-soft transition-opacity hover:bg-paper disabled:opacity-0 sm:grid"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
            <p
              aria-live="polite"
              // Top right: product art often carries a label in its bottom corner (the PDF ribbon).
              className="absolute right-2 top-2 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold tabular-nums text-white sm:hidden"
            >
              <span className="sr-only">{PDP_COPY.gallery.position(active + 1, total)}</span>
              <span aria-hidden>
                {active + 1} / {total}
              </span>
            </p>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <ul className="scrollbar-none mt-3 hidden gap-2 overflow-x-auto overflow-y-hidden p-1 sm:flex">
          {images.map((image, i) => (
            <li key={`${image.url}-thumb-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={PDP_COPY.gallery.thumb(i + 1)}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-lg border-2 bg-cream-deep transition-colors lg:size-[4.5rem]",
                  i === active ? "border-forest" : "border-transparent hover:border-ink/20",
                )}
              >
                <Img
                  image={image}
                  alt=""
                  sizes="72px"
                  quality={60}
                  className="absolute inset-0 size-full object-contain p-0.5"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
