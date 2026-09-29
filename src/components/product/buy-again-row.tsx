"use client";

import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Img } from "@/components/ui/img";
import { PDP_COPY, SHIPPING_NOTES } from "@/content/pdp";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";
import { BuyPicker, useBuyBox } from "./buy-box";

/**
 * A second, compact buy row after the reviews on long product pages, so a
 * shopper who has just read the proof doesn't have to scroll back up. It shares
 * the buy box's selection (picking "Both books" here updates the gallery, the
 * buy box and the sticky bar too), and the sticky bar hides while it's on screen.
 */
export function BuyAgainRow({ className }: { className?: string }) {
  const { config, current, quantity } = useBuyBox();
  const { picker } = config;
  const hasCompare = current.compareAtPrice && toNumber(current.compareAtPrice) > toNumber(current.price);

  return (
    <section
      aria-labelledby="pdp-buy-again"
      className={cn("border-t border-line bg-cream-deep py-10 sm:py-14", className)}
    >
      <div className="container-page">
        <div
          className={cn(
            "mx-auto grid max-w-4xl gap-4 rounded-(--radius-card) border border-line bg-paper p-4 shadow-soft sm:gap-5 sm:p-7",
            "md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-8",
          )}
        >
          <div className="flex items-center gap-4">
            {current.thumbnail ? (
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cream-deep sm:size-24">
                <Img
                  image={current.thumbnail}
                  alt=""
                  sizes="(min-width: 640px) 96px, 80px"
                  className="absolute inset-0 size-full object-contain p-1"
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <h2 id="pdp-buy-again" className="text-xl font-semibold leading-tight sm:text-2xl">
                {PDP_COPY.buyAgain.heading}
              </h2>
              <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm text-body">
                <span className="font-semibold text-ink">{current.name}</span>
                <span className="font-display text-base font-semibold tabular-nums text-ink">
                  <span className="sr-only">Price </span>
                  {formatMoney(current.price)}
                </span>
                {hasCompare && current.compareAtPrice ? (
                  <span className="text-xs text-muted">
                    <s className="tabular-nums">
                      <span className="sr-only">Price if bought separately </span>
                      {formatMoney(current.compareAtPrice)}
                    </s>
                    <span aria-hidden> separately</span>
                  </span>
                ) : null}
                {current.shipsFree ? (
                  <span className="text-xs font-bold text-forest-dark">{SHIPPING_NOTES.shipsFree}</span>
                ) : null}
                {current.rating ? (
                  <span className="inline-flex items-center gap-1 self-center text-xs font-semibold text-ink">
                    <Star aria-hidden className="size-3.5 fill-star text-star" />
                    <span className="sr-only">Rated </span>
                    {current.rating.value.toFixed(1)}
                    <span className="font-normal text-muted">
                      ({current.rating.count}
                      <span className="sr-only"> reviews</span>)
                    </span>
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {picker ? <BuyPicker name={`${config.productHandle}-${picker.kind}-again`} /> : null}
            <div data-buy-cta="" className="flex">
              <AddToCartButton
                key={current.key}
                variantId={current.variantId}
                productHandle={current.productHandle}
                productTitle={current.productTitle}
                variantTitle={current.variantTitle}
                price={toNumber(current.price)}
                quantity={quantity}
                available={current.available}
                size="lg"
                className="min-w-0 flex-1 px-4"
              >
                {PDP_COPY.addToCart} · {formatMoney(current.price)}
              </AddToCartButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
