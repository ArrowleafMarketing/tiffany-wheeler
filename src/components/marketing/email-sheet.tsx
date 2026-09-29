"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useCart } from "@/components/cart/cart-context";
import { EmailCaptureForm } from "@/components/home/email-capture-form";
import { Button } from "@/components/ui/button";
import {
  markAddedToCart,
  markSheetDismissed,
  markSheetShown,
  sheetAllowed,
} from "@/lib/leads/prompt-state";

export type EmailSheetCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  inputLabel: string;
  placeholder: string;
  button: string;
  dismiss: string;
  close: string;
  done: string;
  finePrint: string;
  privacyLabel: string;
  privacyHref: string;
};

/** Show after this long on the site… */
const DELAY_MS = 10_000;
/** …or once the visitor has scrolled this share of the page, whichever comes first. */
const SCROLL_SHARE = 0.45;
/** While something else has the visitor's attention, check again this often. */
const RETRY_MS = 2_000;

const TITLE_ID = "email-sheet-title";
const DESCRIPTION_ID = "email-sheet-description";

/** Never on checkout or the ad landing pages (they have one job each). */
function excludedPath(pathname: string): boolean {
  return /^\/(checkout|lp)(\/|$)/.test(pathname);
}

/** Something else has the visitor's attention right now, so wait. */
function busy(): boolean {
  if (document.querySelector("dialog[open]")) return true; // cart drawer, mobile menu…
  const active = document.activeElement;
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement) {
    return true; // typing somewhere
  }
  // The inline Family Activity Pack form is on screen: it already makes this offer.
  const inline = document.getElementById("free-activity-pack");
  if (inline) {
    const r = inline.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) return true;
  }
  return false;
}

/**
 * The Family Activity Pack offer as a polite bottom sheet (copy deck §2.11,
 * popup variant): email only, a sheet rather than a full-screen interstitial,
 * a corner card from 640px up.
 *
 * - Shows after 10 seconds or 45% scroll, once per session.
 * - Stays away for 7 days after a dismissal, and for good after a signup or an
 *   add-to-cart (or while the cart has anything in it).
 * - Never on /checkout or /lp/*, and waits while the cart drawer or another
 *   dialog is open, a field has focus, or the inline signup is on screen.
 * - A modal <dialog>: focus moves to the Close button, Esc and a tap outside
 *   close it, and focus returns where it was. The slide-in respects reduced motion.
 *
 * It mounts nothing until it's due, so it adds no HTML to the page.
 */
export function EmailSheet({ copy, visual }: { copy: EmailSheetCopy; visual: ReactNode }) {
  const pathname = usePathname();
  const { cart, loading, isOpen, lastAdded } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [due, setDue] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  const eligiblePath = !excludedPath(pathname);
  const hasCart = lastAdded !== null || (cart?.totalQuantity ?? 0) > 0;

  // Arm on time (once per page load) or scroll depth (on the current page).
  useEffect(() => {
    if (due || !sheetAllowed()) return;
    const timer = window.setTimeout(() => setDue(true), DELAY_MS);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_SHARE) setDue(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [due, pathname]);

  // Anything in the cart ends it for good (and closes the sheet if it's up).
  useEffect(() => {
    if (!hasCart) return;
    markAddedToCart();
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [hasCart]);

  // Open when due and nothing else is going on; otherwise keep checking.
  useEffect(() => {
    if (!due || mounted || !eligiblePath || loading || hasCart || isOpen) return;
    const attempt = () => {
      if (!sheetAllowed()) return true; // give up for this session
      if (busy()) return false;
      markSheetShown();
      setMounted(true);
      return true;
    };
    if (attempt()) return;
    const id = window.setInterval(() => {
      if (attempt()) window.clearInterval(id);
    }, RETRY_MS);
    return () => window.clearInterval(id);
  }, [due, mounted, eligiblePath, loading, hasCart, isOpen]);

  // showModal once the dialog is in the DOM.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (mounted && dialog && !dialog.open) dialog.showModal();
  }, [mounted]);

  // Navigating to checkout (client-side) closes it.
  useEffect(() => {
    if (!eligiblePath && dialogRef.current?.open) dialogRef.current.close();
  }, [eligiblePath]);

  const dismiss = useCallback(() => {
    if (!done) markSheetDismissed();
    dialogRef.current?.close();
  }, [done]);

  const onSuccess = useCallback(() => setDone(true), []);

  if (!mounted) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
      // Esc: the browser closes the dialog; count it as a dismissal.
      onCancel={() => {
        if (!done) markSheetDismissed();
      }}
      // A tap on the backdrop (the dialog box itself, outside the panel) closes it.
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-visible bg-transparent p-0 text-body backdrop:bg-ink/40 open:motion-safe:animate-fade-up sm:mb-6 sm:mr-6 sm:ml-auto sm:max-w-[26rem]"
    >
      <div className="relative max-h-[92dvh] overflow-y-auto rounded-t-[1.75rem] bg-paper px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-lift sm:rounded-(--radius-card) sm:p-6">
        <button
          type="button"
          onClick={dismiss}
          aria-label={copy.close}
          className="absolute top-2 right-2 grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <X aria-hidden className="size-5" />
        </button>

        <div className="flex items-center gap-4 pr-8">
          <div aria-hidden className="w-[4.5rem] shrink-0 sm:w-20">
            {visual}
          </div>
          <div className="min-w-0">
            <p className="font-hand text-lg leading-none text-periwinkle-text">{copy.eyebrow}</p>
            <h2 id={TITLE_ID} className="mt-1 text-xl font-semibold leading-tight sm:text-[1.375rem]">
              {copy.title}
            </h2>
          </div>
        </div>
        <p id={DESCRIPTION_ID} className="mt-3 text-[0.9375rem] leading-relaxed text-body">
          {copy.subtitle}
        </p>

        <EmailCaptureForm
          variant="section"
          source="sheet"
          labelledBy={TITLE_ID}
          labels={{ inputLabel: copy.inputLabel, placeholder: copy.placeholder, button: copy.button }}
          onSuccess={onSuccess}
          className="mt-4"
        />

        {done ? (
          <Button variant="outline" block onClick={() => dialogRef.current?.close()} className="mt-4">
            {copy.done}
          </Button>
        ) : (
          <>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {copy.finePrint}{" "}
              <Link href={copy.privacyHref} prefetch={false} className="font-semibold text-ink underline underline-offset-2">
                {copy.privacyLabel}
              </Link>
              .
            </p>
            <div className="mt-1 flex justify-center">
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                {copy.dismiss}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
