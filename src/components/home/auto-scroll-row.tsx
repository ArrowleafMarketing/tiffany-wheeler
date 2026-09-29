"use client";

import { Children, useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

type Props = {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration: number;
  labels: { region: string };
};

/**
 * An endless, slowly scrolling row (the review cards). It keeps moving under the
 * mouse (a design choice); it only pauses while a keyboard user is focused inside
 * it, so links there stay usable. The items render
 * twice for a seamless loop; the copy is hidden from assistive tech. Under
 * reduced motion (and in the static HTML) it's a plain swipeable row instead.
 */
export function AutoScrollRow({ children, duration, labels }: Props) {
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED_MOTION).matches, () => true);
  const [focused, setFocused] = useState(false);
  const items = Children.toArray(children);

  if (reduced) {
    return (
      <ul aria-label={labels.region} className="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto overflow-y-hidden px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {items.map((item, i) => (
          <li key={i} className="flex shrink-0 snap-start">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const stopped = focused;
  return (
    <div
      role="region"
      aria-label={labels.region}
      className="relative -mx-4 overflow-hidden sm:-mx-6 lg:mx-0 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div
        className={cn("flex w-max animate-ticker", stopped && "[animation-play-state:paused]")}
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} inert={copy === 1} className="flex shrink-0 gap-4 pr-4">
            {items.map((item, i) => (
              <li key={i} className="flex shrink-0">
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
