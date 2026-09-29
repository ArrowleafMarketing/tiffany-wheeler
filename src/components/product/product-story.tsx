import { Plus } from "lucide-react";
import { HOW_IT_BEGAN_FROM, PDP_COPY } from "@/content/pdp";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";

/**
 * About the Story (and Easter Journey's "How it began"), collapsed by default:
 * the plot summary is for readers who want it, not a wall between the reviews
 * and the button. Native <details>, so it works without JavaScript.
 */
export function ProductStory({ product, className }: { product: Product; className?: string }) {
  const paragraphs = product.story ?? [];
  if (paragraphs.length === 0) return null;
  const storyEnd = HOW_IT_BEGAN_FROM[product.handle] ?? paragraphs.length;
  const story = paragraphs.slice(0, storyEnd);
  const began = paragraphs.slice(storyEnd);
  const title = story.length > 0 ? PDP_COPY.sections.aboutStory : PDP_COPY.sections.howItBegan;

  return (
    <section aria-labelledby="pdp-story" className={cn("border-t border-line py-10 sm:py-14", className)}>
      <div className="container-page">
        <details className="group max-w-3xl">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-(--radius-btn) [&::-webkit-details-marker]:hidden">
            <h2 id="pdp-story" className="text-2xl font-semibold sm:text-3xl">
              {title}
            </h2>
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-full bg-periwinkle-light text-periwinkle-text transition-transform duration-200 group-open:rotate-45"
            >
              <Plus className="size-4" />
            </span>
          </summary>
          <div className="mt-5 grid gap-8">
            {story.length > 0 ? (
              <div className="grid max-w-prose gap-4 text-base leading-relaxed sm:text-lg">
                {story.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            ) : null}
            {story.length > 0 && began.length > 0 ? (
              <div className="max-w-prose rounded-(--radius-card) border border-line bg-paper p-6 shadow-soft sm:p-8">
                <h3 className="text-xl font-semibold sm:text-2xl">{PDP_COPY.sections.howItBegan}</h3>
                <div className="mt-3 grid gap-3 leading-relaxed">
                  {began.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </div>
            ) : (
              began.map((p) => (
                <p key={p.slice(0, 40)} className="max-w-prose leading-relaxed">
                  {p}
                </p>
              ))
            )}
          </div>
        </details>
      </div>
    </section>
  );
}
