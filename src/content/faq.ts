// Site FAQs (docs/copy-deck.md §2.14, plus the gift question from §3.3). The
// answers are functions of the Season so every date comes from
// src/lib/delivery.ts (via season.christmas / season.easter) and every price,
// rate and threshold from store-config. Nothing here is a literal date or price.
//
// Claims that need Tiffany's sign-off are gated on CLAIMS in store-config, with
// honest fallback copy when a flag is false. Remaining "[CONFIRM]" facts carry
// a `// CONFIRM` comment (copy deck §5).
//
// Each item has a stable `id`. <FaqList> renders it as the anchor `#faq-{id}`
// (e.g. /faq#faq-christmas-deadline).

import type { Faq } from "@/lib/commerce/types";
import { formatDate, type IsoDate } from "@/lib/delivery";
import { formatMoney } from "@/lib/money";
import type { Season } from "@/lib/season";
import {
  BULK_DISCOUNT,
  CLAIMS,
  CONTACT_EMAIL,
  FLAT_RATE_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  HANDLING_TIME,
  SHIPS_FROM,
  TRANSIT_TIME,
} from "@/lib/store-config";

export type FaqId =
  | "ages"
  | "size"
  | "story"
  | "church"
  | "shipping"
  | "christmas-deadline"
  | "gifts"
  | "signed"
  | "guarantee"
  | "bulk"
  | "pdf"
  | "dove"
  | "easter-advent";

/** A FAQ with a stable id (anchor `#faq-{id}`). Assignable to `Faq`. */
export type FaqItem = Faq & { id: FaqId };

const freeShip = formatMoney(FREE_SHIPPING_THRESHOLD, { trim: true }); // "$45"
const flatRate = formatMoney(FLAT_RATE_SHIPPING); // "$5.99"
/** "Tuesday, December 15" */
const day = (iso: IsoDate) => formatDate(iso, { weekday: true });

const sellingChristmas = (season: Season) =>
  season.mode === "christmas" || season.mode === "christmas-last-minute";

/** "Orders of $45 or more ship free to US addresses. Orders under $45 ship for a flat $5.99." */
function shippingCostSentence(): string {
  // CONFIRM free-shipping threshold and scope, and the flat rate (§5, items 2 and 3).
  return CLAIMS.freeShipping
    ? `Orders of ${freeShip} or more ship free to US addresses. Orders under ${freeShip} ship for a flat ${flatRate}.`
    : "Shipping is calculated at checkout.";
}

// ── The questions ───────────────────────────────────────────────────────────

const ages: FaqItem = {
  id: "ages",
  question: "What ages are the books for?",
  answer:
    // Tiffany's wording (Oct 2026).
    "Nephite Christmas is a read-aloud picture book for ages 3–10. The rhyme keeps little ones listening, and older kids can read it on their own. The whole family will enjoy it. Easter Journey is a longer read, best for ages 8–80. It’s great for the whole family, with speaking parts that older kids and grown-ups can take turns reading, reader’s-theater style, if they wish.",
};

const size: FaqItem = {
  id: "size",
  question: "How big are the books, and how many pages?",
  // CONFIRM Nephite Christmas size and page count, Easter Journey page count
  // (§5, items 19–21). The deck leaves the NC page count blank ("with [CONFIRM]
  // pages"), so that clause is left out until Tiffany answers.
  answer:
    "Nephite Christmas is a landscape hardcover with a dust jacket, about 10.75″ × 8.75″. Easter Journey is a 9″ × 11″ hardcover with a dust jacket and 46 pages.",
};

const story: FaqItem = {
  id: "story",
  question: "What’s the story? Is it based on scripture?",
  answer:
    "Yes. Nephite Christmas is inspired by 3 Nephi 1 in the Book of Mormon and Samuel the Lamanite’s prophecy of a night without darkness. The believers watch and pray, Nephi pleads with the Lord, and the Lord answers, “Son, lift up your head, and be of good cheer!” That night, no darkness comes. Easter Journey follows the Gospel accounts of Holy Week and quotes the King James Bible.",
};

const church: FaqItem = {
  id: "church",
  question: "Is this published by The Church of Jesus Christ of Latter-day Saints?",
  answer:
    "No. Nephite Christmas and Easter Journey are independent publications by author Tiffany Wheeler. They are not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints.",
};

function shipping(): FaqItem {
  const pickup = CLAIMS.localPickup ? " Local to Boise? Choose free pickup at checkout." : ""; // CONFIRM (§5, item 9)
  return {
    id: "shipping",
    question: "How much is shipping, and how fast is it?",
    // CONFIRM handling and transit times (§5, item 6).
    answer: `${shippingCostSentence()} We pack every order by hand and ship from ${SHIPS_FROM} in ${HANDLING_TIME}; most packages arrive ${TRANSIT_TIME} later by USPS. Digital downloads arrive by email right away.${pickup}`,
  };
}

