import { BadgeCheck } from "lucide-react";
import type { Review } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { Stars } from "@/components/ui/stars";
import { reviewsCopy } from "@/content/reviews";

/**
 * “Karen H Bartlett” → “Karen B.”, “D Fuller” → “D. F.”, “Noel” → “Noel”.
 * First name plus the initial of the surname (a middle initial is skipped).
 */
export function reviewerName(author: string): string {
  const parts = author.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const bare = (s: string) => s.replace(/\./g, "");
  const first = bare(parts[0]).length === 1 ? `${bare(parts[0]).toUpperCase()}.` : cap(parts[0]);
  const rest = parts.slice(1);
  const surname = rest.find((p) => bare(p).length > 1) ?? rest.at(-1);
  return surname ? `${first} ${bare(surname).charAt(0).toUpperCase()}.` : first;
}

/**
 * Straight quotes to typographic ones, the only change the deck allows to a
 * verbatim review (docs/copy-deck.md, “How to use this deck”).
 */
export function curlyQuotes(text: string): string {
  return text
    .replace(/(^|[\s([{“])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{“])'/g, "$1‘")
    .replace(/'/g, "’");
}

const monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

function formatReviewDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m) return isoDate;
  return monthYear.format(new Date(Date.UTC(y, m - 1, d || 1)));
}

/** One customer review: stars, the verbatim text, reviewer name (first name + last initial). */
export function ReviewCard({ review, className }: { review: Review; className?: string }) {
  return (
    <figure
      className={cn(
        "flex flex-col rounded-(--radius-card) border border-line bg-paper p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      {/* The number spells the rating out, so it doesn't rest on star color alone (WCAG 1.4.11).
          It's hidden from screen readers: the stars' label already says "Rated 5.0 out of 5". */}
      <p className="flex items-center gap-2">
        <Stars value={review.rating} size={16} />
        <span aria-hidden className="text-sm font-semibold tabular-nums text-ink">
          {review.rating.toFixed(1)}
        </span>
      </p>
      <blockquote className="mt-3 text-base leading-relaxed text-body">
        <p>{curlyQuotes(review.body)}</p>
      </blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-semibold text-ink">{reviewerName(review.author)}</span>
        {review.verified ? (
          <span className="inline-flex items-center gap-1 font-medium text-forest">
            <BadgeCheck aria-hidden className="size-4" />
            {reviewsCopy.verified}
          </span>
        ) : null}
        <time dateTime={review.date} className="text-muted">
          {formatReviewDate(review.date)}
        </time>
      </figcaption>
    </figure>
  );
}
