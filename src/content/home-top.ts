// Copy for the top of the homepage: hero (copy deck §2.1 + §2.15), trust strip
// (§1.4 / §2.2, digital row from §3.0a), product cards (§2.3) and the Complete
// Set bar (§2.4). Copy is verbatim from docs/copy-deck.md. "[CONFIRM]" tags are
// stripped from the strings and tracked with a `// CONFIRM` comment (see §5).
//
// Prices, handles and commercial constants never live here: prices come from the
// catalog at render time and `{tokens}` are filled in by the components.
// Keep this module free of server-only imports: ProductCard reads it, and a
// client island (e.g. the cart drawer) may render compact cards.

import type { SeasonMode } from "@/lib/season";
import { formatMoney } from "@/lib/money";
import {
  CLAIMS,
  FLAT_RATE_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  HANDLES,
  HANDLING_TIME,
  SHIPS_FROM,
  productPath,
} from "@/lib/store-config";

const freeShippingFrom = formatMoney(FREE_SHIPPING_THRESHOLD, { trim: true }); // "$45"

/**
 * Keeps hyphenated words like "8-day" on one line by putting a word joiner
 * (U+2060, invisible) after the hyphen. Our fonts have no U+2011 glyph, so a
 * non-breaking hyphen would fall back to a system font.
 */
export function keepHyphens(text: string): string {
  return text.replace(/(\w)-(\w)/g, "$1-\u2060$2");
}

/**
 * The hidden-dove claim (§5, item 23). The book review found a dove on *nearly*
 * every page, so "every page" only renders once Tiffany confirms it
 * (CLAIMS.doveOnEveryPage); until then the deck's fallback wording is used.
 */
export const doveCopy = CLAIMS.doveOnEveryPage
  ? {
      /** Ends a sentence: "…, with {phrase}." */
      phrase: "a hidden dove on every page",
      bullet: "A hidden dove to find on every page",
      reason: "A dove is tucked into every page, and the afterword invites kids to count the stars, too.",
      /** Hero spec line: makes no every-page claim, so it's the same either way. */
      short: "Find the hidden dove",
    }
  : {
      phrase: "a dove hidden throughout the book",
      bullet: "A hidden dove to find throughout the book",
      reason: "A dove is hidden throughout the book, and the afterword invites kids to count the stars, too.",
      short: "Find the hidden dove",
    };

// ── Hero (§2.1, §2.15) ───────────────────────────────────────────────────────

export type HeroAction = {
  /** Button text. When `priceOf` is set, " — {price}" is appended from the catalog. */
  label: string;
  /** Adds this product's first available variant to the cart. */
  add?: string;
  /** Otherwise the button links here. */
  href?: string;
  /** Product handle whose price is appended to the label. */
  priceOf?: string;
};

/** Parts of the line under the Complete Set button, joined with " · " (see heroSetLine). */
export type HeroSetLinePart = "why" | "shipsFree" | "savings";

/** The set line when a mode doesn't set its own. The sticky bar follows the same choice. */
export const DEFAULT_SET_LINE: readonly HeroSetLinePart[] = ["why", "shipsFree"];

export type HeroCopy = {
  /**
   * Short lead-in above the H1, only when it carries a date. Every hero string
   * supports {easterDate} ("March 28"), {holyWeek} ("March 21–28, 2027"),
   * {resumeShipping} ("Monday, December 28") and {priorityBy} ("Thursday, December 17").
   */
  eyebrow?: string;
  title: string;
  /** One short spec line right under the H1. */
  lede?: string;
  primary: HeroAction;
  secondary: HeroAction;
  /** The line under whichever button adds the Complete Set. Defaults to why + ships free. */
  setLine?: readonly HeroSetLinePart[];
  /** Alt text for the two-book composition (the front book is named first). */
  imageAlt: string;
};

// Button labels name what you get, then the price is appended (" — $49.99").
const getBothBooks: HeroAction = {
  label: "Christmas + Easter Set", // CONFIRM price (§5, item 1) and set naming
  add: HANDLES.completeSet,
  priceOf: HANDLES.completeSet,
};

const getEasterJourney: HeroAction = {
  label: "Easter Journey",
  add: HANDLES.easterJourney,
  priceOf: HANDLES.easterJourney,
};

