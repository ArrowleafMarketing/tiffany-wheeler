"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PeekTab = {
  id: string;
  label: string;
  /** Server-rendered panel content (the carousel and anything under it). */
  panel: ReactNode;
};

/**
 * Accessible tabs (roving tabindex; arrows, Home and End). Only the active panel
 * is mounted, so the other book's images don't load until its tab is chosen.
 */
export function PeekInsideTabs({ tabs, defaultTab, label }: { tabs: PeekTab[]; defaultTab: string; label: string }) {
  const baseId = useId();
  const [active, setActive] = useState(() => (tabs.some((t) => t.id === defaultTab) ? defaultTab : tabs[0]?.id));
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  if (!current) return null;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === active);
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % tabs.length
        : e.key === "ArrowLeft"
          ? (i - 1 + tabs.length) % tabs.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? tabs.length - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(tabs[next].id);
    buttons.current[next]?.focus();
  };

  return (
    <div>
      {tabs.length > 1 ? (
        <div
          role="tablist"
          aria-label={label}
          onKeyDown={onKeyDown}
          className="mx-auto mb-6 flex w-fit max-w-full rounded-full border border-line bg-paper p-1 shadow-soft sm:mb-8"
        >
          {tabs.map((t, i) => {
            const selected = t.id === current.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(t.id)}
                className={cn(
                  "min-h-11 rounded-full px-4 text-[0.95rem] font-semibold transition-colors sm:px-6",
                  selected ? "bg-ink text-white shadow-soft" : "text-body hover:bg-ink/5 hover:text-ink",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      ) : null}
      <div
        role={tabs.length > 1 ? "tabpanel" : undefined}
        id={`${baseId}-panel`}
        aria-labelledby={tabs.length > 1 ? `${baseId}-tab-${current.id}` : undefined}
        key={current.id}
      >
        {current.panel}
      </div>
    </div>
  );
}
