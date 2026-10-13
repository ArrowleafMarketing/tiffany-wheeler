"use client";

import { LoaderCircle, Lock } from "lucide-react";
import { cartCopy } from "@/content/cart";
import { bookUnits } from "@/lib/cart/pricing";
import type { Cart, CartLine } from "@/lib/commerce/types";
import { formatMoney, toNumber } from "@/lib/money";
import { HANDLES, productPath } from "@/lib/store-config";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { useCart } from "./cart-context";
import type { CartDrawerData } from "./cart-drawer-data";
import { CartLineItem } from "./cart-line";
import { CartSkeleton } from "./cart-skeleton";
import { CartUpsells, upsellPlan, type UpsellPlan } from "./cart-upsells";
import { FreeShippingProgress, physicalSubtotal, shippingRowText } from "./free-shipping-progress";
import { GiftNote } from "./gift-note";
import { SignedCopy } from "./signed-copy";

type Props = { data: CartDrawerData; onNavigate: () => void };

/** The drawer's contents: the filled cart, the empty state, or a skeleton. Lazy-loaded (drawer-loader.ts). */
export function CartDrawerBody({ data, onNavigate }: Props) {
  const { cart, loading, adding } = useCart();
  if (cart && cart.lines.length > 0) return <FilledCart cart={cart} data={data} onNavigate={onNavigate} />;
  // A first add opens the drawer before the cart exists: show the skeleton,
  // not "Your cart is empty" (and don't fetch the mascot for it).
  if (loading || adding) return <CartSkeleton />;
  return <EmptyCart data={data} onNavigate={onNavigate} />;
}

/** The one hardcover line that a "2nd copy" nudge applies to: exactly one book in the cart, no set. */
function secondCopyCandidate(cart: Cart): CartLine | null {
  if (bookUnits(cart.lines) !== 1) return null;
  const line = cart.lines.find((l) => (l.bookCount ?? 0) > 0);
  if (!line || line.quantity !== 1) return null;
  return line.productHandle === HANDLES.nephiteChristmas || line.productHandle === HANDLES.easterJourney
    ? line
    : null;
}

/**
 * When the add-on tiles together can't reach free shipping, the progress row
 * names what does: upgrading to the set, or a second copy (cart-aov-levers).
 */
function shippingHint(
  data: CartDrawerData,
  plan: UpsellPlan,
  physical: number,
  secondCopy: CartLine | null,
): string | null {
  if (data.threshold === null) return null;
  const remaining = data.threshold - physical;
  if (remaining <= 0) return null;
  const addOns = [plan.featured?.kind === "add" ? plan.featured.item : null, ...plan.tiles];
  const addOnTotal = addOns.reduce((sum, item) => sum + (item ? toNumber(item.price) : 0), 0);
  if (addOnTotal >= remaining) return null;
  const upgrade = plan.featured?.kind === "upgrade" ? plan.featured : null;
  const difference = upgrade ? (toNumber(upgrade.set.price) - toNumber(upgrade.line.unitPrice)) * upgrade.line.quantity : 0;
  const set = upgrade && difference >= remaining ? { difference: formatMoney(difference) } : null;
  const copy = secondCopy && toNumber(secondCopy.unitPrice) >= remaining ? formatMoney(secondCopy.unitPrice) : null;
  return cartCopy.freeShipping.hint(set, copy);
}

