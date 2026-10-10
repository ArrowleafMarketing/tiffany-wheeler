import "server-only";

import { money, toNumber } from "@/lib/money";
import { GIFT_NOTE_MAX } from "@/lib/store-config";
import { catalog } from "../mock/catalog";
import { publishedReviews } from "../mock/reviews";
import type { CommerceProvider } from "../provider";
import type { Cart, CartDiscount, CartLine, Money, Product, ProductQuery, Variant } from "../types";
import { assertNoUserErrors, storefront } from "./client";

/*
  Shopify provider. The site's editorial content (story, highlights, specs,
  peek-inside pages, FAQs, optimized images) stays in the local catalog; Shopify
  is the source of truth for what makes a sale work: variant ids, prices,
  compare-at prices, availability, the cart and checkout. A product appears on
  the site only while it's active and published to the Headless channel.
  Reviews stay local until Judge.me is connected.
*/

type SMoney = { amount: string; currencyCode: string };
type SVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  requiresShipping: boolean;
  price: SMoney;
  compareAtPrice: SMoney | null;
  selectedOptions: { name: string; value: string }[];
};

const toMoney = (m: SMoney): Money => money(Number(m.amount));

const CATALOG_QUERY = `query Catalog { products(first: 100) { nodes { handle variants(first: 10) { nodes { id title availableForSale requiresShipping price { amount currencyCode } compareAtPrice { amount currencyCode } selectedOptions { name value } } } } } }`;

/** Merges Shopify's commerce data into the local catalog. Products missing from Shopify are left out. */
async function loadCatalog(): Promise<Product[]> {
  const data = await storefront<{ products: { nodes: { handle: string; variants: { nodes: SVariant[] } }[] } }>(CATALOG_QUERY);
  const remote = new Map(data.products.nodes.map((p) => [p.handle, p.variants.nodes]));

  // Local variant id → Shopify variant, so bundle components point at real ids too.
  const idMap = new Map<string, SVariant>();
  for (const product of catalog) {
    const variants = remote.get(product.handle);
    if (!variants) continue;
    product.variants.forEach((v, i) => {
      const match = variants.find((s) => s.title === v.title) ?? variants[i];
      if (match) idMap.set(v.id, match);
    });
  }

  return catalog
    .filter((p) => remote.has(p.handle))
    .map((product) => ({
      ...product,
      variants: product.variants
        .filter((v) => idMap.has(v.id))
        .map((v): Variant => {
          const s = idMap.get(v.id)!;
          return {
            ...v,
            id: s.id,
            availableForSale: s.availableForSale,
            requiresShipping: s.requiresShipping,
            price: toMoney(s.price),
            compareAtPrice: s.compareAtPrice && Number(s.compareAtPrice.amount) > Number(s.price.amount) ? toMoney(s.compareAtPrice) : null,
            components: v.components?.map((c) => ({ ...c, variantId: idMap.get(c.variantId)?.id ?? c.variantId })),
          };
        }),
    }));
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

// ── Cart ─────────────────────────────────────────────────────────────────────

const CART_FIELDS = `fragment CartFields on Cart { id checkoutUrl totalQuantity note attributes { key value } lines(first: 50) { nodes { id quantity attributes { key value } cost { amountPerQuantity { amount currencyCode } compareAtAmountPerQuantity { amount currencyCode } subtotalAmount { amount currencyCode } } discountAllocations(lineLevelOnly: false) { discountedAmount { amount currencyCode } ... on CartAutomaticDiscountAllocation { title } ... on CartCodeDiscountAllocation { code } } merchandise { ... on ProductVariant { id title requiresShipping product { handle title } } } } } }`;

type SCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  note: string | null;
  attributes: { key: string; value: string }[];
  lines: {
    nodes: {
      id: string;
      quantity: number;
      attributes: { key: string; value: string }[];
      cost: { amountPerQuantity: SMoney; compareAtAmountPerQuantity: SMoney | null; subtotalAmount: SMoney };
      discountAllocations: { discountedAmount: SMoney; title?: string; code?: string }[];
      merchandise: { id: string; title: string; requiresShipping: boolean; product: { handle: string; title: string } };
    }[];
  };
};
type Payload = { cart: SCart | null; userErrors: { message: string }[] };

const productByHandle = new Map(catalog.map((p) => [p.handle, p]));

/** Hardcover books in one unit of a line, for the bulk-discount messaging (same rule as the mock). */
function bookCount(handle: string): number {
  const p = productByHandle.get(handle);
  if (!p) return 0;
  if (p.kind === "book") return 1;
  return (p.variants[0]?.components ?? []).reduce((n, c) => (productByHandle.get(c.productHandle)?.kind === "book" ? n + c.quantity : n), 0);
}

