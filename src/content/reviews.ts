// Review selection and review copy (copy deck §2.8, plus the §2.5 proof line).
//
// Review bodies are never retyped here: every review is referenced by author and
// date and its text comes verbatim from getReviews() (FTC Consumer Reviews rule).
// The deck's trims ("…") are expressed as cut points on that verbatim text; if a
// cut point stops matching, the full body is shown instead of a guess.
//
// The Kim and John Bytheway testimonial is not in the review data (it was sent to
// Tiffany directly), so its deck text is kept here, verbatim.

import type { Review } from "@/lib/commerce/types";
import { CLAIMS } from "@/lib/store-config";

// ── Copy ─────────────────────────────────────────────────────────────────────

// Counts always come from the catalog rating (product.ratings), never from here.
// The deck's Amazon line is deliberately left out: it sends price-sensitive
// visitors to a cheaper listing, out of reach of the Meta pixel.
export const reviewsCopy = {
  /** The auto-scrolling row of review cards. */
  row: { region: "More reviews" },
  heading: "What families are saying",
  /** “5.0 · 17 reviews of Nephite Christmas”; stars render beside it. */
  summary: (rating: string, count: number) => `${rating} · ${count} reviews of Nephite Christmas`, // CONFIRM count (§5, item 12)
  readAll: (count: number) => `Read All ${count} Reviews`, // CONFIRM count (§5, item 12)
  write: "Write a Review",
  verified: "Verified buyer",
} as const;

/**
 * Kim and John Bytheway's note (§2.8). Rendered only once written permission is
 * on file (CLAIMS.bythewayTestimonial, §5 item 14). If they received the book
 * free (CLAIMS.bythewayComplimentaryCopy), the FTC Endorsement Guides require
 * the disclosure line, so `note` fills itself in.
 */
export const bythewayTestimonial = {
  show: CLAIMS.bythewayTestimonial,
  quote:
    "We just received your Nephi Christmas book and it is absolutely beautiful. Thank you so much for adding to our Christmas collection in such a beautiful way. Thank you for helping make a new tradition in our home. … many thanks for this lovely treasure.",
  /** For a hero pull or an ad. */
  shortQuote: "…it is absolutely beautiful. … Thank you for helping make a new tradition in our home.",
  name: "Kim and John Bytheway",
  note: CLAIMS.bythewayComplimentaryCopy === true ? "Received a complimentary copy." : null,
};

// ── Selection ────────────────────────────────────────────────────────────────

/**
 * Points at one verbatim review, with optional trims:
 * - `from`: start at this text (prefix “…” unless `fromMidSentence` is false)
 * - `omit`: replace each fragment with “…”
 * - `to`: end after this text and append “…”
 * - `contains`: disambiguates two reviews with the same author and date
 */
export type ReviewRef = {
  author: string;
  date: string;
  contains?: string;
  from?: string;
  fromMidSentence?: boolean;
  omit?: string[];
  to?: string;
};

/** The 8 featured Nephite Christmas reviews, in the deck's order (§2.8). */
export const featuredReviewRefs: ReviewRef[] = [
  { author: "Karen H Bartlett", date: "2025-11-21", omit: ["from the Book of Morman"] },
  { author: "Noel", date: "2025-10-03" },
  { author: "LeeAnn Jett", date: "2024-11-17" },
  { author: "Kathy Horning", date: "2024-12-06", to: "I have given copies to my children" },
  { author: "Austin Vach", date: "2024-12-01" },
  { author: "Merrilee Boyack", date: "2024-11-05" },
  { author: "Kate Asbury", date: "2024-11-10" },
  { author: "Nate", date: "2024-07-20" },
];

/** Alternates, for landing pages or a second row (§2.8). */
export const alternateReviewRefs: ReviewRef[] = [
  {
    author: "Candice andrus",
    date: "2024-10-09",
    from: "My grandma used to include",
    fromMidSentence: false,
    omit: [
      "The illustration is awesome and the words makes it clear that the author loves and cherishes the nephites and the Book of Mormon. What a wonderful opportunity to have this book in my home to read yearly now!",
    ],
  },
  { author: "Kendra Santa Cruz", date: "2024-09-28", contains: "Such a sweet story!" },
  { author: "Tim", date: "2024-11-09" },
  { author: "D Fuller", date: "2025-11-17" },
  { author: "Jeanne", date: "2024-12-05" },
];

/** The §2.5 proof line: “…the kids love finding the dove.” — Noel */
export const doveProofRef: ReviewRef = { author: "Noel", date: "2025-10-03", from: "the kids love finding the dove." };

/** Applies a ref's trims to a verbatim body. Any cut point that no longer matches is skipped. */
export function excerpt(body: string, ref: ReviewRef): string {
  let text = body;
  if (ref.from) {
    const i = text.indexOf(ref.from);
    if (i > 0) text = (ref.fromMidSentence === false ? "" : "…") + text.slice(i);
  }
  for (const fragment of ref.omit ?? []) {
    if (text.includes(fragment)) text = text.replace(fragment, "…");
  }
  if (ref.to) {
    const i = text.indexOf(ref.to);
    const end = i + ref.to.length;
    if (i >= 0 && end < text.length) text = `${text.slice(0, end)}…`;
  }
  return text;
}

/** Resolves refs against reviews from getReviews(), keeping the refs' order. Missing refs are dropped. */
export function pickReviews(reviews: Review[], refs: ReviewRef[]): Review[] {
  const picked: Review[] = [];
  for (const ref of refs) {
    const match = reviews.find(
      (r) => r.author === ref.author && r.date === ref.date && (!ref.contains || r.body.includes(ref.contains)),
    );
    if (match) picked.push({ ...match, body: excerpt(match.body, ref) });
  }
  return picked;
}