function FilledCart({ cart, data, onNavigate }: { cart: Cart; data: CartDrawerData; onNavigate: () => void }) {
  const physical = physicalSubtotal(cart.lines);
  const digitalOnly = !cart.requiresShipping;
  const plan = upsellPlan(cart, data);
  const secondCopy = secondCopyCandidate(cart);
  const hint = shippingHint(data, plan, physical, secondCopy);
  const books = bookUnits(cart.lines);
  const hasHardcover = books > 0;
  // The Christmas cutoff is for items we ship ourselves; made-to-order items
  // have no confirmed production time yet (copy deck §4.4), so no promise for them.
  const showChristmasLine =
    data.christmasOrderBy !== null &&
    cart.lines.some((l) => l.requiresShipping && !data.products[l.productHandle]?.madeToOrder);
  // Past the cutoff, the caveat covers every shipped line, made-to-order included.
  const lateLine =
    data.christmasLate && cart.lines.some((l) => l.requiresShipping)
      ? data.christmasLate === "priority"
        ? cartCopy.checkout.christmasPriority
        : cartCopy.checkout.christmasLate
      : null;

  return (
    <>
      {digitalOnly || data.threshold !== null ? (
        <FreeShippingProgress
          subtotal={physical}
          digitalOnly={digitalOnly}
          threshold={data.threshold ?? undefined}
          hint={hint}
          className="border-b border-line bg-cream/60 px-4 py-2.5 sm:px-6"
        />
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">
        <ul role="list" className="divide-y divide-line">
          {cart.lines.map((line) => (
            <li key={line.id}>
              <CartLineItem
                line={line}
                madeToOrder={data.products[line.productHandle]?.madeToOrder}
                onNavigate={onNavigate}
                secondCopy={
                  secondCopy?.id === line.id
                    ? {
                        shipsFree: data.threshold !== null && physical + toNumber(line.unitPrice) >= data.threshold,
                      }
                    : undefined
                }
              />
            </li>
          ))}
        </ul>

        <div className="space-y-5 border-t border-line py-5">
          <CartUpsells cart={cart} data={data} plan={plan} onNavigate={onNavigate} />
          <GiftNote initialNote={cart.note} />
          {data.signedCopies && hasHardcover ? (
            <SignedCopy
              attributes={cart.attributes}
              shipTime={data.signedCopies.shipTime}
              orderBy={data.signedCopies.orderBy}
            />
          ) : null}
          <button
            type="button"
            onClick={onNavigate}
            className="mx-auto block h-11 rounded-md px-3 text-sm font-semibold text-ink underline underline-offset-4 hover:text-forest"
          >
            {cartCopy.drawer.keepShopping}
          </button>
          <p className="text-center text-xs leading-relaxed text-muted">
            {digitalOnly ? cartCopy.checkout.reassuranceDigital : cartCopy.checkout.reassurance}
          </p>
        </div>
      </div>

      <div className="border-t border-line bg-paper px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_20px_-12px_rgb(60_40_10/0.18)] sm:px-6">
        {cart.savings ? (
          <p className="flex items-baseline justify-between text-sm font-semibold text-forest">
            <span>{cartCopy.summary.savings}</span>
            <span className="tabular-nums">{formatMoney(cart.savings)}</span>
          </p>
        ) : null}
        {cart.discounts?.map((d) => (
          <p key={d.title} className="flex items-baseline justify-between gap-3 text-sm font-semibold text-forest">
            <span>{d.title}</span>
            <span className="tabular-nums">−{formatMoney(d.amount)}</span>
          </p>
        ))}
        <p className="flex items-baseline justify-between">
          <span className="font-semibold text-ink">{cartCopy.summary.subtotal}</span>
          <span className="font-display text-xl font-semibold tabular-nums text-ink">
            {formatMoney(cart.subtotal)}
          </span>
        </p>
        {/* One muted line: shipping, tax and (in season) the Christmas cutoff or, after it, the caveat. */}
        <p className="mt-0.5 text-xs leading-snug text-muted">
          {digitalOnly ? null : `${shippingRowText(physical, data.threshold)} · `}
          {cartCopy.summary.taxNote}
          {showChristmasLine && data.christmasOrderBy ? (
            <span className="font-medium text-ink"> {cartCopy.checkout.christmasDelivery(data.christmasOrderBy)}</span>
          ) : null}
          {lateLine ? <span className="font-medium text-ink"> {lateLine}</span> : null}
        </p>
        <CheckoutButton subtotal={formatMoney(cart.subtotal)} />
      </div>
    </>
  );
}

function CheckoutButton({ subtotal }: { subtotal: string }) {
  const { goToCheckout, checkingOut } = useCart();
  return (
    // aria-disabled, not disabled: a disabled button drops keyboard focus to <body>.
    <button
      type="button"
      aria-disabled={checkingOut || undefined}
      onClick={() => {
        if (!checkingOut) void goToCheckout();
      }}
      className={buttonClasses({ size: "lg", block: true, className: "mt-2.5 aria-disabled:opacity-80" })}
    >
      {checkingOut ? (
        <>
          <LoaderCircle aria-hidden className="size-5 animate-spin" />
          {cartCopy.checkout.loading}
        </>
      ) : (
        <>
          <Lock aria-hidden className="size-4" />
          {cartCopy.checkout.button(subtotal)}
        </>
      )}
    </button>
  );
}

function EmptyCart({ data, onNavigate }: Props) {
  const { completeSet, nephiteChristmas } = data;
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center">
      <div className="w-28">
        <Img image={data.mascot} sizes="112px" className="h-auto w-full" />
      </div>
      <h3 className="mt-4 text-2xl font-semibold">{cartCopy.empty.heading}</h3>
      <p className="mt-2 max-w-xs leading-relaxed text-body">{cartCopy.empty.body}</p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
        {completeSet ? (
          <ButtonLink
            href={productPath(completeSet.handle)}
            prefetch={false}
            onClick={onNavigate}
            variant="accent"
            size="lg"
            block
          >
            {cartCopy.empty.setButton(formatMoney(completeSet.price))}
          </ButtonLink>
        ) : null}
        {nephiteChristmas ? (
          <ButtonLink
            href={productPath(nephiteChristmas.handle)}
            prefetch={false}
            onClick={onNavigate}
            variant="outline"
            size="lg"
            block
          >
            {cartCopy.empty.bookButton}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}
