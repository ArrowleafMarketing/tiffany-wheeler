import { CircleCheck, Download, Truck } from "lucide-react";
import { cartCopy, FREE_SHIPPING_NEAR } from "@/content/cart";
import type { CartLine } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";
import { CLAIMS, FLAT_RATE_SHIPPING, FREE_SHIPPING_THRESHOLD } from "@/lib/store-config";

// No "use client": a plain presentational component, so it renders in the
// client drawer and in Server Components (the mock checkout) alike.

type ShippingLine = Pick<CartLine, "requiresShipping" | "unitPrice" | "quantity">;

const cents = (n: number) => Math.round(n * 100) / 100;

/** The free-shipping threshold while that claim is on (CLAIMS.freeShipping), else null. */
export const SHIPPING_THRESHOLD: number | null = CLAIMS.freeShipping ? FREE_SHIPPING_THRESHOLD : null;

/**
 * Subtotal of the lines that ship. Digital items don't count toward free
 * shipping. CONFIRM whether they should (copy deck §4.1, §5 item 2).
 */
export function physicalSubtotal(lines: ShippingLine[]): number {
  return cents(
    lines.reduce((sum, l) => (l.requiresShipping ? sum + toNumber(l.unitPrice) * l.quantity : sum), 0),
  );
}

/**
 * The cart's shipping row: "Shipping: Free" or the flat-rate line (copy deck
 * §4.1). With the free-shipping claim off (threshold null), it makes no promise.
 */
export function shippingRowText(physical: number, threshold: number | null = SHIPPING_THRESHOLD): string {
  if (threshold === null) return cartCopy.summary.shippingAtCheckout;
  return physical >= threshold
    ? cartCopy.summary.shippingFree
    : cartCopy.summary.shippingFlat(formatMoney(FLAT_RATE_SHIPPING), formatMoney(threshold, { trim: true }));
}

type Props = {
  /** Physical (shippable) subtotal; see physicalSubtotal(). */
  subtotal: number;
  /** Cart holds only digital items: nothing ships, no bar. */
  digitalOnly?: boolean;
  threshold?: number;
  /** A second line under the "away" message naming what would close the gap. */
  hint?: string | null;
  className?: string;
};

/**
 * "You're $20.01 away from free US shipping." plus a progress bar (copy deck
 * §4.1). Render it only while CLAIMS.freeShipping is on (or for digital-only carts).
 */
export function FreeShippingProgress({
  subtotal,
  digitalOnly,
  threshold = FREE_SHIPPING_THRESHOLD,
  hint,
  className,
}: Props) {
  if (digitalOnly) {
    return (
      <div className={cn("flex items-start gap-2 text-sm text-body", className)}>
        <Download aria-hidden className="mt-0.5 size-4 shrink-0 text-periwinkle-text" />
        <p aria-live="polite">{cartCopy.freeShipping.digitalOnly}</p>
      </div>
    );
  }

  const remaining = cents(Math.max(0, threshold - subtotal));
  const reached = remaining <= 0;
  const percent = reached ? 100 : Math.min(99, Math.floor((subtotal / threshold) * 100));
  const message = reached
    ? cartCopy.freeShipping.reached
    : remaining <= FREE_SHIPPING_NEAR
      ? cartCopy.freeShipping.near(formatMoney(remaining))
      : cartCopy.freeShipping.far(formatMoney(remaining));
  const Icon = reached ? CircleCheck : Truck;

  return (
    <div className={cn("text-sm", className)}>
      <div className="flex items-start gap-2">
        <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", reached ? "text-forest" : "text-ink")} />
        <div aria-live="polite" className="min-w-0">
          <p className={cn("font-medium", reached ? "text-forest" : "text-ink")}>{message}</p>
          {hint && !reached ? <p className="text-xs leading-snug text-body">{hint}</p> : null}
        </div>
      </div>
      <div
        role="progressbar"
        aria-label={cartCopy.freeShipping.progressLabel(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-2 overflow-hidden rounded-full bg-forest-light"
      >
        <div
          className="h-full rounded-full bg-forest transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
