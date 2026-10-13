// Product detail page copy that isn't product data (copy deck §3.0a, §3.x, §2.8,
// §4.3, §4.4, §4.7). Product copy itself (titles, descriptions, highlights, specs,
// FAQs) lives in the catalog. "[CONFIRM]" tags are stripped from the strings and
// tracked with a `// CONFIRM` comment (copy deck §5). Claims that need Tiffany's
// sign-off are gated on CLAIMS in store-config.
//
// Client islands (buy box, sticky bar, gallery) import this module, so keep it
// free of server-only imports.

import type { ProductKind } from "@/lib/commerce/types";
import { CART_MAX_QUANTITY, HANDLES } from "@/lib/store-config";

/** §3.0a shared PDP microcopy. */
export const PDP_COPY = {
  quantityLabel: "Quantity",
  /** Rating link text next to the stars: "5.0 · 17 reviews". */
  ratingLink: (value: string, count: number) => `${value} · ${count} reviews`,
  /** §3.3–3.5 rating line for bundles: "5.0 · 17 reviews of Nephite Christmas". */
  ratingLinkOf: (value: string, count: number, of: string) => `${value} · ${count} reviews of ${of}`,
  /** The count part of it, for cards: "17 reviews of Nephite Christmas". */
  countOf: (count: number, of: string) => `${count} reviews of ${of}`,
  /** §4.7 review count aria. */
  ratingAria: (value: string, count: number) => `Rated ${value} out of 5 from ${count} reviews`,
  /** Screen-reader version of a borrowed (bundle) rating. */
  ratingAriaOf: (value: string, count: number, of: string) =>
    `${of} is rated ${value} out of 5 from ${count} reviews`,
  /** §4.7 max quantity. */
  maxQuantity: CART_MAX_QUANTITY,
  maxQuantityNote: `Need more than ${CART_MAX_QUANTITY}?`,
  maxQuantityLink: "Email us.",
  addToCart: "Add to Cart",
  buyNow: "Buy Now",
  soldOut: "Sold out",
  /** Quick facts merged into the rating row (values come from the catalog). */
  facts: {
    ages: (range: string) => `Ages ${range}`, // CONFIRM ages (§5, item 22)
    hardcover: "Hardcover",
  },
  sections: {
    whatsInside: "What’s Inside",
    details: "Details",
    aboutStory: "About the Story",
    howItBegan: "How it began",
    perfectFor: "Perfect for",
    reviews: "Reviews",
    faqEyebrow: "FAQ",
    faq: "Questions? We’re here to help.",
    peekInside: "Take a peek inside",
    pairsWith: "Pairs well with",
    alsoBy: "Also by Tiffany",
  },
  /** §3.0a reviews label for bundles that contain Nephite Christmas. */
  bundleReviews: "Reviews of Nephite Christmas (included in this set)",
  /** §2.8 labels reused on the product page. */
  reviews: {
    readAll: (count: number) => `Read All ${count} Reviews`,
    showFewer: "Show fewer reviews",
    write: "Write a Review",
    /** FTC disclosure under an endorsement from someone who got the book free. */
    complimentary: "Received a complimentary copy.",
  },
  /** §2.6 intro under “Take a peek inside”. */
  peekIntro: "Every spread is painted by Idaho illustrator Kelley Hicken. Here are a few favorite pages.",
  /** Accessible name of the peek-inside carousel. */
  peekLabel: (title: string) => `Inside ${title}`,
  /** Heading on the §3.0a digital usage terms box. */
  usageHeading: (alsoShips: boolean) => (alsoShips ? "Printable PDF" : "Digital download"),
  gallery: {
    label: (title: string) => `${title} photos`,
    previous: "Previous photo",
    next: "Next photo",
    position: (n: number, total: number) => `Photo ${n} of ${total}`,
    thumb: (n: number) => `Show photo ${n}`,
  },
  /** The repeat buy row after the reviews (long pages only). */
  buyAgain: {
    heading: "Ready to read it together?",
  },
} as const;

/** §4.3 sticky add-to-cart bar. */
export const STICKY_BAR_COPY = {
  added: "Added to your cart",
  viewCart: "View Cart",
  addToCart: "Add to Cart",
  soldOut: (title: string) => `${title} · Sold out`,
  shipsFree: "Ships free", // CONFIRM free-shipping threshold (§5, item 2)
  /** Region name: "Quick add: Nephite Christmas · $24.99". */
  region: (label: string) => `Quick add: ${label}`,
} as const;

