// Deliberate focus moves inside the cart drawer. When the control someone
// pressed disappears (Remove, an add-on tile, "Upgrade to the Set"), focus
// would fall to <body> and keyboard and screen-reader users lose their place
// (WCAG 2.4.3). These helpers put it somewhere sensible, but only when it was
// actually lost: they never take focus away from something else.

const DRAWER_ID = "cart-drawer";

function focusLost(drawer: HTMLElement): boolean {
  const active = document.activeElement;
  return !active || active === document.body || !active.isConnected || !drawer.contains(active);
}

/**
 * After the next render, focuses the first match of `selectors` inside the open
 * drawer (falling back to the drawer's heading), if focus was lost.
 */
export function focusInCart(...selectors: string[]): void {
  // Two frames: React commits the state change, then the browser lays it out.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const drawer = document.getElementById(DRAWER_ID);
      if (!drawer || !drawer.hasAttribute("open") || !focusLost(drawer)) return;
      for (const selector of [...selectors, "#cart-drawer-title"]) {
        const el = drawer.querySelector<HTMLElement>(selector);
        if (el) {
          el.focus();
          return;
        }
      }
    }),
  );
}

/** Selector for a cart line's title link. */
export const lineLink = (variantId: string) => `[data-line-link="${CSS.escape(variantId)}"]`;

/** Selector for the drawer notice's action button ("Undo"). */
export const NOTICE_ACTION = "[data-notice-action]";
