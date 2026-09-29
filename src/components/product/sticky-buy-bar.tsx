"use client";

import { Star } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { STICKY_BAR_COPY } from "@/content/pdp";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";
import { BUY_CTA_SELECTOR, PDP_END_ID, useBuyBox } from "./buy-box";

/** The bar is a phone/tablet pattern; desktop keeps the buy box beside the sticky gallery. */
const DESKTOP = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Sticky add-to-cart bar (copy deck §4.3). Shown whenever no in-page Add to Cart
 * is on screen (above it on the first screen, or after scrolling past it), and
 * hidden at the end of the product page (so it never covers the footer), while
 * the cart drawer is open and from `lg` up. While visible it sets
 * `<html data-sticky-bar="on">`, which adds scroll padding so focused controls
 * aren't hidden behind it (WCAG 2.4.11).
 */
export function StickyBuyBar() {
  const { current, quantity } = useBuyBox();
  const { cart, isOpen, openCart } = useCart();
  // Until the observers report, assume a button is on screen (no flash on load).
  const [ctaInView, setCtaInView] = useState(true);
  const [endReached, setEndReached] = useState(false);
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );

  useEffect(() => {
    const ctas = [...document.querySelectorAll(BUY_CTA_SELECTOR)];
    if (ctas.length === 0) return;
    const inView = new Set<Element>();
    const ctaObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      }
      setCtaInView(inView.size > 0);
    });
    // End sentinel: "intersecting" = in view or already above it. The huge top
    // margin turns that into a plain flip, so fast flings can't skip it.
    const end = document.getElementById(PDP_END_ID);
    const endObserver = new IntersectionObserver(([entry]) => setEndReached(entry.isIntersecting), {
      rootMargin: "100000px 0px 0px 0px",
    });
    for (const cta of ctas) ctaObserver.observe(cta);
    if (end) endObserver.observe(end);
    return () => {
      ctaObserver.disconnect();
      endObserver.disconnect();
    };
  }, []);

  const visible = !ctaInView && !endReached && !isOpen && !desktop;

  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.stickyBar = "on";
    else delete root.dataset.stickyBar;
    return () => {
      delete root.dataset.stickyBar;
    };
  }, [visible]);

  // "Added" comes from the cart itself, so it clears when the line is removed.
  const inCart = cart?.lines.some((line) => line.variantId === current.variantId) ?? false;
  const price = formatMoney(current.price);
  const label = [current.name, price, current.shipsFree ? STICKY_BAR_COPY.shipsFree : null]
    .filter(Boolean)
    .join(" · ");
  // No strike-through here: there's no room to label it "separately", and an
  // unlabelled one would read as a former price.

  return (
    <div
      role="region"
      aria-label={STICKY_BAR_COPY.region(label)}
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 shadow-lift backdrop-blur-sm transition-transform duration-300 ease-out lg:hidden",
        "pb-[env(safe-area-inset-bottom)]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container-page flex items-center gap-2.5 py-2.5">
        {current.thumbnail ? (
          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
            <Img
              image={current.thumbnail}
              alt=""
              sizes="(min-resolution: 3dppx) 30px, 44px"
              className="absolute inset-0 size-full object-contain"
            />
          </div>
        ) : null}
        <p className="min-w-0 flex-1 text-sm leading-tight">
          {inCart ? (
            <span className="font-semibold text-forest-dark">{STICKY_BAR_COPY.added}</span>
          ) : !current.available ? (
            <span className="font-semibold text-ink">{STICKY_BAR_COPY.soldOut(current.name)}</span>
          ) : (
            <>
              <span className="block truncate font-semibold text-ink">{current.name}</span>
              <span className="mt-0.5 flex items-baseline gap-x-1.5 whitespace-nowrap">
                <span className="font-display font-semibold tabular-nums text-ink">
                  <span className="sr-only">Price </span>
                  {price}
                </span>
                {current.shipsFree ? (
                  <span className="text-xs font-bold text-forest-dark">· {STICKY_BAR_COPY.shipsFree}</span>
                ) : current.rating ? (
                  <span className="inline-flex items-center gap-0.5 self-center text-xs font-semibold text-ink">
                    <Star aria-hidden className="size-3.5 fill-star text-star" />
                    <span className="sr-only">Rated </span>
                    {current.rating.value.toFixed(1)}
                    <span className="font-normal text-muted">
                      {" "}
                      ({current.rating.count}
                      <span className="sr-only"> reviews</span>)
                    </span>
                  </span>
                ) : null}
              </span>
            </>
          )}
        </p>
        {inCart ? (
          <Button variant="outline" size="md" onClick={openCart} className="shrink-0">
            {STICKY_BAR_COPY.viewCart}
          </Button>
        ) : (
          <AddToCartButton
            key={current.key}
            variantId={current.variantId}
            productHandle={current.productHandle}
            productTitle={current.productTitle}
            variantTitle={current.variantTitle}
            price={toNumber(current.price)}
            quantity={quantity}
            available={current.available}
            size="md"
            className="shrink-0 px-4"
          >
            {STICKY_BAR_COPY.addToCart}
          </AddToCartButton>
        )}
      </div>
    </div>
  );
}
