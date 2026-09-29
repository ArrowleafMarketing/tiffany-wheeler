import { NextResponse, type NextRequest } from "next/server";
import { CART_COOKIE, CART_COOKIE_OPTIONS, readAttribution, readCartId } from "@/lib/cart/cookies";
import {
  BUY_NOW_ATTRIBUTE,
  CartOpError,
  parseCartOp,
  type CartOp,
  type CartResponse,
  type SwappedLine,
} from "@/lib/cart/ops";
import { commerce, getProducts } from "@/lib/commerce";
import type { Attribute, Cart, CartLine, LineInput, LineUpdate } from "@/lib/commerce/types";

// The cart API. The cart is per visitor, so the client reads it after the
// static shell loads (GET) and changes it with small JSON POSTs, one op each
// (src/lib/cart/ops.ts). This is a Route Handler rather than Server Actions on
// purpose: an action that sets a cookie makes Next re-render the whole current
// page into the response (~50-85 KB per tap), while this returns ~2 KB of cart.

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET() {
  const id = await readCartId();
  const cart = id ? await commerce.getCart(id) : null;
  return NextResponse.json({ cart } satisfies CartResponse, { headers: NO_STORE });
}

export async function POST(request: NextRequest) {
  // CSRF: the cookie is SameSite=Lax, and a JSON body can't come from a
  // cross-site form. Also refuse any other declared origin (the same check
  // Next applies to Server Actions).
  if (!sameOrigin(request)) return fail(403, "Forbidden");
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return fail(415, "Expected JSON");
  }

  let op: CartOp;
  try {
    op = parseCartOp(await request.json());
  } catch (err) {
    return fail(400, err instanceof CartOpError ? err.message : "Invalid body");
  }

  const cartId = await readCartId();
  try {
    const existing = cartId ? await commerce.getCart(cartId) : null;
    const { body, persist } = await run(op, existing);
    const res = NextResponse.json(body, { headers: NO_STORE });
    // Set the cookie on this response only when the cart id changed (the mock
    // encodes the cart in its id; Shopify ids are stable).
    if (persist && persist.id !== cartId) res.cookies.set(CART_COOKIE, persist.id, CART_COOKIE_OPTIONS);
    return res;
  } catch (err) {
    if (err instanceof CartOpError) return fail(err.status, err.message);
    // Provider rejections: unknown or sold-out variant, and so on.
    return fail(422, "The cart couldn’t be updated");
  }
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: NO_STORE });
}

type Result = { body: CartResponse; persist?: Cart };

async function run(op: CartOp, existing: Cart | null): Promise<Result> {
  switch (op.op) {
    case "add": {
      const { cart, swapped } = await addLines(existing, op.lines, op.swap !== false);
      return { body: { cart, swapped }, persist: cart };
    }

    case "update": {
      if (!existing) return { body: { cart: null } };
      const cart =
        op.quantity === 0
          ? await commerce.removeLines(existing.id, [op.lineId])
          : await commerce.updateLines(existing.id, [{ id: op.lineId, quantity: op.quantity }]);
      return { body: { cart }, persist: cart };
    }

    case "replace": {
      // Add the new variant before removing the old line, so a failed add
      // leaves the cart untouched. "Upgrade to the Set" turns a Nephite
      // Christmas line into a Complete Set line (copy deck §4.1).
      if (!existing) throw new CartOpError("No cart", 404);
      const line = existing.lines.find((l) => l.id === op.lineId);
      if (!line) throw new CartOpError("Line not found", 404);
      if (line.variantId === op.variantId) return { body: { cart: existing } };
      const added = await commerce.addLines(existing.id, [{ variantId: op.variantId, quantity: line.quantity }]);
      const cart = await commerce.removeLines(added.id, [op.lineId]);
      return { body: { cart }, persist: cart };
    }

    case "note": {
      if (!existing) return { body: { cart: null } };
      const cart = await commerce.setNote(existing.id, op.note);
      return { body: { cart }, persist: cart };
    }

    case "attributes": {
      if (!existing) return { body: { cart: null } };
      const cart = await commerce.setAttributes(existing.id, mergeAttributes(existing.attributes, op.attributes));
      return { body: { cart }, persist: cart };
    }

    case "checkout": {
      if (!existing || existing.totalQuantity === 0) throw new CartOpError("Cart is empty", 409);
      return { body: { cart: existing, checkoutUrl: existing.checkoutUrl } };
    }

    case "buyNow": {
      // Shopify-style "Buy it now": a new cart with only this item (plus ad
      // attribution), sent straight to checkout. The main cart cookie is not
      // touched, so nothing already in the cart comes along, and it's still
      // there afterwards.
      const cart = await commerce.createCart({
        lines: op.lines,
        attributes: [...(await readAttribution()), { key: BUY_NOW_ATTRIBUTE, value: "true" }],
      });
      return { body: { cart, checkoutUrl: cart.checkoutUrl } };
    }
  }
}

