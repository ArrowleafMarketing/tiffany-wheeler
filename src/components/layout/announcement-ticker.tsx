"use client";

import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore, type CSSProperties } from "react";
import type { AnnouncementMessage } from "@/content/site";
import { cn } from "@/lib/cn";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * True when the visitor prefers reduced motion. The server snapshot is `true`,
 * so the static HTML (and no-JS visitors) show the first message only; the
 * ticker starts after hydration.
 */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );
}

type Props = {
  messages: AnnouncementMessage[];
  tone: "night" | "butter";
  /** Button labels (copy lives in src/content/site.ts; passed in to keep this island small). */
  labels: { pause: string; play: string };
  /** Scroll speed: seconds per message for one full loop. */
  secondsPerMessage: number;
};

/**
 * The season's messages as a scrolling ticker. It pauses on hover and keyboard
 * focus and has a pause button (WCAG 2.2.2). Under reduced motion (and before
 * hydration) it shows only the first message, standing still. The list is
 * rendered twice so the loop is seamless; the copy is hidden from assistive tech.
 */
export function AnnouncementTicker({ messages, tone, labels, secondsPerMessage }: Props) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const linkClass = cn(
    "inline-flex min-h-11 items-center whitespace-nowrap py-2 text-[0.8125rem] font-semibold leading-snug underline-offset-4 hover:underline sm:text-sm",
    tone === "night" ? "text-gold" : "text-ink",
  );

  if (reducedMotion || messages.length < 2) {
    const first = messages[0];
    return (
      <div className="flex justify-center px-4">
        <Link href={first.href} prefetch={false} className={cn(linkClass, "whitespace-normal text-center")}>
          {first.text}
        </Link>
      </div>
    );
  }

  const stopped = paused || hovered || focused;
  // Set on the element itself: a custom property inside the theme's animate value resolves at :root.
  const style: CSSProperties = { animationDuration: `${messages.length * secondsPerMessage}s` };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className={cn("flex w-max animate-ticker", stopped && "[animation-play-state:paused]")} style={style}>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} inert={copy === 1} className="flex shrink-0 items-center">
            {messages.map((m) => (
              <li key={m.href + m.text} className="flex items-center">
                {/* Low-value links: no viewport prefetch on metered mobile data. */}
                <Link href={m.href} prefetch={false} className={linkClass}>
                  {m.text}
                </Link>
                <span aria-hidden className={cn("px-5 text-[0.6rem]", tone === "night" ? "text-gold/60" : "text-ink/40")}>
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? labels.play : labels.pause}
        className={cn(
          "absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center",
          tone === "night"
            ? "bg-linear-to-l from-night from-60% to-transparent text-gold"
            : "bg-linear-to-l from-butter from-60% to-transparent text-ink",
        )}
      >
        {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
      </button>
    </div>
  );
}
