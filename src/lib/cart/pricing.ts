// Cart helpers shared by the cart drawer and the providers.

import type { CartLine } from "@/lib/commerce/types";

/** Hardcover books in the cart (the Complete Set counts as 2). */
export function bookUnits(lines: Pick<CartLine, "bookCount" | "quantity">[]): number {
  return lines.reduce((n, l) => n + (l.bookCount ?? 0) * l.quantity, 0);
}
