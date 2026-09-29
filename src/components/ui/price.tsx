import type { Money } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";

type Props = {
  price: Money;
  compareAtPrice?: Money | null;
  size?: "sm" | "md" | "lg" | "xl";
  /** Show "Save $X" next to a real compare-at price. */
  showSavings?: boolean;
  /**
   * Visible qualifier after the struck-through price. Our only compare-at is a
   * sum of separate prices (never a former price), so it defaults to
   * "separately" (FTC 16 CFR 233). Pass null only when the same label is
   * already right beside the price.
   */
  compareAtLabel?: string | null;
  className?: string;
};

const sizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl sm:text-4xl",
};

/** Price with an honest strike-through: only rendered when compare-at is higher, and always qualified. */
export function Price({
  price,
  compareAtPrice,
  size = "md",
  showSavings,
  compareAtLabel = "separately",
  className,
}: Props) {
  const hasCompare = compareAtPrice && toNumber(compareAtPrice) > toNumber(price);
  const savings = hasCompare ? toNumber(compareAtPrice) - toNumber(price) : 0;
  return (
    <span className={cn("relative inline-flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-display font-semibold text-ink tabular-nums", sizes[size])}>
        <span className="sr-only">Price </span>
        {formatMoney(price)}
      </span>
      {hasCompare ? (
        <>
          <span className="whitespace-nowrap text-muted">
            <s className="tabular-nums text-[0.95em] decoration-1">
              <span className="sr-only">Price if bought separately </span>
              {formatMoney(compareAtPrice)}
            </s>
            {compareAtLabel ? (
              <span aria-hidden className="ml-1 text-xs">
                {compareAtLabel}
              </span>
            ) : null}
          </span>
          {showSavings ? (
            <span className="whitespace-nowrap rounded-full bg-ember-light px-2 py-0.5 text-xs font-bold text-ember-dark">
              Save {formatMoney(savings, { trim: true })}
            </span>
          ) : null}
        </>
      ) : null}
    </span>
  );
}
