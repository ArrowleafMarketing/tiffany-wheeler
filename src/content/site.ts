// Global site copy (docs/copy-deck.md §1.1–§1.6). Owned by the shell.
// Claims tagged [CONFIRM] in the deck render without the tag and carry a
// `// CONFIRM` comment here until Tiffany signs off (copy deck §5).

import type { Holiday } from "@/lib/commerce/types";
import { formatMonthDay } from "@/lib/delivery";
import { formatMoney } from "@/lib/money";
import type { Season, SeasonMode } from "@/lib/season";
import {
  BULK_DISCOUNT,
  CLAIMS,
  FREE_SHIPPING_THRESHOLD,
  HANDLES,
  HANDLING_TIME,
  RETURN_WINDOW_DAYS,
  SHIPS_FROM,
  productPath,
} from "@/lib/store-config";

export type NavLink = { label: string; href: string };
export type AnnouncementMessage = {
  text: string;
  href: string;
  /** The season's real deadline (or its last-minute caveat). Keep it first: it's the static fallback. */
  deadline?: boolean;
};

const freeShip = formatMoney(FREE_SHIPPING_THRESHOLD, { trim: true }); // "$45"

// ---------------------------------------------------------------------------
// §1.1 Site identity
// ---------------------------------------------------------------------------

export const SITE = {
  name: "Tiffany Wheeler",
  tagline: "Christ-centered picture books for Christmas and Easter",
  taglineAlt: "Creating traditions that help connect families",
} as const;

// ---------------------------------------------------------------------------
// §1.3 Header and navigation
// ---------------------------------------------------------------------------

export const HEADER = {
  skipLink: "Skip to main content",
  logoAlt: "Tiffany Wheeler, home",
  /** Landing pages: the logo is not a link. */
  logoAltPlain: "Tiffany Wheeler",
  mainNavLabel: "Main",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menuLabel: "Menu",
  mobileExtraLabel: "Help",
  mobileFooterLine: CLAIMS.freeShipping
    ? `Free US shipping on orders ${freeShip}+` // CONFIRM threshold (§5, item 2)
    : `Ships from ${SHIPS_FROM} in ${HANDLING_TIME}`, // CONFIRM (§5, item 6)
} as const;

const NAV_NC: NavLink = { label: "Nephite Christmas", href: productPath(HANDLES.nephiteChristmas) };
const NAV_EJ: NavLink = { label: "Easter Journey", href: productPath(HANDLES.easterJourney) };
const NAV_REST: NavLink[] = [
  { label: "Complete Set", href: productPath(HANDLES.completeSet) },
  { label: "Shop All", href: "/shop" },
  { label: "Free Printables", href: "/freebies" },
  { label: "About", href: "/about" },
];

/** Book that leads the nav: Easter Journey only in easter mode (§1.3). */
export function navLeadBook(mode: SeasonMode): Holiday {
  return mode === "easter" ? "easter" : "christmas";
}

/** Main nav in season order (§1.3). */
export function mainNav(mode: SeasonMode): NavLink[] {
  const books = navLeadBook(mode) === "easter" ? [NAV_EJ, NAV_NC] : [NAV_NC, NAV_EJ];
  return [...books, ...NAV_REST];
}

/** Extra links in the mobile drawer (§1.3). */
export const MOBILE_EXTRA_LINKS: NavLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Christmas Delivery", href: "/shipping#christmas-delivery" },
  { label: "Contact Tiffany", href: "/contact" },
];

// ---------------------------------------------------------------------------
// §1.2 Announcement bar
// ---------------------------------------------------------------------------

const PDF_NC = productPath(HANDLES.ncPdf);

/** "Ships from Idaho in 1–2 business days". CONFIRM (§5, item 6) */
const shipsFromMessage: AnnouncementMessage = { text: `Ships from ${SHIPS_FROM} in ${HANDLING_TIME}`, href: "/shipping" };

/** Free-shipping line, or the handling time when free shipping isn't confirmed. CONFIRM (§5, item 2) */
const freeShippingMessage: AnnouncementMessage = CLAIMS.freeShipping
  ? { text: `Free US shipping on orders ${freeShip}+`, href: "/shipping" }
  : shipsFromMessage;

/**
 * The season's rotating messages, in order (§1.2, shortened). Every date comes
 * from season.christmas / season.easter (src/lib/delivery.ts): real cutoffs
 * only, nothing invented. Claims are gated on CLAIMS in store-config.
 *
 * The messages scroll past as a ticker. Every line has to earn its place by
 * answering a buying question: will it arrive in time, what does shipping
 * cost, is it any good, what if we don't love it, can I send it as a gift.
 * The deadline stays first (it's the static fallback under reduced motion),
 * the proof second, then the season's own lines, then the store promises.
 */
