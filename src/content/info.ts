// Copy for the info pages: /about, /contact, /faq, /shipping, /returns,
// /freebies, /bulk-orders, /privacy, /terms, /accessibility.
//
// Sources: docs/copy-deck.md (§1.x, §2.10–§2.14, §4.4, §5), the live site
// (docs/discovery/current-site.md and live-site-pages-text.txt: Tiffany’s and
// Kelley’s bios, the Easter Journey story, wholesale terms) and
// docs/discovery/market-cro.md (USPS holiday dates, FTC and Church guidance).
// Copy that isn’t in the deck is drafted in the deck’s voice for review.
// "[CONFIRM]" claims render without the tag and carry a `// CONFIRM` comment
// (copy deck §5). Numbers that live in store-config or the cart are
// interpolated so the pages never drift from checkout.
//
// Inline markup understood by <RichText> (src/components/info/rich-text.tsx):
// [label](/href or https://… or mailto:…), **bold**, and bare email addresses.
//
// Claims that need Tiffany's written sign-off are gated on CLAIMS in
// store-config (guarantee, free shipping, pickup, Priority, signed copies, gift
// slips): when a flag is false the copy falls back to neutral wording and the
// related rows are hidden. Every date comes from src/lib/delivery.ts.

import type { StaticImageData } from "next/image";
import { FOOTER } from "@/content/site";
import { formatMoney } from "@/lib/money";
import {
  BULK_DISCOUNT,
  CART_MAX_QUANTITY,
  CLAIMS,
  CONTACT_EMAIL,
  FLAT_RATE_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  HANDLES,
  HANDLING_TIME,
  SHIPS_FROM,
  SITE_URL,
  TRANSIT_TIME,
  productPath,
} from "@/lib/store-config";

import ejMerchantWide from "@/assets/images/art/ej-merchant-wide.jpg";
import ncVillageNight from "@/assets/images/art/nc-page-village-night.jpg";
import kelleyHicken from "@/assets/images/people/kelley-hicken.jpg";
import tiffanyBanner from "@/assets/images/people/tiffany-banner.jpg";
import tiffanyPortrait2 from "@/assets/images/people/tiffany-portrait-2.jpg";
import cubeDove from "@/assets/images/printables/cube-dove.jpg";
import familyPraying from "@/assets/images/printables/family-praying.jpg";
import nephiPreaching from "@/assets/images/printables/nephi-preaching.jpg";
import origamiDove from "@/assets/images/printables/origami-dove.jpg";

// ── Shared ──────────────────────────────────────────────────────────────────

/** A block of prose: a paragraph (string), a list, or a highlighted note. */
export type InfoBlock =
  | string
  | { list: readonly string[]; ordered?: boolean }
  | { note: string };

export type InfoSectionCopy = { id: string; title: string; blocks: readonly InfoBlock[] };

export type InfoLink = { label: string; href: string; line?: string };

export type StaticPhoto = { src: StaticImageData; alt: string };

const freeShip = formatMoney(FREE_SHIPPING_THRESHOLD, { trim: true }); // "$45"
const flatRate = formatMoney(FLAT_RATE_SHIPPING); // "$5.99" CONFIRM (§5, item 3)
const bulkMin = BULK_DISCOUNT.minBooks;
const bulkPct = BULK_DISCOUNT.percent;

const GUARANTEE = CLAIMS.moneyBackGuarantee; // CONFIRM (§5, item 5)
const FREE_SHIPPING = CLAIMS.freeShipping; // CONFIRM (§5, items 2 and 3)
const PICKUP = CLAIMS.localPickup; // CONFIRM (§5, item 9)
const RETURNS_LABEL = GUARANTEE ? "Returns & Guarantee" : "Returns";
/** Names the date topics on /shipping, with pickup only when it's offered. */
const SHIPPING_LINK_LINE = PICKUP ? "Rates, order-by dates and local pickup" : "Rates and Christmas order-by dates";

/** Legal entity named in the policies (same value as the footer copyright). CONFIRM (§5, item 24) */
const ENTITY = FOOTER.copyrightHolder;
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** How quickly we answer email. CONFIRM with Tiffany (not in the deck). */
const REPLY_TIME = "1–2 business days"; // CONFIRM
/** How quickly we answer wholesale applications. CONFIRM with Tiffany. */
const WHOLESALE_REPLY_TIME = "2–3 business days"; // CONFIRM

/** Church-affiliation disclaimer, verbatim from the footer (copy deck §1.5). */
export const CHURCH_DISCLAIMER = FOOTER.disclaimer;

/** "Last updated" date on the policy pages. Change it whenever a policy changes. */
export const POLICIES_UPDATED = "September 22, 2026";

// ── Delivery dates (used by /shipping) ──────────────────────────────────────

/**
 * USPS recommended holiday "ship by" dates for the lower 48 (market-cro.md §2,
 * published 2026-09-22). Add each year once USPS publishes them; the shipping
 * page only shows the USPS reference line for years listed here.
 */
export const USPS_HOLIDAY_SHIP_BY: Record<
  number,
  { groundAdvantage: string; priority: string; priorityExpress: string }
> = {
  2026: { groundAdvantage: "2026-12-17", priority: "2026-12-18", priorityExpress: "2026-12-19" },
};

// ── /about ──────────────────────────────────────────────────────────────────