const NC_FRONT_ALT = "Nephite Christmas and Easter Journey hardcovers, with Nephite Christmas in front";
const EJ_FRONT_ALT = "Easter Journey and Nephite Christmas hardcovers, with Easter Journey in front";

const getInstantPdf: HeroAction = { label: "Instant PDF", add: HANDLES.ncPdf, priceOf: HANDLES.ncPdf };

/**
 * Hero copy per season (deck §2.1 and §2.15, condensed after the 2026-09-25
 * buyer-panel review). Cold ad traffic already knows what the book is from the
 * ad, so the hero says it once and spends its words on the choice.
 *
 * Budget, so the hero keeps fitting one phone screen: about 40 words including
 * button labels; an eyebrow only when it carries a date; H1 3 lines or fewer
 * at 390px (about 20 characters a line); the lede, rating and set line one
 * line each. No subhead and no checkmarks: the trust band sits right below.
 */
export const heroCopy: Record<SeasonMode, HeroCopy> = {
  christmas: {
    // The book's own first line, which is also how the ad's voice-over opens.
    // The ad caption stays word for word on /lp/christmas-tradition.
    // Non-breaking spaces keep the break at "’Twas the night / before Christmas… / in the Book of Mormon."
    title: "’Twas the night before Christmas… in the Book of Mormon.",
    lede: `Hardcover · Ages 3–10 · ${doveCopy.short}`, // CONFIRM ages (§5, item 22)
    // The ads sell Nephite Christmas, so it leads; the set is the second option, with its
    // reason under it. A direct add (opens the drawer and its set upgrade), not a link.
    primary: {
      label: "Get Nephite Christmas", // CONFIRM price (§5, item 1)
      add: HANDLES.nephiteChristmas,
      priceOf: HANDLES.nephiteChristmas,
    },
    secondary: getBothBooks,
    imageAlt: NC_FRONT_ALT,
  },
  "christmas-last-minute": {
    // The pinned announcement says hardcovers may not arrive by Christmas.
    title: "Read Nephite Christmas this Christmas Eve.",
    lede: "No shipping. It’s in your inbox in minutes.",
    primary: getInstantPdf,
    secondary: {
      label: "Order the Hardcover",
      href: productPath(HANDLES.nephiteChristmas),
      priceOf: HANDLES.nephiteChristmas,
    },
    imageAlt: NC_FRONT_ALT,
  },
  "after-christmas": {
    eyebrow: "Next up: Easter, {easterDate}",
    title: keepHyphens("An 8-day Easter advent, Palm Sunday to Easter morning."),
    lede: "Hardcover · Ages 8–80 · Questions for each day", // Tiffany, Oct 2026
    primary: getEasterJourney,
    secondary: getBothBooks,
    imageAlt: EJ_FRONT_ALT,
  },
  easter: {
    eyebrow: "Holy Week · {holyWeek}",
    title: "Walk through Holy Week with the people who knew Jesus.",
    lede: keepHyphens("Hardcover · A built-in 8-day Holy Week advent"),
    primary: getEasterJourney,
    // Deck: "Look Inside", not the set, so the Easter page works for Christians of every denomination.
    secondary: { label: "Look Inside", href: "#peek-inside" },
    imageAlt: EJ_FRONT_ALT,
  },
  "off-season": {
    title: "His birth and His Resurrection, in two picture books.",
    lede: "Nephite Christmas + Easter Journey, in hardcover",
    primary: getBothBooks,
    secondary: { label: "Shop the Books", href: "/shop" },
    // The H1 already gives the why.
    setLine: ["shipsFree", "savings"],
    imageAlt: NC_FRONT_ALT,
  },
};

/**
 * Dec 16–17 (only when Priority shipping is really offered, CLAIMS.priorityShipping):
 * the standard cutoff has passed, but hardcovers can still make it.
 */
export const heroPriorityCopy: HeroCopy = {
  title: "Still time for Christmas with Priority shipping.",
  lede: "Choose it at checkout by {priorityBy}.", // CONFIRM Priority (§5, item 7)
  primary: getBothBooks,
  secondary: { ...getInstantPdf, label: "Nephite Christmas PDF" },
  // No "Ships free": Priority costs extra.
  setLine: ["why"],
  imageAlt: NC_FRONT_ALT,
};