export function announcementMessages(
  season: Season,
  { ncReviewCount = 0, ncPercentOff = 0 }: { ncReviewCount?: number; ncPercentOff?: number } = {},
): AnnouncementMessage[] {
  const [first, ...rest] = seasonMessages(season);
  // Named for its book, so it never reads as Easter Journey's; only while Nephite Christmas leads.
  const proof: AnnouncementMessage | null =
    ncReviewCount > 0 && season.featured !== "easter"
      ? { text: `★★★★★ ${ncReviewCount} five-star reviews of Nephite Christmas`, href: `${productPath(HANDLES.nephiteChristmas)}#reviews` } // CONFIRM count (§5, item 12)
      : null;
  // A Nephite Christmas sale (its compare-at price in Shopify), right after the deadline,
  // while Nephite Christmas leads. It appears and disappears with the sale itself.
  const promo: AnnouncementMessage | null =
    ncPercentOff > 0 && season.featured !== "easter"
      ? { text: `${ncPercentOff}% off Nephite Christmas`, href: productPath(HANDLES.nephiteChristmas) }
      : null;
  const ordered = [first, promo, proof, ...rest, ...tickerPromises()].filter((m): m is AnnouncementMessage => Boolean(m));
  const seen = new Set<string>();
  return ordered.filter((m) => !seen.has(m.text) && Boolean(seen.add(m.text)));
}

/** Store-wide promises that remove a reason to wait, each gated on its claim. */
function tickerPromises(): AnnouncementMessage[] {
  return [
    CLAIMS.moneyBackGuarantee ? { text: `Love it or return it · ${RETURN_WINDOW_DAYS} days`, href: "/returns" } : null,
    { text: "Sending it as a gift? Add a free gift note", href: "/faq" },
  ].filter((m): m is AnnouncementMessage => m !== null);
}

function seasonMessages(season: Season): AnnouncementMessage[] {
  const { today } = season;
  switch (season.mode) {
    case "christmas": {
      const { signedOrderBy } = season.christmas;
      const messages: AnnouncementMessage[] = [];
      if (season.orderBy) {
        messages.push({
          text: `Order by ${formatMonthDay(season.orderBy)} for Christmas delivery`, // CONFIRM (§5, item 7)
          href: "/shipping#christmas-delivery",
          deadline: true,
        });
      }
      if (CLAIMS.freeShipping) {
        messages.push({
          text: `Free US shipping ${freeShip}+ · The set ships free`, // CONFIRM (§5, item 2)
          href: productPath(HANDLES.completeSet),
        });
      }
      // §1.2 alternate for message 3, only while signed copies are offered.
      if (CLAIMS.signedCopies && signedOrderBy && today <= signedOrderBy) {
        messages.push({
          text: `Signed copies available through ${formatMonthDay(signedOrderBy)}`, // CONFIRM (§5, item 10)
          href: "/faq#faq-signed",
        });
      } else {
        messages.push(shipsFromMessage);
      }
      return messages;
    }

    case "christmas-last-minute": {
      const { priorityOrderBy, pickupThrough } = season.christmas;
      if (CLAIMS.priorityShipping && priorityOrderBy && today <= priorityOrderBy) {
        // After the standard cutoff, Priority still makes it.
        return [
          {
            text: `Priority shipping by ${formatMonthDay(priorityOrderBy)} for Christmas`, // CONFIRM (§5, item 7)
            href: "/shipping#christmas-delivery",
            deadline: true,
          },
          { text: "Or skip shipping: PDFs download instantly", href: PDF_NC },
        ];
      }
      const messages: AnnouncementMessage[] = [
        {
          // Pinned: the homepage hero sells the PDF and offers the hardcover, and this is
          // the hardcover's caveat. Honest under the normal handling time; CONFIRM whether
          // Tiffany pauses shipping (§5, item 7).
          text: "Hardcovers may not arrive by Christmas",
          href: "/shipping#christmas-delivery",
          deadline: true,
        },
        { text: "Too late to ship? Get the instant PDF", href: PDF_NC },
      ];
      if (CLAIMS.localPickup && pickupThrough && today <= pickupThrough) {
        messages.push({
          text: `Boise pickup is free through ${formatMonthDay(pickupThrough)}`, // CONFIRM (§5, item 9)
          href: "/shipping#pickup",
        });
      }
      return messages;
    }

    case "after-christmas":
      return [
        {
          text: `Next up: Easter Journey. Easter is ${formatMonthDay(season.easter.easter)}.`,
          href: productPath(HANDLES.easterJourney),
        },
        freeShippingMessage,
      ];

    case "easter": {
      const messages: AnnouncementMessage[] = [];
      if (season.orderBy) {
        messages.push({
          text: `Order by ${formatMonthDay(season.orderBy)} to start on Palm Sunday`, // CONFIRM (§5, item 8)
          href: "/shipping#easter-delivery",
          deadline: true,
        });
      } else if (today <= season.easter.palmSunday) {
        // Past the hardcover cutoff: the PDF still makes Palm Sunday.
        messages.push({
          text: "Start Palm Sunday with the instant PDF",
          href: productPath(HANDLES.ejPdf),
          deadline: true,
        });
      }
      messages.push(freeShippingMessage);
      return messages;
    }

    case "off-season":
      return [
        freeShippingMessage,
        { text: "Free printables for your family, by email", href: "/freebies" },
        ...(CLAIMS.bulkDiscount
          ? [
              {
                text: `Save ${BULK_DISCOUNT.percent}% on ${BULK_DISCOUNT.minBooks}+ hardcovers for a ward`, // CONFIRM (§5, item 4)
                href: "/bulk-orders",
              },
            ]
          : []),
      ];
  }
}

