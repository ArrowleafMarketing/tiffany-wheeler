import { percentOff } from "@/lib/commerce/compare-at-rule";
import type { Money } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";

type Props = {
  price: Money;
  compareAtPrice?: Money | null;
  /**
   * From the price rule (src/lib/commerce/compare-at-rule.ts): "sale" shows a
   * "10% OFF" sticker; "bundle" labels the struck total "if bought separately"
   * and shows "Save $X". Pass the variant's or cart line's compareAtReason.
   */
  reason?: "sale" | "bundle";
  size?: "sm" | "md" | "lg" | "xl";
  /** Hide the "if bought separately" words when the same label is printed right beside the price. */
  hideBundleLabel?: boolean;
  /** Leave out the sticker (only where space is very tight, e.g. a cart line). */
  noSticker?: boolean;
  className?: string;
};

const sizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl sm:text-4xl",
};

/**
 * Every price on the site. With a real compare-at (sale or bundle), the new
 * price is large and dark, the old one smaller, lighter and struck through,
 * and a sticker says what it's worth. Without one, just the price.
 */
export function Price({ price, compareAtPrice, reason = "sale", size = "md", hideBundleLabel, noSticker, className }: Props) {
  const was = compareAtPrice && toNumber(compareAtPrice) > toNumber(price) ? compareAtPrice : null;
  const sticker = was
    ? reason === "bundle"
      ? `Save ${formatMoney(toNumber(was) - toNumber(price), { trim: true })}`
      : `${percentOff(price, was)}% off`
    : null;
  return (
    <span className={cn("relative inline-flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <span className={cn("font-display font-semibold leading-none text-ink tabular-nums", sizes[size])}>
        <span className="sr-only">{was ? (reason === "bundle" ? "Set price " : "Sale price ") : "Price "}</span>
        {formatMoney(price)}
      </span>
      {was ? (
        <>
          <span className="whitespace-nowrap text-[0.8125rem] leading-none text-muted/80">
            <s className="tabular-nums decoration-1">
              <span className="sr-only">{reason === "bundle" ? "Price if bought separately " : "Regular price "}</span>
              {formatMoney(was)}
            </s>
            {reason === "bundle" && !hideBundleLabel ? (
              <span aria-hidden className="ml-1 text-xs">
                if bought separately
              </span>
            ) : null}
          </span>
          {sticker && !noSticker ? (
            <span className="-rotate-2 whitespace-nowrap rounded-md bg-ember px-1.5 py-0.5 text-xs font-bold uppercase leading-tight tracking-[0.06em] text-white shadow-[0_1px_2px_rgb(120_40_10/0.35)]">
              {sticker}
            </span>
          ) : null}
        </>
      ) : null}
    </span>
  );
}
