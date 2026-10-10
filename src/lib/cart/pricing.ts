// Cart pricing rules shared by the mock provider (the "real" totals) and the
// cart context (optimistic totals while a request is in flight). With Shopify,
// the bulk discount is an automatic discount configured in the admin, and the
// cart response carries it; only the optimistic estimate uses this file then.

import type { CartLine } from "@/lib/commerce/types";
import { BULK_DISCOUNT, CLAIMS } from "@/lib/store-config";

type Priced = Pick<CartLine, "bookCount" | "quantity" | "unitPrice">;

const cents = (n: number) => Math.round(n * 100) / 100;

/** Hardcover books in the cart (the Complete Set counts as 2). */
export function bookUnits(lines: Pick<CartLine, "bookCount" | "quantity">[]): number {
  return lines.reduce((n, l) => n + (l.bookCount ?? 0) * l.quantity, 0);
}

/** Books still needed for the bulk discount (0 once it applies). */
export function booksToBulkDiscount(lines: Pick<CartLine, "bookCount" | "quantity">[]): number {
  if (!CLAIMS.bulkDiscount) return 0;
  return Math.max(0, BULK_DISCOUNT.minBooks - bookUnits(lines));
}

/**
 * The bulk discount: BULK_DISCOUNT.percent off every line that holds books,
 * once the cart has BULK_DISCOUNT.minBooks or more. It stacks with the
 * Complete Set price. CONFIRM (copy deck §5, item 4)
 */
export function bulkDiscountAmount(lines: Priced[]): number {
  if (!CLAIMS.bulkDiscount || bookUnits(lines) < BULK_DISCOUNT.minBooks) return 0;
  const base = lines.reduce(
    (sum, l) => ((l.bookCount ?? 0) > 0 ? sum + Number(l.unitPrice.amount) * l.quantity : sum),
    0,
  );
  return cents((base * BULK_DISCOUNT.percent) / 100);
}

/** The discount's title, as the Shopify automatic discount will be named (copy deck §4.1). CONFIRM (§5, item 4) */
export const BULK_DISCOUNT_TITLE = `${BULK_DISCOUNT.minBooks}+ books: ${BULK_DISCOUNT.percent}% off applied`;