/**
 * The line under the Complete Set button: "One for His birth, one for His
 * Resurrection · Ships free". It sells the second book at the moment of choice.
 * "Ships free" only shows when CLAIMS.freeShipping is on and the set clears the
 * threshold; "Save {savings}" only while the set costs less than its parts.
 */
export const heroSetLine: Record<HeroSetLinePart, string> = {
  why: "One for His birth, one for His Resurrection",
  shipsFree: "Ships free", // CONFIRM threshold (§5, item 2)
  savings: "Save {savings}", // CONFIRM price (§5, item 1)
};

/**
 * Rating line above the H1: "★★★★★ 17 Nephite Christmas reviews". The count
 * comes from the Nephite Christmas catalog rating (never hardcoded), and the
 * title is named because the stars sit beside a two-book offer. It is only
 * shown when Nephite Christmas leads: Easter Journey has no reviews yet, so the
 * Easter heroes show no stars rather than borrow them. The deck's Amazon half
 * is left out on purpose: it sends price-sensitive visitors to a cheaper listing.
 */
export const heroRating = {
  /** {count} and {title} ("Nephite Christmas"). */
  named: "{count} {title} reviews",
  reviewsHref: "#reviews",
};

// ── Trust strip (§1.4, §3.0a) ────────────────────────────────────────────────

export type TrustItemId =
  | "shipping"
  | "ships-from"
  | "reviews"
  | "signed"
  | "guarantee"
  | "gift-note"
  | "instant"
  | "print"
  | "email"
  | "help";

export type TrustItem = { id: TrustItemId; text: string; sub?: string; href?: string };

/**
 * §1.4 in order, keeping only the claims that are switched on in CLAIMS
 * (store-config). The reviews item gets its count at render time ({count}).
 * No Amazon subline: it sends price-sensitive visitors to a cheaper listing.
 */
export const trustItems: TrustItem[] = [
  CLAIMS.freeShipping
    ? {
        id: "shipping",
        text: `Free US shipping ${freeShippingFrom}+`, // CONFIRM threshold (§5, item 2)
        sub: `Under ${freeShippingFrom}, a flat ${formatMoney(FLAT_RATE_SHIPPING)}`, // CONFIRM flat rate (§5, item 3)
      }
    : null,
  {
    id: "ships-from",
    text: `Ships from ${SHIPS_FROM} in ${HANDLING_TIME}`, // CONFIRM handling time (§5, item 6)
    sub: "Packed by hand", // CONFIRM (§5, item 6)
  },
  {
    id: "reviews",
    text: "{count} five-star reviews", // CONFIRM count (§5, item 12)
  },
  CLAIMS.signedCopies
    ? {
        id: "signed",
        text: "Signed copies available", // CONFIRM (§5, item 10)
        sub: "Free. Just check the box in your cart.", // CONFIRM (§5, item 10)
      }
    : null,
  CLAIMS.moneyBackGuarantee
    ? {
        id: "guarantee",
        text: "Love it or your money back", // CONFIRM (§5, item 5)
        sub: "30 days, no hassle", // CONFIRM (§5, item 5)
      }
    : null,
].filter((item): item is TrustItem => item !== null);

/** §1.4 gift item: the homepage trust band and the physical buy-box rows (BUY_BOX_TRUST in pdp.ts). */
export const trustGiftNote: TrustItem = {
  id: "gift-note",
  text: "Free gift note",
  sub: "We’ll tuck your message in the box",
};

/** §3.0a buy-box trust row for digital products. */
export const trustItemsDigital: TrustItem[] = [
  { id: "instant", text: "Instant download" },
  { id: "print", text: "Print as many times as you need" },
  { id: "email", text: "Delivered by email" },
  { id: "help", text: "Questions? We’ll help", href: "/contact" },
];

/** Accessible name for the homepage trust band (not visible copy). */
export const trustBandLabel = "Shopping with Tiffany Wheeler";

// ── Product cards (§2.3) ─────────────────────────────────────────────────────