/**
 * The Christmas cutoffs from season.christmas: before the standard cutoff,
 * after it (last-minute), or next year's dates out of season. Priority only
 * when CLAIMS.priorityShipping. `withShippingCost` adds the rate sentence
 * (the homepage has no separate shipping question).
 */
function christmasDeadline(season: Season, { withShippingCost = false } = {}): FaqItem {
  const { today } = season;
  const { year, standardOrderBy, priorityOrderBy } = season.christmas;
  const priorityOpenUntil =
    CLAIMS.priorityShipping && priorityOrderBy !== null && today <= priorityOrderBy ? priorityOrderBy : null;
  const pdf = "The PDF editions download instantly, right up to Christmas Eve.";
  const gift = "Sending it as a gift? Add a free gift note in your cart and ship straight to the recipient.";
  const cost = withShippingCost ? ` ${shippingCostSentence()}` : "";

  let answer: string;
  if (today > standardOrderBy) {
    // Dec 16–24: standard shipping no longer makes Christmas. CONFIRM (§5, item 7)
    answer = priorityOpenUntil
      ? `Standard shipping won’t arrive by Christmas now, but Priority shipping at checkout still will if you order by ${day(priorityOpenUntil)}. Or skip shipping: ${pdf}`
      : `The standard-shipping cutoff for Christmas was ${formatDate(standardOrderBy)}, so a hardcover ordered now may not arrive by Christmas. ${pdf}`; // CONFIRM whether Tiffany pauses shipping (§5, item 7)
  } else {
    const when = sellingChristmas(season) || season.mode === "off-season" ? "Order" : `For Christmas ${year}, order`;
    const priority =
      CLAIMS.priorityShipping && priorityOrderBy
        ? ` After that, faster shipping is available at checkout through ${day(priorityOrderBy)}.` // CONFIRM (§5, item 7)
        : "";
    // CONFIRM Christmas cutoff (§5, item 7).
    answer = `${when} by ${day(standardOrderBy)} for Christmas delivery with standard shipping.${priority}${cost} Running late? ${pdf} ${gift}`;
  }
  return { id: "christmas-deadline", question: "When do I need to order for Christmas?", answer };
}

/** Only while signed copies are offered (CLAIMS.signedCopies); the cutoff sentence drops once it passes. */
function signed(season: Season): FaqItem | null {
  const { signedOrderBy } = season.christmas;
  if (!CLAIMS.signedCopies || !signedOrderBy) return null;
  const cutoff =
    season.today <= signedOrderBy ? ` Please order signed copies by ${day(signedOrderBy)} for Christmas delivery.` : "";
  return {
    id: "signed",
    question: "Can I get a signed copy?",
    // CONFIRM signed copies and their cutoff (§5, items 7 and 10).
    answer: `Yes. Check “Have Tiffany sign my books” in your cart. It’s free. To have it signed to someone, add their name in the box that appears.${cutoff}`,
  };
}

/** The 30-day guarantee when confirmed; otherwise the damaged/help answer that is always true. */
function guarantee(): FaqItem {
  if (CLAIMS.moneyBackGuarantee) {
    return {
      id: "guarantee",
      question: "What if we don’t love it?",
      // CONFIRM guarantee terms (§5, item 5). Scope matches /returns.
      answer:
        "Then we’ll make it right. If a book, bundle or gift isn’t a fit for your family, email us within 30 days of delivery for a full refund. If anything arrives damaged, send a photo and we’ll replace it free. Made-to-order prints and digital downloads can’t be returned, but if one arrives flawed or a file won’t open, we’ll fix it.",
    };
  }
  return {
    id: "guarantee",
    question: "What if something’s wrong with my order?",
    answer: `Email ${CONTACT_EMAIL} and we’ll make it right. If anything arrives damaged, send a photo and we’ll replace it free. Digital downloads can’t be returned, but if a file won’t open, we’ll fix it.`,
  };
}

const bulk: FaqItem = {
  id: "bulk",
  question: "Do you offer bulk or ward orders?",
  // CONFIRM bulk discount (§5, item 4) and the contact address (§5, item 32).
  answer: CLAIMS.bulkDiscount
    ? `Yes. Buy ${BULK_DISCOUNT.minBooks} or more hardcovers, mixing titles if you like, and you’ll save ${BULK_DISCOUNT.percent}% on each automatically. The Complete Set counts as two books; PDFs don’t count. It’s a favorite for grandparents, Primary teachers and ward gifts. For large orders, email ${CONTACT_EMAIL}. Stores can apply for wholesale pricing.`
    : `Yes. The books are a favorite for grandparents, Primary teachers and ward gifts. For an order of several copies, or copies going to several homes, email ${CONTACT_EMAIL} and we’ll help. Stores can apply for wholesale pricing.`,
};

