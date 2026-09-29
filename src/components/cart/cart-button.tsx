"use client";

import { ShoppingBag } from "lucide-react";
import { cartCopy } from "@/content/cart";
import { cn } from "@/lib/cn";
import { useCart } from "./cart-context";
import { preloadCartDrawer } from "./drawer-loader";

/**
 * Header bag icon with a count badge. Opens the cart drawer. The badge stays
 * hidden while the cart loads (it isn't server-rendered) and when it's empty.
 */
export function CartButton({ className }: { className?: string }) {
  const { cart, loading, isOpen, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;
  const known = !loading || cart !== null;
  const showBadge = known && count > 0;

  return (
    <button
      type="button"
      onClick={openCart}
      // Fetch the drawer's code on intent (hover, press, keyboard focus).
      onPointerEnter={() => void preloadCartDrawer()}
      onPointerDown={() => void preloadCartDrawer()}
      onFocus={() => void preloadCartDrawer()}
      aria-label={cartCopy.button.label(known ? count : null)}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls="cart-drawer"
      className={cn(
        "relative grid size-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5",
        className,
      )}
    >
      <ShoppingBag aria-hidden className="size-6" strokeWidth={1.75} />
      {showBadge ? (
        <span
          aria-hidden
          className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[0.6875rem] font-bold leading-none tabular-nums text-white ring-2 ring-cream"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
