import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "ember" | "forest" | "butter" | "periwinkle" | "night" | "neutral";

const tones: Record<Tone, string> = {
  ember: "bg-ember text-white",
  forest: "bg-forest-light text-forest-dark",
  butter: "bg-butter text-ink",
  periwinkle: "bg-periwinkle-light text-periwinkle-text",
  night: "bg-night text-gold",
  neutral: "bg-cream-deep text-body",
};

export function Badge({
  tone = "butter",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.06em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
