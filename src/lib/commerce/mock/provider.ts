import "server-only";

import { bulkDiscountAmount, BULK_DISCOUNT_TITLE } from "@/lib/cart/pricing";
import { BUY_NOW_ATTRIBUTE } from "@/lib/cart/ops";
import { money, toNumber } from "@/lib/money";
import { GIFT_NOTE_MAX } from "@/lib/store-config";
import type { CommerceProvider } from "../provider";
import type {
  Attribute,
  Cart,
  CartLine,
  LineInput,
  Product,
  ProductQuery,
  Variant,
} from "../types";
import { catalog } from "./catalog";
import { publishedReviews } from "./reviews";

/*
  Stateless mock cart: the cart id *is* the cart, base64url-encoded, so it
  works on serverless without a database. Every mutation returns a new id and
  the caller rewrites the cookie. The Shopify provider returns stable ids; the
  calling code is identical.
*/

type Encoded = { l: [variantId: string, quantity: number][]; n?: string; a?: Attribute[] };

const PREFIX = "mock:";
const MAX_LINES = 30;
const MAX_QTY = 99;

const variantIndex = new Map<string, { product: Product; variant: Variant }>();
for (const product of catalog) {
  for (const variant of product.variants) variantIndex.set(variant.id, { product, variant });
}

/** Hardcover books in one unit of a variant: books count 1, bundles count the books inside. */
function bookCount(product: Product, variant: Variant): number {
  if (product.kind === "book") return 1;
  return (variant.components ?? []).reduce((n, c) => {
    const inner = variantIndex.get(c.variantId);
    return inner?.product.kind === "book" ? n + c.quantity : n;
  }, 0);
}

function decode(cartId: string): Encoded | null {
  if (!cartId.startsWith(PREFIX)) return null;
  try {
    const raw = JSON.parse(Buffer.from(cartId.slice(PREFIX.length), "base64url").toString("utf8"));
    if (!raw || !Array.isArray(raw.l)) return null;
    const lines = (raw.l as unknown[])
      .filter(
        (x): x is [string, number] =>
          Array.isArray(x) && typeof x[0] === "string" && Number.isInteger(x[1]) && variantIndex.has(x[0]),
      )
      .map(([id, q]) => [id, Math.min(Math.max(q, 1), MAX_QTY)] as [string, number])
      .slice(0, MAX_LINES);
    const note = typeof raw.n === "string" ? raw.n.slice(0, GIFT_NOTE_MAX) : undefined;
    const attrs = Array.isArray(raw.a)
      ? (raw.a as Attribute[])
          .filter((a) => typeof a?.key === "string" && typeof a?.value === "string")
          .slice(0, 20)
      : undefined;
    return { l: lines, n: note, a: attrs };
  } catch {
    return null;
  }
}

function encode(state: Encoded): string {
  return PREFIX + Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
}

function lineId(variantId: string) {
  return `line:${variantId}`;
}

function build(state: Encoded): Cart {
  const lines: CartLine[] = state.l.map(([variantId, quantity]) => {
    const { product, variant } = variantIndex.get(variantId)!;
    const unit = toNumber(variant.price);
    return {
      id: lineId(variantId),
      quantity,
      variantId,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: variant.title,
      image: product.images[0],
      requiresShipping: variant.requiresShipping,
      unitPrice: variant.price,
      compareAtUnitPrice: variant.compareAtPrice,
      total: money(unit * quantity),
      attributes: [],
      bookCount: bookCount(product, variant),
    };
  });
  const linesTotal = lines.reduce((sum, l) => sum + toNumber(l.total), 0);
  const compare = lines.reduce(
    (sum, l) => sum + toNumber(l.compareAtUnitPrice ?? l.unitPrice) * l.quantity,
    0,
  );
  // Stands in for the Shopify automatic discount (5+ books, 10% off).
  const bulk = bulkDiscountAmount(lines);
  const id = encode(state);
  const attributes = state.a ?? [];
  return {
    id,
    // A Buy Now cart isn't in the cart cookie, so its checkout names it (like
    // Shopify's per-cart checkout URLs). The main cart's checkout reads the cookie.
    checkoutUrl: attributes.some((a) => a.key === BUY_NOW_ATTRIBUTE)
      ? `/checkout?cart=${encodeURIComponent(id)}`
      : "/checkout",
    totalQuantity: lines.reduce((n, l) => n + l.quantity, 0),
    lines,
    subtotal: money(linesTotal - bulk),
    savings: compare - linesTotal > 0.004 ? money(compare - linesTotal) : null,
    discounts: bulk > 0 ? [{ title: BULK_DISCOUNT_TITLE, amount: money(bulk) }] : [],
    note: state.n ?? "",
    attributes,
    requiresShipping: lines.some((l) => l.requiresShipping),
  };
}

