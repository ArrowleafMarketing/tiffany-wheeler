"use client";

import { LoaderCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useCart } from "./cart-context";

type Props = {
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle?: string;
  price: number;
  quantity?: number;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
};

/**
 * Checks out just this item, like Shopify's "Buy it now": a separate cart goes
 * straight to checkout, and the main cart (anything added earlier) is left
 * alone. It stays busy until the checkout page takes over, so a second tap
 * can't start a second checkout.
 */
export function BuyNowButton({
  variantId,
  productHandle,
  productTitle,
  variantTitle,
  price,
  quantity = 1,
  children = "Buy Now",
  variant = "outline",
  size = "md",
  block,
  className,
}: Props) {
  const { goToCheckout, checkingOut } = useCart();
  // Which button started the checkout (for the spinner); busy state itself is global.
  const [mine, setMine] = useState(false);
  const [wasChecking, setWasChecking] = useState(checkingOut);
  if (wasChecking !== checkingOut) {
    setWasChecking(checkingOut);
    if (!checkingOut) setMine(false);
  }
  const busy = checkingOut || mine;

  return (
    <Button
      variant={variant}
      size={size}
      block={block}
      className={cn("aria-disabled:opacity-80", className)}
      aria-disabled={busy || undefined}
      onClick={async () => {
        if (busy) return;
        setMine(true);
        const ok = await goToCheckout([{ variantId, quantity }], {
          productHandle,
          productTitle,
          variantTitle,
          price,
        });
        if (!ok) setMine(false);
      }}
    >
      {busy && mine ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}