export const ANNOUNCEMENT = {
  regionLabel: "Announcements",
  pause: "Pause announcements",
  play: "Play announcements",
  /** Ticker speed, in seconds per message. */
  secondsPerMessage: 7,
} as const;

// ---------------------------------------------------------------------------
// §1.5 Footer
// ---------------------------------------------------------------------------

export type FooterColumn = { title: string; links: NavLink[] };

export const FOOTER = {
  blurb:
    "Tiffany Wheeler writes Christ-centered picture books that help families make traditions around the Savior’s birth and Resurrection. Illustrated by Kelley Hicken. Packed and shipped from Idaho.",
  columns: [
    {
      title: "Shop",
      links: [
        { label: "Nephite Christmas", href: productPath(HANDLES.nephiteChristmas) },
        { label: "Easter Journey", href: productPath(HANDLES.easterJourney) },
        { label: "The Complete Set", href: productPath(HANDLES.completeSet) },
        { label: "Gifts & Add-ons", href: "/shop#gifts-add-ons" },
        { label: "Instant Downloads", href: "/shop#instant-downloads" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Shipping & Christmas Delivery", href: "/shipping#christmas-delivery" },
        { label: "Returns & Exchanges", href: "/returns" },
        { label: "Contact Tiffany", href: "/contact" },
        { label: "Bulk & Ward Orders", href: "/bulk-orders" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Meet Tiffany", href: "/about" },
        // The about page should give Kelley's section id="illustrator".
        { label: "Illustrator Kelley Hicken", href: "/about#illustrator" },
        { label: "Free Printables", href: "/freebies" },
        { label: "Wholesale for Retailers", href: "/bulk-orders#wholesale" },
      ],
    },
  ] satisfies FooterColumn[],
  navLabel: "Footer",
  legalLabel: "Legal",
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
  ] satisfies NavLink[],
  socialLabel: "Follow along",
  social: {
    instagram: { label: "Instagram", handle: "@tiffanywheelerbooks" },
    // CONFIRM which Facebook page (§5, item 33): the live About page links a personal profile.
    facebook: { label: "Facebook", handle: "Tiffany Wheeler Books" },
  },
  /**
   * Required on every page, landing pages included. Render it with
   * <Disclaimer> (src/components/layout/disclaimer.tsx) so “Latter-day” never
   * breaks across lines.
   */
  disclaimer:
    "Independent publication. Not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints.",
  /** Rendered as "© {year} Tiffany Books LLC. Illustrations by Kelley Hicken." */
  copyrightHolder: "Tiffany Books LLC", // Publisher of record on Easter Journey's copyright page
  copyrightSuffix: "Illustrations by Kelley Hicken.",
  /** Hidden until Shopify checkout is live. */
  showPaymentLine: false,
  paymentLine: "Secure checkout · Shop Pay · PayPal · Visa · Mastercard · Amex", // CONFIRM enabled methods
} as const;

// ---------------------------------------------------------------------------
// §1.6 Shop All page
// ---------------------------------------------------------------------------

export type ShopSectionId = "books-sets" | "gifts-add-ons" | "instant-downloads" | "easter";

export const SHOP = {
  title: "Shop",
  sub: "Books, bundles and little extras for Christmas and Easter.",
  metaDescription:
    "Books, bundles and little extras for Christmas and Easter: Nephite Christmas, Easter Journey, the Complete Set, ornaments, activity books and instant PDF downloads.",
  sectionsNavLabel: "Shop sections",
  /** Accessible name for the trust band at the bottom of the page (not visible). */
  trustLabel: "Shopping with Tiffany Wheeler",
  sections: {
    "books-sets": { title: "Books & Sets" },
    "gifts-add-ons": { title: "Gifts & Add-ons" },
    "instant-downloads": {
      title: "Instant Downloads",
      note: "Instant downloads arrive by email. Nothing ships.",
    },
    easter: { title: "Easter" },
  } satisfies Record<ShopSectionId, { title: string; note?: string }>,
} as const;

// ---------------------------------------------------------------------------
// 404 (not in the copy deck; drafted in the deck's voice for review)
// ---------------------------------------------------------------------------

export const NOT_FOUND = {
  metaTitle: "Page not found",
  eyebrow: "Hello there!",
  title: "We couldn’t find that page",
  body: "The link may be old, or the page may have moved. Here are the books most families come for:",
  boyAlt: "Jacob, the Nephite boy from Nephite Christmas, waving hello",
  setShortTitle: "The Complete Set",
  homeCta: "Back to Home",
  shopCta: "Shop All",
  helpLine: "Looking for something else?",
  helpLinks: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping & Christmas Delivery", href: "/shipping#christmas-delivery" },
    { label: "Contact Tiffany", href: "/contact" },
  ] satisfies NavLink[],
} as const;