function assertLines(lines: LineInput[]) {
  for (const line of lines) {
    if (!variantIndex.has(line.variantId)) throw new Error(`Unknown variant: ${line.variantId}`);
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_QTY) {
      throw new Error(`Invalid quantity: ${line.quantity}`);
    }
    if (!variantIndex.get(line.variantId)!.variant.availableForSale) {
      throw new Error(`Variant not available: ${line.variantId}`);
    }
  }
}

function merge(state: Encoded, lines: LineInput[]): Encoded {
  const next = new Map(state.l);
  for (const line of lines) {
    next.set(line.variantId, Math.min((next.get(line.variantId) ?? 0) + line.quantity, MAX_QTY));
  }
  return { ...state, l: [...next.entries()].slice(0, MAX_LINES) };
}

function load(cartId: string): Encoded {
  return decode(cartId) ?? { l: [] };
}

function matches(product: Product, query: ProductQuery): boolean {
  if (query.handles && !query.handles.includes(product.handle)) return false;
  if (query.holiday && product.holiday !== query.holiday) return false;
  if (query.kind) {
    const kinds = Array.isArray(query.kind) ? query.kind : [query.kind];
    if (!kinds.includes(product.kind)) return false;
  }
  return true;
}

export const mockProvider: CommerceProvider = {
  async getProduct(handle) {
    return catalog.find((p) => p.handle === handle) ?? null;
  },

  async getProducts(query = {}) {
    const found = catalog.filter((p) => matches(p, query));
    if (!query.handles) return found;
    // Preserve the caller's requested order.
    return query.handles
      .map((h) => found.find((p) => p.handle === h))
      .filter((p): p is Product => Boolean(p));
  },

  async getReviews(productHandle) {
    return publishedReviews.filter((r) => r.productHandle === productHandle);
  },

  async getCart(cartId) {
    const state = decode(cartId);
    return state ? build(state) : null;
  },

  async createCart(input = {}) {
    const lines = input.lines ?? [];
    assertLines(lines);
    return build(merge({ l: [], a: input.attributes }, lines));
  },

  async addLines(cartId, lines) {
    assertLines(lines);
    return build(merge(load(cartId), lines));
  },

  async updateLines(cartId, updates) {
    const state = load(cartId);
    const next = new Map(state.l);
    for (const { id, quantity } of updates) {
      const variantId = id.replace(/^line:/, "");
      if (!next.has(variantId)) continue;
      if (quantity <= 0) next.delete(variantId);
      else next.set(variantId, Math.min(quantity, MAX_QTY));
    }
    return build({ ...state, l: [...next.entries()] });
  },

  async removeLines(cartId, lineIds) {
    const state = load(cartId);
    const remove = new Set(lineIds.map((id) => id.replace(/^line:/, "")));
    return build({ ...state, l: state.l.filter(([v]) => !remove.has(v)) });
  },

  async setNote(cartId, note) {
    return build({ ...load(cartId), n: note.slice(0, GIFT_NOTE_MAX) });
  },

  async setAttributes(cartId, attributes) {
    return build({ ...load(cartId), a: attributes.slice(0, 20) });
  },
};
