"use client";

import { LoaderCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cartCopy } from "@/content/cart";
import type { Cart, CartLine } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";
import { HANDLES, productPath } from "@/lib/store-config";
import { buttonClasses } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { useCart } from "./cart-context";
import type { CartDrawerData, UpsellItem } from "./cart-drawer-data";
import { focusInCart, lineLink } from "./drawer-focus";

type Featured =
  | { kind: "upgrade"; line: CartLine; set: UpsellItem; other: UpsellItem }
  | { kind: "add"; item: UpsellItem; heading: string; body: string; button: string };

/** The featured offer plus the add-on tiles, decided once per render (the progress hint reads it too). */
export type UpsellPlan = { featured: Featured | null; tiles: UpsellItem[] };

type Props = {
  cart: Cart;
  data: CartDrawerData;
  /** From upsellPlan(); computed here when not passed. */
  plan?: UpsellPlan;
  onNavigate?: () => void;
};

/** Product handles in the cart, including the books inside bundles and the set. */
function handlesInCart(cart: Cart, data: CartDrawerData): Set<string> {
  const handles = new Set<string>();
  for (const line of cart.lines) {
    handles.add(line.productHandle);
    for (const h of data.includes[line.variantId] ?? []) handles.add(h);
  }
  return handles;
}

/**
 * The deck's upsell table (copy deck §4.1), one at a time in priority order:
 * upgrade a single book to the Complete Set, the matching ornament, the
 * coloring book, the puzzle, and the hardcover for digital-only carts.
 */
function pickFeatured(cart: Cart, data: CartDrawerData, inCart: Set<string>): Featured | null {
  const { completeSet, nephiteChristmas, easterJourney } = data;
  const copy = cartCopy.upsells;

  if (completeSet && !inCart.has(HANDLES.completeSet)) {
    const ncLine = cart.lines.find((l) => l.productHandle === HANDLES.nephiteChristmas);
    if (ncLine && easterJourney && !inCart.has(HANDLES.easterJourney)) {
      return { kind: "upgrade", line: ncLine, set: completeSet, other: easterJourney };
    }
    const ejLine = cart.lines.find((l) => l.productHandle === HANDLES.easterJourney);
    if (ejLine && nephiteChristmas && !inCart.has(HANDLES.nephiteChristmas)) {
      return { kind: "upgrade", line: ejLine, set: completeSet, other: nephiteChristmas };
    }
  }

  const hasNC = inCart.has(HANDLES.nephiteChristmas);
  const add = (item: UpsellItem, heading: string, body: string, button?: string): Featured => ({
    kind: "add",
    item,
    heading,
    body,
    button: button ?? copy.addButton(formatMoney(item.price)),
  });

  if (
    hasNC &&
    data.starOrnament &&
    !inCart.has(HANDLES.starOrnament) &&
    !inCart.has(HANDLES.doveOrnament)
  ) {
    return add(data.starOrnament, copy.ornament.heading, copy.ornament.body);
  }
  if (hasNC && data.coloringBook && !inCart.has(HANDLES.coloringBook)) {
    return add(data.coloringBook, copy.coloring.heading, copy.coloring.body);
  }
  if (inCart.has(HANDLES.easterJourney) && data.puzzle && !inCart.has(HANDLES.puzzle)) {
    return add(data.puzzle, copy.puzzle.heading, copy.puzzle.body);
  }
  if (!cart.requiresShipping) {
    const easterOnly = cart.lines.every((l) => data.products[l.productHandle]?.holiday === "easter");
    const hardcover = easterOnly ? easterJourney : nephiteChristmas;
    if (hardcover) {
      return add(
        hardcover,
        copy.hardcover.heading,
        copy.hardcover.body,
        copy.hardcover.button(formatMoney(hardcover.price)),
      );
    }
  }
  return null;
}

export function upsellPlan(cart: Cart, data: CartDrawerData): UpsellPlan {
  const inCart = handlesInCart(cart, data);
  const featured = pickFeatured(cart, data, inCart);
  const featuredHandle = featured?.kind === "add" ? featured.item.handle : null;
  // Christmas add-ons ride along with a physical Christmas order (§2.9, §4.1).
  const christmasOrder =
    cart.requiresShipping && [...inCart].some((h) => data.products[h]?.holiday === "christmas");
  const addOns = [data.starOrnament, data.doveOrnament, data.coloringBook].filter(
    (t): t is UpsellItem => t !== null,
  );
  const tiles = christmasOrder
    ? addOns.filter((t) => !inCart.has(t.handle) && t.handle !== featuredHandle)
    : [];
  return { featured, tiles };
}

