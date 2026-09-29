import type { Holiday, Image, Money } from "@/lib/commerce/types";

/** A product the drawer can offer, reduced to what the client island needs. */
export type UpsellItem = {
  handle: string;
  title: string;
  /** Short name for small tiles ("Star Ornament"). */
  shortTitle: string;
  variantId: string;
  variantTitle: string;
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
};

/** Serializable catalog + season data, prepared by <CartDrawerRoot>. */
export type CartDrawerData = {
  /** Free-shipping threshold, or null while CLAIMS.freeShipping is off (no bar, no "ships free"). */
  threshold: number | null;
  /** "Dec 15" in christmas mode (before the standard-shipping cutoff), else null. */
  christmasOrderBy: string | null;
  /**
   * After the standard cutoff (christmas-last-minute): "priority" while Priority
   * shipping is offered and still makes it (CLAIMS.priorityShipping), else "late".
   * Null in every other mode.
   */
  christmasLate: "priority" | "late" | null;
  /**
   * The "Have Tiffany sign my books" option, or null when it isn't offered
   * (CLAIMS.signedCopies off, or past the signed-copy order-by date).
   */
  signedCopies: {
    /** "3–4 business days". */
    shipTime: string;
    /** "Dec 11" in christmas mode, else null. */
    orderBy: string | null;
  } | null;
  /** Per product handle: holiday and made-to-order flag. */
  products: Record<string, { holiday?: Holiday; madeToOrder: boolean }>;
  /** Per variant id: the product handles a bundle includes (the set holds both books). */
  includes: Record<string, string[]>;
  completeSet: UpsellItem | null;
  nephiteChristmas: UpsellItem | null;
  easterJourney: UpsellItem | null;
  starOrnament: UpsellItem | null;
  doveOrnament: UpsellItem | null;
  /** The Printed variant. */
  coloringBook: UpsellItem | null;
  puzzle: UpsellItem | null;
  /** Waving Jacob for the empty state (a still frame, ~16 KB). */
  mascot: Image;
};
