"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { cartCopy, lineVariantLabel } from "@/content/cart";
import type { CartLine } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";
import { CART_MAX_QUANTITY, productPath } from "@/lib/store-config";
import { Img } from "@/components/ui/img";
import { Price } from "@/components/ui/price";
import { useCart } from "./cart-context";
import { focusInCart, lineLink, NOTICE_ACTION } from "./drawer-focus";
import { QuantityStepper } from "./quantity-stepper";

type Props = {
  line: CartLine;
  /** Print-on-demand item (puzzle, canvas): shows the "Made to order" note. */
  madeToOrder?: boolean;
  /** Called when a product link is followed (closes the drawer). */
  onNavigate?: () => void;
  /** Offer "Buying for another family? Add a 2nd copy" under this line (the cart's only book). */
  secondCopy?: { shipsFree: boolean };
};

/** One cart drawer line: thumbnail, title, variant, unit price, stepper, remove (with undo). */
export function CartLineItem({ line, madeToOrder, onNavigate, secondCopy }: Props) {
  const { updateQuantity, removeLine, addItems, pendingLineIds, showNotice, dismissNotice } = useCart();
  const pending = pendingLineIds.has(line.id);
  const href = productPath(line.productHandle);
  const label = lineVariantLabel(line.productTitle, line.variantTitle);
  const note = !line.requiresShipping ? cartCopy.line.digital : madeToOrder ? cartCopy.line.madeToOrder : null;
  const unit = toNumber(line.unitPrice);

  function remove() {
    const { variantId, quantity, productHandle, productTitle, variantTitle } = line;
    showNotice(cartCopy.notices.removed(productTitle), {
      label: cartCopy.notices.undo,
      onAction: () => {
        void addItems([{ variantId, quantity }], {
          productHandle,
          productTitle,
          variantTitle,
          price: unit,
          openDrawer: false,
          // Restore exactly what was removed.
          swap: false,
        }).then((ok) => {
          if (!ok) return;
          dismissNotice();
          focusInCart(lineLink(variantId));
        });
      },
    });
    void removeLine(line.id);
    // This line (and its Remove button) is gone: focus Undo.
    focusInCart(NOTICE_ACTION);
  }

  function addSecondCopy() {
    void updateQuantity(line.id, line.quantity + 1).then((ok) => {
      if (!ok) return;
      showNotice(cartCopy.notices.secondCopyAdded);
      focusInCart(lineLink(line.variantId));
    });
  }

  return (
    <article aria-busy={pending} className={cn("flex gap-3 py-4 transition-opacity", pending && "opacity-70")}>
      <Link
        href={href}
        prefetch={false}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden
        className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-cream-deep"
      >
        {line.image ? (
          <Img image={line.image} alt="" sizes="80px" className="size-full object-contain p-1" />
        ) : null}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug">
              <Link
                href={href}
                prefetch={false}
                onClick={onNavigate}
                data-line-link={line.variantId}
                className="rounded-sm hover:underline hover:underline-offset-4"
              >
                {line.productTitle}
              </Link>
            </h3>
            {label ? <p className="mt-0.5 text-sm text-muted">{label}</p> : null}
            {note ? <p className="mt-0.5 text-xs text-muted">{note}</p> : null}
          </div>
          {/* Capped so a compare-at price ("$54.98 separately") wraps under the price instead of squeezing the title. */}
          <div className="max-w-[45%] shrink-0 text-right">
            <Price
              price={line.unitPrice}
              compareAtPrice={line.compareAtUnitPrice}
              reason={line.compareAtReason}
              size="sm"
              className="justify-end"
            />
            {line.quantity > 1 ? (
              <p className="mt-0.5 text-xs tabular-nums text-muted">
                {cartCopy.line.total(formatMoney(unit * line.quantity))}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityStepper
            value={line.quantity}
            min={1}
            max={Math.max(CART_MAX_QUANTITY, line.quantity)}
            label={cartCopy.line.quantityLabel(line.productTitle)}
            itemName={line.productTitle}
            onChange={(q) => void updateQuantity(line.id, q)}
          />
          <button
            type="button"
            onClick={remove}
            aria-label={cartCopy.line.removeLabel(line.productTitle)}
            className="h-11 rounded-md px-2 text-sm font-medium text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            {cartCopy.line.remove}
          </button>
        </div>

        {secondCopy ? (
          <button
            type="button"
            onClick={addSecondCopy}
            className="mt-2 flex min-h-11 w-full items-center gap-1.5 rounded-md py-1 text-left text-sm font-semibold text-forest underline-offset-4 hover:underline"
          >
            <Plus aria-hidden className="size-4 shrink-0" />
            <span>{cartCopy.line.secondCopy(formatMoney(line.unitPrice), secondCopy.shipsFree)}</span>
          </button>
        ) : null}

        {line.quantity >= CART_MAX_QUANTITY ? (
          <p className="mt-2 text-xs text-body">
            <a
              href={cartCopy.line.maxQuantityHref}
              className="font-medium text-periwinkle-text underline underline-offset-4"
            >
              {cartCopy.line.maxQuantity}
            </a>
          </p>
        ) : null}
      </div>
    </article>
  );
}