function toCart(s: SCart): Cart {
  const discountsByTitle = new Map<string, number>();
  const lines: CartLine[] = s.lines.nodes.map((l) => {
    for (const d of l.discountAllocations) {
      const title = d.title ?? d.code ?? "Discount";
      discountsByTitle.set(title, (discountsByTitle.get(title) ?? 0) + Number(d.discountedAmount.amount));
    }
    const local = productByHandle.get(l.merchandise.product.handle);
    const unit = toMoney(l.cost.amountPerQuantity);
    const compare = l.cost.compareAtAmountPerQuantity;
    return {
      id: l.id,
      quantity: l.quantity,
      variantId: l.merchandise.id,
      productHandle: l.merchandise.product.handle,
      productTitle: local?.title ?? l.merchandise.product.title,
      variantTitle: l.merchandise.title,
      image: local?.images[0],
      requiresShipping: l.merchandise.requiresShipping,
      unitPrice: unit,
      compareAtUnitPrice: compare && Number(compare.amount) > Number(unit.amount) ? toMoney(compare) : null,
      total: toMoney(l.cost.subtotalAmount),
      attributes: l.attributes,
      bookCount: bookCount(l.merchandise.product.handle),
    };
  });
  const linesTotal = lines.reduce((sum, l) => sum + toNumber(l.total), 0);
  const compareTotal = lines.reduce((sum, l) => sum + toNumber(l.compareAtUnitPrice ?? l.unitPrice) * l.quantity, 0);
  const discounts: CartDiscount[] = [...discountsByTitle].map(([title, amount]) => ({ title, amount: money(amount) }));
  const discountTotal = discounts.reduce((sum, d) => sum + toNumber(d.amount), 0);
  return {
    id: s.id,
    checkoutUrl: s.checkoutUrl,
    totalQuantity: s.totalQuantity,
    lines,
    subtotal: money(linesTotal - discountTotal),
    savings: compareTotal - linesTotal > 0.004 ? money(compareTotal - linesTotal) : null,
    discounts,
    note: s.note ?? "",
    attributes: s.attributes,
    requiresShipping: lines.some((l) => l.requiresShipping),
  };
}

async function mutate(name: string, operation: string, variables: Record<string, unknown>): Promise<Cart> {
  const data = await storefront<Record<string, Payload>>(`${CART_FIELDS}\n${operation}`, variables);
  const payload = data[name];
  assertNoUserErrors(payload.userErrors);
  if (!payload.cart) throw new Error("Cart not returned");
  return toCart(payload.cart);
}

export const shopifyProvider: CommerceProvider = {
  async getProduct(handle) {
    return (await loadCatalog()).find((p) => p.handle === handle) ?? null;
  },

  async getProducts(query = {}) {
    const found = (await loadCatalog()).filter((p) => matches(p, query));
    if (!query.handles) return found;
    return query.handles.map((h) => found.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p));
  },

  async getReviews(productHandle) {
    return publishedReviews.filter((r) => r.productHandle === productHandle);
  },

  async getCart(cartId) {
    if (!cartId.startsWith("gid://shopify/Cart/")) return null;
    const data = await storefront<{ cart: SCart | null }>(`${CART_FIELDS}\nquery GetCart($id: ID!) { cart(id: $id) { ...CartFields } }`, { id: cartId });
    return data.cart ? toCart(data.cart) : null;
  },

  async createCart(input = {}) {
    return mutate(
      "cartCreate",
      `mutation Create($input: CartInput!) { cartCreate(input: $input) { cart { ...CartFields } userErrors { field message } } }`,
      { input: { lines: (input.lines ?? []).map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity, attributes: l.attributes })), attributes: input.attributes ?? [] } },
    );
  },

  async addLines(cartId, lines) {
    return mutate(
      "cartLinesAdd",
      `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } } }`,
      { cartId, lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity, attributes: l.attributes })) },
    );
  },

  async updateLines(cartId, updates) {
    const remove = updates.filter((u) => u.quantity <= 0).map((u) => u.id);
    const keep = updates.filter((u) => u.quantity > 0);
    let cart: Cart | null = null;
    if (keep.length) {
      cart = await mutate(
        "cartLinesUpdate",
        `mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } } }`,
        { cartId, lines: keep.map((u) => ({ id: u.id, quantity: u.quantity })) },
      );
    }
    if (remove.length) cart = await shopifyProvider.removeLines(cartId, remove);
    return cart ?? (await shopifyProvider.getCart(cartId))!;
  },

  async removeLines(cartId, lineIds) {
    return mutate(
      "cartLinesRemove",
      `mutation Remove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message } } }`,
      { cartId, lineIds },
    );
  },

  async setNote(cartId, note) {
    return mutate(
      "cartNoteUpdate",
      `mutation Note($cartId: ID!, $note: String!) { cartNoteUpdate(cartId: $cartId, note: $note) { cart { ...CartFields } userErrors { field message } } }`,
      { cartId, note: note.slice(0, GIFT_NOTE_MAX) },
    );
  },

  async setAttributes(cartId, attributes) {
    return mutate(
      "cartAttributesUpdate",
      `mutation Attrs($cartId: ID!, $attributes: [AttributeInput!]!) { cartAttributesUpdate(cartId: $cartId, attributes: $attributes) { cart { ...CartFields } userErrors { field message } } }`,
      { cartId, attributes: attributes.slice(0, 20) },
    );
  },
};