/** Extra lines the 'featured' card shows for the two books. */
export const productCardDetails: Record<string, { ageLine?: string; bullets?: string[] }> = {
  [HANDLES.nephiteChristmas]: {
    // CONFIRM ages (§5, item 22). Deck: "Ages 3–10 · Hardcover · [CONFIRM] pages";
    // the page count is left out until it's known (§5, item 19).
    ageLine: "Ages 3–10 · Hardcover",
    bullets: [
      "In the rhythm of ’Twas the Night Before Christmas",
      doveCopy.bullet, // CONFIRM dove claim (§5, item 23)
      "Reads aloud in under 5 minutes",
    ],
  },
  [HANDLES.easterJourney]: {
    ageLine: "Ages 8–80 · great for the whole family · Hardcover · 9″ × 11″ · 46 pages", // ages: Tiffany, Oct 2026; CONFIRM pages (§5, item 21)
    bullets: [
      keepHyphens("Built-in 8-day advent with questions for each day"),
      "Kids join in: “We seek Jesus of Nazareth.”",
      "Seek-and-find 8 symbols of Christ",
    ],
  },
};

export const productCardCopy = {
  addToCart: "Add to Cart",
  addCompact: "Add",
  lookInside: "Look inside",
};

export const featuredBooksCopy = {
  /** Visually hidden section heading (the deck has none; keeps the outline h1 → h2 → h3). */
  heading: "The books",
  /** §2.3 card subtitle for Nephite Christmas (the catalog subtitle is the longer PDP one). */
  ncSubtitle: "The Book of Mormon Christmas story, in rhyme",
  /** §2.3 Easter Journey badge while Christmas leads. {date} = "March 28, 2027". */
  ejBadge: "For Easter · {date}",
  /** §2.3 note under the Easter Journey button in the Christmas modes. */
  ejChristmasNote: "Ships now. Tuck it away for Holy Week.",
  /** Phones, Christmas modes: the compact Easter Journey card's link to its page. */
  ejDetailsLink: "See inside Easter Journey",
};

// ── Shop row (under the trust band) ─────────────────────────────────────────

export const shopRowCopy = {
  heading: "Shop the collection",
  shopAll: "Shop All",
  add: "Add to Cart",
  previous: "Previous products",
  next: "More products",
};

// ── Complete Set bar (§2.4) ──────────────────────────────────────────────────

export const completeSetBarCopy = {
  badge: "Best value",
  headline: "His birth and His Resurrection, in one set.",
  sub: "Read Nephite Christmas on Christmas Eve, then walk through Holy Week with Easter Journey. Two illustrated hardcovers that come back out every year.",
  includes: "Includes: Nephite Christmas (hardcover) + Easter Journey (hardcover)",
  /** Joined with " · ". The free-shipping part only shows when the set price clears the threshold. */
  priceLabel: {
    separately: "{compareAt} if bought separately", // CONFIRM price (§5, item 1)
    /** Not rendered in the bar: the "Save $X" pill next to the price already says it. */
    savings: "You save {savings}",
    /** Only when CLAIMS.freeShipping and the set price clears the threshold. */
    freeShipping: "Free US shipping", // CONFIRM threshold (§5, item 2)
  },
  cta: "Get Both Books", // " — {price}" is appended from the catalog
  microline: `Both books ship together from ${SHIPS_FROM} in ${HANDLING_TIME}.`, // CONFIRM handling time (§5, item 6)
};

// ── Sticky mobile bar (§4.3) ────────────────────────────────────────────────

export const homeStickyBarCopy = {
  /** Accessible name of the bar. */
  label: "Quick add",
  /** Left side for the set: "Both books · $49.99 · Ships free". */
  setName: "Both books",
  /** Only when CLAIMS.freeShipping and the set price clears the threshold. */
  shipsFree: "Ships free", // CONFIRM threshold (§5, item 2)
  /** The bar's button. The left side already names the product, so the button doesn't repeat it. */
  cta: "Add to Cart",
};

// ── Closing buy band (end of the homepage) ──────────────────────────────────

export const closingCtaCopy = {
  eyebrow: "Start the tradition",
  /** §2.4 headline alternate A. */
  headline: "One set. Two holidays. A year of Christ-centered traditions.",
  includes: "Nephite Christmas + Easter Journey, both illustrated hardcovers",
  /** Real order-by date from the season (only before the cutoff). */
  orderBy: "Order by {date} for Christmas delivery.", // CONFIRM cutoff (§5, item 7)
  primary: "Get Both Books", // " — {price}" is appended from the catalog
  secondary: "Just Nephite Christmas", // " — {price}" is appended from the catalog
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Replaces `{token}`s in a copy string. */
export function fill(template: string, tokens: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in tokens ? String(tokens[key]) : match,
  );
}
