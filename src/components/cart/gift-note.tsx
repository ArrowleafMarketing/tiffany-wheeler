"use client";

import { Gift } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cartCopy } from "@/content/cart";
import { cn } from "@/lib/cn";
import { GIFT_NOTE_MAX } from "@/lib/store-config";
import { useCart } from "./cart-context";

const SAVE_DELAY_MS = 800;

type Props = {
  /** The cart's saved note, used once on mount. */
  initialNote: string;
  className?: string;
};

/**
 * "This is a gift" checkbox that reveals a gift-note field (copy deck §4.1).
 * The note saves to the cart via saveNote() on blur, and while typing after a
 * short pause. Unchecking clears the saved note but keeps the text, so
 * re-checking restores it. A failed save is retried on the next change or blur.
 */
export function GiftNote({ initialNote, className }: Props) {
  const { saveNote } = useCart();
  const id = useId();
  const [isGift, setIsGift] = useState(initialNote.trim().length > 0);
  const [text, setText] = useState(initialNote);
  // What the server has; only updated once a save succeeds.
  const savedRef = useRef(initialNote.trim());
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  function commit(value: string) {
    window.clearTimeout(timerRef.current);
    const next = value.trim().slice(0, GIFT_NOTE_MAX);
    if (next === savedRef.current) return;
    void saveNote(next).then((ok) => {
      if (ok) savedRef.current = next;
    });
  }

  const panelId = `${id}-panel`;
  const fieldId = `${id}-note`;
  const helperId = `${id}-helper`;
  const counterId = `${id}-counter`;

  return (
    <div className={cn("rounded-(--radius-card) border border-line bg-cream/60", className)}>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 px-4 py-2">
        <input
          type="checkbox"
          checked={isGift}
          aria-controls={panelId}
          onChange={(e) => {
            const on = e.target.checked;
            setIsGift(on);
            commit(on ? text : "");
          }}
          className="size-5 shrink-0 accent-forest"
        />
        <Gift aria-hidden className="size-4 shrink-0 text-berry" />
        <span className="text-sm font-semibold text-ink">{cartCopy.giftNote.checkbox}</span>
      </label>

      {/* Always in the DOM so the checkbox's aria-controls points at something; hidden until checked. */}
      <div id={panelId} hidden={!isGift} className="px-4 pb-4">
        <label htmlFor={fieldId} className="block text-sm font-semibold text-ink">
          {cartCopy.giftNote.label}
        </label>
        <textarea
          id={fieldId}
          value={text}
          rows={3}
          maxLength={GIFT_NOTE_MAX}
          placeholder={cartCopy.giftNote.placeholder}
          aria-describedby={`${helperId} ${counterId}`}
          onChange={(e) => {
            const value = e.target.value;
            setText(value);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => commit(value), SAVE_DELAY_MS);
          }}
          onBlur={(e) => commit(e.target.value)}
          className="mt-1.5 block w-full resize-none rounded-xl border border-field bg-paper px-3 py-2 text-base text-ink placeholder:text-muted focus:border-periwinkle focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-periwinkle"
        />
        <div className="mt-1.5 flex items-start justify-between gap-3 text-xs text-muted">
          <p id={helperId}>{cartCopy.giftNote.helper}</p>
          <p id={counterId} className="shrink-0 tabular-nums">
            {cartCopy.giftNote.counter(text.length)}
          </p>
        </div>
      </div>
    </div>
  );
}
