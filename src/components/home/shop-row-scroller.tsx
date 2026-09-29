"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  labels: { previous: string; next: string };
};

/**
 * Horizontal row of product cards: swipe or scroll on phones, arrow buttons
 * everywhere. Each arrow moves about one screen of cards and hides at its end.
 */
export function ShopRowScroller({ children, labels }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [pulse, setPulse] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  // One-time peek: the first time the row is on screen, slide it left a little and back,
  // and pulse the next arrow, so it's clear there's more to the right. Skipped under
  // reduced motion, once the visitor has scrolled it, and after the first time per visit.
  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("shop-row-peek")) return;
    } catch {}
    let timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (el.scrollLeft > 8 || el.scrollWidth <= el.clientWidth) return;
        try {
          sessionStorage.setItem("shop-row-peek", "1");
        } catch {}
        setPulse(true);
        el.style.scrollSnapType = "none";
        el.scrollTo({ left: Math.min(72, el.clientWidth * 0.2), behavior: "smooth" });
        timers = [
          window.setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 650),
          window.setTimeout(() => (el.style.scrollSnapType = ""), 1300),
          window.setTimeout(() => setPulse(false), 2400),
        ];
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      el.style.scrollSnapType = "";
    };
  }, []);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "absolute top-[calc(var(--tile)/2)] z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lift ring-1 ring-line transition-opacity hover:bg-cream disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="relative [--tile:min(62vw,15rem)] sm:[--tile:15rem]">
      {/* Scrolls sideways only (overflow-y hidden), so it never traps a vertical scroll. */}
      <ul
        ref={track}
        data-reveal-stagger
        className="scrollbar-none -mx-4 flex items-start snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain -my-3 py-3 px-4 sm:-mx-6 sm:scroll-px-6 sm:gap-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {children}
      </ul>
      <button type="button" aria-label={labels.previous} onClick={() => move(-1)} disabled={edges.start} className={cn(arrow, "-left-2 lg:-left-5")}>
        <ChevronLeft aria-hidden className="size-5" />
      </button>
      <button type="button" aria-label={labels.next} onClick={() => move(1)} disabled={edges.end} className={cn(arrow, "-right-2 lg:-right-5", pulse && "animate-nudge")}>
        <ChevronRight aria-hidden className="size-5" />
      </button>
    </div>
  );
}
