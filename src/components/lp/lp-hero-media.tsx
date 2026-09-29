"use client";

import type { ReactNode } from "react";
import { useBuyBox } from "@/components/product/buy-box";
import { cn } from "@/lib/cn";

type Props = {
  /** The book on its own (server-rendered, preloaded: the page's LCP image). */
  single: ReactNode;
  /** Shown while this product is picked in the buy box ("Both books"). */
  both: ReactNode;
  bothHandle: string;
  /** Corner badge (phones: over the image). */
  badge?: ReactNode;
  className?: string;
};

/**
 * The hero image stage. It follows the buy box: picking "Both books" swaps the
 * cover for the photo of both hardcovers, so the choice is visible. The second
 * image only mounts when it's picked, so it never competes with the first one.
 * A short, wide stage on phones keeps the whole offer on the first screen.
 */
export function LpHeroMedia({ single, both, bothHandle, badge, className }: Props) {
  const { current } = useBuyBox();
  const showBoth = current.productHandle === bothHandle;
  return (
    <div
      className={cn(
        "relative aspect-[2/1] overflow-hidden rounded-(--radius-card) bg-cream-deep sm:aspect-[16/9] lg:aspect-[5/4]",
        className,
      )}
    >
      <div className={cn("absolute inset-0 grid place-items-center", showBoth && "hidden")}>{single}</div>
      {showBoth ? <div className="absolute inset-0">{both}</div> : null}
      {badge ? <div className="pointer-events-none absolute left-2 top-2 sm:left-3 sm:top-3">{badge}</div> : null}
    </div>
  );
}