/** Shipping notes on the gift-picker tiles. Only rendered while CLAIMS.freeShipping is on. */
export const SHIPPING_NOTES = {
  shipsFree: "Ships free", // CONFIRM free-shipping threshold (§5, item 2)
  flatRate: (rate: string) => `+ ${rate} shipping`, // CONFIRM flat rate (§5, item 3)
} as const;

/**
 * §3.1 “Choose your gift” on Nephite Christmas: two side-by-side tiles, the book
 * on its own or both books. Prices, shipping notes and the compare-at come from
 * the catalog and store-config, never from here. (The Christmas Bundle stays a
 * product in /shop; it cost exactly its parts and missed free shipping, so it
 * only added a choice.)
 */
export const NC_GIFT_PICKER = {
  legend: "Choose your gift",
  options: [
    { handle: HANDLES.nephiteChristmas, label: "Just the book" },
    { handle: HANDLES.completeSet, label: "Both books", tag: "Best value" },
  ],
  /** Helper under the tiles: what "Both books" adds, and for how much. */
  helper: (extra: string) => `Both books adds Easter Journey for ${extra} more.`,
} as const;

/** Variant (format) pickers: option value → label, and helper text (§3.6). Keyed by handle. */
export const FORMAT_PICKERS: Record<string, { labels: Record<string, string>; helper?: string }> = {
  [HANDLES.coloringBook]: {
    labels: { Printed: "Printed Book", "PDF Download": "Printable PDF" },
    helper: "Printed Book ships from Idaho. Printable PDF arrives by email; print as many copies as you need.",
  },
};

/** Query param that preselects a format (legacy PDF URL → ?format=pdf, copy deck §3.0). */
export const FORMAT_PARAM = "format";

/** §3.2: other books by Tiffany, shown once below the fold (never above it on Easter Journey). */
export const ALSO_BY: Record<string, string[]> = {
  [HANDLES.easterJourney]: [HANDLES.nephiteChristmas],
};

/**
 * Gallery image to show when a variant is selected (Shopify variants carry an
 * image; the mock Variant type doesn't). Keyed by handle, then option value.
 */
export const VARIANT_IMAGE_INDEX: Record<string, Record<string, number>> = {
  // Catalog: images[1] is the PDF cover.
  [HANDLES.coloringBook]: { "PDF Download": 1 },
};

/**
 * §3.1/§3.2 buy-box facts merged into the rating row ("Ages 3–10 · Hardcover").
 * Which facts to show per product; the values come from the catalog (ageRange,
 * the "Pages" spec), so a page count is never typed twice.
 */
export const BUY_BOX_FACTS: Record<string, readonly ("ages" | "hardcover" | "pages")[]> = {
  [HANDLES.nephiteChristmas]: ["ages", "hardcover"], // CONFIRM: page count omitted until known (§5, item 19)
  [HANDLES.easterJourney]: ["ages", "hardcover", "pages"], // CONFIRM page count (§5, item 21)
};

/**
 * Buy-box trust row (§1.4 items by id). Items whose claim isn't confirmed
 * (CLAIMS in store-config) are dropped by TrustStrip. No reviews item: the
 * stars already sit under the title.
 */
export const BUY_BOX_TRUST = {
  physical: ["shipping", "guarantee", "ships-from", "gift-note"],
  /** Print-on-demand items don't ship from Idaho and are final sale. */
  madeToOrder: ["shipping", "gift-note"],
} as const;

/**
 * Product kinds /returns accepts back within the return window (books, bundles,
 * activity books, ornaments). Digital and made-to-order items are final sale.
 */
export const GUARANTEE_KINDS: readonly ProductKind[] = ["book", "bundle", "activity", "ornament"];

/**
 * Site FAQs the product page borrows from src/content/faq.ts, matched by id
 * (or, failing that, by the question text so a renamed id doesn't drop them).
 */
export const PDP_SITE_FAQS = {
  christmasOrderBy: {
    ids: ["christmas-deadline", "christmas-order-by", "order-by", "christmas", "order-for-christmas"],
    question: /order for christmas/i,
  },
  guarantee: {
    ids: ["guarantee", "returns", "money-back", "love-it"],
    question: /don.t love it/i,
  },
  church: {
    ids: ["church", "affiliation", "published-by-church", "publisher"],
    question: /published by the church/i,
  },
} as const;

/** §3.1 pull quote near the buy box (verbatim review by Noel). */
export const PULL_QUOTES: Record<string, { quote: string; author: string }> = {
  [HANDLES.nephiteChristmas]: {
    quote: "“We love this book! It is sweet and the kids love finding the dove.”",
    author: "Noel",
  },
};

