// Cart drawer, cart button and mock checkout copy (docs/copy-deck.md §1.3, §4.1,
// §4.2, §4.6, §4.7). Final copy: "[CONFIRM]" tags are stripped from the strings
// and tracked with a `// CONFIRM` comment on the same line (copy deck §5).
// `{token}` values from the deck are function arguments here.

import {
  BULK_DISCOUNT,
  CART_MAX_QUANTITY,
  CLAIMS,
  CONTACT_EMAIL,
  GIFT_NOTE_MAX,
  HANDLING_TIME,
  SHIPS_FROM,
} from "@/lib/store-config";

// The commercial constants live in store-config; re-exported here for older
// imports (e.g. src/content/info.ts). New code imports them from store-config.
export { CART_MAX_QUANTITY, FLAT_RATE_SHIPPING, GIFT_NOTE_MAX } from "@/lib/store-config";

const bulkMin = BULK_DISCOUNT.minBooks;
const bulkPct = BULK_DISCOUNT.percent;

/** "$10 or less away" switches the free-shipping message to the "Almost there" wording (§4.1). */
export const FREE_SHIPPING_NEAR = 10;

export const cartCopy = {
  button: {
    // §1.3 "Open cart, {count} items"
    label: (count: number | null) =>
      count === null ? "Open cart" : `Open cart, ${count} ${count === 1 ? "item" : "items"}`,
  },

  drawer: {
    title: (count: number | null) => (count === null ? "Your Cart" : `Your Cart (${count})`),
    close: "Close cart",
    loading: "Loading…",
    keepShopping: "Keep Shopping",
  },

  line: {
    digital: "Instant download · delivered by email",
    madeToOrder: "Made to order · ships separately", // CONFIRM (§5, item 29)
    remove: "Remove",
    removeLabel: (title: string) => `Remove ${title} from cart`,
    quantityLabel: (title: string) => `Quantity of ${title}`,
    total: (amount: string) => `${amount} total`,
    maxQuantity: `Need more than ${CART_MAX_QUANTITY}? Email us about bulk pricing.`,
    /** One book in the cart: the second-copy nudge under that line (AOV). */
    secondCopy: (price: string, shipsFree: boolean) =>
      `Buying for another family? Add a 2nd copy · +${price}${shipsFree ? " · ships free" : ""}`,
    maxQuantityHref: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Bulk order")}`,
  },

  summary: {
    subtotal: "Subtotal",
    // Adapted from the deck's upsell body ("You save $4.99").
    savings: "You save",
    shippingFree: "Shipping: Free",
    shippingFlat: (flatRate: string, threshold: string) =>
      `Shipping: ${flatRate} flat rate, or free at ${threshold}+`, // CONFIRM (§5, items 2–3)
    /** Shown instead of the two rows above while CLAIMS.freeShipping is off. */
    shippingAtCheckout: "Shipping calculated at checkout",
    taxNote: "Taxes calculated at checkout.",
  },

  bulk: {
    // §4.1 "Bulk nudge (exactly 4 books)", extended to 3 books.
    nudge: (more: number) =>
      `Add ${more === 1 ? "one more book" : `${more} more books`} and save ${bulkPct}% on all ${bulkMin}.`, // CONFIRM (§5, item 4)
  },

  empty: {
    heading: "Your cart is empty",
    body: CLAIMS.freeShipping
      ? "Start a new Christmas tradition with Nephite Christmas, or get both books and ship free."
      : "Start a new Christmas tradition with Nephite Christmas, or get both books in the Complete Set.",
    setButton: (price: string) => `Get Both Books — ${price}`,
    bookButton: "Shop Nephite Christmas",
    mascotAlt: "Jacob, the boy from Nephite Christmas, waving hello",
  },

  freeShipping: {
    far: (remaining: string) => `You’re ${remaining} away from free US shipping.`, // CONFIRM threshold (§5, item 2)
    near: (remaining: string) => `Almost there! Add ${remaining} for free shipping.`,
    reached: "You’ve unlocked free US shipping!",
    digitalOnly: "Digital downloads arrive by email, so there’s nothing to ship.",
    progressLabel: (percent: number) => `Free shipping progress: ${percent} percent`,
    /**
     * Under the "away" message when the add-on tiles can't close the gap: name
     * what does (the set upgrade, a second copy).
     */
    // Kept to one short line; the offers right below name the book and the savings.
    hint: (set: { difference: string } | null, secondCopy: string | null) =>
      set && secondCopy
        ? `The set (+${set.difference}) or a 2nd copy gets you there.`
        : set
          ? `Upgrading to the set (+${set.difference}) gets you there.`
          : secondCopy
            ? `A 2nd copy (+${secondCopy}) gets you there.`
            : null,
  },

  upsells: {
    upgrade: {
      heading: "Complete the set",
      body: (other: string, setPrice: string, savings: string | null, shipsFree: boolean) =>
        `Add ${other} and get both books for ${setPrice}.` +
        (savings ? ` You save ${savings}${shipsFree ? ", and your order ships free." : "."}` : shipsFree ? " Your order ships free." : ""),
      button: (difference: string) => `Upgrade to the Set · +${difference}`,
    },
    ornament: {
      heading: "Add the matching ornament",
      body: "Hide it on the tree and let the kids seek the star, like the wise men of old.",
    },
    coloring: {
      heading: "Keep the story going",
      body: "The Coloring & Activity Book: 13 puzzles and games plus 12 coloring pages.", // CONFIRM print matches PDF (§5, item 27)
    },
    puzzle: {
      heading: "For Easter afternoons",
      body: "The Promised Messiah Puzzle: 252 pieces of Kelley Hicken’s art.",
    },
    hardcover: {
      heading: "Want the hardcover, too?",
      body: `The keepsake edition, packed and shipped from ${SHIPS_FROM}.`,
      button: (price: string) => `Add Hardcover · ${price}`,
    },
    addButton: (price: string) => `Add · ${price}`,
    addLabel: (title: string, price: string) => `Add ${title} to cart, ${price}`,
    tilesHeading: "Make it a tradition",
    /** Short names for the add-on tiles (§2.9 names). */
    shortTitles: {
      "nephite-christmas-ornament": "Star Ornament",
      "nephite-christmas-peace-dove-ornament": "Peace Dove Ornament",
      "nephite-christmas-coloring-activity-book": "Coloring & Activity Book",
      "easter-journey-puzzle": "The Promised Messiah Puzzle",
    } as Record<string, string>,
  },

  giftNote: {
    checkbox: "This is a gift",
    label: "Gift note (free)",
    placeholder:
      "Write your message and we’ll tuck it in the box. For example: Merry Christmas, Emma! Love, Grandma and Grandpa",
    helper: `Up to ${GIFT_NOTE_MAX} characters.${CLAIMS.giftSlipsHidePrices ? " Gift orders never include prices." : ""}`, // CONFIRM (§5, item 31)
    counter: (n: number) => `${n}/${GIFT_NOTE_MAX}`,
  },

  // §4.1 "Signed copies (only if confirmed)". Rendered only while
  // CLAIMS.signedCopies is on, the cart holds a hardcover, and it's on or
  // before the signed-copy order-by date.
  signedCopy: {
    checkbox: "Have Tiffany sign my books (free)", // CONFIRM (§5, item 10)
    label: "Sign it to (optional)",
    placeholder: "For example: The Johnson Family",
    helper: (shipTime: string, orderBy: string | null) =>
      `Signed orders ship in ${shipTime}.${orderBy ? ` Order by ${orderBy} for Christmas.` : ""}`, // CONFIRM (§5, items 7, 10)
    signedValue: "Yes",
  },

  checkout: {
    button: (subtotal: string) => `Checkout · ${subtotal}`,
    loading: "Heading to checkout…",
    reassurance: `Secure checkout · Ships from ${SHIPS_FROM} in ${HANDLING_TIME}${CLAIMS.moneyBackGuarantee ? " · 30-day money-back guarantee" : ""}`, // CONFIRM (§5, items 5–6)
    reassuranceDigital: "Secure checkout · Instant download · delivered by email",
    christmasDelivery: (date: string) => `Order by ${date} for Christmas delivery.`, // CONFIRM (§5, item 7)
    /** After the standard cutoff, for carts with anything that ships (every add button leads here). */
    christmasLate: "Shipped items may not arrive by Christmas.", // CONFIRM whether Tiffany pauses shipping (§5, item 7)
    christmasPriority: "Choose Priority at checkout for Christmas delivery.", // CONFIRM Priority (§5, item 7)
  },

  notices: {
    added: (title: string) => `Added to your cart: ${title}`,
    addedSet: CLAIMS.freeShipping
      ? "Both books are in your cart, and your order ships free." // CONFIRM free-shipping threshold (§5, item 2)
      : "Both books are in your cart.",
    /** Adding a bundle replaced single copies of the books it contains. */
    swapped: (from: string[], to: string) =>
      `Swapped ${from.join(" and ")} for ${to}, so you won’t get two copies.`,
    completeSetName: "the Complete Set",
    secondCopyAdded: "Second copy added.",
    upgraded: (price: string) => `Upgraded! You’re getting both books for ${price}.`,
    addOnAdded: (title: string) => `${title} added.`,
    removed: (title: string) => `${title} removed.`,
    undo: "Undo",
    dismiss: "Dismiss",
  },

  errors: {
    add: "We couldn’t add that to your cart. Please try again.",
    tryAgain: "Try Again",
    generic: "Something went wrong. Please try again.",
    network: "We can’t reach the store right now. Check your connection and try again.",
  },

  // §4.6 Mock checkout page (preview store)
  checkoutPage: {
    metaTitle: "Checkout",
    heading: "Checkout is coming soon",
    notice: "Checkout is coming soon — this preview store isn’t taking payments yet.",
    sub: "Your cart is saved, and nothing has been charged.",
    summaryHeading: "Your order",
    backButton: "Back to the Store",
    questions: `Questions? Email ${CONTACT_EMAIL}`, // CONFIRM (§5, item 32)
    questionsHref: `mailto:${CONTACT_EMAIL}`,
    quantity: (n: number) => `Quantity: ${n}`,
    giftNote: "Gift note",
    signed: "Signed by Tiffany",
    signedTo: (name: string) => `Signed by Tiffany, to ${name}`,
    /** A Buy Now checkout holds only that item. */
    buyNowNote: "Buy Now: just this item. Anything else in your cart is still saved there.",
  },
} as const;

// Cart line variant labels (§4.1: Hardcover · Printed Book · Printable PDF ·
// 14″ × 11″, 252 pieces · 10″ × 8″ canvas). Catalog variant titles that read
// differently in the cart map to the deck's label; everything else shows as is.
const VARIANT_LABELS: Record<string, string> = {
  Printed: "Printed Book",
  "PDF Download": "Printable PDF",
  "PDF download": "Printable PDF",
  "10″ × 8″ horizontal, 0.75″ deep": "10″ × 8″ canvas",
};

/**
 * The variant label shown under a cart line's title, or null when it adds
 * nothing (Shopify's "Default Title", or a label the product title already
 * says, like "Star ornament" on "Nephite Christmas Star Ornament").
 */
export function lineVariantLabel(productTitle: string, variantTitle: string): string | null {
  const title = variantTitle.trim();
  if (!title || /^default( title)?$/i.test(title)) return null;
  const label = VARIANT_LABELS[title] ?? title;
  if (productTitle.toLowerCase().includes(label.toLowerCase())) return null;
  return label;
}
