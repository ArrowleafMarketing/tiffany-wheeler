// The cart drawer's body (lines, upsells, gift note, checkout) is its own
// chunk, so it isn't in every page's first-load JS. It loads on the first
// open or add, and is prefetched on pointerdown of any Add to Cart button and
// on hover or press of the cart icon, so it's usually ready by the time the
// drawer slides in.

type DrawerBodyModule = typeof import("./cart-drawer-body");

let pending: Promise<DrawerBodyModule> | null = null;

export function preloadCartDrawer(): Promise<DrawerBodyModule> {
  if (!pending) {
    pending = import("./cart-drawer-body");
    // A failed chunk load (flaky connection) can be retried on the next call.
    pending.catch(() => {
      pending = null;
    });
  }
  return pending;
}
