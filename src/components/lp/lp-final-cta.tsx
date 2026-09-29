"use client";

import type { ReactNode } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { BuyPicker, useBuyBox } from "@/components/product/buy-box";
import { PDP_COPY } from "@/content/pdp";
import { formatMoney, toNumber } from "@/lib/money";

type Props = {
  eyebrow: string;
  headline: string;
  /** Real order-by line (only before the cutoff). */
  note?: string | null;
  /** Server-rendered trust row under the button (guarantee, shipping). */
  below?: ReactNode;
};

/**
 * The closing offer: the same two tiles as the buy box (the choice is shared,
 * so the top of the page and the sticky bar follow it), Add to Cart, the
 * deadline and the guarantee. The sticky bar hides while it's on screen.
 */
export function LpFinalCta({ eyebrow, headline, note, below }: Props) {
  const { config, current, quantity } = useBuyBox();
  return (
    <section aria-labelledby="lp-final-heading" className="bg-night py-12 text-white sm:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-hand text-2xl leading-none text-gold">{eyebrow}</p>
          <h2 id="lp-final-heading" className="mt-2 text-[1.75rem] font-semibold leading-[1.1] text-white sm:text-4xl">
            {headline}
          </h2>
          {note ? <p className="mt-3 text-white/85">{note}</p> : null}
        </div>

        <div className="mx-auto mt-7 grid max-w-xl gap-4 rounded-(--radius-card) bg-paper p-4 text-body shadow-lift sm:p-6">
          {config.picker ? <BuyPicker name={`${config.productHandle}-${config.picker.kind}-final`} /> : null}
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
          {below}
        </div>
      </div>
    </section>
  );
}
