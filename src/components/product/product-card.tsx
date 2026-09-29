import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { BookCover } from "@/components/product/book-cover";
import { Badge } from "@/components/ui/badge";
import { Img } from "@/components/ui/img";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { productCardCopy, productCardDetails } from "@/content/home-top";
import { PDP_COPY } from "@/content/pdp";
import type { Image, Product } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";
import { productPath } from "@/lib/store-config";

type CardVariant = "featured" | "default" | "compact";

export type ProductCardProps = {
  product: Product;
  /** 'featured': large homepage/shop card with bullets. 'default': grid card. 'compact': small add-on tile. */
  variant?: CardVariant;
  /** Image `sizes`; defaults to an estimate of the rendered cover width for the variant. */
  sizes?: string;
  /** Only for a card whose image is the page's LCP (rare; the hero owns it on the homepage). */
  preload?: boolean;
  /** Optional small line under the button (e.g. a seasonal shipping note). */
  note?: string;
  /** Extra visual weight: the season's lead book. */
  emphasis?: boolean;
  className?: string;
};

type Tone = "night" | "sunrise" | "butter" | "cream";

const tiles: Record<Tone, string> = {
  night: "bg-radial-[at_50%_35%] from-night-light to-night",
  sunrise: "bg-radial-[at_50%_30%] from-paper via-sunrise/80 to-sunrise",
  butter: "bg-radial-[at_50%_35%] from-paper via-butter to-butter",
  cream: "bg-radial-[at_50%_35%] from-paper to-cream-deep",
};

const badgeTones = {
  night: "butter",
  sunrise: "forest",
  butter: "ember",
  cream: "butter",
} as const;

function toneOf(product: Product): Tone {
  if (product.kind === "bundle") return "butter";
  if (product.kind === "book") return product.holiday === "easter" ? "sunrise" : "night";
  return "cream";
}

/** Tile shape and how much of it the cover may fill (fractions of width/height). */
const geometry: Record<CardVariant, { ratio: number; maxW: number; maxH: number; aspect: string }> = {
  featured: { ratio: 4 / 3, maxW: 0.68, maxH: 0.72, aspect: "aspect-[4/3]" },
  default: { ratio: 4 / 3, maxW: 0.7, maxH: 0.72, aspect: "aspect-[4/3]" },
  compact: { ratio: 1, maxW: 0.86, maxH: 0.86, aspect: "aspect-square" },
};

/** Width fraction of the tile that fits `image` inside the variant's box without distortion. */
function fitFraction(image: Image, variant: CardVariant): number {
  const g = geometry[variant];
  return Math.min(g.maxW, (g.maxH * (image.width / image.height)) / g.ratio);
}

/**
 * Rendered cover width per breakpoint. Phones: the card spans the page minus the
 * gutters (≈92vw). On 3x phones the estimate is two-thirds of that, so the
 * browser picks a 2x file: the difference is invisible and the bytes aren't.
 */
function defaultSizes(variant: CardVariant, f: number): string {
  const px = (n: number) => `${Math.round(n * f)}px`;
  const vw = (n: number) => `${Math.round(n * f)}vw`;
  if (variant === "compact") return `(min-resolution: 3dppx) ${px(59)}, ${px(88)}`;
  if (variant === "featured") {
    return `(min-width: 1024px) ${px(660)}, (min-width: 768px) ${vw(50)}, (min-resolution: 3dppx) ${vw(61)}, ${vw(92)}`;
  }
  return `(min-width: 1024px) ${px(380)}, (min-width: 640px) ${vw(50)}, (min-resolution: 3dppx) ${vw(61)}, ${vw(92)}`;
}

/**
 * A product card with its cover, badge, rating, price and Add to Cart. Books
 * render as hardcovers (BookCover); everything else as a fitted image.
 */