export const aboutCopy = {
  meta: {
    title: "About Tiffany Wheeler",
    description:
      "Meet Tiffany Wheeler, the Idaho author of Nephite Christmas and Easter Journey, and illustrator Kelley Hicken. The story behind the butterfly, “Enjoy the Journey” and the books.",
  },
  hero: {
    eyebrow: "Enjoy the Journey",
    title: "Meet Tiffany Wheeler",
    intro:
      "Author of Nephite Christmas and Easter Journey. Wife, mom of six and lifelong reader in Idaho’s Treasure Valley, writing faith-filled stories that bring families closer to one another and to Jesus Christ.",
    photo: { src: tiffanyBanner, alt: "Author Tiffany Wheeler" } satisfies StaticPhoto,
    cta: { label: "See Her Books", href: "#books" },
  },
  /**
   * Tiffany’s About page, in her words (docs/discovery/live-site-pages-text.txt,
   * lines 25–35), with dashes set as unspaced em dashes.
   *
   * TIFFANY TO APPROVE: light copy edits to her text, marked “EDITED” below.
   * Everything else is verbatim from the live page.
   */
  story: {
    title: "My story",
    photo: { src: tiffanyPortrait2, alt: "Tiffany Wheeler, author of Nephite Christmas and Easter Journey" } satisfies StaticPhoto,
    family: [
      "Hi, I’m Tiffany Wheeler. If we were sitting together around the breakfast table, I’d probably start by telling you about my family. I live in Idaho’s beautiful Treasure Valley with my husband, John, and we have six incredible children. Family is my greatest joy and the place where I learn and grow the most. When I’m not gathering people together, you’ll probably find me kayaking on a mountain lake, hiking somewhere with a view, planning my next trip, or curled up with a good book.",
      "I’ve loved books for as long as I can remember. As a child, I spent my summers biking to the library, filling my basket with books, and reading beneath the lilac bushes until dinnertime. Stories such as Little Women, The Count of Monte Cristo, and To Kill a Mockingbird taught me that a good book can shape our character and help us see the world differently. Now, as the author of Nephite Christmas and Easter Journey, I love creating faith-filled stories and experiences that bring families closer to one another and to Jesus Christ.",
    ],
    butterfly: {
      eyebrow: "Why there’s a butterfly in my logo",
      quote: "What the caterpillar calls the end of the world, the Master calls the butterfly.",
      paragraph:
        "In 2022, breast cancer caused me to pause and think about what I wanted to do with my life. During that time, a friend gave me a journal with the words, “What the caterpillar calls the end of the world, the Master calls the butterfly.” That message encouraged me to uncover talents I had buried and trust God to help me become something more. It’s also why there’s a small butterfly in my logo—it reminds me where my wings come from.",
    },
    // CONFIRM Connection Crates, the next book series and the ACT podcast are
    // still current (live-site wording; "This year, I’m launching…" is
    // time-relative, so recheck it each January).
    today: [
      // EDITED (Tiffany to approve): "Connection Crates—creating connection
      // tools for families- tools that can be delivered to your front door- so
      // you actually use them" → one clause; "the value of Connection" → lower case.
      "I always have a new book or business idea floating around in my head, and I am excited for one of my new ventures. After years of serving youth and working in suicide and addiction prevention, I’ve become convinced that small moments of genuine connection can change lives. That belief inspired Connection Crates: connection tools for families, delivered to your front door so you actually use them. Through simple activities, practical tools, and meaningful conversations, Connection Crates helps families slow down, laugh together, and build stronger relationships one small moment at a time. This is also going to be part of the next book series that I am working on to help youth and children understand the value of connection and how to find and create more connection in their lives.",
      // EDITED (Tiffany to approve): "The other project I am working on,
      // touches deep on my faith" → "The other project I’m working on touches
      // deeply on my faith".
      "The other project I’m working on touches deeply on my faith and love for my Savior. All things point to Him. That is how Easter Journey started. But teaching early-morning seminary also helped me discover how much joy comes from applying gospel principles—not just learning them. This year, I’m launching ACT: Applying Christ’s Teachings, a podcast centered on one simple idea: the gospel isn’t something we only learn; it’s something we live. As we act on what we’re learning, we begin to recognize Jesus Christ in our everyday choices, relationships, and experiences. That’s where true joy is found.",
    ],
    mantra: {
      label: "My mantra",
      phrase: "Enjoy the Journey.",
      paragraphs: [
        "My mantra is “Enjoy the Journey.” I believe life is meant to be lived with passion! Passion for your faith, your family, your friendships, your life and the beautiful things of this world! That’s why I love writing books and creating things that bring people closer together and closer to Christ. He is the source of my joy and my strength.",
        "I’m so glad our paths have crossed. I hope something I create brings a little more faith, connection, and joy to your journey!",
      ],
      signature: "Tiffany",
    },
    credential: "Named one of Idaho Business Review’s 2025 Women of the Year.", // CONFIRM she wants this used (§5, item 17)
  },
  books: {
    title: "The stories behind the books",
    nephiteChristmas: {
      eyebrow: "Nephite Christmas",
      title: "You know what happened in Bethlehem. But do you know what happened across the sea?",
      paragraphs: [
        "Just like the shepherds and wise men, the Nephites too were witnesses of the miracle of Christ’s birth.",
        // EDITED (Tiffany to approve): first person, to match the Easter Journey
        // story beside it. "My daughters’ love" follows the live product page
        // ("Inspired by her daughters love for the Book of Mormon…"). CONFIRM
        // daughters (plural).
        "Inspired by my daughters’ love for the Book of Mormon and my own testimony of the Savior, I retold the story of 3 Nephi 1 in the rhythm of ’Twas the Night Before Christmas, so families could read it together every year.",
      ],
      image: {
        src: ncVillageNight,
        alt: "Illustrated Nephite village of thatched huts beneath a temple, from the first page of Nephite Christmas",
      } satisfies StaticPhoto,
      link: { label: "Look inside Nephite Christmas", href: productPath(HANDLES.nephiteChristmas) },
    },
    easterJourney: {
      eyebrow: "Easter Journey",
      title: "How Easter Journey began",
      // Tiffany’s words from the live /easter-journey/ page (verbatim).
      paragraphs: [
        "What started in 2007 as a small Easter event in our church—to help families and our community experience Easter together—became more powerful and meaningful than I ever imagined. Originally created as a play, Easter Journey has since evolved into a tool to help families celebrate Easter in a higher, holier way.",
        "The first year we did the play, about a thousand people walked through the story of Christ in our building. Each year, more came, and we added nights and space to accommodate everyone.",
        "It wasn’t about fancy sets or special effects—it was about immersing people in the story of Jesus, helping them feel like they were really there.",
        "One 10-year-old told me he wanted to go through it again and again, saying it was even better than Disneyland. The story came alive, and the Spirit testified of Christ in ways words alone cannot describe.",
        "For years, families have asked if they could get a copy of Easter Journey to share at home. Inspired by a faith leader’s invitation to celebrate Easter in a “higher and holier” way, I knew it was time to make this experience available to more families.",
        "Based on the stories from the Gospels, this story is made to be shared by Christians of every denomination.",
      ],
      // Tiffany’s own line on the live /easter-journey/ page (it follows the
      // faith-leader paragraph there), so it is attributed to her and never to a
      // Church leader (market-cro.md). CONFIRM it is her wording.
      quote: "We need to up our game when it comes to putting Christ back into Easter.",
      quoteBy: "Tiffany",
      image: {
        src: ejMerchantWide,
        alt: "Smiling merchant welcoming visitors to a lamplit Jerusalem market street",
      } satisfies StaticPhoto,
      link: { label: "Look inside Easter Journey", href: productPath(HANDLES.easterJourney) },
    },
  },
  illustrator: {
    id: "illustrator",
    eyebrow: "The illustrator",
    title: "Illustrated by Kelley Hicken",
    // Verbatim: the live About page, then the Nephite Christmas product-page bio.
    paragraphs: [
      "Kelley Hicken is passionate about all things creative, with illustration and fiction writing topping the list. She believes creativity is inherent in every human being—and she lives that belief through her work in children’s literature, poetry, and, of course, illustration.",
      "Kelley lives in Idaho with her husband and their two children, who give her equal parts anxiety, immeasurable joy, and endless story-fire kindling.",
      "Kelley brings her artistic talents and testimony of Jesus Christ to life in “Nephite Christmas.” Each page of her work reflects her profound love for the Savior and the Book of Mormon. She loves to hear from readers.",
    ],
    photo: { src: kelleyHicken, alt: "Kelley Hicken, illustrator" } satisfies StaticPhoto,
    link: { label: "Visit Kelley’s website", href: "https://kelleyhicken.com/" },
  },
  shop: {
    id: "books",
    eyebrow: "Christmas and Easter",
    title: "Two Christ-centered traditions your family will keep",
    subtitle: "Nephite Christmas for His birth, Easter Journey for His Resurrection, or both together in the Complete Set.",
  },
  contact: {
    line: "Want to say hello, or ask Tiffany a question?",
    link: { label: "Send Tiffany a message", href: "/contact" },
  },
  /** Person JSON-LD for the author. */
  person: {
    name: "Tiffany Wheeler",
    jobTitle: "Children’s book author",
    homeLocation: "Treasure Valley, Idaho",
  },
};