/** Upsells for the cart drawer: one featured offer plus one-tap add-on tiles. */
export function CartUpsells({ cart, data, plan, onNavigate }: Props) {
  const { featured, tiles } = plan ?? upsellPlan(cart, data);
  if (!featured && tiles.length === 0) return null;

  return (
    <div className="space-y-5">
      {featured?.kind === "upgrade" ? (
        <UpgradeCard {...featured} threshold={data.threshold} onNavigate={onNavigate} />
      ) : featured ? (
        <FeaturedAdd {...featured} onNavigate={onNavigate} />
      ) : null}

      {tiles.length > 0 ? (
        <section aria-labelledby="cart-addons-heading">
          <h3 id="cart-addons-heading" className="text-base font-semibold">
            {cartCopy.upsells.tilesHeading}
          </h3>
          <ul role="list" className="mt-3 grid grid-cols-3 gap-2">
            {tiles.map((item) => (
              <li key={item.handle}>
                <AddOnTile item={item} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Thumb({ item, size, onNavigate }: { item: UpsellItem; size: string; onNavigate?: () => void }) {
  return (
    <Link
      href={productPath(item.handle)}
      prefetch={false}
      onClick={onNavigate}
      tabIndex={-1}
      aria-hidden
      className={cn("grid shrink-0 place-items-center overflow-hidden rounded-xl bg-paper", size)}
    >
      {item.image ? (
        <Img image={item.image} alt="" sizes="96px" className="size-full object-contain p-1" />
      ) : null}
    </Link>
  );
}

// In-flight buttons use aria-disabled (plus an early return), not `disabled`:
// Chrome blurs a focused button when it becomes disabled, dropping focus to <body>.

function UpgradeCard({
  line,
  set,
  other,
  threshold,
  onNavigate,
}: {
  line: CartLine;
  set: UpsellItem;
  other: UpsellItem;
  threshold: number | null;
  onNavigate?: () => void;
}) {
  const { replaceLine, showNotice, pendingLineIds } = useCart();
  const [busy, setBusy] = useState(false);
  const copy = cartCopy.upsells.upgrade;
  const setPrice = toNumber(set.price);
  const difference = (setPrice - toNumber(line.unitPrice)) * line.quantity;
  const savings =
    set.compareAtPrice && toNumber(set.compareAtPrice) > setPrice
      ? formatMoney(toNumber(set.compareAtPrice) - setPrice)
      : null;
  const pending = busy || pendingLineIds.has(line.id);

  async function upgrade() {
    if (pending) return;
    setBusy(true);
    const ok = await replaceLine(line.id, set.variantId, {
      productHandle: set.handle,
      productTitle: set.title,
      variantTitle: set.variantTitle,
      price: setPrice,
    });
    setBusy(false);
    if (ok) {
      showNotice(cartCopy.notices.upgraded(formatMoney(set.price)));
      // This card is gone now; keep focus on the new set line.
      focusInCart(lineLink(set.variantId));
    }
  }

  return (
    <section
      aria-labelledby="cart-upgrade-heading"
      className="rounded-(--radius-card) border border-butter-deep bg-butter p-4"
    >
      <div className="flex gap-3">
        <Thumb item={set} size="size-16" onNavigate={onNavigate} />
        <div className="min-w-0">
          <h3 id="cart-upgrade-heading" className="text-lg font-semibold leading-tight">
            {copy.heading}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-body">
            {copy.body(other.title, formatMoney(set.price), savings, threshold !== null && setPrice >= threshold)}
          </p>
        </div>
      </div>
      <button
        type="button"
        aria-disabled={pending || undefined}
        onClick={upgrade}
        className={buttonClasses({ variant: "accent", block: true, className: "mt-3 aria-disabled:opacity-70" })}
      >
        {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
        {copy.button(formatMoney(difference))}
      </button>
    </section>
  );
}

function useAddOn(item: UpsellItem) {
  const { addItems, showNotice } = useCart();
  const [busy, setBusy] = useState(false);
  async function add() {
    if (busy) return;
    setBusy(true);
    const ok = await addItems([{ variantId: item.variantId, quantity: 1 }], {
      productHandle: item.handle,
      productTitle: item.title,
      variantTitle: item.variantTitle,
      price: toNumber(item.price),
      openDrawer: false,
    });
    setBusy(false);
    if (ok) {
      showNotice(cartCopy.notices.addOnAdded(item.title));
      // The offer that was pressed disappears; move focus to its new line.
      focusInCart(lineLink(item.variantId));
    }
  }
  return { busy, add };
}

function FeaturedAdd({
  item,
  heading,
  body,
  button,
  onNavigate,
}: {
  item: UpsellItem;
  heading: string;
  body: string;
  button: string;
  onNavigate?: () => void;
}) {
  const { busy, add } = useAddOn(item);
  return (
    <section
      aria-labelledby="cart-featured-heading"
      className="rounded-(--radius-card) border border-line bg-cream-deep/60 p-4"
    >
      <div className="flex gap-3">
        <Thumb item={item} size="size-16" onNavigate={onNavigate} />
        <div className="min-w-0 flex-1">
          <h3 id="cart-featured-heading" className="text-lg font-semibold leading-tight">
            {heading}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-body">{body}</p>
        </div>
      </div>
      <button
        type="button"
        aria-disabled={busy || undefined}
        onClick={add}
        className={buttonClasses({ variant: "outline", block: true, className: "mt-3 aria-disabled:opacity-70" })}
      >
        {busy ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Plus aria-hidden className="size-4" />}
        {button}
        <span className="sr-only">: {item.title}</span>
      </button>
    </section>
  );
}

function AddOnTile({ item, onNavigate }: { item: UpsellItem; onNavigate?: () => void }) {
  const { busy, add } = useAddOn(item);
  const price = formatMoney(item.price);
  return (
    <div className="flex h-full flex-col rounded-xl border border-line bg-paper p-2">
      <Thumb item={item} size="aspect-square w-full bg-cream-deep" onNavigate={onNavigate} />
      <p className="mt-2 line-clamp-2 flex-1 text-xs font-semibold leading-snug text-ink">
        <Link href={productPath(item.handle)} prefetch={false} onClick={onNavigate} className="hover:underline">
          {item.shortTitle}
        </Link>
      </p>
      <button
        type="button"
        aria-disabled={busy || undefined}
        aria-label={cartCopy.upsells.addLabel(item.title, price)}
        onClick={add}
        className="mt-2 inline-flex h-11 w-full items-center justify-center gap-1 rounded-(--radius-btn) border-2 border-forest/25 bg-paper px-1 text-[0.8125rem] font-semibold text-forest transition-colors hover:border-forest/50 hover:bg-forest-light aria-disabled:opacity-60"
      >
        {busy ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
        {cartCopy.upsells.addButton(price)}
      </button>
    </div>
  );
}