const pdf: FaqItem = {
  id: "pdf",
  question: "What’s the difference between the PDF and the hardcover?",
  answer:
    "The hardcover is the keepsake: a dust-jacketed book your family can pull out every year. The PDF is an instant download with two versions, single pages for reading on a tablet and two-page spreads for a TV or projector. It’s perfect for ward parties, Primary lessons or a last-minute Christmas Eve. PDFs are for personal, family and classroom use; please don’t copy or share the files.",
};

const dove: FaqItem = {
  id: "dove",
  question: "How does the hidden dove work?",
  // CONFIRM "every page" (§5, item 23); until then, the deck's fallback.
  answer: `A small dove, a symbol of peace, is tucked into the illustrations ${CLAIMS.doveOnEveryPage ? "on every page" : "throughout the book"}. Kids love hunting for it as you read. The afterword also invites them to count the stars, a symbol of Christ’s light. Want to keep the game going? The Peace Dove Ornament comes with a card for a hide-the-dove tradition on your tree.`,
};

/** Palm Sunday and Easter from season.easter, plus the hardcover order-by while it's open. */
function easterAdvent(season: Season): FaqItem {
  const { year, easter, palmSunday, orderBy } = season.easter;
  const orderLine =
    season.today <= orderBy
      ? ` To have the hardcover by Palm Sunday, order by ${day(orderBy)}.` // CONFIRM Easter cutoff (§5, item 8)
      : season.today < palmSunday
        ? " Starting late? The PDF edition downloads instantly."
        : "";
  return {
    id: "easter-advent",
    question: "How does the Easter Journey 8-day advent work?",
    answer: `At the back of the book is an 8-day reading guide from Palm Sunday to Easter Sunday. Each day, read one part of the story (a fig symbol behind the page number shows where to stop), then talk through a few questions together. Saturday has no reading; it’s a day to remember Christ in the tomb. In ${year}, the journey runs from Palm Sunday, ${formatDate(palmSunday)}, to Easter morning, ${formatDate(easter)}.${orderLine}`,
  };
}

/** Gift-order question from the Complete Set page (§3.3), useful site-wide. */
function gifts(): FaqItem {
  const noPrices = CLAIMS.giftSlipsHidePrices ? " Packing slips never show prices." : ""; // CONFIRM (§5, item 31)
  return {
    id: "gifts",
    question: "Can I send it as a gift?",
    answer: `Of course. Add a free gift note in your cart and enter the recipient’s address at checkout. We’ll tuck your message in the box.${noPrices}`,
  };
}

// ── Lists ───────────────────────────────────────────────────────────────────

const isItem = (item: FaqItem | null): item is FaqItem => item !== null;

/**
 * The six most purchase-relevant questions for the homepage, in season order:
 * what it is and who it's for, the holiday deadline (with shipping cost), the
 * guarantee, the Church question, the dove, and bulk/ward orders.
 */
export function homeFaqs(season: Season): FaqItem[] {
  switch (season.mode) {
    case "after-christmas":
    case "easter":
      return [ages, easterAdvent(season), shipping(), guarantee(), church, bulk];
    case "off-season":
      return [ages, shipping(), guarantee(), church, dove, bulk];
    default:
      return [ages, christmasDeadline(season, { withShippingCost: true }), guarantee(), church, dove, bulk];
  }
}

/** Everything for the /faq page (one FAQPage JSON-LD), the season's holiday first among the date questions. */
export function allFaqs(season: Season): FaqItem[] {
  const easterFirst = season.mode === "after-christmas" || season.mode === "easter";
  const dated = easterFirst
    ? [easterAdvent(season), christmasDeadline(season)]
    : [christmasDeadline(season), easterAdvent(season)];
  return [
    ages,
    size,
    story,
    church,
    shipping(),
    dated[0],
    gifts(),
    signed(season),
    guarantee(),
    bulk,
    pdf,
    dove,
    dated[1],
  ].filter(isItem);
}

/**
 * Specific questions by id, in the order asked (unknown or flagged-off ids are
 * skipped). For product pages, e.g. ["christmas-deadline", "guarantee", "church"].
 */
export function faqsById(season: Season, ids: readonly FaqId[]): FaqItem[] {
  const all = allFaqs(season);
  return ids.flatMap((id) => all.find((item) => item.id === id) ?? []);
}
