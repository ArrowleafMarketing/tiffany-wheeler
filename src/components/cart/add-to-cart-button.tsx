"use client";

import { Check, CircleAlert, LoaderCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useCart } from "./cart-context";
import { preloadCartDrawer } from "./drawer-loader";

export type AddToCartButtonProps = {
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle?: string;
  /** Unit price as a number, for analytics. */
  price: number;
  quantity?: number;
  available?: boolean;
  /** Button text; defaults to "Add to Cart". */
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  /** Open the cart drawer after adding (default true). */
  openDrawer?: boolean;
  showIcon?: boolean;
  /** Id of a nearby note read with the button (e.g. the hero's set line). */
  describedBy?: string;
};

type State = "idle" | "adding" | "added" | "failed";

/**
 * Add to Cart → Adding… → Added! Opens the cart drawer, which shows the
 * outcome (and the error with "Try Again" if it failed). Adding the Complete
 * Set when one of its books is already in the cart swaps that book for the set.
 */
export function AddToCartButton({
  variantId,
  productHandle,
  productTitle,
  variantTitle,
  price,
  quantity = 1,
  available = true,
  children = "Add to Cart",
  variant = "primary",
  size = "md",
  block,
  className,
  openDrawer = true,
  showIcon = false,
  describedBy,
}: AddToCartButtonProps) {
  const { addItems } = useCart();
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (state !== "added" && state !== "failed") return;
    const t = setTimeout(() => setState("idle"), state === "added" ? 1600 : 2400);
    return () => clearTimeout(t);
  }, [state]);

  if (!available) {
    return (
      <Button variant="outline" size={size} block={block} className={className} disabled>
        Sold out
      </Button>
    );
  }

  const busy = state === "adding";

  return (
    <Button
      variant={variant}
      size={size}
      block={block}
      className={cn("aria-disabled:opacity-80", className)}
      aria-live="polite"
      aria-describedby={describedBy}
      // aria-disabled, not disabled: disabling the focused button would drop
      // keyboard focus to <body> (and lose the drawer's return target).
      aria-disabled={busy || undefined}
      data-add-to-cart=""
      // Start fetching the drawer's code as the finger lands, so it's ready when it opens.
      onPointerDown={() => void preloadCartDrawer()}
      onClick={async () => {
        if (busy) return;
        setState("adding");
        const ok = await addItems([{ variantId, quantity }], {
          productHandle,
          productTitle,
          variantTitle,
          price,
          openDrawer,
        });
        // With the drawer open, it shows the error and "Try Again"; without it,
        // the button has to say so itself.
        setState(ok ? "added" : openDrawer ? "idle" : "failed");
      }}
    >
      {state === "adding" ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Adding…
        </>
      ) : state === "added" ? (
        <>
          <Check aria-hidden className="size-4" /> Added!
        </>
      ) : state === "failed" ? (
        <>
          <CircleAlert aria-hidden className="size-4" /> Try again
        </>
      ) : (
        <>
          {showIcon ? <ShoppingBag aria-hidden className="size-4" /> : null}
          {children}
        </>
      )}
    </Button>
  );
}
