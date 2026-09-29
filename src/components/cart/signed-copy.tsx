"use client";

import { PenLine } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cartCopy } from "@/content/cart";
import { INSCRIPTION_ATTRIBUTE, INSCRIPTION_MAX, SIGNED_ATTRIBUTE } from "@/lib/cart/ops";
import type { Attribute } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { useCart } from "./cart-context";

const SAVE_DELAY_MS = 800;

type Props = {
  /** The cart's attributes, read once on mount. */
  attributes: Attribute[];
  /** "3–4 business days". */
  shipTime: string;
  /** "Dec 11" in christmas mode, else null. */
  orderBy: string | null;
  className?: string;
};

const valueOf = (attributes: Attribute[], key: string) => attributes.find((a) => a.key === key)?.value ?? "";

/**
 * "Have Tiffany sign my books (free)" with an optional "Sign it to" name
 * (copy deck §4.1). Saved as the cart attributes `Signed` and `Inscription`,
 * which Shopify carries onto the order. The drawer renders this only while
 * CLAIMS.signedCopies is on, the cart holds a hardcover, and it's on or before
 * the signed-copy order-by date.
 */
export function SignedCopy({ attributes, shipTime, orderBy, className }: Props) {
  const { saveAttributes } = useCart();
  const id = useId();
  const [signed, setSigned] = useState(valueOf(attributes, SIGNED_ATTRIBUTE) !== "");
  const [name, setName] = useState(valueOf(attributes, INSCRIPTION_ATTRIBUTE));
  const savedRef = useRef({ signed, name: name.trim() });
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  function commit(nextSigned: boolean, nextName: string) {
    window.clearTimeout(timerRef.current);
    const inscription = nextSigned ? nextName.trim().slice(0, INSCRIPTION_MAX) : "";
    const saved = savedRef.current;
    if (saved.signed === nextSigned && saved.name === inscription) return;
    void saveAttributes([
      { key: SIGNED_ATTRIBUTE, value: nextSigned ? cartCopy.signedCopy.signedValue : "" },
      { key: INSCRIPTION_ATTRIBUTE, value: inscription },
    ]).then((ok) => {
      if (ok) savedRef.current = { signed: nextSigned, name: inscription };
    });
  }

  const panelId = `${id}-panel`;
  const fieldId = `${id}-name`;
  const helperId = `${id}-helper`;

  return (
    <div className={cn("rounded-(--radius-card) border border-line bg-cream/60", className)}>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 px-4 py-2">
        <input
          type="checkbox"
          checked={signed}
          aria-controls={panelId}
          aria-describedby={helperId}
          onChange={(e) => {
            const on = e.target.checked;
            setSigned(on);
            commit(on, name);
          }}
          className="size-5 shrink-0 accent-forest"
        />
        <PenLine aria-hidden className="size-4 shrink-0 text-periwinkle-text" />
        <span className="text-sm font-semibold text-ink">{cartCopy.signedCopy.checkbox}</span>
      </label>

      <div id={panelId} hidden={!signed} className="px-4">
        <label htmlFor={fieldId} className="block text-sm font-semibold text-ink">
          {cartCopy.signedCopy.label}
        </label>
        <input
          id={fieldId}
          type="text"
          value={name}
          maxLength={INSCRIPTION_MAX}
          autoComplete="off"
          placeholder={cartCopy.signedCopy.placeholder}
          onChange={(e) => {
            const value = e.target.value;
            setName(value);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => commit(true, value), SAVE_DELAY_MS);
          }}
          onBlur={(e) => commit(true, e.target.value)}
          className="mt-1.5 block h-11 w-full rounded-xl border border-field bg-paper px-3 text-base text-ink placeholder:text-muted focus:border-periwinkle focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-periwinkle"
        />
      </div>
      <p id={helperId} className={cn("px-4 pb-3 text-xs text-muted", signed ? "pt-1.5" : "-mt-1.5")}>
        {cartCopy.signedCopy.helper(shipTime, orderBy)}
      </p>
    </div>
  );
}
