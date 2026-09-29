import { Bird, Music, Sparkles, type LucideIcon } from "lucide-react";
import { whyFamilies, type Reason } from "@/content/home-story";
import { cn } from "@/lib/cn";

/** The three one-line reasons the ad angle rests on (market-cro §6(b) item 4). */
const LP_REASONS: Reason["icon"][] = ["rhythm", "dove", "night"];

const icons: Partial<Record<Reason["icon"], LucideIcon>> = {
  rhythm: Music,
  dove: Bird,
  night: Sparkles,
};

/**
 * Rhythm and rhyme, the hidden dove (the copy is gated on
 * CLAIMS.doveOnEveryPage in home-top) and Samuel's sign from 3 Nephi 1, as
 * copy deck §2.5 words them. They describe the book, never the reader.
 */
export function LpReasons({ className }: { className?: string }) {
  const reasons = LP_REASONS.flatMap((icon) => whyFamilies.reasons.find((r) => r.icon === icon) ?? []);
  return (
    <section aria-labelledby="lp-reasons-heading" className={cn("bg-paper py-12 sm:py-16", className)}>
      <div className="container-page">
        <h2
          id="lp-reasons-heading"
          className="mx-auto max-w-2xl text-center text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl"
        >
          {whyFamilies.heading}
        </h2>
        <ol className="mx-auto mt-7 grid max-w-5xl gap-5 sm:mt-10 md:grid-cols-3 md:gap-8">
          {reasons.map((reason) => {
            const Icon = icons[reason.icon] ?? Sparkles;
            return (
              <li key={reason.title} className="flex gap-4 md:flex-col md:gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-periwinkle-light text-periwinkle-text sm:size-12">
                  <Icon aria-hidden className="size-5 sm:size-6" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug sm:text-xl">{reason.title}</h3>
                  <p className="mt-1 leading-relaxed text-body">{reason.line}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
