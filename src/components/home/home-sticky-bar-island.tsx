"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useCart } from "@/components/cart/cart-context";
import type { ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type HomeStickyBarProps = {
  /** Accessible name of the bar. */
  label: string;
  /** "Both books" / "Nephite Christmas (PDF Edition)". */
  name: string;
  /** "$49.99" */
  price: string;
  /** Optional short line, e.g. "Ships free". */
  extra?: string;
  /** Button text, e.g. "Add to Cart". */
  cta: string;
  tone: ButtonVariant;
  item: {
    variantId: string;
    productHandle: string;
    productTitle: string;
    variantTitle?: string;
    price: number;
    available: boolean;
  };
};

const PHONE_QUERY = "(max-width: 767.98px)";

function subscribePhone(onChange: () => void) {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Sticky mobile buy bar for the homepage (copy deck §4.3). It slides up once
 * the hero's buttons (`[data-sticky-anchor]`) have scrolled above the screen,
 * and hides again while any in-page offer that repeats it is on screen
 * (`[data-sticky-hide]`, e.g. the Complete Set bar), while the footer is in
 * view, and while the cart drawer is open. Phones only.
 *
 * While it's showing it sets `data-sticky-bar="on"` on <html>, which adds
 * scroll-padding at the bottom so focused elements aren't hidden under it.
 */
export function HomeStickyBarIsland({ label, name, price, extra, cta, tone, item }: HomeStickyBarProps) {
  const { isOpen } = useCart();
  const phone = useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );
  const [pastHero, setPastHero] = useState(false);
  const [covered, setCovered] = useState(false);

  // Past the hero: the anchor is out of view *above* the screen.
  useEffect(() => {
    const anchor = document.querySelector("[data-sticky-anchor]");
    if (!anchor) return;
    const io = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(anchor);
    return () => io.disconnect();
  }, []);

  // Covered: an in-page offer that makes the same pitch, or the site footer, is on screen.
  useEffect(() => {
    const targets = [
      ...document.querySelectorAll("[data-sticky-hide]"),
      ...[...document.querySelectorAll("footer")].filter((f) => !f.closest("dialog")),
    ];
    if (targets.length === 0) return;
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setCovered(onScreen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const visible = phone && pastHero && !covered && !isOpen;

  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.stickyBar = "on";
    else delete root.dataset.stickyBar;
    return () => {
      delete root.dataset.stickyBar;
    };
  }, [visible]);

  return (
    <div
      role="region"
      aria-label={label}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 transition-[translate,visibility] duration-300 ease-out md:hidden",
        visible ? "visible translate-y-0" : "invisible translate-y-full",
      )}
    >
      <div className="border-t border-line bg-paper/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(60_40_10/0.25)] backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <p className="min-w-0 flex-1 leading-tight">
            {/* Only the name truncates, so the price always shows (e.g. "Nephite Christmas (P… · $6.99" at 360px). */}
            <span className="flex min-w-0 gap-1 text-sm font-semibold text-ink">
              <span className="truncate">{name}</span>
              <span className="shrink-0">
                · <span className="font-display tabular-nums">{price}</span>
              </span>
            </span>
            {extra ? <span className="mt-0.5 block text-xs text-muted">{extra}</span> : null}
          </p>
          <AddToCartButton
            variantId={item.variantId}
            productHandle={item.productHandle}
            productTitle={item.productTitle}
            variantTitle={item.variantTitle}
            price={item.price}
            available={item.available}
            variant={tone}
            size="md"
            className="shrink-0 px-4"
          >
            {cta}
            {/* The visible label says just "Add to Cart"; screen readers also hear what and how much. */}
            <span className="sr-only">
              : {name}, {price}
            </span>
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}
