import type {
  Article,
  Attribute,
  Cart,
  LineInput,
  LineUpdate,
  Product,
  ProductQuery,
  Review,
} from "./types";

/**
 * Everything the storefront needs from a commerce backend. The mock provider
 * implements this today; a Shopify Storefront API provider replaces it later
 * (see docs/discovery/shopify-headless.md) without touching UI code.
 *
 * Cart ids are opaque. The mock provider encodes the whole cart in the id, so
 * every mutation may return a new id — callers must persist `cart.id` after
 * each call.
 */
export interface CommerceProvider {
  getProduct(handle: string): Promise<Product | null>;
  getProducts(query?: ProductQuery): Promise<Product[]>;
  getReviews(productHandle: string): Promise<Review[]>;

  /** Published blog posts, newest first, without their bodies. Never throws: no blog = []. */
  getArticles(): Promise<Article[]>;
  /** One post with its body, or null. */
  getArticle(handle: string): Promise<Article | null>;

  getCart(cartId: string): Promise<Cart | null>;
  createCart(input?: { lines?: LineInput[]; attributes?: Attribute[] }): Promise<Cart>;
  addLines(cartId: string, lines: LineInput[]): Promise<Cart>;
  updateLines(cartId: string, lines: LineUpdate[]): Promise<Cart>;
  removeLines(cartId: string, lineIds: string[]): Promise<Cart>;
  setNote(cartId: string, note: string): Promise<Cart>;
  setAttributes(cartId: string, attributes: Attribute[]): Promise<Cart>;
}
