import { Check } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { BookCover } from "@/components/product/book-cover";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { keepHyphens, productCardCopy, productCardDetails } from "@/content/home-top";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { toNumber } from "@/lib/money";
import { productPath } from "@/lib/store-config";

type Props = {
  product: Product;
  /** Small pill above the title, e.g. "For Easter · March 28, 2027". */
  badge?: string;
  /** Small line under the price row, e.g. a seasonal shipping note. */
  note?: string;
  /** Show the rating and the §2.3 bullets (the season's lead book; both books off-season). */
  lead?: boolean;
  /** Gold ring: the season's lead book. */
  emphasis?: boolean;
  className?: string;
};

/**
 * A compact, horizontal book card for phones: a small hardcover, the title and
 * subtitle, price and Add to Cart. The hero already shows the covers large, so
 * on phones both books use this instead of the tall featured card; the lead
 * book adds its rating and the §2.3 bullets.
 */
export function BookMiniCard({ product, badge, note, lead, emphasis, className }: Props) {
  const href = productPath(product.handle);
  const cover = product.images[0];
  const buyable = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const easter = product.holiday === "easter";
  const rating = lead ? product.ratings.find((r) => r.source === "site" && r.count > 0) : undefined;
  const bullets = lead ? (productCardDetails[product.handle]?.bullets ?? []) : [];

  const buy = buyable ? (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <Price price={buyable.price} compareAtPrice={buyable.compareAtPrice} size="md" />
      <AddToCartButton
        variantId={buyable.id}
        productHandle={product.handle}
        productTitle={product.title}
        variantTitle={buyable.title}
        price={toNumber(buyable.price)}
        available={buyable.availableForSale}
        size="md"
        className="shrink-0 px-4"
      >
        {productCardCopy.addToCart}
        <span className="sr-only">: {product.title}</span>
      </AddToCartButton>
    </div>
  ) : null;
  const noteLine = note ? <p className="mt-2 text-sm leading-snug text-muted">{note}</p> : null;

  return (
    <article
      className={cn(
        "rounded-(--radius-card) border bg-paper p-4 shadow-soft",
        emphasis ? "border-gold/70 ring-1 ring-gold/50" : "border-line",
        className,
      )}
    >
      <div className="flex gap-4">
        {cover ? (
          <Link
            href={href}
            prefetch={false}
            tabIndex={-1}
            aria-hidden
            className={cn(
              "grid w-24 shrink-0 place-items-center self-start rounded-xl px-3 py-4",
              easter
                ? "bg-radial-[at_50%_30%] from-paper via-sunrise/80 to-sunrise"
                : "bg-radial-[at_50%_35%] from-night-light to-night",
            )}
          >
            <BookCover cover={cover} sizes="72px" className="w-full" />
          </Link>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          {badge ? (
            <Badge tone={easter ? "forest" : "butter"} className="self-start px-2 py-0.5 text-[0.6875rem]">
              {badge}
            </Badge>
          ) : null}
          <h3 className="mt-1 text-xl font-semibold leading-tight">
            {/* min-h-11 keeps the tap target at 44px; the negative margin keeps the layout tight. */}
            <Link href={href} prefetch={false} className="-my-1.5 inline-flex min-h-11 items-center hover:text-periwinkle-text">
              {product.title}
            </Link>
          </h3>
          {product.subtitle ? (
            <p className="text-sm leading-snug text-body">{keepHyphens(product.subtitle)}</p>
          ) : null}
          {rating ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm">
              <Stars value={rating.value} size={14} />
              <span className="font-semibold tabular-nums text-ink">{rating.value.toFixed(1)}</span>
              <span className="tabular-nums text-muted">
                ({rating.count}
                <span className="sr-only"> reviews</span>)
              </span>
            </p>
          ) : null}
          {lead ? null : (
            <div className="mt-3">
              {buy}
              {noteLine}
            </div>
          )}
        </div>
      </div>

      {lead ? (
        <>
          {bullets.length ? (
            <ul className="mt-3 space-y-1 text-[0.9375rem] leading-snug text-body">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={2.5} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-3">
            {buy}
            {noteLine}
          </div>
        </>
      ) : null}
    </article>
  );
}
