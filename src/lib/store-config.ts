// Commercial settings in one place. Values marked CONFIRM are working
// assumptions until Tiffany signs off (see docs/PLAN.md, "Open questions").

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tiffany-wheeler.com";

/**
 * Claims that need Tiffany's written confirmation before they can be shown
 * (copy deck §5). Every component that renders one of these checks its flag,
 * so flipping a flag here is the only change needed. `false` = the site uses
 * neutral fallback copy and hides the related UI.
 */
export const CLAIMS = {
  /** 30-day "love it or your money back" guarantee (§5 item 3). CONFIRM before launch. */
  moneyBackGuarantee: true,
  /** Free US shipping at FREE_SHIPPING_THRESHOLD and the flat rate below (§5 item 2). CONFIRM before launch. */
  freeShipping: true,
  /** Free signed copies via a cart checkbox (§5 item 10). */
  signedCopies: false,
  /** Boise local pickup at checkout (§5 item 9). */
  localPickup: false,
  /** Priority shipping offered at checkout for late Christmas orders (§5 item 7). */
  priorityShipping: false,
  /** Gift orders ship with no prices on the packing slip (§3.3). */
  giftSlipsHidePrices: false,
  /** A dove is hidden on *every* page of Nephite Christmas (§5 item 23). False = "throughout the book". */
  doveOnEveryPage: false,
  /** Written permission to feature Kim & John Bytheway's testimonial (§5 item 14). */
  bythewayTestimonial: false,
  /** They received a complimentary copy (FTC endorsement disclosure). null = unknown. */
  bythewayComplimentaryCopy: null as boolean | null,
  /** "Bestseller" badge on Nephite Christmas (§5 item 18). False = "Family favorite". */
  bestsellerBadge: false,
} as const;

/** Free US shipping at or above this subtotal. One book misses it; the set clears it. CONFIRM */
export const FREE_SHIPPING_THRESHOLD = 45;

/** Flat shipping rate below the free-shipping threshold. CONFIRM (§5 item 2) */
export const FLAT_RATE_SHIPPING = 5.99;

/** Ships from Tiffany in Idaho. */
export const SHIPS_FROM = "Idaho";

/** Business days from order to hand-off to USPS. CONFIRM (§5 item 6) */
export const HANDLING_BUSINESS_DAYS = { min: 1, max: 2 } as const;
/** USPS Ground Advantage transit, business days. CONFIRM (§5 item 6) */
export const TRANSIT_BUSINESS_DAYS = { min: 2, max: 5 } as const;
/** USPS Priority transit, business days (only used when CLAIMS.priorityShipping). */
export const PRIORITY_TRANSIT_BUSINESS_DAYS = 2;
/** Extra business days Tiffany needs to sign and pack signed copies. CONFIRM */
export const SIGNED_EXTRA_BUSINESS_DAYS = 2;
/** Boise pickup runs through this month-day (only used when CLAIMS.localPickup). */
export const LOCAL_PICKUP_THROUGH = "12-23";

export const HANDLING_TIME = `${HANDLING_BUSINESS_DAYS.min}–${HANDLING_BUSINESS_DAYS.max} business days`;
export const TRANSIT_TIME = `${TRANSIT_BUSINESS_DAYS.min}–${TRANSIT_BUSINESS_DAYS.max} business days`;

/** "Bulk purchases of 5 or more get an automatic 10% off each book" (live site). Counts hardcovers; the set counts as 2. */
export const BULK_DISCOUNT = { minBooks: 5, percent: 10 } as const;

/** Max quantity per cart line, and max gift-note length. */
export const CART_MAX_QUANTITY = 10;
export const GIFT_NOTE_MAX = 250;

export const CONTACT_EMAIL = "tiffany@tiffany-wheeler.com";

/**
 * Product handles (URL: /products/{handle}). Legacy WooCommerce slugs that
 * changed are 301-redirected in next.config.ts.
 */
export const HANDLES = {
  nephiteChristmas: "nephite-christmas",
  easterJourney: "easter-journey",
  completeSet: "complete-set",
  ncBundle: "nephite-christmas-bundle",
  ncBundleOrnament: "nephite-christmas-bundle-with-ornament",
  /** Printed + PDF variants. */
  coloringBook: "nephite-christmas-coloring-activity-book",
  starOrnament: "nephite-christmas-ornament",
  doveOrnament: "nephite-christmas-peace-dove-ornament",
  nativityCraft: "nephite-christmas-nativity-craft",
  ncPdf: "nephite-christmas-pdf",
  ejPdf: "easter-journey-pdf",
  ncDigitalBundle: "nephite-christmas-digital-bundle",
  puzzle: "easter-journey-puzzle",
  canvas: "he-spoke-my-name-canvas",
} as const;

export const productPath = (handle: string) => `/products/${handle}`;

export const SOCIAL = {
  instagram: "https://www.instagram.com/tiffanywheelerbooks/",
  facebook: "https://www.facebook.com/profile.php?id=61567716267980",
} as const;
