// The cart API contract: what the cart context POSTs to /api/cart and what it
// gets back. Shared by the client (types only) and the Route Handler (which
// validates every body with parseCartOp, since anyone can POST to it).

import type { Attribute, Cart, LineInput, Money } from "@/lib/commerce/types";
import { CLAIMS, GIFT_NOTE_MAX } from "@/lib/store-config";

export type CartOp =
  /** Add lines. A bundle absorbs single hardcovers it contains (see the route), unless `swap` is false. */
  | { op: "add"; lines: LineInput[]; swap?: boolean }
  /** Set a line's quantity; 0 removes it. */
  | { op: "update"; lineId: string; quantity: number }
  /** Swap a line for another variant at the same quantity ("Upgrade to the Set"). */
  | { op: "replace"; lineId: string; variantId: string }
  | { op: "note"; note: string }
  /** Set customer-editable cart attributes; an empty value removes the key. */
  | { op: "attributes"; attributes: Attribute[] }
  /** The main cart's checkout URL. */
  | { op: "checkout" }
  /** "Buy Now": a separate cart holding only these lines. The main cart is untouched. */
  | { op: "buyNow"; lines: LineInput[] };

/** A line that an added bundle replaced ("Swapped Nephite Christmas for the Complete Set"). */
export type SwappedLine = {
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  unitPrice: Money;
  quantity: number;
};

export type CartResponse = {
  cart: Cart | null;
  /** For "checkout" and "buyNow". */
  checkoutUrl?: string;
  /** For "add": lines the new bundle absorbed. */
  swapped?: SwappedLine[];
};

/** Cart attribute keys (they end up on the order). */
export const SIGNED_ATTRIBUTE = "Signed";
export const INSCRIPTION_ATTRIBUTE = "Inscription";
/** Marks a Buy Now cart, so the order shows how it was placed. */
export const BUY_NOW_ATTRIBUTE = "_buy_now";

/** "Sign it to…" length limit. */
export const INSCRIPTION_MAX = 80;

/** Keys shoppers may set. Attribution keys (leading "_") are written by the server only. */
export function editableAttributeKeys(): string[] {
  return CLAIMS.signedCopies ? [SIGNED_ATTRIBUTE, INSCRIPTION_ATTRIBUTE] : [];
}

export class CartOpError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

const MAX_LINES_PER_REQUEST = 10;
const MAX_QUANTITY = 99;

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function id(value: unknown, what: string): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 200) {
    throw new CartOpError(`Invalid ${what}`);
  }
  return value;
}

function quantity(value: unknown, min: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > MAX_QUANTITY) {
    throw new CartOpError("Invalid quantity");
  }
  return value;
}

function lines(value: unknown): LineInput[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_LINES_PER_REQUEST) {
    throw new CartOpError("Invalid cart lines");
  }
  // Line attributes aren't accepted from the client.
  return value.map((line) => {
    if (!isRecord(line)) throw new CartOpError("Invalid cart line");
    return { variantId: id(line.variantId, "variant"), quantity: quantity(line.quantity, 1) };
  });
}

function attributes(value: unknown): Attribute[] {
  const allowed = editableAttributeKeys();
  if (!Array.isArray(value) || value.length === 0 || value.length > allowed.length) {
    throw new CartOpError("Invalid attributes");
  }
  return value.map((attr) => {
    if (!isRecord(attr) || typeof attr.key !== "string" || !allowed.includes(attr.key)) {
      throw new CartOpError("Invalid attribute");
    }
    if (typeof attr.value !== "string") throw new CartOpError("Invalid attribute value");
    const max = attr.key === INSCRIPTION_ATTRIBUTE ? INSCRIPTION_MAX : 20;
    return { key: attr.key, value: attr.value.trim().slice(0, max) };
  });
}

/** Validates a POST body. Throws CartOpError (400) on anything unexpected. */
export function parseCartOp(body: unknown): CartOp {
  if (!isRecord(body)) throw new CartOpError("Invalid body");
  switch (body.op) {
    case "add":
      return { op: "add", lines: lines(body.lines), swap: body.swap !== false };
    case "update":
      return { op: "update", lineId: id(body.lineId, "line"), quantity: quantity(body.quantity, 0) };
    case "replace":
      return { op: "replace", lineId: id(body.lineId, "line"), variantId: id(body.variantId, "variant") };
    case "note":
      if (typeof body.note !== "string") throw new CartOpError("Invalid note");
      return { op: "note", note: body.note.trim().slice(0, GIFT_NOTE_MAX) };
    case "attributes":
      return { op: "attributes", attributes: attributes(body.attributes) };
    case "checkout":
      return { op: "checkout" };
    case "buyNow":
      return { op: "buyNow", lines: lines(body.lines) };
    default:
      throw new CartOpError("Unknown op");
  }
}
