"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Accessible name of the group, e.g. "Quantity of Nephite Christmas". */
  label?: string;
  /** Names the item in the button labels: "Decrease quantity of {itemName}" (copy deck §4.1). */
  itemName?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
};

/**
 * − value + stepper. At the limits the buttons are aria-disabled rather than
 * disabled, so pressing − down to 1 doesn't knock keyboard focus to <body>.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  itemName,
  size = "md",
  disabled,
  className,
}: Props) {
  const btn = cn(
    "grid place-items-center text-ink transition-colors hover:bg-ink/5 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:bg-transparent",
    size === "sm" ? "size-9" : "size-12",
  );
  const atMin = disabled || value <= min;
  const atMax = disabled || value >= max;
  const suffix = itemName ? ` of ${itemName}` : "";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center overflow-hidden rounded-(--radius-btn) border-2 border-ink/15 bg-paper",
        className,
      )}
    >
      <button
        type="button"
        className={btn}
        aria-label={`Decrease quantity${suffix}`}
        aria-disabled={atMin || undefined}
        onClick={() => {
          if (!atMin) onChange(Math.max(min, value - 1));
        }}
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <output
        aria-live="polite"
        className={cn("min-w-8 text-center font-semibold tabular-nums text-ink", size === "sm" && "text-sm")}
      >
        {value}
      </output>
      <button
        type="button"
        className={btn}
        aria-label={`Increase quantity${suffix}`}
        aria-disabled={atMax || undefined}
        onClick={() => {
          if (!atMax) onChange(Math.min(max, value + 1));
        }}
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}
