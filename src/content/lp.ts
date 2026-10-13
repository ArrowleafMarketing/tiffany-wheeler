// Copy for the Nephite Christmas paid-social landing page, /lp/christmas-tradition
// (docs/discovery/market-cro.md §5.1 and §6(b)). Deck copy is reused where the
// deck has it: the H1 is copy deck §2.1 alternate B, which the deck earmarks for
// this page. Lines the deck doesn't have are marked `// NEW (not in the deck)`.
//
// Meta ad policy: describe the book, never the reader's faith. No "LDS moms",
// no "as Latter-day Saints, you…". Every price, date and count is filled in at
// render time from the catalog, the season and store-config; claims that need
// Tiffany's sign-off are gated on CLAIMS.

import { featuredReviewRefs, type ReviewRef } from "@/content/reviews";
import type { FaqId } from "@/content/faq";
import { FOOTER } from "@/content/site";

export const LP_CHRISTMAS_PATH = "/lp/christmas-tradition";

// ── Metadata ─────────────────────────────────────────────────────────────────

export const lpMeta = {
  title: "Nephite Christmas: The Book of Mormon Christmas Story in Rhyme",
  // NEW (not in the deck). No price or shipping claim, so it can't go stale.
  description:
    "The Book of Mormon Christmas story from 3 Nephi 1, told in the rhythm of ’Twas the Night Before Christmas. An illustrated hardcover picture book to read aloud on Christmas Eve.",
} as const;

// ── Slim deadline bar (layout) ───────────────────────────────────────────────

export const lpBarCopy = {
  /** Accessible name of the bar. */
  label: "Christmas delivery",
  /** "Order by Dec 15 for Christmas". The date is season.christmas.standardOrderBy. */
  orderBy: (date: string) => `Order by ${date} for Christmas`, // CONFIRM cutoff (§5, item 7)
  /** Only while CLAIMS.freeShipping and the set's price clears the threshold. */
  setShipsFree: "The set ships free", // CONFIRM threshold (§5, item 2)
  /** After the standard cutoff, with Priority offered (CLAIMS.priorityShipping). */
  priorityBy: (date: string) => `Priority shipping by ${date} for Christmas`, // CONFIRM (§5, item 7)
  /** After the last cutoff (normal handling time continues). CONFIRM whether Tiffany pauses shipping (§5, item 7). */
  afterCutoff: "Hardcovers may not arrive by Christmas · The PDF is instant",
} as const;

// ── Hero ─────────────────────────────────────────────────────────────────────

export const lpHeroCopy = {
  /** Copy deck §2.1, H1 alternate B: the rhyme-led ad angle, word for word. */
  title: "The Book of Mormon Christmas story, in the rhythm of ’Twas the Night Before Christmas.",
} as const;

// ── Peek inside + trailer ───────────────────────────────────────────────────

/**
 * The vertical cut of the trailer (public/video/hero-mobile-preview.mp4, the
 * first 16s of the 30s ad edit) matches the ads, so the page matches what the visitor just saw. That encode
 * has no audio track, so the play control says so instead of promising sound.
 */
export const lpTrailerCopy = {
  heading: "Watch families read it by the fire", // §2.7
  sub: "Grandmas, moms and kids gathered around Nephite Christmas. (0:16)", // §2.7
  videoTitle: "Nephite Christmas trailer",
  playLabel: "Play Video",
  // NEW (not in the deck): §2.7 says "with sound", but the vertical encode is silent.
  playDescription: "Play a 16-second preview of the Nephite Christmas trailer. This version has no sound.",
  posterAlt: "A mother and her children read Nephite Christmas together by the fireplace", // §2.7
} as const;

// ── Reviews ──────────────────────────────────────────────────────────────────

/**
 * The four cards for this page, from the deck's featured list (§2.8), chosen
 * for the ad's themes: Christmas Eve, the familiar cadence, a family tradition
 * and grandchildren. Trims come from the deck refs, so the text stays verbatim.
 */
const LP_REVIEW_AUTHORS = ["Karen H Bartlett", "Austin Vach", "Kathy Horning", "Merrilee Boyack"];

export const lpReviewRefs: ReviewRef[] = LP_REVIEW_AUTHORS.flatMap(
  (author) => featuredReviewRefs.find((ref) => ref.author === author) ?? [],
);

// ── Value stack ─────────────────────────────────────────────────────────────

export const lpValueStackCopy = {
  eyebrow: "Best value", // §2.4 badge
  headline: "His birth and His Resurrection, in one set.", // §2.4
  sub: "Read Nephite Christmas on Christmas Eve, then walk through Holy Week with Easter Journey. Two illustrated hardcovers that come back out every year.", // §2.4
  /** " — {price}" is appended from the catalog. */
  cta: "Get Both Books", // §2.4
  imageAlt: "Nephite Christmas and Easter Journey hardcovers standing side by side", // §3.3 primary image alt
} as const;

// ── FAQ ──────────────────────────────────────────────────────────────────────

export const lpFaqCopy = {
  title: "Questions? We’re here to help.", // §2.14
  /**
   * The five questions a cold visitor asks before buying, in this order. The
   * answers come from src/content/faq.ts (season-aware, flag-aware): the
   * guarantee id falls back to the "something’s wrong" answer when
   * CLAIMS.moneyBackGuarantee is off, and the dove answer to "throughout the book".
   */
  ids: ["christmas-deadline", "church", "ages", "guarantee", "dove"] satisfies FaqId[],
} as const;

// ── Final call to action ─────────────────────────────────────────────────────

export const lpFinalCtaCopy = {
  eyebrow: "Start the tradition", // homepage closing band
  // NEW (not in the deck); market-cro §6(b) item 6 names the section this way.
  headline: "Make it your Christmas Eve tradition.",
  /** Real order-by date, only before the standard cutoff. */
  orderBy: (date: string) => `Order by ${date} for Christmas delivery.`, // CONFIRM cutoff (§5, item 7)
  /**
   * The trust row under the button (§1.4 items by id, rendered by TrustStrip,
   * which drops any item whose claim is off: the guarantee while
   * CLAIMS.moneyBackGuarantee is false, free shipping while CLAIMS.freeShipping is).
   */
  trustIds: ["guarantee", "shipping"],
} as const;

// ── Minimal footer ───────────────────────────────────────────────────────────

export const lpFooterCopy = {
  navLabel: "Store policies",
  links: [
    { label: "Shipping & Christmas Delivery", href: "/shipping#christmas-delivery" },
    { label: "Returns & Exchanges", href: "/returns" },
    ...FOOTER.legal,
    { label: "Contact Tiffany", href: "/contact" },
  ],
  copyright: (year: string) => `© ${year} ${FOOTER.copyrightHolder}. ${FOOTER.copyrightSuffix}`, // CONFIRM legal entity (§5, item 24)
} as const;
