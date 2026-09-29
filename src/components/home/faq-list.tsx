import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import type { Faq } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";

/** A FAQ may carry a stable id; it renders as the anchor `#faq-{id}` (e.g. `/faq#faq-guarantee`). */
type Item = Faq & { id?: string };

type Props = {
  items: readonly Item[];
  className?: string;
  /** Also render FAQPage JSON-LD with the same text. Use it once per page. */
  jsonLd?: boolean;
};

const EMAIL = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

/** Turns plain email addresses in an answer into mailto links. */
function withLinks(text: string): ReactNode[] {
  return text.split(EMAIL).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="font-semibold text-periwinkle-text underline underline-offset-2 hover:text-ink"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

/**
 * Accessible FAQ accordion on native <details>/<summary>: works without
 * JavaScript, keyboard operable, announced as expandable. An item's `id` goes on
 * its <summary> as `faq-{id}` (prefixed so it can't collide with section ids
 * such as #guarantee on /returns), so a link to `#faq-{id}` scrolls to the question.
 */
export function FaqList({ items, className, jsonLd = false }: Props) {
  const structuredData = jsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <div
      className={cn(
        "divide-y divide-line overflow-hidden rounded-(--radius-card) border border-line bg-paper shadow-soft",
        className,
      )}
    >
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary
            id={item.id ? `faq-${item.id}` : undefined}
            // The card clips its children (overflow-hidden + rounded corners), so
            // draw the focus ring inside the summary instead of outside it.
            className="flex min-h-14 cursor-pointer list-none scroll-mt-24 items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-cream/70 focus-visible:rounded-2xl focus-visible:-outline-offset-4 sm:px-6 [&::-webkit-details-marker]:hidden"
          >
            <span className="font-display text-[1.05rem] font-semibold leading-snug text-ink sm:text-lg">
              {item.question}
            </span>
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full bg-periwinkle-light text-periwinkle-text transition-transform duration-200 group-open:rotate-45"
            >
              <Plus className="size-4" />
            </span>
          </summary>
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="max-w-prose leading-relaxed text-body">{withLinks(item.answer)}</p>
          </div>
        </details>
      ))}
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      ) : null}
    </div>
  );
}