// ── /contact ────────────────────────────────────────────────────────────────

/** Topics in the contact form. Validated server-side against this list. */
export const CONTACT_TOPICS = [
  { value: "order", label: "An order I placed" },
  { value: "books", label: "A question about the books" },
  { value: "bulk", label: "A bulk or ward order" },
  { value: "wholesale", label: "Wholesale for my store" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export const contactFormCopy = {
  formLabel: "Send Tiffany a message",
  name: { label: "Your name" },
  email: { label: "Email address", placeholder: "you@example.com" },
  topic: { label: "What’s it about?", placeholder: "Choose one" },
  order: { label: "Order number", hint: "If your question is about an order you placed." },
  message: { label: "Message", placeholder: "How can we help?" },
  optional: "(optional)",
  submit: "Send Message",
  privacy: "We’ll only use your details to reply to you. See our [Privacy Policy](/privacy).",
  /** `{email}` is the sender’s address. */
  success: {
    title: "Thank you! Your message is on its way.",
    body: `We’ll reply to {email} within ${REPLY_TIME}.`, // CONFIRM reply time
  },
  another: "Send another message",
  errors: {
    summary: "Please check the highlighted fields.",
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    topic: "Please choose a topic.",
    order: "That order number looks too long. Please check it.",
    message: "Please write a short message (at least 10 characters).",
    messageLong: "Please keep your message under 5,000 characters.",
    server: `Something went wrong on our end. Please try again in a moment, or email ${CONTACT_EMAIL}.`,
  },
};

export type ContactFormCopy = typeof contactFormCopy;

export const contactCopy = {
  meta: {
    title: "Contact Tiffany",
    description: `Questions about an order, a big ward order or wholesale? Email ${CONTACT_EMAIL} or send Tiffany a message here.`,
  },
  eyebrow: "We’d love to hear from you",
  title: "Send Tiffany a Message",
  // From the live contact form.
  intro: "Please let us know what’s on your mind. Have a question for us? Ask away.",
  email: {
    title: "Email us",
    line: "The quickest way to reach us:",
    address: CONTACT_EMAIL, // CONFIRM customer-service address (§5, item 32)
    reply: `We reply within ${REPLY_TIME}.`, // CONFIRM reply time
  },
  formTitle: "Send a message",
  quickTitle: "Quick answers",
  quickLinks: [
    { label: "Shipping & Christmas Delivery", href: "/shipping#christmas-delivery", line: SHIPPING_LINK_LINE },
    {
      label: RETURNS_LABEL,
      href: "/returns",
      line: GUARANTEE ? "Our 30-day love-it-or-your-money-back promise" : "Returns, exchanges and damaged items",
    }, // CONFIRM (§5, item 5)
    { label: "FAQ", href: "/faq", line: "Ages, sizes, PDFs and more" },
    { label: "Bulk & Ward Orders", href: "/bulk-orders", line: `Save ${bulkPct}% on ${bulkMin} or more hardcovers` }, // CONFIRM (§5, item 4)
    { label: "Wholesale for Retailers", href: "/bulk-orders#wholesale", line: "Carry the books in your store" },
  ] satisfies InfoLink[],
};

// ── /faq ────────────────────────────────────────────────────────────────────

export const faqPageCopy = {
  meta: {
    title: "FAQ",
    description: `Answers about Nephite Christmas and Easter Journey: ages and sizes, shipping and Christmas delivery,${CLAIMS.signedCopies ? " signed copies," : ""} returns, bulk orders and the PDF editions.`,
  },
  eyebrow: "FAQ",
  title: "Questions? We’re here to help.",
  intro: "The questions families ask most about the books, shipping and orders.",
  more: {
    title: "Still have a question?",
    line: `Email ${CONTACT_EMAIL} or send Tiffany a message. We reply within ${REPLY_TIME}.`, // CONFIRM reply time
    cta: { label: "Contact Tiffany", href: "/contact" },
  },
  relatedLabel: "Related help pages",
  related: [
    { label: "Shipping & Christmas Delivery", href: "/shipping#christmas-delivery", line: SHIPPING_LINK_LINE },
    {
      label: RETURNS_LABEL,
      href: "/returns",
      line: GUARANTEE ? "How our 30-day guarantee works" : "Returns, exchanges and damaged items",
    },
    { label: "Bulk & Ward Orders", href: "/bulk-orders", line: "Grandparents, Primary and ward gifts" },
  ] satisfies InfoLink[],
};

// ── /shipping ───────────────────────────────────────────────────────────────

export type ShippingIcon = "truck" | "package" | "download";

export const shippingCopy = {
  meta: {
    title: "Shipping & Christmas Delivery",
    description: `${FREE_SHIPPING ? `Free US shipping on orders ${freeShip}+, or a flat ${flatRate} under ${freeShip}. ` : ""}Orders ship from ${SHIPS_FROM} in ${HANDLING_TIME}. See this year’s Christmas order-by dates${PICKUP ? " and Boise pickup" : ""}.`, // CONFIRM (§5, items 2, 3, 6, 9)
  },
  eyebrow: "Shipping",
  title: "Shipping & Christmas Delivery",
  intro: `Packed by hand and shipped from ${SHIPS_FROM}, with honest dates so your books arrive when you need them.`, // CONFIRM (§5, item 6)
  highlights: [
    FREE_SHIPPING
      ? {
          icon: "truck",
          title: `Free US shipping on orders ${freeShip}+`,
          line: `Orders under ${freeShip} ship for a flat ${flatRate}.`,
        } // CONFIRM (§5, items 2 and 3)
      : { icon: "truck", title: "Shipping to US addresses", line: "Your shipping cost is shown at checkout." },
    {
      icon: "package",
      title: `Ships from ${SHIPS_FROM} in ${HANDLING_TIME}`,
      line: `Most packages arrive ${TRANSIT_TIME} later by USPS.`,
    }, // CONFIRM (§5, item 6)
    { icon: "download", title: "Instant downloads", line: "PDFs arrive by email in minutes. Nothing ships." },
  ] satisfies { icon: ShippingIcon; title: string; line: string }[],
  jumpLabel: "On this page",
  /** "Local pickup" is dropped by the page when pickup isn't offered. */
  jumpLinks: [
    { label: "Rates", href: "#rates" },
    { label: "Christmas dates", href: "#christmas-delivery" },
    { label: "Easter", href: "#easter-delivery" },
    { label: "Local pickup", href: "#pickup" },
  ] satisfies InfoLink[],
  rates: {
    id: "rates",
    title: "Shipping rates",
    colOrder: "Your order",
    colCost: "Shipping",
    rows: [
      ...(FREE_SHIPPING
        ? [
            { label: `Under ${freeShip}`, value: flatRate }, // CONFIRM (§5, item 3)
            { label: `${freeShip} or more`, value: "Free" }, // CONFIRM (§5, item 2)
          ]
        : [{ label: "Books and gifts", value: "At checkout" }]),
      { label: "Digital downloads only", value: "Free (nothing ships)" },
      ...(PICKUP ? [{ label: "Local pickup, Boise area", value: "Free" }] : []), // CONFIRM (§5, item 9)
    ],
    notes: [
      ...(FREE_SHIPPING
        ? [
            "The Complete Set ships free on its own.", // CONFIRM (§5, item 2)
            "Digital downloads don’t count toward the free-shipping total, because they never ship.", // CONFIRM (§5, item 2)
          ]
        : []),
      "We ship to addresses in the United States.", // CONFIRM lower 48 vs all US, APO/FPO, international
      "Sales tax, where it applies, is added at checkout.",
    ],
  },
  timing: {
    id: "timing",
    title: "When your order ships",
    blocks: [
      `We pack every order by hand and ship from ${SHIPS_FROM} in ${HANDLING_TIME} (Monday through Friday, except holidays). Most packages arrive ${TRANSIT_TIME} after they ship, by USPS.`, // CONFIRM (§5, item 6)
      "You’ll get an email with tracking as soon as your order ships. Book and bundle pages show a “Get it by” date based on these times.", // CONFIRM tracking emails once Shopify is live
      "If we ever can’t ship your order in the time we’ve said, we’ll email you right away with a new date and the choice to cancel for a full refund.",
    ] satisfies InfoBlock[],
  },
  christmas: {
    id: "christmas-delivery",
    eyebrow: "Christmas",
    /** `{year}` is the Christmas the dates are for. */
    title: "Christmas delivery dates",
    intro: "Order by these dates for delivery by Christmas.",
  },
  easter: {
    id: "easter-delivery",
    eyebrow: "Easter",
    title: "Easter delivery",
    /** Arguments: the year and the formatted Easter date. */
    dateLabel: (year: number, easter: string) => `Easter ${year} is Sunday, ${easter}`,
    guide:
      "Easter Journey’s 8-day reading guide runs from Palm Sunday to Easter morning, so plan to have the book in hand by Palm Sunday.",
    /** Arguments are formatted dates (season.easter). CONFIRM Easter cutoff (§5, item 8) */
    open: (orderBy: string, palmSunday: string) =>
      `Order the hardcover by ${orderBy} to start Easter Journey on Palm Sunday, ${palmSunday}.`,
    passed: (palmSunday: string) =>
      `The hardcover cutoff has passed, but the PDF edition downloads instantly, in time to start on Palm Sunday, ${palmSunday}.`,
    holyWeek:
      "Holy Week is here. The PDF edition downloads instantly, so your family can still take the journey before Easter morning.",
    pdfLink: { label: "Get the Easter Journey PDF", href: productPath(HANDLES.ejPdf) },
    bookLink: { label: "See Easter Journey", href: productPath(HANDLES.easterJourney) },
  },
  /** Rendered only when CLAIMS.localPickup. */
  pickup: {
    id: "pickup",
    eyebrow: "Local",
    title: "Local pickup in the Boise area",
    blocks: [
      "Local to the Boise area? Choose **Local Pickup** at checkout and pick up your order for free.", // CONFIRM keep pickup (§5, item 9)
      "We’ll email you when your order is ready, with the pickup address and times.", // CONFIRM pickup process
    ] satisfies InfoBlock[],
    /** `date` is formatted. CONFIRM (§5, item 9) */
    christmas: (date: string) => `For Christmas, local pickup runs through ${date}.`,
  },
  madeToOrder: {
    id: "made-to-order",
    title: "Made-to-order gifts",
    blocks: [
      "[The Promised Messiah puzzle](" +
        productPath(HANDLES.puzzle) +
        ") and the [He Spoke My Name canvas](" +
        productPath(HANDLES.canvas) +
        ") are made to order just for you. They ship separately from the rest of your order and take a little longer to arrive, so please order them early for Christmas and Easter.", // CONFIRM production time and separate shipping (§5, item 29)
    ] satisfies InfoBlock[],
  },
  gifts: {
    id: "gifts",
    title: "Sending a gift",
    blocks: [
      `Enter the recipient’s address at checkout and add a free gift note in your cart. We’ll tuck your message in the box.${CLAIMS.giftSlipsHidePrices ? " Packing slips never show prices." : ""}`, // CONFIRM packing slips leave prices off (§5, item 31)
    ] satisfies InfoBlock[],
  },
  problems: {
    id: "problems",
    title: "Late, lost or damaged?",
    blocks: [
      `Email ${CONTACT_EMAIL} with your order number (and a photo if something arrived damaged), and we’ll make it right. See [Returns & Guarantee](/returns).`,
    ] satisfies InfoBlock[],
  },
};

/**
 * Copy for the Christmas order-by table (src/components/info/christmas-delivery-table.tsx).
 * The signed, Priority and pickup rows render only while CLAIMS offers them
 * (their dates are null in season.christmas otherwise).
 */
export const christmasTableCopy = {
  /** `{year}` */
  caption: (year: number) => `Christmas ${year} order-by dates`,
  colMethod: "How it gets to you",
  colDate: "Order by",
  passed: "Passed",
  through: "Through",
  rows: {
    signed: { name: "Signed copies", line: "Signed by Tiffany, then sent by standard shipping" }, // CONFIRM signed copies (§5, item 10)
    standard: {
      name: "Standard shipping",
      line: FREE_SHIPPING ? `USPS Ground Advantage. Free on orders ${freeShip}+.` : "USPS Ground Advantage",
    }, // CONFIRM carrier (§5, item 3)
    priority: { name: "Priority shipping", line: "USPS Priority Mail, chosen at checkout for an added cost" }, // CONFIRM Priority offered (§5, item 7)
    pickup: { name: "Local pickup, Boise area", line: "Free. Choose Local Pickup at checkout." }, // CONFIRM (§5, item 9)
    digital: {
      name: "PDF editions",
      line: "Instant download: in your inbox in minutes, right up to Christmas Eve",
      date: "Any time",
    },
  },
  /** Status line above the table. Arguments are formatted dates. */
  status: {
    /** `soon`: the cutoff is within two weeks. */
    standard: (orderBy: string, soon: boolean) =>
      `${soon ? "There’s still time: order" : "Order"} by ${orderBy} for Christmas delivery with standard shipping.`,
    priority: (priorityBy: string) =>
      `Standard shipping won’t arrive by Christmas now. Choose Priority at checkout by ${priorityBy}, or get an instant PDF.`, // CONFIRM (§5, item 7)
    lastMinute: () =>
      `Too late to ship for Christmas? The PDF editions download instantly, right up to Christmas Eve. A hardcover ordered now may not arrive by Christmas.`, // CONFIRM whether Tiffany pauses shipping (§5, item 7)
    planning: (year: number) =>
      `Planning ahead? These are our Christmas ${year} order-by dates. We confirm them each fall once USPS posts its holiday schedule.`,
  },
  /** Argument is the formatted last Christmas cutoff. CONFIRM whether Tiffany pauses shipping (§5, item 7) */
  afterCutoff: (lastCutoff: string) =>
    `Hardcover orders placed after ${lastCutoff} still ship in ${HANDLING_TIME}, but may not arrive by Christmas.`,
  /**
   * USPS's published ship-by dates as the basis (only the services we offer).
   * `earlier`: every order-by date plus our packing time ships by USPS's date.
   */
  usps: (
    dates: { groundAdvantage: string; priority: string | null; priorityExpress: string | null },
    earlier: boolean,
  ) => {
    const services = [
      `${dates.groundAdvantage} (Ground Advantage)`,
      ...(dates.priority ? [`${dates.priority} (Priority Mail)`] : []),
      ...(dates.priorityExpress ? [`${dates.priorityExpress} (Priority Express)`] : []),
    ];
    const list =
      services.length > 1 ? `${services.slice(0, -1).join(", ")} and ${services[services.length - 1]}` : services[0];
    return `For reference, USPS recommends mailing by ${list} for Christmas delivery in the lower 48.${earlier ? ` Our order-by ${services.length > 1 ? "dates are" : "date is"} earlier, to leave ${HANDLING_TIME} to pack your order.` : ""}`;
  },
  /** FTC Mail Order Rule: every delivery promise states its basis and limits. */
  disclaimer: "Delivery dates are estimates for most US addresses; not guaranteed.",
  pdfLink: { label: "Shop the instant PDF editions", href: "/shop#instant-downloads" },
};

// ── /returns ────────────────────────────────────────────────────────────────

export type ReturnsCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  intro: string;
  promises: readonly { title: string; line: string }[];
  sections: readonly InfoSectionCopy[];
  help: { title: string; line: string; cta: InfoLink };
};

const returnsShared = {
  damaged: {
    id: "damaged",
    title: "Damaged or wrong item",
    blocks: [
      `If anything arrives damaged, or we sent the wrong item, email ${CONTACT_EMAIL} with a photo and your order number. We’ll send a replacement free, and you won’t need to send the damaged item back.`, // CONFIRM
    ],
  },
  digital: {
    id: "digital",
    title: "Digital downloads",
    blocks: [
      "Because digital files can’t be returned, PDF downloads can’t be refunded once they’ve been downloaded.", // CONFIRM digital excluded (§5, item 5)
      "If a file won’t open, is missing pages, or you were charged by mistake (for example, you bought the same PDF twice), email us and we’ll fix it or refund you.", // CONFIRM
    ],
  },
  madeToOrder: {
    id: "made-to-order",
    title: "Made-to-order puzzle and canvas",
    blocks: [
      "The puzzle and canvas print are made just for you, so they can’t be returned for a change of mind. If one arrives damaged or with a printing flaw, send us a photo and we’ll replace it free.", // CONFIRM (§5, item 29)
    ],
  },
  wholesale: {
    id: "wholesale",
    title: "Wholesale orders",
    blocks: [
      "Store and wholesale orders follow the wholesale terms on our [Wholesale for Retailers](/bulk-orders#wholesale) page.",
    ],
  },
  help: {
    title: "Need help with an order?",
    line: `Email ${CONTACT_EMAIL} and we’ll make it right. We reply within ${REPLY_TIME}.`, // CONFIRM reply time
    cta: { label: "Contact Tiffany", href: "/contact" },
  },
} satisfies Record<string, InfoSectionCopy | ReturnsCopy["help"]>;

/**
 * CLAIMS.moneyBackGuarantee: the 30-day love-it-or-your-money-back guarantee.
 * CONFIRM every term with Tiffany (§5, item 5). It replaces the live policy,
 * which says sale items can't be refunded. Scope: every physical book, bundle
 * and gift except the made-to-order puzzle and canvas (same as the FAQ).
 */
const guaranteeReturnsCopy: ReturnsCopy = {
  meta: {
    title: "Returns & Guarantee",
    description:
      "Love it or your money back: if a book, bundle or gift isn’t a fit for your family, email us within 30 days of delivery for a full refund. Damaged items are replaced free.",
  },
  eyebrow: "Our guarantee",
  title: "Love it or your money back",
  intro:
    "If a book, bundle or gift isn’t a fit for your family, email us within 30 days of delivery for a full refund. No hassle.", // CONFIRM (§5, item 5)
  promises: [
    { title: "30-day guarantee", line: "A full refund on any book, bundle or gift." }, // CONFIRM
    { title: "Damaged? Replaced free", line: "Send a photo and we’ll send a new one." },
    { title: "Downloads that work", line: "If a file won’t open, we’ll fix it." },
  ],
  sections: [
    {
      id: "guarantee",
      title: "How the 30-day guarantee works",
      blocks: [
        {
          list: [
            `Email ${CONTACT_EMAIL} within 30 days of delivery with your order number. A quick note about what didn’t work for you helps, but it isn’t required.`, // CONFIRM
            "We’ll refund the item’s price to your original payment method.", // CONFIRM
            "If we need the item back, we’ll email you a prepaid return label, so returning it costs you nothing.", // CONFIRM who pays return shipping (§5, item 5)
          ],
          ordered: true,
        },
        "The guarantee covers every physical book, bundle and gift, including anything bought with the bulk discount. The only exceptions are the made-to-order puzzle and canvas print, and digital downloads (see below).", // CONFIRM
      ],
    },
    returnsShared.damaged,
    returnsShared.digital,
    returnsShared.madeToOrder,
    {
      id: "refund-timing",
      title: "When you’ll see your refund",
      blocks: [
        "Once we approve a refund, we process it within 7 days. Your bank or card company may take a few more days to post it.", // CONFIRM (the live policy says 7 days)
      ],
    },
    {
      id: "gifts",
      title: "Gifts",
      blocks: [
        "Received one of our books as a gift and want to return it? Email us and we’ll offer an exchange or store credit, so the gift giver isn’t notified.", // CONFIRM
      ],
    },
    returnsShared.wholesale,
  ],
  help: returnsShared.help,
};

/**
 * Without a confirmed guarantee: the live store's return policy
 * (docs/discovery/live-site-pages-text.txt, "refund_returns"), in plain English.
 */
const standardReturnsCopy: ReturnsCopy = {
  meta: {
    title: "Returns",
    description:
      "Return unused items within 30 days of delivery. Damaged or wrong items are replaced free. How refunds, exchanges and gifts work.",
  },
  eyebrow: "Returns",
  title: "Returns & exchanges",
  intro: "Changed your mind? Unused items in their original condition can be returned within 30 days of delivery.",
  promises: [
    { title: "30-day returns", line: "Unused, in the condition it arrived." },
    { title: "Damaged? Replaced free", line: "Send a photo and we’ll send a new one." },
    { title: "Downloads that work", line: "If a file won’t open, we’ll fix it." },
  ],
  sections: [
    {
      id: "returns",
      title: "How returns work",
      blocks: [
        {
          list: [
            `Email ${CONTACT_EMAIL} within 30 days of delivery with your order number, and we’ll send the return address.`,
            "Send the item back unused, in the condition you received it. Return shipping is paid by you.",
            "Once it arrives, we’ll email you and refund the item’s price to your original payment method within 7 days.",
          ],
          ordered: true,
        },
      ],
    },
    returnsShared.damaged,
    returnsShared.digital,
    returnsShared.madeToOrder,
    {
      id: "gifts",
      title: "Gifts",
      blocks: [
        "If an order was marked as a gift and shipped to you, you’ll get store credit for a return, and the gift giver isn’t notified.",
      ],
    },
    returnsShared.wholesale,
  ],
  help: returnsShared.help,
};

export const returnsCopy: ReturnsCopy = GUARANTEE ? guaranteeReturnsCopy : standardReturnsCopy;

// ── /freebies ───────────────────────────────────────────────────────────────

export const freebiesCopy = {
  meta: {
    title: "Free Printables",
    description:
      "Get the free Nephite Christmas Family Activity Pack: an origami dove, a paper cube dove and two coloring pages from the book, sent straight to your inbox.",
  },
  eyebrow: "Free for your family",
  title: "Free Christmas printables",
  intro:
    "The Nephite Christmas Family Activity Pack: fold an origami dove, build a paper cube dove and color two scenes from the book. Four pages, sent straight to your inbox.",
  /** Accessible name for the four thumbnails in the hero. */
  previewsAlt:
    "The four printables: an origami dove, a cube dove, and coloring pages of Nephi preaching and a family praying",
  inside: {
    title: "What’s in the Family Activity Pack",
    subtitle: "Four pages, ready to print as many times as your family or class needs.",
    items: [
      {
        label: "Origami Dove",
        line: "Fold a paper dove, a symbol of peace. Then hide it for the kids to find, just like the dove hidden in the book’s pictures.",
        image: origamiDove,
      },
      {
        label: "Cube Dove",
        line: "Cut, fold and build a paper cube dove to set on the table or tuck in the tree.",
        image: cubeDove,
      },
      { label: "Nephi Preaching", line: "A coloring page of Nephi preaching on the temple steps.", image: nephiPreaching },
      // CONFIRM OK to give away (§5, item 16): it is also page 15 of the paid coloring book.
      {
        label: "Family Praying",
        line: "A coloring page of a family at prayer, a scene from the book.",
        image: familyPraying,
      },
    ] satisfies { label: string; line: string; image: StaticImageData }[],
  },
  ideas: {
    title: "Ways to use them",
    items: [
      "Print a set for each child and color while you read Nephite Christmas aloud.",
      "Hide the paper doves around the house and let the kids hunt for them.",
      "Set them out at a Primary class, a family home evening or a ward party craft table.",
    ],
  },
  more: {
    title: "Want more to do?",
    subtitle:
      "The Coloring & Activity Book has mazes, puzzles and coloring pages, and the Nativity Craft is a color-your-own nativity.",
    handles: [HANDLES.coloringBook, HANDLES.nativityCraft, HANDLES.nephiteChristmas],
  },
};

// ── /bulk-orders ────────────────────────────────────────────────────────────

/** Wholesale terms from the live site (current-site.md §5). CONFIRM they still apply. */
export const WHOLESALE_TERMS = {
  /** Minimum order per title (the live wholesale products each had MOQ 12). CONFIRM per title vs per order */
  minimumPerTitle: 12,
  returnDays: 180,
  /** Wholesale unit prices; suggested retail comes from the catalog price. */
  items: [
    { handle: HANDLES.nephiteChristmas, label: "Nephite Christmas (hardcover)", wholesale: 12.5 },
    { handle: HANDLES.coloringBook, label: "Coloring & Activity Book (printed)", wholesale: 4 },
  ],
} as const;

export const wholesaleFormCopy = {
  formLabel: "Wholesale application",
  business: { label: "Business name" },
  name: { label: "Your name" },
  email: { label: "Email address", placeholder: "you@yourstore.com" },
  phone: { label: "Phone" },
  permit: { label: "Resale permit number", hint: "Your state seller’s or resale permit number." },
  message: {
    label: "Message",
    placeholder: "Which titles, about how many copies, and anything else we should know",
  },
  optional: "(optional)",
  submit: "Apply for Wholesale",
  privacy: "We’ll only use these details to review your application and reply. See our [Privacy Policy](/privacy).",
  /** `{email}` is the applicant’s address. */
  success: {
    title: "Thank you! We’ve received your application.",
    body: `We’ll review it and reply to {email} within ${WHOLESALE_REPLY_TIME} with wholesale pricing and ordering details.`, // CONFIRM response time
  },
  another: "Send another application",
  errors: {
    summary: "Please check the highlighted fields.",
    business: "Please enter your business name.",
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a phone number we can reach you at.",
    permit: "Please enter your resale permit number.",
    messageLong: "Please keep your message under 5,000 characters.",
    server: `Something went wrong on our end. Please try again in a moment, or email ${CONTACT_EMAIL}.`,
  },
};

export type WholesaleFormCopy = typeof wholesaleFormCopy;

// The bulk discount counts hardcovers only: each Nephite Christmas or Easter
// Journey is one book, the Complete Set counts as two, and PDFs don't count
// (store-config BULK_DISCOUNT; the cart applies it and shows the nudge).
// CONFIRM the terms and whether it stacks with the Complete Set price (§5, item 4).
export const bulkOrdersCopy = {
  meta: {
    title: "Bulk, Ward & Wholesale Orders",
    description: `Save ${bulkPct}% on ${bulkMin} or more hardcovers, applied automatically at checkout. Gifts for grandparents, Primary and ward, plus wholesale pricing for stores.`, // CONFIRM (§5, item 4)
  },
  eyebrow: "Bulk & ward orders",
  title: "Gifts for the whole family, or the whole ward",
  intro: `Buy ${bulkMin} or more hardcovers and save ${bulkPct}% on each, applied automatically at checkout.`, // CONFIRM (§5, item 4)
  cta: { label: "Shop the Books", href: "#shop-books" },
  how: {
    title: "How the bulk discount works",
    steps: [
      {
        title: `Add ${bulkMin} or more hardcovers`,
        line: "Mix and match Nephite Christmas and Easter Journey however you like. The Complete Set counts as two books; PDFs don’t count.",
      },
      {
        title: `Save ${bulkPct}% on each`,
        line: "The discount comes off automatically at checkout. No code needed.",
      },
      {
        title: "Need a lot?",
        line: `Ordering more than ${CART_MAX_QUANTITY} of one title, or sending copies to several homes? Email ${CONTACT_EMAIL} and we’ll help.`,
      },
    ],
  },
  who: { title: "Who orders in bulk" },
  ward: {
    title: "Ideas for Primary, ward and classroom",
    items: [
      "Put the PDF on the big screen at a ward Christmas party, and set out nativity crafts at the craft table.",
      "Give each teacher a hardcover to read aloud in class, then pull it out again every December.",
      "Send a copy to every grandchild’s home with a gift note in your own words.",
    ],
    note: "Sharing a book PDF on screen at a family, church or classroom gathering is welcome.", // CONFIRM (§5, item 30)
  },
  shop: {
    id: "shop-books",
    title: "Shop the books",
    subtitle: `Add ${bulkMin} or more hardcovers to your cart, in any mix, and ${bulkPct}% comes off each at checkout. The Complete Set counts as two.`, // CONFIRM (§5, item 4)
    /** Hardcovers only: PDFs don't count toward the bulk discount. */
    handles: [HANDLES.nephiteChristmas, HANDLES.easterJourney, HANDLES.completeSet],
  },
  contactLine: "Questions about a large order? Email",
  wholesale: {
    id: "wholesale",
    eyebrow: "For stores and gift shops",
    title: "Wholesale for retailers",
    intro:
      "Carry Nephite Christmas and the Coloring & Activity Book at wholesale prices. A reseller permit is required.",
    termsTitle: "Wholesale terms",
    colItem: "Title",
    colWholesale: "Wholesale",
    colRetail: "Suggested retail",
    /** Narrow phones: the three columns fit at 320px. */
    colRetailShort: "Retail",
    terms: [
      "A valid reseller (resale) permit is required.",
      "The retailer pays shipping.",
      "Returns within 180 days in resaleable condition, with our approval first. The retailer pays return shipping.",
    ],
    /** `{n}` copies. CONFIRM MOQ per title vs per order */
    minimum: (n: number) => `Minimum order: ${n} copies of each title.`,
    easterNote: "Interested in Easter Journey for your store? Ask in your message.", // CONFIRM Easter Journey wholesale
    formTitle: "Apply for wholesale",
    formIntro: `Tell us about your store and we’ll reply with pricing and ordering details within ${WHOLESALE_REPLY_TIME}.`, // CONFIRM response time
  },
};

// ── /privacy, /terms, /accessibility ────────────────────────────────────────
// LEGAL REVIEW NEEDED: plain-English small-business templates for a US store
// on Shopify checkout with email marketing and Meta/Google pixels. They make no
// compliance-certification claims. Have a lawyer review before launch.

export type LegalPageCopy = {
  meta: { title: string; description: string };
  title: string;
  intro: string;
  sections: readonly InfoSectionCopy[];
};

export const privacyCopy: LegalPageCopy = {
  meta: {
    title: "Privacy Policy",
    description:
      "What information Tiffany Wheeler’s bookstore collects, how we use it, the cookies and ad tools we use, and the choices you have.",
  },
  title: "Privacy Policy",
  intro: `This policy explains what information we collect when you visit ${SITE_HOST} or buy from us, how we use it, and the choices you have. We’re a small family business, and we try to collect only what we need.`,
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        // Not "the publisher": Nephite Christmas lists Rhino Media as its publisher (§5, item 24).
        `This website is run by ${ENTITY}, Tiffany Wheeler’s company, based in Idaho. When this policy says “we” or “us,” it means ${ENTITY}. Questions? Email ${CONTACT_EMAIL}.`,
      ],
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      blocks: [
        {
          list: [
            "**Order details.** When you buy, our checkout (provided by Shopify) collects your name, email address, shipping and billing addresses, phone number if you give one, and what you ordered. Payments are handled by Shopify and its payment partners. We never see or store your full card number.",
            "**Messages and forms.** If you email us or use our contact or wholesale forms, we get what you send, such as your name, email address, phone number, business details and your message.",
            "**Email sign-ups.** Your email address, when and where you signed up, and whether you open or click our emails.",
            "**Device and usage information.** Like most websites, we and our partners collect some information automatically when you visit, such as your IP address, browser and device type, the pages you view, the site that sent you here, and actions like adding a book to your cart. This comes from cookies, pixels and similar tools (see below).",
            "**Reviews.** If you write a review, we publish your review and your first name and last initial.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-it",
      title: "How we use it",
      blocks: [
        {
          list: [
            "To process and ship your order, deliver your downloads, and send order and shipping updates.",
            "To answer your questions and wholesale applications.",
            "To send the emails you signed up for, such as free printables, new books and holiday shipping reminders. You can unsubscribe at any time.",
            "To understand how people use the site, so we can make it better.",
            "To measure our ads and show them to people who might like our books, including people who have visited this site.",
            "To prevent fraud, keep the site secure, and meet legal duties such as tax records.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies, pixels and analytics",
      blocks: [
        {
          list: [
            "**Cookies that make the store work,** such as the ones that remember your cart.",
            "**Google Analytics,** to see how visitors use the site.",
            "**Meta Pixel (Facebook and Instagram) and Google Ads tags,** to measure our ads and show our ads to people who have visited the site. These tools may collect information about your activity on our site and on other sites over time.",
          ],
        },
        "You can block or delete cookies in your browser settings, though the cart may not work without them. You can also manage ads from these companies here: [Google Ads Settings](https://adssettings.google.com), the [Google Analytics opt-out add-on](https://tools.google.com/dlpage/gaoptout) and [Meta ad preferences](https://www.facebook.com/adpreferences).",
      ],
    },
    {
      id: "sharing",
      title: "When we share information",
      blocks: [
        "We don’t sell your personal information for money. We share it only with companies that help us run the store, such as:",
        {
          list: [
            "Shopify, which runs our store and checkout, and its payment processors.",
            "Shipping carriers such as USPS, to deliver your order.",
            "Our email service, to send the emails you asked for.",
            "The app that delivers your digital downloads.",
            "Meta and Google, for the analytics and advertising described above.",
          ],
        },
        "We may also share information when the law requires it, to protect our rights or someone’s safety, or if our business is sold or reorganized.",
        "Some state privacy laws treat advertising cookies like the ones above as “selling” or “sharing” personal information. You can opt out at any time; see Your choices below.",
      ],
    },
    {
      id: "your-choices",
      title: "Your choices",
      blocks: [
        {
          list: [
            "**Emails:** click “unsubscribe” at the bottom of any email, or email us.",
            `**Ad cookies:** use the links above, your browser settings, or email ${CONTACT_EMAIL} to opt out of targeted advertising.`,
            `**Your information:** depending on where you live, you may have the right to ask what personal information we have about you, and to correct it, delete it or get a copy. Email ${CONTACT_EMAIL} and we’ll respond within the time the law requires. We may need to confirm your identity first.`,
          ],
        },
        "We won’t treat you differently for using any of these choices.",
      ],
    },
    {
      id: "children",
      title: "Children’s privacy",
      blocks: [
        "Our books are for children, but this website is for grown-ups. We don’t knowingly collect personal information from children under 13. If you think a child has sent us information, email us and we’ll delete it.",
      ],
    },
    {
      id: "keeping",
      title: "How long we keep it",
      blocks: [
        "We keep order records for as long as we need them for taxes, accounting and returns. We keep other information only as long as it’s useful for the reasons above, or as long as the law requires.",
      ],
    },
    {
      id: "security",
      title: "How we protect it",
      blocks: [
        "We use trusted providers and reasonable safeguards to protect your information. No website can be perfectly secure, so please contact us right away if you think something is wrong.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: ["If we change this policy, we’ll post the new version here and update the date at the top."],
    },
    {
      id: "contact",
      title: "Contact us",
      blocks: [`Questions about your privacy? Email ${CONTACT_EMAIL}.`],
    },
  ],
};

export const termsCopy: LegalPageCopy = {
  meta: {
    title: "Terms of Service",
    description:
      "The terms for using Tiffany Wheeler’s online bookstore and buying books, gifts and digital downloads, in plain English.",
  },
  title: "Terms of Service",
  intro: `Welcome! These terms apply when you use ${SITE_HOST} or buy from us. By using the site or placing an order, you agree to them. We’ve kept them short and in plain English.`,
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        `This store is run by ${ENTITY} in Idaho (“we” or “us”). You can reach us at ${CONTACT_EMAIL}.`,
      ],
    },
    {
      id: "orders",
      title: "Orders and payment",
      blocks: [
        "Checkout is provided by Shopify. After you order, you’ll get an email confirming we received it. Your order is accepted when we ship it or send your download.",
        "We may cancel an order, with a full refund, if an item is unavailable, a price was listed in error, or we suspect fraud. Prices are in US dollars, and sales tax is added at checkout where it applies.",
      ],
    },
    {
      id: "products",
      title: "Prices and product details",
      blocks: [
        "We work hard to show accurate prices, photos and descriptions, though colors can look a little different on screens. If we make a mistake on your order, we’ll let you know and give you the choice to continue or cancel.",
        "Discounts and promotions, including the bulk discount, work as described on the site, can’t be combined unless we say so, and have no cash value.", // CONFIRM bulk stacking (§5, item 4)
      ],
    },
    {
      id: "shipping",
      title: "Shipping and delivery",
      blocks: [
        "See our [Shipping & Christmas Delivery](/shipping) page for rates and dates. Delivery dates are estimates, not guarantees. If we can’t ship your order in the time we said, we’ll email you and you can cancel for a full refund.",
      ],
    },
    {
      id: "returns",
      title: "Returns and our guarantee",
      blocks: ["See our [Returns & Guarantee](/returns) page."],
    },
    {
      id: "digital",
      title: "Digital downloads",
      blocks: [
        "When you buy a PDF, you get a personal license to download it and print as many copies as you need for personal, family or classroom use. Please don’t copy, share, resell or post the files. Thank you!",
        "Sharing a book PDF on screen at a family, church or classroom gathering is welcome.", // CONFIRM (§5, item 30)
        "Digital downloads can’t be refunded once downloaded, except as described on our [Returns & Guarantee](/returns) page.", // CONFIRM (§5, item 5)
      ],
    },
    {
      id: "content",
      title: "Our stories and illustrations",
      blocks: [
        `The stories, illustrations, photos and other content on this site belong to ${ENTITY}, Tiffany Wheeler, illustrator Kelley Hicken or their other owners, and are protected by copyright. Please don’t copy or use them without written permission, other than sharing a link or a short quote with credit.`,
      ],
    },
    {
      id: "reviews",
      title: "Reviews and messages you send",
      blocks: [
        "If you send us a review, photo or comment, you give us permission to show it on our site and in our marketing, with your first name and last initial. Please keep it honest and kind. We may remove anything unlawful, off-topic or not about the product, but we never remove or edit a review because it’s negative.",
      ],
    },
    {
      id: "church",
      title: "Not affiliated with the Church",
      blocks: [
        `Nephite Christmas and Easter Journey are independent publications by author Tiffany Wheeler. ${CHURCH_DISCLAIMER}`,
      ],
    },
    {
      id: "use",
      title: "Using the site",
      blocks: [
        "Please don’t misuse the site. That means no hacking, scraping or interfering with how it works, and no using it for anything unlawful.",
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers and limits",
      blocks: [
        "We provide the site “as is.” To the extent the law allows, we don’t promise it will always be available or error-free, we aren’t liable for indirect or consequential damages, and our total liability for any claim about a product is limited to what you paid for it. Some places don’t allow these limits, so they may not apply to you.",
      ],
    },
    {
      id: "law",
      title: "Governing law",
      blocks: [
        "These terms are governed by the laws of the State of Idaho. If something goes wrong, please email us first. Most problems can be solved with a quick note.", // CONFIRM governing law
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [
        "We may update these terms from time to time. We’ll post the new version here and update the date at the top. Orders follow the terms in place when you placed them.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      blocks: [`Questions about these terms? Email ${CONTACT_EMAIL}.`],
    },
  ],
};

export const accessibilityCopy: LegalPageCopy = {
  meta: {
    title: "Accessibility",
    description:
      "Our commitment to making Tiffany Wheeler’s bookstore easy to use for everyone, what we’ve done so far, and how to tell us about a problem.",
  },
  title: "Accessibility",
  intro:
    "We want every family to be able to find, learn about and buy our books, including people who use screen readers, keyboards, zoom or other assistive technology.",
  sections: [
    {
      id: "goal",
      title: "Our goal",
      blocks: [
        "We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. It’s a goal we keep working toward, not a promise that every page is perfect.",
      ],
    },
    {
      id: "what-we-do",
      title: "What we’ve done",
      blocks: [
        {
          list: [
            "Pages use clear headings, landmarks and labels, so screen readers can find their way.",
            "Everything works with a keyboard, with a visible outline showing where you are.",
            "Images have text descriptions, and decorative images are hidden from screen readers.",
            "Text and buttons are designed for strong color contrast, and buttons are large enough to tap easily.",
            "You can zoom in as far as you like. We never turn zoom off.",
            "Animations are reduced when your device asks for reduced motion.",
          ],
        },
      ],
    },
    {
      id: "limitations",
      title: "Known limitations",
      blocks: [
        {
          list: [
            "Checkout is provided by Shopify, which runs its own accessibility program.",
            "Our PDF downloads are picture books made for printing and screens, and may not work well with screen readers. If you need the story text in another format, email us.", // CONFIRM offering text versions
            "Some videos don’t have captions yet. We’re adding them.",
          ],
        },
      ],
    },
    {
      id: "feedback",
      title: "Tell us about a problem",
      blocks: [
        `If something on this site is hard to use, please tell us. Email ${CONTACT_EMAIL} with the page and what went wrong, and we’ll help you place your order another way in the meantime. We aim to reply within ${REPLY_TIME}.`, // CONFIRM reply time
      ],
    },
  ],
};

export const legalCopy = {
  eyebrow: "In plain English",
  updatedLabel: "Last updated",
  tocLabel: "On this page",
};
