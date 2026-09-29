import { cartCopy } from "@/content/cart";

/** Placeholder lines while the cart (or the drawer's code) loads, or while the first add is in flight. */
export function CartSkeleton() {
  return (
    <div className="flex-1 px-4 py-4 sm:px-6" aria-busy="true">
      <p className="sr-only">{cartCopy.drawer.loading}</p>
      {[0, 1].map((i) => (
        <div key={i} className="flex animate-pulse gap-3 py-4">
          <div className="size-20 rounded-xl bg-cream-deep" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-3/4 rounded bg-cream-deep" />
            <div className="h-3 w-1/3 rounded bg-cream-deep" />
            <div className="mt-4 h-10 w-32 rounded-(--radius-btn) bg-cream-deep" />
          </div>
        </div>
      ))}
    </div>
  );
}