/**
 * §3.2: the "How it began" block is the story paragraphs from this index on.
 * The catalog keeps it in `story` so the Shopify metafield stays one field.
 */
export const HOW_IT_BEGAN_FROM: Record<string, number> = {
  [HANDLES.easterJourney]: 2,
};

/** Extra per-product lists from §3.x that the catalog doesn't carry. */
export const EXTRA_LISTS: Record<string, { heading: string; items: string[] }> = {
  // §3.9 Ideas
  [HANDLES.nativityCraft]: {
    heading: "Ideas",
    items: [
      "Laminate it for a lasting decoration",
      "Glue figures to craft sticks for a puppet show",
      "Build a shoebox stable",
      "Turn the figures into tree ornaments",
    ],
  },
};

/** §3.10 last-minute mode headline (after the last shipping cutoff), shown above the title. */
export const LAST_MINUTE_HEADLINES: Record<string, string> = {
  [HANDLES.ncPdf]: "Read it tonight. No shipping, no waiting.",
};

/** §3.3 value stack for bundles with a real compare-at (the Complete Set). */
export const VALUE_STACK = {
  /** Table caption (screen readers). */
  caption: "Price breakdown",
  line: (title: string, variantTitle: string) => `${title}, ${variantTitle.toLowerCase()}`,
  separately: "If bought separately",
  youSave: (amount: string) => `you save ${amount}`,
  shipping: "Shipping",
  shippingFree: (threshold: number) => `Free (orders $${threshold}+)`, // CONFIRM threshold (§5, item 2)
} as const;

/** §3.2 Christmas-mode line under the Easter Journey CTA. Dates come from the season. */
export const EJ_CHRISTMAS_LINE = (easter: string, year: number, palmSunday: string) =>
  `Ships now. Easter is ${easter}, ${year}; Holy Week starts Palm Sunday, ${palmSunday}.`;

/**
 * §4.4 delivery line under Add to Cart. Every date is computed in
 * src/lib/delivery.ts from the business-day calendar and store-config times.
 */
export const DELIVERY_COPY = {
  digital: "Instant download: in your inbox in minutes",
  madeToOrder: "Made to order · ships separately", // CONFIRM production time (§5, item 29)
  /** "Arrives Sep 25–Oct 1" */
  arrives: (range: string) => `Arrives ${range}`,
  shipsFrom: (place: string) => `Ships from ${place}`,
  inTimeForChristmas: "in time for Christmas",
  beforePalmSunday: "before Palm Sunday", // CONFIRM Easter cutoff (§5, item 8)
  /** Second line for Christmas items in christmas mode. */
  christmasOrderBy: (date: string) => `Order by ${date} for Christmas delivery`, // CONFIRM (§5, item 7)
  /** Last-minute mode with Priority offered at checkout (CLAIMS.priorityShipping). */
  priority: "Standard shipping won’t arrive by Christmas. Choose Priority at checkout", // CONFIRM (§5, item 7)
  /** Follows `priority` for items that include the book: ", or get the instant PDF." */
  priorityPdf: "get the instant PDF",
  /**
   * Last-minute mode otherwise. Tiffany keeps shipping at the normal handling
   * time, so the honest line is the real window, flagged as possibly after
   * Christmas (under-promise). CONFIRM whether she pauses shipping (§5, item 7).
   */
  afterCutoff: (range: string) => `May not arrive by Christmas · Arrives ${range}.`,
  needItSooner: "Need it for Christmas Eve?",
  pdfLink: "Get the instant PDF.",
} as const;

/**
 * Review display order: the deck's featured reviews first (§2.8), then its
 * alternates, then the rest by date. Keyed by the reviewer's original name.
 */
export const FEATURED_REVIEW_ORDER = [
  "Karen H Bartlett",
  "Noel",
  "LeeAnn Jett",
  "Kathy Horning",
  "Austin Vach",
  "Merrilee Boyack",
  "Kate Asbury",
  "Nate",
  "Candice andrus",
  "Kendra Santa Cruz",
  "Tim",
  "D Fuller",
  "Jeanne",
];

/** How many review cards show before "Read All {count} Reviews": phones, then larger screens. */
export const REVIEWS_VISIBLE = { phone: 3, wide: 6 } as const;

/**
 * Where "Write a Review" goes until a review app is installed. The PDP's own
 * link carries id="write-review", so older `#write-review` links land on it.
 */
export const WRITE_REVIEW_HREF = "/contact?topic=review"; // TODO: review app (Judge.me / Shopify Product Reviews)
export const WRITE_REVIEW_ID = "write-review";