export function ProductCard({
  product,
  variant = "default",
  sizes,
  preload,
  note,
  emphasis,
  className,
}: ProductCardProps) {
  const href = productPath(product.handle);
  const cover = product.images[0];
  const buyable = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const rating = product.ratings.find((r) => r.source === "site" && r.count > 0);
  // A bundle's rating is its book's: say whose it is, or show none at all.
  const borrowedFrom = rating?.borrowedFrom;
  const showRating = rating && (borrowedFrom ? variant !== "compact" : product.kind !== "bundle");
  const name = variant === "compact" ? (product.shortTitle ?? product.title) : product.title;
  const tone = toneOf(product);
  const isBook = product.kind === "book";
  const f = cover ? fitFraction(cover, variant) : 0;
  const imageSizes = sizes ?? defaultSizes(variant, f);

  const media = cover ? (
    <div className="relative" style={{ width: `${(f * 100).toFixed(2)}%` }}>
      {isBook ? (
        <BookCover cover={cover} sizes={imageSizes} preload={preload} />
      ) : (
        <Img
          image={cover}
          sizes={imageSizes}
          preload={preload}
          blur={preload}
          className="h-auto w-full rounded-lg drop-shadow-[0_10px_14px_rgb(40_25_5/0.22)]"
        />
      )}
    </div>
  ) : null;

  const button = buyable ? (
    <AddToCartButton
      variantId={buyable.id}
      productHandle={product.handle}
      productTitle={product.title}
      variantTitle={buyable.title}
      price={toNumber(buyable.price)}
      available={buyable.availableForSale}
      size={variant === "compact" ? "sm" : "md"}
      className={variant === "compact" ? "min-h-11 shrink-0 px-3.5" : "shrink-0"}
    >
      {variant === "compact" ? productCardCopy.addCompact : productCardCopy.addToCart}
      {/* Deck §2.9 aria: "Add {title} to cart, {price}". */}
      <span className="sr-only">
        {" "}
        {product.title} to cart, {formatMoney(buyable.price)}
      </span>
    </AddToCartButton>
  ) : null;

  const ratingRow =
    rating && showRating ? (
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
        <Stars
          value={rating.value}
          size={variant === "compact" ? 13 : 15}
          label={
            borrowedFrom
              ? PDP_COPY.ratingAriaOf(rating.value.toFixed(1), rating.count, borrowedFrom)
              : PDP_COPY.ratingAria(rating.value.toFixed(1), rating.count)
          }
        />
        {borrowedFrom ? (
          <span aria-hidden className="text-muted tabular-nums">
            <span className="font-semibold text-ink">{rating.value.toFixed(1)}</span> ·{" "}
            {PDP_COPY.countOf(rating.count, borrowedFrom)}
          </span>
        ) : (
          <span aria-hidden className="tabular-nums">
            <span className="font-semibold text-ink">{rating.value.toFixed(1)}</span>{" "}
            <span className="text-muted">({rating.count})</span>
          </span>
        )}
      </p>
    ) : null;

  // ── compact: a small horizontal add-on tile ────────────────────────────────
  if (variant === "compact") {
    return (
      <article
        className={cn(
          "flex items-center gap-3 rounded-(--radius-card) border border-line bg-paper p-2.5 shadow-soft",
          className,
        )}
      >
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className={cn(
            "grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl sm:size-[5.5rem]",
            tiles[tone],
          )}
        >
          {media}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-1 self-stretch">
          <h3 className="line-clamp-2 font-display text-[0.95rem] font-semibold leading-snug">
            <Link href={href} className="hover:text-periwinkle-text">
              {name}
            </Link>
          </h3>
          {/* §2.9: the one-line reason to add it. */}
          {product.cardBlurb ? (
            <p className="line-clamp-2 text-[0.8125rem] leading-snug text-body">{product.cardBlurb}</p>
          ) : null}
          {ratingRow}
          <div className="mt-auto flex items-center justify-between gap-2 pt-0.5">
            {buyable ? <Price price={buyable.price} compareAtPrice={buyable.compareAtPrice} size="sm" /> : null}
            {button}
          </div>
        </div>
      </article>
    );
  }

  // ── featured / default ─────────────────────────────────────────────────────
  const featured = variant === "featured";
  const details = featured ? productCardDetails[product.handle] : undefined;
  const titleClass = featured ? "text-2xl sm:text-[1.75rem]" : "text-xl";

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-(--radius-card) border bg-paper transition-shadow duration-300",
        emphasis
          ? "border-gold/70 shadow-lift ring-1 ring-gold/50"
          : "border-line shadow-soft hover:shadow-lift",
        className,
      )}
    >
      <div className="relative">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className={cn(
            "relative grid place-items-center overflow-hidden",
            geometry[variant].aspect,
            tiles[tone],
            // keep the cover clear of the badge
            product.badge && "pt-9 sm:pt-11",
          )}
        >
          {tone === "night" ? <StarField /> : null}
          <div className="relative flex w-full justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1">
            {media}
          </div>
        </Link>
        {product.badge ? (
          <Badge tone={badgeTones[tone]} className="absolute left-3 top-3 shadow-soft sm:left-4 sm:top-4">
            {product.badge}
          </Badge>
        ) : null}
      </div>

      <div className={cn("flex flex-1 flex-col", featured ? "gap-2.5 p-5 sm:p-7" : "gap-2 p-4 sm:p-5")}>
        <h3 className={cn("font-semibold leading-[1.1] tracking-[-0.01em]", titleClass)}>
          <Link href={href} className="hover:text-periwinkle-text">
            {product.title}
          </Link>
        </h3>
        {product.subtitle ? (
          <p className={cn("text-body", featured ? "text-base sm:text-[1.0625rem]" : "text-[0.9375rem]")}>
            {product.subtitle}
          </p>
        ) : null}
        {ratingRow}
        {product.cardBlurb ? (
          <p className={cn("leading-relaxed text-body", featured ? "mt-1 text-base" : "text-sm")}>
            {product.cardBlurb}
          </p>
        ) : null}
        {details?.bullets?.length ? (
          <ul className="mt-1 space-y-1.5 text-[0.9375rem] text-body">
            {details.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={2.5} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {details?.ageLine ? <p className="text-sm text-muted">{details.ageLine}</p> : null}

        <div
          className={cn(
            "mt-auto flex flex-wrap items-center gap-y-3",
            featured ? "gap-x-6 pt-4" : "justify-between gap-x-4 pt-3",
          )}
        >
          {buyable ? (
            <Price
              price={buyable.price}
              compareAtPrice={buyable.compareAtPrice}
              size={featured ? "lg" : "md"}
              showSavings
            />
          ) : null}
          {button}
        </div>
        {note ? <p className="text-sm text-muted">{note}</p> : null}
        {featured && product.peekInside?.length ? (
          <Link
            href={`${href}#peek-inside`}
            className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold text-periwinkle-text underline-offset-4 hover:underline"
          >
            {productCardCopy.lookInside}
            <span className="sr-only">: {product.title}</span>
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

/** A few soft gold and white stars for night tiles (decorative). */
function StarField() {
  const stars: [number, number, number, "gold" | "white"][] = [
    [12, 18, 1.6, "gold"],
    [24, 70, 1, "white"],
    [38, 10, 1.1, "white"],
    [64, 14, 1.4, "gold"],
    [86, 24, 1, "white"],
    [90, 62, 1.5, "gold"],
    [8, 52, 1, "white"],
    [74, 84, 1.1, "white"],
    [52, 6, 0.9, "white"],
  ];
  return (
    <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 100 75" preserveAspectRatio="none">
      {stars.map(([x, y, r, c]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y * 0.75}
          r={r * 0.45}
          className={c === "gold" ? "fill-gold" : "fill-white/70"}
        />
      ))}
    </svg>
  );
}
