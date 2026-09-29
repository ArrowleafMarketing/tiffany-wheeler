"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * What animates: every block of every section after the first (the hero or buy
 * box never waits), anything marked `.reveal`, and the items of a list marked
 * `data-reveal-stagger`, which come in one after another.
 */
const TARGETS = "main > section:not(:first-child) > .container-page > *, .reveal, [data-reveal-stagger] > *";
/** Delay between items that come on screen together, and the most any item waits. */
const STAGGER_MS = 90;
const MAX_DELAY_MS = 360;

/**
 * Scroll-in reveal. Blocks that start below the screen are hidden once this
 * script runs (never before, so nothing stays invisible if JavaScript is slow or
 * off) and fade up over 0.7s the moment they come on screen, however fast the
 * visitor scrolls. Blocks already on screen are left alone. Reduced motion
 * turns it off entirely.
 */
export function RevealFallback() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pending = [...new Set(document.querySelectorAll<HTMLElement>(TARGETS))].filter(
      (el) =>
        !el.classList.contains("reveal-js") &&
        // A block holding a staggered list hands the motion to its items instead.
        !el.querySelector("[data-reveal-stagger]") &&
        el.getBoundingClientRect().top > window.innerHeight,
    );
    if (pending.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        shown.forEach((el, i) => {
          io.unobserve(el);
          el.style.transitionDelay = `${Math.min(i * STAGGER_MS, MAX_DELAY_MS)}ms`;
          el.classList.remove("reveal-pending");
          el.addEventListener(
            "transitionend",
            () => {
              el.classList.remove("reveal-js");
              el.style.transitionDelay = "";
            },
            { once: true },
          );
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of pending) {
      el.classList.add("reveal-js", "reveal-pending");
      io.observe(el);
    }
    return () => {
      io.disconnect();
      for (const el of pending) {
        el.classList.remove("reveal-js", "reveal-pending");
        el.style.transitionDelay = "";
      }
    };
  }, [pathname]);

  return null;
}