/** Replaces the given keys; an empty value removes the key. Server-written keys ("_utm_source"…) are kept. */
function mergeAttributes(current: Attribute[], changes: Attribute[]): Attribute[] {
  const changed = new Set(changes.map((a) => a.key));
  return [...current.filter((a) => !changed.has(a.key)), ...changes.filter((a) => a.value !== "")];
}

function summary(line: CartLine, quantity: number): SwappedLine {
  return {
    productHandle: line.productHandle,
    productTitle: line.productTitle,
    variantTitle: line.variantTitle,
    unitPrice: line.unitPrice,
    quantity,
  };
}

/**
 * Adds lines to the cart (creating it, with attribution, on the first add).
 *
 * A bundle absorbs the single hardcovers it contains: adding the Complete Set
 * to a cart holding Nephite Christmas replaces that line instead of leaving
 * the shopper with two copies of the same book. That covers every Add button
 * (cards, "Pairs well with", the buy box), not just the drawer's upgrade card.
 * Only hardcover books are absorbed; ornaments and activity books stay.
 */
async function addLines(
  existing: Cart | null,
  input: LineInput[],
  swap: boolean,
): Promise<{ cart: Cart; swapped: SwappedLine[] }> {
  if (!existing) {
    const cart = await commerce.createCart({ lines: input, attributes: await readAttribution() });
    return { cart, swapped: [] };
  }

  const absorbed = swap ? await planSwaps(existing, input) : [];
  let cart = await commerce.addLines(existing.id, input);
  if (absorbed.length > 0) {
    const updates: LineUpdate[] = [];
    const removals: string[] = [];
    for (const { line, quantity } of absorbed) {
      if (line.quantity > quantity) updates.push({ id: line.id, quantity: line.quantity - quantity });
      else removals.push(line.id);
    }
    if (updates.length > 0) cart = await commerce.updateLines(cart.id, updates);
    if (removals.length > 0) cart = await commerce.removeLines(cart.id, removals);
  }
  return { cart, swapped: absorbed.map(({ line, quantity }) => summary(line, quantity)) };
}

async function planSwaps(existing: Cart, input: LineInput[]): Promise<{ line: CartLine; quantity: number }[]> {
  const products = await getProducts();
  const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const inputIds = new Set(input.map((l) => l.variantId));
  const left = new Map(existing.lines.map((l) => [l.id, l.quantity]));
  const plan = new Map<string, { line: CartLine; quantity: number }>();

  for (const add of input) {
    for (const component of byVariant.get(add.variantId)?.variant.components ?? []) {
      // Adding the book itself alongside its bundle is deliberate; leave it.
      if (inputIds.has(component.variantId)) continue;
      if (byHandle.get(component.productHandle)?.kind !== "book") continue;
      const line = existing.lines.find((l) => l.variantId === component.variantId);
      if (!line) continue;
      const take = Math.min(left.get(line.id) ?? 0, component.quantity * add.quantity);
      if (take <= 0) continue;
      left.set(line.id, (left.get(line.id) ?? 0) - take);
      plan.set(line.id, { line, quantity: (plan.get(line.id)?.quantity ?? 0) + take });
    }
  }
  return [...plan.values()];
}
