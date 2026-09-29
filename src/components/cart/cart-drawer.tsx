"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cartCopy } from "@/content/cart";
import { useCart } from "./cart-context";
import type { CartDrawerData } from "./cart-drawer-data";
import { CartSkeleton } from "./cart-skeleton";
import { preloadCartDrawer } from "./drawer-loader";

export type { CartDrawerData, UpsellItem } from "./cart-drawer-data";

// The body (lines, upsells, gift note, checkout) is a separate chunk that loads
// on first open; see drawer-loader.ts.
const CartDrawerBody = lazy(() => preloadCartDrawer().then((m) => ({ default: m.CartDrawerBody })));

const CLOSE_MS = 300;
/** Plain confirmations ("Added to your cart: …") step aside after this; ones with an action (Undo) stay. */
const NOTICE_MS = 4500;

/** Locks page scroll behind the drawer, keeping the scrollbar gap so nothing shifts. */
function lockScroll(): () => void {
  const html = document.documentElement;
  const body = document.body;
  const gap = window.innerWidth - html.clientWidth;
  const prev = { html: html.style.overflow, body: body.style.overflow, pad: body.style.paddingRight };
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  if (gap > 0) body.style.paddingRight = `${gap}px`;
  return () => {
    html.style.overflow = prev.html;
    body.style.overflow = prev.body;
    body.style.paddingRight = prev.pad;
  };
}

/**
 * Where focus goes when the drawer closes and the control that opened it is
 * gone (e.g. the sticky bar swapped its button): the product page's main Add to
 * Cart, else the header cart button.
 */
function fallbackFocusTarget(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>("#pdp-buy-cta [data-add-to-cart]") ??
    document.querySelector<HTMLElement>('[aria-controls="cart-drawer"]')
  );
}

/**
 * The cart drawer: a right-side sheet (full screen on phones) built on a modal
 * <dialog>, so focus stays inside, the page behind is inert, and Esc or the
 * Android back gesture closes it. Focus returns to whatever opened it.
 *
 * This shell (header, status rows) ships with every page; the body loads on
 * first open.
 */
export function CartDrawer({ data }: { data: CartDrawerData }) {
  const { cart, loading, isOpen, closeCart, error, retry, clearError, notice, dismissNotice } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const unlockRef = useRef<(() => void) | null>(null);
  // Mount the body the first time the drawer opens, then keep it.
  const [bodyWanted, setBodyWanted] = useState(false);
  if (isOpen && !bodyWanted) setBodyWanted(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) {
        returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialog.showModal();
        unlockRef.current ??= lockScroll();
      }
      // Two frames so the closed styles paint first and the slide-in transitions.
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          dialog.dataset.state = "open";
        });
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    dialog.dataset.state = "closed";
    if (!dialog.open) return;
    const timer = window.setTimeout(() => dialog.close(), CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // If the drawer is ever hidden while open (unmounted, or inside a route that
  // Activity hides on navigation), close the modal so the page it leaves behind
  // isn't inert and scroll-locked (docs: guides/preserving-ui-state).
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  // Plain confirmations free up their row after a few seconds, which matters
  // on short in-app browser screens. Never while focus is inside the row.
  useEffect(() => {
    if (!notice || notice.action) return;
    const timer = window.setTimeout(() => {
      if (noticeRef.current?.contains(document.activeElement)) return;
      dismissNotice();
    }, NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice, dismissNotice]);

  function handleClose() {
    unlockRef.current?.();
    unlockRef.current = null;
    dialogRef.current?.removeAttribute("data-state");
    // Browsers restore focus on close; this covers the ones that leave it on
    // <body>, and the case where the opener is no longer on the page.
    const trigger = returnFocusRef.current;
    returnFocusRef.current = null;
    // (When the opener is gone, focus is left inside the now-closed dialog until
    // the browser drops it to <body>, so check for that too.)
    const active = document.activeElement;
    if (!active || active === document.body || dialogRef.current?.contains(active)) {
      const target = trigger?.isConnected ? trigger : fallbackFocusTarget();
      target?.focus({ preventScroll: true });
    }
    if (isOpen) closeCart();
  }

  const count = cart ? cart.totalQuantity : loading ? null : 0;

  return (
    <dialog
      ref={dialogRef}
      id="cart-drawer"
      aria-labelledby="cart-drawer-title"
      // Esc is handled here too: some embedded webviews (in-app browsers) never
      // fire the dialog's native "cancel" for it. "cancel" still covers the
      // Android back gesture.
      onKeyDown={(e) => {
        if (e.key === "Escape" && !e.defaultPrevented) {
          e.preventDefault();
          closeCart();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        closeCart();
      }}
      onClose={handleClose}
      className="group fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-body backdrop:bg-transparent"
    >
      {/* Overlay: tapping outside the sheet closes it. Esc and the close button cover keyboard users. */}
      <div
        aria-hidden
        onClick={closeCart}
        className="absolute inset-0 bg-ink/45 opacity-0 transition-opacity duration-300 group-data-[state=open]:opacity-100"
      />

      <div className="absolute inset-y-0 right-0 flex w-full translate-x-full flex-col bg-paper shadow-lift transition-transform duration-300 ease-out group-data-[state=open]:translate-x-0 sm:max-w-md sm:rounded-l-(--radius-card)">
        {/* Plain divs: <header>/<footer> here would add stray banner/contentinfo landmarks. */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6">
          <h2 id="cart-drawer-title" tabIndex={-1} className="rounded-sm text-2xl font-semibold">
            {cartCopy.drawer.title(count)}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label={cartCopy.drawer.close}
            className="-mr-2 grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <X aria-hidden className="size-6" />
          </button>
        </div>

        <div role="alert">
          {error ? (
            <div className="flex items-start gap-2 border-b border-ember/30 bg-ember-light px-4 py-3 text-sm text-ember-dark sm:px-6">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              <p className="flex-1 font-medium">{error}</p>
              {retry ? (
                <button
                  type="button"
                  onClick={retry}
                  className="-my-3 h-11 shrink-0 rounded-md px-2 font-semibold underline underline-offset-4"
                >
                  {cartCopy.errors.tryAgain}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearError}
                  aria-label={cartCopy.notices.dismiss}
                  className="-my-3 -mr-2 grid size-11 shrink-0 place-items-center rounded-md"
                >
                  <X aria-hidden className="size-4" />
                </button>
              )}
            </div>
          ) : null}
        </div>

        <div role="status" ref={noticeRef}>
          {notice ? (
            <div
              key={notice.id}
              className="flex animate-fade-up items-center gap-2 border-b border-forest/15 bg-forest-light px-4 py-2 text-sm text-forest-dark sm:px-6"
            >
              <CircleCheck aria-hidden className="size-4 shrink-0" />
              <p className="flex-1 font-medium">{notice.message}</p>
              {notice.action ? (
                <button
                  type="button"
                  data-notice-action
                  onClick={notice.action.onAction}
                  className="-my-3 h-11 shrink-0 rounded-md px-2 font-semibold underline underline-offset-4"
                >
                  {notice.action.label}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={dismissNotice}
                  aria-label={cartCopy.notices.dismiss}
                  className="-my-3 -mr-2 grid size-11 shrink-0 place-items-center rounded-md"
                >
                  <X aria-hidden className="size-4" />
                </button>
              )}
            </div>
          ) : null}
        </div>

        {bodyWanted ? (
          <Suspense fallback={<CartSkeleton />}>
            <CartDrawerBody data={data} onNavigate={closeCart} />
          </Suspense>
        ) : null}
      </div>
    </dialog>
  );
}
