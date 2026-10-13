"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { cartCopy } from "@/content/cart";
import { track, type AnalyticsItem } from "@/lib/analytics";
import type { CartOp, CartResponse, SwappedLine } from "@/lib/cart/ops";
import type { Attribute, Cart, CartLine, LineInput } from "@/lib/commerce/types";
import { money, toNumber } from "@/lib/money";
import { HANDLES } from "@/lib/store-config";
import { preloadCartDrawer } from "./drawer-loader";

/** What the UI knows about an item being added, for instant feedback + analytics. */
export type AddItemMeta = {
  productHandle: string;
  productTitle: string;
  variantTitle?: string;
  price: number;
  /** Open the cart drawer after adding (default true). */
  openDrawer?: boolean;
  /**
   * Let a bundle replace single copies of the books it contains (default
   * true). "Undo" turns it off so it restores exactly what was removed.
   */
  swap?: boolean;
};

/** A short confirmation shown at the top of the cart drawer (copy deck §4.2). */
export type CartNotice = {
  id: number;
  message: string;
  action?: { label: string; onAction: () => void };
};

type LastAdded = { title: string; at: number; variantId: string; productHandle: string };

type CartContextValue = {
  cart: Cart | null;
  /** True until the first /api/cart response arrives. */
  loading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** True while an add is in flight (drives button spinners and the drawer skeleton). */
  adding: boolean;
  /** Line ids with an update in flight. */
  pendingLineIds: ReadonlySet<string>;
  /**
   * The item added in the last few seconds (LAST_ADDED_MS), for "Added to your
   * cart" states. Cleared early when that line is removed.
   */
  lastAdded: LastAdded | null;
  /** Whether a variant has a line in the cart right now. */
  isInCart: (variantId: string) => boolean;
  error: string | null;
  /** Retries the last failed add ("Try Again"), when there is one. */
  retry: (() => void) | null;
  clearError: () => void;
  /** Resolves true when the lines were added. */
  addItems: (lines: LineInput[], meta: AddItemMeta) => Promise<boolean>;
  updateQuantity: (lineId: string, quantity: number) => Promise<boolean>;
  removeLine: (lineId: string) => Promise<boolean>;
  /**
   * Swaps a line for another variant at the same quantity ("Upgrade to the
   * Set"). `meta` describes the new variant, for analytics. Resolves true on success.
   */
  replaceLine: (lineId: string, variantId: string, meta?: AddItemMeta) => Promise<boolean>;
  /** Resolves true once the note is saved. */
  saveNote: (note: string) => Promise<boolean>;
  /** Sets customer cart attributes (signed copy); an empty value removes one. Resolves true on success. */
  saveAttributes: (attributes: Attribute[]) => Promise<boolean>;
  /**
   * Checkout. With `lines`, it's "Buy Now": a separate cart with only those
   * lines goes to checkout and the main cart is left as it is. Ignored while a
   * checkout is already starting. Resolves false if it failed.
   */
  goToCheckout: (lines?: LineInput[], meta?: AddItemMeta) => Promise<boolean>;
  /** True from goToCheckout() until the checkout page takes over ("Heading to checkout…"). */
  checkingOut: boolean;
  /** Drawer confirmation row ("Added to your cart: …", "… removed. Undo"). Cleared on open/close. */
  notice: CartNotice | null;
  showNotice: (message: string, action?: CartNotice["action"]) => void;
  dismissNotice: () => void;
};

type ErrorState = {
  message: string;
  retry?: { lines: LineInput[]; meta: AddItemMeta };
};

const CartContext = createContext<CartContextValue | null>(null);

/** How long "Added to your cart" states last. */
const LAST_ADDED_MS = 4000;

/** Client-side totals for optimistic updates; the next server response replaces them. */
function recalc(cart: Cart, lines: CartLine[]): Cart {
  let total = 0;
  let compare = 0;
  const next = lines.map((l) => {
    const unit = toNumber(l.unitPrice);
    total += unit * l.quantity;
    compare += toNumber(l.compareAtUnitPrice ?? l.unitPrice) * l.quantity;
    return { ...l, total: money(unit * l.quantity) };
  });
  return {
    ...cart,
    lines: next,
    totalQuantity: next.reduce((n, l) => n + l.quantity, 0),
    subtotal: money(total),
    savings: compare - total > 0.004 ? money(compare - total) : null,
    discounts: [],
    requiresShipping: next.some((l) => l.requiresShipping),
  };
}

