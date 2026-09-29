// Browser-only memory for the email bottom sheet (EmailSheet): whether this
// visitor already signed up, added to cart, saw the sheet this session, or
// dismissed it recently. It's a per-browser convenience, nothing more: every
// read and write is wrapped, and if storage is blocked (private mode, in-app
// browsers) the sheet simply behaves as if nothing was stored, at most once per
// page view.

const KEYS = {
  subscribed: "tw:lead:subscribed",
  addedToCart: "tw:lead:added-to-cart",
  dismissedAt: "tw:lead:sheet-dismissed-at",
  shownThisSession: "tw:lead:sheet-shown",
} as const;

/** After a dismissal the sheet stays away this long. */
export const SHEET_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

function read(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(storage: "local" | "session", key: string, value: string): void {
  try {
    (storage === "local" ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    // Storage unavailable: nothing to remember.
  }
}

/** Any email form succeeded: never show the sheet again in this browser. */
export function markSubscribed(): void {
  write("local", KEYS.subscribed, "1");
}

/** Something went into the cart: the sheet would only get in the way from now on. */
export function markAddedToCart(): void {
  write("local", KEYS.addedToCart, "1");
}

export function markSheetShown(): void {
  write("session", KEYS.shownThisSession, "1");
}

export function markSheetDismissed(now = Date.now()): void {
  write("local", KEYS.dismissedAt, String(now));
}

/** True when the sheet may appear: not subscribed, no add-to-cart, not shown this session, not snoozed. */
export function sheetAllowed(now = Date.now()): boolean {
  if (read("local", KEYS.subscribed) || read("local", KEYS.addedToCart)) return false;
  if (read("session", KEYS.shownThisSession)) return false;
  const dismissedAt = Number(read("local", KEYS.dismissedAt));
  return !(dismissedAt && now - dismissedAt < SHEET_SNOOZE_MS);
}
