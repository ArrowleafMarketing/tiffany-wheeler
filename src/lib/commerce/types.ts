// Domain types for the storefront. Shaped after the Shopify Storefront API
// (gid-style ids, Money as decimal strings) so the Shopify provider only has to
// reshape responses, never change these types. UI code imports only from here.

export type CurrencyCode = "USD";

export type Money = { amount: string; currencyCode: CurrencyCode };

export type Image = {
  url: string;
  width: number;
  height: number;
  alt: string;
  /** Tiny base64 placeholder; present for statically imported images. */
  blurDataURL?: string;
};

export type Holiday = "christmas" | "easter";

export type ProductKind =
  | "book" // hardcover picture book
  | "bundle" // fixed bundle of other products
  | "activity" // coloring & activity book, crafts
  | "ornament"
  | "digital" // PDF downloads
  | "gift"; // puzzle, canvas print

export type SelectedOption = { name: string; value: string };

export type Variant = {
  id: string;
  title: string;
  sku?: string;
  availableForSale: boolean;
  requiresShipping: boolean;
  price: Money;
  /** Only set when it is a real, defensible former/separate price. */
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  /** For fixed bundles: the component variants and quantities. */
  components?: { variantId: string; productHandle: string; quantity: number }[];
};

export type ProductOption = { name: string; values: string[] };

export type Spec = { label: string; value: string };

export type Faq = { question: string; answer: string };

export type PeekSpread = {
  image: Image;
  /** Optional single-page crops for narrow screens (left, right). */
  mobilePages?: [Image, Image];
  caption: string;
  /** A short line of the book's own text shown on the spread. */
  quote?: string;
};

export type Rating = {
  value: number;
  count: number;
  source: "site" | "amazon";
  /**
   * Set when the rating belongs to another product (a bundle shows the rating of
   * the book it includes). The UI must name that product next to the stars, and
   * structured data must never claim it for this product.
   */
  borrowedFrom?: string;
};

export type Product = {
  id: string;
  handle: string;
  kind: ProductKind;
  holiday?: Holiday;
  title: string;
  /** Short name for small tiles, the sticky bar and pickers ("Star Ornament"). Falls back to `title`. */
  shortTitle?: string;
  subtitle?: string;
  /** 1–2 sentences for cards. */
  cardBlurb?: string;
  /** 2–3 sentence summary near the buy box. */
  description: string;
  /** Longer story/about section (paragraphs), for the main books. */
  story?: string[];
  highlights: string[];
  perfectFor?: string[];
  specs: Spec[];
  ageRange?: string;
  badge?: string;
  images: Image[];
  peekInside?: PeekSpread[];
  options: ProductOption[];
  variants: Variant[];
  /** Aggregate ratings; one entry per source (site reviews, Amazon). */
  ratings: Rating[];
  faqs?: Faq[];
  /** Handles of products to cross-sell ("pairs well with"). */
  pairsWith: string[];
  /** Terms shown on digital products. */
  usageNote?: string;
  tags: string[];
  seo: { title: string; description: string };
};

export type Review = {
  id: string;
  productHandle: string;
  author: string;
  rating: number;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  body: string;
  verified: boolean;
};

export type Attribute = { key: string; value: string };

export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  image?: Image;
  requiresShipping: boolean;
  unitPrice: Money;
  compareAtUnitPrice: Money | null;
  total: Money;
  attributes: Attribute[];
  /**
   * Hardcover books in one unit of this line, for the bulk discount (a book
   * = 1, the Complete Set = 2, a bundle with one hardcover = 1, everything
   * else = 0). Optional: providers that can't tell leave it out.
   */
  bookCount?: number;
};

/** An automatic cart-level discount (e.g. the 5+ books bulk discount). */
export type CartDiscount = {
  /** Shown as the summary label, e.g. "5+ books: 10% off applied". */
  title: string;
  amount: Money;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  /** What the customer pays before shipping and tax: line totals minus `discounts`. */
  subtotal: Money;
  /** Sum of compare-at prices minus line totals, when any line has a real compare-at (discounts not included). */
  savings: Money | null;
  /** Automatic discounts already taken off `subtotal`. Optional for backward compatibility. */
  discounts?: CartDiscount[];
  note: string;
  attributes: Attribute[];
  requiresShipping: boolean;
};

export type LineInput = {
  variantId: string;
  quantity: number;
  attributes?: Attribute[];
};

export type LineUpdate = { id: string; quantity: number };

export type ProductQuery = {
  kind?: ProductKind | ProductKind[];
  holiday?: Holiday;
  handles?: string[];
};