function analyticsItems(cart: Cart): AnalyticsItem[] {
  return cart.lines.map(lineItem);
}

function lineItem(line: Pick<CartLine, "productHandle" | "productTitle" | "variantTitle" | "unitPrice" | "quantity">): AnalyticsItem {
  return {
    item_id: line.productHandle,
    item_name: line.productTitle,
    item_variant: line.variantTitle,
    price: toNumber(line.unitPrice),
    quantity: line.quantity,
  };
}

function metaItem(meta: AddItemMeta, quantity: number): AnalyticsItem {
  return {
    item_id: meta.productHandle,
    item_name: meta.productTitle,
    item_variant: meta.variantTitle,
    price: meta.price,
    quantity,
  };
}

/** The deck's network-error copy when the device is offline, otherwise `fallback`. */
function failure(fallback: string): string {
  return typeof navigator !== "undefined" && navigator.onLine === false ? cartCopy.errors.network : fallback;
}

async function fetchCart(): Promise<Cart | null> {
  const r = await fetch("/api/cart", { cache: "no-store" });
  if (!r.ok) throw new Error(`GET /api/cart ${r.status}`);
  const data = (await r.json()) as CartResponse;
  return data.cart;
}

async function postCart(op: CartOp): Promise<CartResponse> {
  const r = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(op),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`POST /api/cart ${op.op} ${r.status}`);
  return (await r.json()) as CartResponse;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [addingCount, setAddingCount] = useState(0);
  const [pendingLineIds, setPending] = useState<ReadonlySet<string>>(new Set());
  const [lastAdded, setLastAdded] = useState<LastAdded | null>(null);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [notice, setNotice] = useState<CartNotice | null>(null);
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [navigating, startTransition] = useTransition();

  // The mock cart lives in its cookie, so two requests in flight at once would
  // each rewrite it from the same starting point and one change would be lost.
  // Mutations therefore run one at a time, in order (as Server Actions did).
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  // Each mutation (and each read) takes a number; a response is applied only if
  // nothing newer has started since, so rapid stepper taps don't flash back
  // through intermediate quantities and a slow first GET can't wipe an add.
  const mutationSeq = useRef(0);
  const noticeSeq = useRef(0);
  const cartRef = useRef<Cart | null>(null);
  const checkoutLock = useRef(false);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const enqueue = useCallback(<T,>(task: () => Promise<T>): Promise<T> => {
    const run = queue.current.then(task, task);
    queue.current = run.catch(() => {});
    return run;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const startSeq = mutationSeq.current;
    fetchCart()
      .then((next) => {
        // An add that started meanwhile carries the newer cart; don't overwrite it.
        if (!cancelled && mutationSeq.current === startSeq) setCart(next);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Back/forward (e.g. the iOS swipe) navigates under an open drawer: close it.
    // (Android's back gesture closes the drawer itself, via the dialog.)
    const onPopState = () => {
      setIsOpen(false);
      setNotice(null);
    };
    // Coming back from an external checkout via the back button (bfcache).
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      checkoutLock.current = false;
      setCheckoutStarted(false);
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  // "Added" states are short-lived.
  useEffect(() => {
    if (!lastAdded) return;
    const t = window.setTimeout(
      () => setLastAdded((cur) => (cur === lastAdded ? null : cur)),
      Math.max(0, lastAdded.at + LAST_ADDED_MS - Date.now()),
    );
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  // A checkout that navigated within the app is over once the navigation is.
  useEffect(() => {
    if (!navigating && !checkoutStarted) checkoutLock.current = false;
  }, [navigating, checkoutStarted]);

  const markPending = useCallback((id: string, on: boolean) => {
    setPending((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  /**
   * Runs one cart op after the ones before it, applies its cart if it's still
   * the newest, and on failure re-reads the server's cart (again, unless
   * something newer is on its way).
   */
  const mutate = useCallback(
    async (op: CartOp): Promise<CartResponse> => {
      const seq = ++mutationSeq.current;
      try {
        const res = await enqueue(() => postCart(op));
        if (seq === mutationSeq.current) setCart(res.cart);
        return res;
      } catch (err) {
        void enqueue(async () => {
          if (seq !== mutationSeq.current) return;
          const next = await fetchCart().catch(() => undefined);
          if (next !== undefined && seq === mutationSeq.current) setCart(next);
        });
        throw err;
      }
    },
    [enqueue],
  );

  const showNotice = useCallback<CartContextValue["showNotice"]>((message, action) => {
    noticeSeq.current += 1;
    setNotice({ id: noticeSeq.current, message, action });
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);
  const clearError = useCallback(() => setErrorState(null), []);

  const addItems = useCallback<CartContextValue["addItems"]>(
    async (lines, meta) => {
      void preloadCartDrawer();
      setErrorState(null);
      setAddingCount((n) => n + 1);
      const opensDrawer = meta.openDrawer !== false;
      if (opensDrawer) {
        setIsOpen(true);
        setNotice(null);
      }
      try {
        const res = await mutate({ op: "add", lines, swap: meta.swap !== false });
        const variantId = lines[0]?.variantId ?? "";
        setLastAdded({ title: meta.productTitle, at: Date.now(), variantId, productHandle: meta.productHandle });

        const swapped: SwappedLine[] = res.swapped ?? [];
        if (swapped.length > 0) {
          const to = meta.productHandle === HANDLES.completeSet ? cartCopy.notices.completeSetName : meta.productTitle;
          showNotice(cartCopy.notices.swapped([...new Set(swapped.map((s) => s.productTitle))], to));
          track("remove_from_cart", {
            value: swapped.reduce((sum, s) => sum + toNumber(s.unitPrice) * s.quantity, 0),
            items: swapped.map(lineItem),
          });
        } else if (opensDrawer) {
          showNotice(
            meta.productHandle === HANDLES.completeSet
              ? cartCopy.notices.addedSet
              : cartCopy.notices.added(meta.productTitle),
          );
        }
        const quantity = lines.reduce((n, l) => n + l.quantity, 0);
        track("add_to_cart", { value: meta.price * quantity, items: [metaItem(meta, quantity)] });
        return true;
      } catch {
        setErrorState({ message: failure(cartCopy.errors.add), retry: { lines, meta } });
        return false;
      } finally {
        setAddingCount((n) => n - 1);
      }
    },
    [mutate, showNotice],
  );

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>(
    async (lineId, quantity) => {
      setErrorState(null);
      const q = Math.max(0, Math.min(99, Math.floor(quantity)));
      const before = cartRef.current?.lines.find((l) => l.id === lineId);
      setCart((prev) =>
        prev
          ? recalc(
              prev,
              q === 0
                ? prev.lines.filter((l) => l.id !== lineId)
                : prev.lines.map((l) => (l.id === lineId ? { ...l, quantity: q } : l)),
            )
          : prev,
      );
      if (before && q !== before.quantity) {
        const delta = Math.abs(q - before.quantity);
        track(q > before.quantity ? "add_to_cart" : "remove_from_cart", {
          value: toNumber(before.unitPrice) * delta,
          items: [lineItem({ ...before, quantity: delta })],
        });
      }
      if (q === 0 && before) {
        setLastAdded((cur) => (cur?.variantId === before.variantId ? null : cur));
      }
      markPending(lineId, true);
      try {
        await mutate({ op: "update", lineId, quantity: q });
        return true;
      } catch {
        setErrorState({ message: failure(cartCopy.errors.generic) });
        return false;
      } finally {
        markPending(lineId, false);
      }
    },
    [markPending, mutate],
  );

  const removeLine = useCallback((lineId: string) => updateQuantity(lineId, 0), [updateQuantity]);

  const replaceLine = useCallback<CartContextValue["replaceLine"]>(
    async (lineId, variantId, meta) => {
      setErrorState(null);
      const previous = cartRef.current?.lines.find((l) => l.id === lineId);
      markPending(lineId, true);
      try {
        await mutate({ op: "replace", lineId, variantId });
        if (previous) {
          setLastAdded((cur) => (cur?.variantId === previous.variantId ? null : cur));
          track("remove_from_cart", {
            value: toNumber(previous.unitPrice) * previous.quantity,
            items: [lineItem(previous)],
          });
        }
        if (meta) {
          const quantity = previous?.quantity ?? 1;
          track("add_to_cart", { value: meta.price * quantity, items: [metaItem(meta, quantity)] });
        }
        return true;
      } catch {
        setErrorState({ message: failure(cartCopy.errors.generic) });
        return false;
      } finally {
        markPending(lineId, false);
      }
    },
    [markPending, mutate],
  );

  const saveNote = useCallback<CartContextValue["saveNote"]>(
    async (note) => {
      try {
        await mutate({ op: "note", note });
        return true;
      } catch {
        setErrorState({ message: failure(cartCopy.errors.generic) });
        return false;
      }
    },
    [mutate],
  );

  const saveAttributes = useCallback<CartContextValue["saveAttributes"]>(
    async (attributes) => {
      try {
        await mutate({ op: "attributes", attributes });
        return true;
      } catch {
        setErrorState({ message: failure(cartCopy.errors.generic) });
        return false;
      }
    },
    [mutate],
  );

  const goToCheckout = useCallback<CartContextValue["goToCheckout"]>(
    async (lines) => {
      // A second tap while the first is on its way does nothing.
      if (checkoutLock.current) return false;
      checkoutLock.current = true;
      setErrorState(null);
      setCheckoutStarted(true);
      try {
        // Buy Now doesn't touch the main cart, so it needn't wait for its queue.
        const res = lines?.length ? await postCart({ op: "buyNow", lines }) : await mutate({ op: "checkout" });
        const url = res.checkoutUrl;
        if (!url) throw new Error("No checkout URL");
        // Value and items both come from the cart that goes to checkout.
        if (res.cart) {
          track("begin_checkout", { value: toNumber(res.cart.subtotal), items: analyticsItems(res.cart) });
        }
        if (/^https?:\/\//.test(url)) {
          // Hosted checkout: keep the loading state up until the page unloads.
          window.location.assign(url);
          return true;
        }
        // The drawer closes in the same transition as the navigation, so it
        // shows "Heading to checkout…" until the checkout page is ready. The
        // lock is released once that navigation finishes (effect above).
        startTransition(() => {
          setIsOpen(false);
          setNotice(null);
          router.push(url);
        });
        setCheckoutStarted(false);
        return true;
      } catch {
        checkoutLock.current = false;
        setCheckoutStarted(false);
        setErrorState({ message: failure(cartCopy.errors.generic) });
        return false;
      }
    },
    [mutate, router],
  );

  const openCart = useCallback(() => {
    void preloadCartDrawer();
    setIsOpen(true);
    setNotice(null);
    setErrorState(null);
    const current = cartRef.current;
    if (current) track("view_cart", { value: toNumber(current.subtotal), items: analyticsItems(current) });
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
    setNotice(null);
  }, []);

  const isInCart = useCallback(
    (variantId: string) => Boolean(cart?.lines.some((l) => l.variantId === variantId)),
    [cart],
  );

  const checkingOut = checkoutStarted || navigating;
  const adding = addingCount > 0;
  const retryLines = errorState?.retry;
  const retry = useMemo(
    () => (retryLines ? () => void addItems(retryLines.lines, retryLines.meta) : null),
    [retryLines, addItems],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      isOpen,
      openCart,
      closeCart,
      adding,
      pendingLineIds,
      lastAdded,
      isInCart,
      error: errorState?.message ?? null,
      retry,
      clearError,
      addItems,
      updateQuantity,
      removeLine,
      replaceLine,
      saveNote,
      saveAttributes,
      goToCheckout,
      checkingOut,
      notice,
      showNotice,
      dismissNotice,
    }),
    [
      cart,
      loading,
      isOpen,
      openCart,
      closeCart,
      adding,
      pendingLineIds,
      lastAdded,
      isInCart,
      errorState,
      retry,
      clearError,
      addItems,
      updateQuantity,
      removeLine,
      replaceLine,
      saveNote,
      saveAttributes,
      goToCheckout,
      checkingOut,
      notice,
      showNotice,
      dismissNotice,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
