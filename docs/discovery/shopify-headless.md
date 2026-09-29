# Architecture research: Next.js 16 front end with Shopify commerce (as of 2026-09-22)

Scratch copies of the fetched docs are in `/private/tmp/claude-501/-Users-ryanmata-Desktop-Arrowleaf-Marketing-tiffany-wheeler/86c2c9b5-128c-496e-bb63-b781462a7d36/scratchpad/arch-research/`. No project files were changed.

## 0. Recommendation

**Go with option (a): headless Next.js 16 on Vercel, using the Shopify Storefront API and Shopify's hosted checkout.**

- **Hosting and domains:** The site runs on Vercel (Pro plan). Checkout runs on a subdomain such as `checkout.tiffany-wheeler.com`.
- **Shopify setup:** Basic plan, with the free Headless channel. Keep the Online Store channel installed with a "headless redirect" theme.
- **Bundles:** the Shopify Bundles app, for the "Complete Set".
- **PDFs:** the Shopify Digital Products (Digital Downloads) app.
- **Checkout and purchase tracking:** install the Meta, Google and Klaviyo Shopify apps. Their pixels and server-side events cover checkout and purchase.
- **Site tracking:** we hand-code the Meta Pixel, GA4 and klaviyo.js on the site, behind one `track()` function.

**Why headless is reasonable for this client.** Headless is usually a poor fit for small merchants because of search, filtering, collections, CMS and app-integration cost. This store has about 6–10 retail SKUs and one main ad funnel, so most of that cost disappears. What we gain is:
- full design control, which matters for the mockup;
- static, pre-rendered landing pages, which are very fast for cold Meta traffic;
- easy A/B landing pages;
- a stack the team already uses. The repo is already on `next@16.2.9`; the latest on npm is 16.3.6.

**Headless trade-offs we accept and must plan around:**
1. **No Apple Pay or Google Pay button on the product page.** Shopify staff confirmed this in Sept 2025. Only a Shop Pay button is possible there. Apple Pay and Google Pay still appear at the top of Shopify checkout.
2. **Shopify's own marketplace apps don't load on our pages.** Their pixels run only on Shopify-hosted pages (checkout, thank-you, order status). Our pages need manual tracking code.
3. **Shopify's session and conversion reports may be inaccurate.** Shopify stopped setting the `_shopify_y`/`_shopify_s` cookies on 2026-04-30. For a custom (non-Hydrogen) build, fixing this means running a Storefront API proxy on our own domain, which Shopify says "isn't officially supported". Orders and revenue in Shopify stay accurate. We should rely on GA4 and Meta for the funnel.
4. **More upkeep:** quarterly Storefront API version bumps, Next.js security patches, and tracking changes.

**Choose (c), a native Liquid theme, instead if** the client needs to install apps and edit layouts herself without a developer, or if nobody at Arrowleaf will own the tracking setup. Liquid gives product-page express buttons (Shop Pay, Apple Pay, Google Pay, PayPal) and zero-code Meta and Google tracking across the whole site. Every product, metafield and app decision below carries over to a Liquid theme, so switching later needs no data migration.

**Rule out:**
- (b) Hydrogen. It would mean rewriting the app in React Router 7, and its main advantage (free Oxygen hosting and the built-in analytics proxy) doesn't outweigh leaving Next.js.
- (d) Buy Button / Storefront Web Components as the main build. They're fine for embeds, but they offer no server-side control and make bundles and analytics awkward.

## 1. Facts observed about the current site and catalog

- The live site runs WordPress 7.1.2, WooCommerce 11.1.0 and WPBakery (from meta generator tags). Product URLs look like `/product/<slug>/`.
- The book titles are "**Nephite Christmas**" and "**Easter Journey**". The puzzle is titled "The Promised Messiah – An Easter Journey Puzzle of the Savior".
- Retail catalog, taken from the WooCommerce Store API (`/wp-json/wc/store/v1/products`). Prices are sale / regular.

| Current product | Price (sale / reg) |
|---|---|
| Nephite Christmas (hardcover) | $22.49 / $24.99 |
| Easter Journey (hardcover) | $29.99 |
| Nephite Christmas & Easter Journey Book Bundle | $49.98 / $59.98 |
| Nephite Christmas Bundle (book + coloring book) | $29.68 / $32.98 |
| Nephite Christmas Bundle with Ornament | $32.37 / $35.97 |
| Nephite Christmas Coloring & Activity Book | $7.19 / $7.99 |
| Nephite Christmas Ornament | $2.69 / $2.99 |
| Nephite Christmas Peace Dove Ornament | $2.69 / $2.99 |
| PDFs: Nephite Christmas / Coloring Book / Nativity Craft / Easter Journey | $6.29, $5.39, $2.69, $8.99 |
| Nephite Christmas Digital Bundle (PDF) | $14.37 / $15.97 |
| Easter Journey puzzle (variable, 252 pcs) | $24.73 |
| "He Spoke My Name" 8x10 canvas (variable) | $22.92 |
| Wholesale: Nephite Christmas, Coloring Book, and a reseller-permit form product | $12.50, $4.00 (minimum order 12) |

There is also a "WooCommerce Automated Testing Product" that should not be migrated.

**Pricing issue to raise with the client:** the book bundle shows a regular price of $59.98, but $24.99 + $29.99 = $54.98. Compare-at prices shown in ads and on the site should be defensible, meaning the sum of the individual prices.

## 2. The four options compared

The checkout is the same Shopify checkout in every option, so conversion differences only come from the pages before checkout.

| | (a) Headless Next.js + Storefront API | (b) Hydrogen + Oxygen | (c) Liquid OS 2.0 theme | (d) Buy Button / Storefront Web Components |
|---|---|---|---|---|
| **Pre-checkout conversion features** | Full design and experiment control; we build the cart-drawer upsell. Product page: Add to Cart, Buy Now (straight to checkout), optional Shop Pay button. No Apple/Google Pay on the product page. | Same as (a), plus ready-made cart and analytics components. | Dynamic checkout buttons on the product page (Shop Pay, Apple Pay, Google Pay, PayPal). App blocks for reviews and upsells. | Embedded product cards; `<shopify-cart>` dialog; `buyNow()`. Limited layout control. |
| **Speed** | Best case: pre-rendered pages on Vercel's CDN, served from cache. | Server-rendered at the edge on Oxygen. Very fast. | Good, but depends on the theme and how many app scripts load. | Client-side JavaScript fetch, so product content appears late. Weak for SEO and page load. |
| **Shopify plan** | Basic or higher. The pricing page lists "Build headless storefronts: 1" on Basic, Grow and Advanced, and 25 on Plus. Vercel says Next.js Commerce "does not work with a Shopify Starter plan" because Starter can't install the redirect theme. Starter also can't create collections. | Oxygen is free on Starter, Basic, Grow, Advanced and Plus. | Basic or higher. | Starter ($5) works. |
| **Hosting cost** | Vercel Pro $20/mo; Hobby is "for personal, non-commercial use". | $0 | $0 | $0 (lives on any site) |
| **Analytics** | Hand-code Meta, GA4 and Klaviyo on the site; Shopify app pixels cover checkout. Shopify admin session data needs the unsupported proxy (§8). | Built-in Shopify analytics and consent handling, including the cookie proxy. Third-party pixels still hand-coded. | Meta, Google and Klaviyo apps cover the whole site plus checkout. Zero code. | Unclear whether the components send Shopify analytics (not documented). |
| **Apps (reviews, upsells, email)** | Only apps with a headless API or JavaScript widget (Judge.me, Klaviyo). Theme-block apps don't work. | Same as (a), plus some Hydrogen packages (e.g. Okendo). | Everything. | Minimal. |
| **Maintenance for a small client** | Medium: API version bumps, Next.js upgrades and patches, tracking changes. The client can't change layouts without a developer. | Medium to high, on a different stack. | Low. The client edits in the theme editor. | Low, but a ceiling on what's possible. |

**Background on (d):** the JS Buy SDK was deprecated in January 2025. Existing Buy Button channel embeds keep working through SDK v3.0. Shopify's current embed product is Storefront Web Components: `<script src="https://cdn.shopify.com/storefront/web-components.js">` with `<shopify-store store-domain country language [public-access-token]>`, `<shopify-context type handle>`, `<shopify-data query>`, `<shopify-money>`, `<shopify-media>`, `<shopify-variant-selector>`, `<shopify-list-context>` and `<shopify-cart>` (which has `addLine()`, `showModal()`, a `discountCodes` attribute and an `extension` slot for upsells). They work without a token; a public token is needed only for inventory, metafields and metaobjects. Useful for an embed on a blog or partner site, not as our main storefront.

**Hydrogen status:** `@shopify/hydrogen@2026.4.5` was released 2026-08-14, with `2026.10.0-preview.3` on 2026-09-11. It uses React Router ~7.16. `@shopify/hydrogen-react@2026.4.3` is pinned to Storefront API `2026-04`.

## 3. Domains and data flow for option (a)

```
tiffany-wheeler.com (apex + www)  -> Vercel (Next.js 16)   pages, cart drawer, server actions
checkout.tiffany-wheeler.com       -> Shopify (Online Store channel, PRIMARY domain)
      +- /cart/c/...  checkout, thank-you, order status (Shopify-hosted)
      +- any /products/* or other Online Store URL -> 301 to tiffany-wheeler.com via the headless redirect theme
Next.js server -> https://<store>.myshopify.com/api/2026-07/graphql.json   (Storefront API)
Shopify webhooks -> https://tiffany-wheeler.com/api/webhooks/shopify   (revalidateTag)
```

- **Why the checkout subdomain matters:** Shopify's headless consent guide says to connect the subdomain with Target = Online Store and Domain type = Primary. Checkout is then on the same registrable domain as the site, so cookies set on `.tiffany-wheeler.com` (Meta `_fbp`/`_fbc`, GA4 `_ga`) can be read by the app pixels on checkout. That is what makes ad attribution line up.
- **Redirect theme:** Vercel's guide installs the "Shopify Headless theme" on the Online Store channel. It redirects Shopify-generated storefront links (emails, "continue shopping", `/products/...`) to the headless domain. Don't password-protect the Online Store; the docs note that "Cart permalinks cannot bypass storefront passwords".
- **Branding on Shopify pages:** set logo and colours for checkout, emails and order status in the Shopify admin (checkout editor, Settings > Branding, email settings).
- **SEO migration:** keep product handles the same as the WooCommerce slugs, and add `redirects()` in `next.config.ts` from `/product/:slug/` to `/products/:slug`.

## 4. Storefront API essentials

**Version:** `2026-07` is the latest stable. Supported versions are 2025-10, 2026-01, 2026-04 and 2026-07. `2026-10` is the release candidate and is "not recommended for production". Versions come out quarterly and each is supported for at least 12 months. The endpoint is `POST https://{shop}.myshopify.com/api/2026-07/graphql.json`.

**Authentication:**
- **Tokenless:** covers products, collections, search, pages, blogs, and cart read/write. Query complexity is capped at 1,000.
- **Public token:** header `X-Shopify-Storefront-Access-Token`. Needed for metafields, metaobjects, product tags, menus and customers.
- **Private token (server-side):** header `Shopify-Storefront-Private-Token`. For request-time calls triggered by a shopper, also send `Shopify-Storefront-Buyer-IP: <shopper ip>`. Without it, Shopify warns this "can result in throttled API requests, limited bot protection, and unauthenticated flows at checkout". Static builds don't need the IP header.

**Rate limits:** shopper traffic has no fixed per-minute limit. Bots are limited. Checkout creation is throttled per minute and returns a `200 Throttled` error. Suspicious traffic gets `430 Shopify Security Rejection`.

**Tokens:** create a storefront in Admin > Headless > "Create storefront" to get public and private tokens. There's a limit of 100 active storefront tokens per shop.

**Useful packages:**
- `@shopify/storefront-api-client@2.0.0`: a thin client.
- `@shopify/api-codegen-preset@3.0.0`: generates types from our queries.
- `@shopify/hydrogen-react`: types (`@shopify/hydrogen-react/storefront-api-types`), `sendShopifyAnalytics` and `useShopifyCookies`. It declares `vite` as a required peer dependency, so we'll probably import only types and utilities from it, or skip it.
- The Hydrogen docs also offer a Claude Code plugin for Shopify docs and API context: `claude plugin install shopify-ai-toolkit@claude-plugins-official`.

**Recommended env vars:**
```
COMMERCE_PROVIDER=mock                     # mock | shopify
SHOPIFY_STORE_DOMAIN=<store>.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2026-07
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=...       # server only
NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN=...  # consent API / optional client use
NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN=checkout.tiffany-wheeler.com
SHOPIFY_WEBHOOK_SECRET=...                 # HMAC key (admin-created webhooks: the signing key shown in Settings > Notifications > Webhooks)
NEXT_PUBLIC_SITE_URL=https://tiffany-wheeler.com
NEXT_PUBLIC_META_PIXEL_ID=...   META_CAPI_TOKEN=...
NEXT_PUBLIC_GA4_ID=G-...        NEXT_PUBLIC_KLAVIYO_COMPANY_ID=...
JUDGEME_SHOP_DOMAIN=...         JUDGEME_PUBLIC_TOKEN=...
```

## 5. Cart API, checked against the 2026-07 reference

**Cart ID:** the ID looks like `gid://shopify/Cart/<token>?key=<secret>`. The docs say never to expose the secret, so store the ID in an httpOnly cookie and only use it on the server.

**`CartInput` fields:** `lines`, `attributes` (up to 250), `buyerIdentity`, `discountCodes`, `giftCardCodes`, `note`, `metafields`, `delivery` and `sourceName`. `sourceName` only works for channels you own.

**`CartBuyerIdentityInput` fields:** `email`, `phone`, `countryCode`, `customerAccessToken`, `companyLocationId` and `preferences`. `deliveryAddressPreferences` is deprecated. Preferences only prefill checkout fields; they don't sync back to the cart.

**Changes in 2026-07:**
- `cartLinesRemove` takes `lineIds` or `viewKeys`; the two are mutually exclusive.
- `CartLineInput` now has a `parent` field for nested lines.
- `CartCost.totalTaxAmount` and `totalDutyAmount` are deprecated, so don't query them.

```graphql
fragment Money on MoneyV2 { amount currencyCode }

fragment CartFields on Cart {
  id
  checkoutUrl
  totalQuantity
  note
  attributes { key value }
  discountCodes { code applicable }
  buyerIdentity { email countryCode }
  cost { subtotalAmount { ...Money } totalAmount { ...Money } }
  lines(first: 50) {
    nodes {
      id
      quantity
      attributes { key value }
      cost {
        amountPerQuantity { ...Money }
        compareAtAmountPerQuantity { ...Money }
        totalAmount { ...Money }
      }
      discountAllocations { discountedAmount { ...Money } }
      merchandise {
        ... on ProductVariant {
          id title requiresShipping
          image { url altText width height }
          product { handle title }
        }
      }
      ... on ComponentizableCartLine {       # fixed-bundle parent line
        lineComponents {
          id quantity
          merchandise { ... on ProductVariant { id title product { handle title } } }
        }
      }
    }
  }
}

mutation CartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart { ...CartFields }
    userErrors { field message code }
    warnings { code message target }
  }
}
# variables example (ad landing -> "Get Both Books"):
# { "input": {
#   "lines": [{ "merchandiseId": "gid://shopify/ProductVariant/<bundleVariant>", "quantity": 1 }],
#   "buyerIdentity": { "countryCode": "US" },
#   "discountCodes": ["HOLIDAY10"],
#   "attributes": [{ "key": "utm_source", "value": "facebook" }, { "key": "utm_campaign", "value": "xmas-lp-a" },
#                  { "key": "fbclid", "value": "..." }, { "key": "landing_page", "value": "/lp/christmas" }] } }

mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { ...CartFields } userErrors { field message code } warnings { code message target }
  }
}
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {   # { id, quantity, merchandiseId?, attributes? }
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { ...CartFields } userErrors { field message code } warnings { code message target }
  }
}
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message code } }
}
mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) { cart { ...CartFields } userErrors { field message code } }
}
mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {   # send the full set each time
  cartAttributesUpdate(cartId: $cartId, attributes: $attributes) { cart { ...CartFields } userErrors { field message code } }
}
mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) { cart { ...CartFields } userErrors { field message code } }
}
mutation CartNoteUpdate($cartId: ID!, $note: String!) {          # e.g. gift message
  cartNoteUpdate(cartId: $cartId, note: $note) { cart { ...CartFields } userErrors { field message code } }
}
query Cart($id: ID!) { cart(id: $id) { ...CartFields } }
```

Practical notes:

- **Discounts:**
  - Codes (for example `?discount=` in an ad URL) go through `discountCodes` or `cartDiscountCodesUpdate`. Show `applicable` in the UI.
  - Automatic discounts appear in `discountAllocations` without any code.
- **Cart permalinks** also work for ads that skip the site entirely. Example: `https://checkout.tiffany-wheeler.com/cart/<variantId>:1,<variantId>:1?discount=CODE&access_token=<public token>`. The `access_token` credits the order to the Headless channel.
- **Order attributes:** attributes end up on the order as note attributes, visible in the admin and in order webhooks. That lets UTMs and fbclid be tied to each order in Shopify.
- **`checkoutUrl`:** request it just before redirecting. With the primary-domain setup it looks like `https://checkout.tiffany-wheeler.com/cart/c/<token>`.

## 6. Bundles, compare-at prices, digital downloads and express checkout

**Bundles: use Shopify Bundles (free, first-party) fixed bundles.**
- Eligibility: fixed bundles work on all plans. The help center says "Bundles must use the Online Store or Headless storefronts".
- Limits: up to 30 components, 3 options and 100 variants.
- Incompatible with purchase options (subscriptions and pre-orders), custom products and nested bundles.
- Inventory: the bundle's stock equals the lowest stock among its components.
- Price and discounts: the price lives on the parent variant and is spread across the components. Discounts are calculated on the parent.
- Orders and reports: orders show the component lines, and reports count sales at the component level.
- Publishing note: the "turn on bundle publishing" dev doc applies to sales-channel apps, and "only product fixed bundles" can be published. We'd publish through Shopify's own Headless channel, which the help center says is supported. Test this in a dev store.

**How bundles look in the Storefront API:**
- `ProductVariant.price`, `compareAtPrice`, `requiresComponents`, and `components(first:){ nodes { quantity productVariant { id title product { handle } } } }`.
- Adding the parent variant to the cart creates a `ComponentizableCartLine` with `lineComponents`, which the fragment above handles.
- Strike-through price: set the bundle variant's compare-at price to the sum of the single prices. Render `compareAtPrice` > `price`, and in the cart use `cost.compareAtAmountPerQuantity`.
- Alternative: add both books plus an automatic "buy both" discount. It's simpler for inventory, but then the pre-cart price is hardcoded in our UI and can drift from the discount. **Not recommended.**

**Digital downloads (Shopify "Digital Products" app, free):**
- Files up to 5 GB, no bandwidth limit, and optional download limits.
- Download links are emailed automatically after payment, and it can show downloads on the Thank you and Order status pages.
- It supports "a product with a physical and digital component".
- Mark PDF variants as not requiring shipping; `requiresShipping` is on `ProductVariant`.
- The docs say nothing about headless. **Inference:** delivery is triggered by the order, not the storefront, so it should work with Headless-channel orders. Confirm with a test order.

**Shop Pay and express checkout on the product page:**
- **Shop Pay only.** The `<shop-pay-button>` custom element loads from `https://cdn.shopify.com/shopifycloud/shop-js/v1.0/client.js`, with attributes `store-url`, `variants="<numericId>:<qty>,..."` and `channel="headless"`. It's what `@shopify/hydrogen-react`'s `ShopPayButton` renders, and we can drop it in without the package. It skips our cart, so cart attributes and UTMs aren't passed.
- **Checkout Kit and its accelerated checkouts (Shop Pay and Apple Pay on the product page) are mobile-app SDKs only** (Swift, Android, React Native). They aren't for the web.
- Shopify staff (2025-09-02): "currently there isn't a direct feature for apple pay on the product page through custom storefronts".
- So the product-page plan is: Add to Cart (opens a drawer with the upsell) + "Buy now" (a server action creates the cart and redirects to `checkoutUrl`, where Apple Pay, Google Pay and Shop Pay buttons show at the top of checkout) + optionally `<shop-pay-button>`. A/B test it.
- "Shop Component" / "Shop Pay Commerce Component": as far as I know this is an enterprise product for non-Shopify checkouts. I didn't verify it in this session, and it doesn't apply here.

**Vercel Next.js Commerce template status:**
- `main` is on `next@15.6.0-canary.60`, `react@19.0.0`, with experimental `ppr`, `inlineCss` and `useCache` flags.
- It hardcodes the Storefront API endpoint `/api/2023-01/graphql.json`, a version that is no longer supported.
- A `jude/update-to-16` branch was last touched 2025-10-13 at `16.0.0-canary.3` and was never merged. The last commit on `main` was 2026-06-10.
- **It is not on stable Next 16.** Use it as a reference for its GraphQL fragments, reshape functions, the `revalidate()` webhook topic list and cookie-based `cartId`, but don't fork it.
- Vercel's Feb 2026 guide uses env vars `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` and `SHOPIFY_REVALIDATION_SECRET`, and webhooks on `collections/{create,update,delete}` and `products/{create,update,delete}`. It notes `products/update` "includes ... purchase events for inventory and out-of-stock updates". The template authenticates webhooks with a `?secret=` query string; checking the HMAC is better.

## 7. Caching and revalidation (Next 16 APIs, per the local docs in `node_modules/next/dist/docs`)

- **Setup:**
  - Enable `cacheComponents: true` in `next.config.ts`; this replaces Next 15's experimental PPR flag.
  - `cacheLife` and `cacheTag` are stable now, with no `unstable_` prefix.
  - `revalidateTag` requires a second argument. For webhooks, the docs recommend `revalidateTag(tag, { expire: 0 })`.
  - Server-action-only APIs: `updateTag` and `refresh()`.
  - `cookies()` and `headers()` can't be called inside `'use cache'`; read them outside and pass the values in.
- **Other Next 16 changes that affect us:**
  - `middleware` is now `proxy.ts` (Node.js runtime only).
  - Image defaults changed: `images.qualities` is `[75]` and `minimumCacheTTL` is 4 hours.
  - Add `cdn.shopify.com` to `remotePatterns`. Alternatively, use Shopify's image transforms plus `unoptimized` to avoid paying for Vercel image optimization.

```ts
// src/lib/commerce/shopify/catalog.ts
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
export async function getProduct(handle: string) {
  'use cache';
  cacheTag('products', `product:${handle}`);
  cacheLife('max');                       // until a webhook says otherwise
  const data = await shopifyFetch<{ product: SfProduct | null }>({ query: PRODUCT_QUERY, variables: { handle } });
  return data.product ? reshapeProduct(data.product) : null;
}

// src/app/api/webhooks/shopify/route.ts
import crypto from 'node:crypto';
import { revalidateTag } from 'next/cache';
export async function POST(req: Request) {
  const raw = await req.text();                                   // raw body required for HMAC
  const given = Buffer.from(req.headers.get('x-shopify-hmac-sha256') ?? '', 'base64');
  const calc = crypto.createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!).update(raw, 'utf8').digest();
  if (given.length !== calc.length || !crypto.timingSafeEqual(given, calc)) return new Response('bad hmac', { status: 401 });
  const topic = req.headers.get('x-shopify-topic') ?? '';
  if (topic.startsWith('products/') || topic.startsWith('inventory_levels/')) revalidateTag('products', { expire: 0 });
  if (topic.startsWith('collections/')) revalidateTag('collections', { expire: 0 });
  return new Response('ok');   // always 2xx on valid deliveries; dedupe with X-Shopify-Webhook-Id if needed
}
```

The cart is per-user, so don't cache it. Render it in a `<Suspense>` area that reads `cookies()`. Mutations are server actions that call `refresh()`.

## 8. Analytics and tracking plan (headless)

**Observed facts:**
- The help center says Shopify pixels load on "the Storefront, Checkout, Thank you page, and Order status page". Third-party guides (Littledata, WeltPixel) confirm app and web pixels "do not run on Hydrogen pages", only on Shopify-hosted pages.
- Meta data sharing at the Enhanced or Maximum levels uses the Conversions API "for the purchase event".
- Shopify stopped setting `_shopify_y`/`_shopify_s` on 2026-04-30. For custom headless builds the fix is a Storefront API proxy on our domain, which forwards selected headers and passes `Set-Cookie` back. Hydrogen's version matches `/^\/api\/(unstable|2\d{3}-\d{2})\/graphql\.json$/` and forwards `X-Shopify-UniqueToken` and `X-Shopify-VisitToken`. Pair it with hydrogen-react's `useShopifyCookies({fetchTrackingValues:true})`, `getTrackingValues` and `sendShopifyAnalytics`. Shopify's words: "This configuration isn't officially supported."

| Event | Fired from | Meta | GA4 | Klaviyo |
|---|---|---|---|---|
| PageView / page_view | Our site | `fbq` | gtag or GTM | klaviyo.js "Active on Site" |
| ViewContent / view_item | Product and landing pages | `fbq` + optional server-side event (same `event_id`) | gtag | "Viewed Product" (manual) |
| AddToCart / add_to_cart | Our site (drawer, Buy Now) | `fbq` + server-side event from a server action, deduplicated by `event_id` | gtag | "Added to Cart" (manual) |
| InitiateCheckout, AddPaymentInfo | Shopify checkout | Meta app pixel. **Don't also fire these from our site** or they double-count. | Google & YouTube app | Klaviyo app (Started Checkout) |
| Purchase | Shopify checkout / thank-you | Meta app pixel + server-side Purchase from Shopify | Google & YouTube app | Order sync |

**Cross-domain attribution:** the checkout subdomain lets the checkout pixels read `_fbp`, `_fbc` and `_ga` set on `.tiffany-wheeler.com`. Also save UTMs, fbclid and gclid to cart attributes as a backup record per order.

**Inference to verify before launch:** that the Meta, Google and Klaviyo apps fire on checkout for Headless-channel orders. Check with Meta's Events Manager test events and GA4 DebugView on a test order.

**Consent:**
- For headless, load `https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js`, or the banner bundle `.../privacy-banner/storefront-banner.js`.
- Configure it with `headlessStorefront: true`, `checkoutRootDomain: 'checkout.tiffany-wheeler.com'`, `storefrontRootDomain: 'tiffany-wheeler.com'` and `storefrontAccessToken`.
- For a US-focused store this matters less, but it keeps opt-outs consistent through checkout.

**App compatibility when headless:**
- **Judge.me:** platform-independent JavaScript widgets, or the Widget API `https://judge.me/api/v1/widgets/product_review` (public token; private token server-side only). Review-request emails are triggered by orders, so they still work. I didn't confirm which Judge.me plan is needed.
- **Okendo:** headless only on the Advanced plan or higher. Too much for this client.
- **Klaviyo:** the native integration syncs orders, catalog and subscribers; onsite tracking needs klaviyo.js plus manual events. Forms work.
- **Upsells:**
  - Theme-block apps don't work, so build the cart-drawer upsell ourselves (the $2.99 ornaments and the coloring book are ideal).
  - Checkout UI extensions on the information, shipping and payment steps are Plus-only.
  - Thank-you and order status extensions are allowed on all plans.
  - Post-purchase extensions are in beta: live stores must request access, only one app can use the slot, and it isn't shown for Apple Pay, Google Pay or installment payments.
- **Complementary products:** `productRecommendations(intent: COMPLEMENTARY)` via the Search & Discovery app works headless.

## 9. Recommended Shopify data model

**Products** published to the Headless channel. Keep WooCommerce slugs as handles.

| Handle | Type | Options / variants | Notes |
|---|---|---|---|
| `nephite-christmas` | Book | Format: Hardcover (ships) · PDF Download (`requiresShipping=false`, Digital Downloads file) | Reviews collect on one product. ISBN goes in the variant `barcode` field. |
| `easter-journey` | Book | Format: Hardcover · PDF Download | Same pattern. |
| `nephite-christmas-coloring-activity-book` | Book | Format: Softcover · PDF | Cart upsell. |
| `nephite-christmas-ornament`, `nephite-christmas-peace-dove-ornament` | Gift | single variant | $2.99 add-on upsells. |
| `nephite-christmas-nativity-craft` | Digital | single PDF variant | |
| `easter-journey-puzzle`, `he-spoke-my-name-canvas-print` | Gift | Size | Ask whether these are print-on-demand. |
| `holiday-book-set` | **Fixed bundle** (Bundles app) | Components: both Hardcover variants | Hero "Get Both Books". Compare-at = sum of single prices. |
| `nephite-christmas-bundle`, `nephite-christmas-bundle-with-ornament` | Fixed bundles | book + coloring book (+ ornament) | Could be one bundle product with an option instead. |
| `nephite-christmas-digital-bundle` | Normal product (not a Bundles-app bundle) | one PDF variant with several files | Files attached through the Digital Downloads app. |
| Wholesale items | **Not published to the Headless channel** | | Shopify's B2B features (quantity rules, volume pricing) are Plus-only; open question below. |

**Product metafields.** Create definitions with Storefront access turned on; reading them needs a token.
- `book.subtitle` (single_line_text)
- `book.card_blurb` (multi_line_text)
- `book.age_range` (single_line_text, e.g. "Ages 3–10"), plus optional `book.age_min` / `book.age_max` (number_integer) for JSON-LD
- `book.page_count` (number_integer)
- `book.binding` (single_line_text, e.g. "Hardcover with dust jacket")
- `book.dimensions` (single_line_text, e.g. `10.75″ x 8.75″`)
- `book.peek_inside` (list.file_reference, images)
- `book.highlights` (list.single_line_text, e.g. "Seek-and-find on every page")
- `book.holiday` (single_line_text with choices christmas / easter)
- `book.trailer` (file_reference video or url)
- `merch.badge` (single_line_text)
- If Judge.me syncs Shopify's standard `reviews.rating` / `reviews.rating_count` metafields, use them for stars on cards. Verify this.

**Metaobjects:** `testimonial` (quote, name, location, rating, product ref), `faq_item`, `trust_item` (icon, title, text), and `shipping_cutoff` (date, message, for "Order by Dec 15 for Christmas").

**Collections:** `books`, `christmas`, `easter`, `bundles`, `digital`, `gifts-add-ons`, and a hidden `featured` collection with manual ordering for the homepage.

**Product query:**
```graphql
query Product($handle: String!) @inContext(country: US, language: EN) {
  product(handle: $handle) {
    id handle title description descriptionHtml tags seo { title description }
    featuredImage { url altText width height }
    images(first: 20) { nodes { url altText width height } }
    priceRange { minVariantPrice { ...Money } }
    compareAtPriceRange { minVariantPrice { ...Money } }
    options { name optionValues { name } }
    variants(first: 10) { nodes {
      id title sku barcode availableForSale requiresShipping requiresComponents
      price { ...Money } compareAtPrice { ...Money } selectedOptions { name value }
      components(first: 10) { nodes { quantity productVariant { id title product { handle title } } } }
    } }
    metafields(identifiers: [
      {namespace:"book",key:"subtitle"},{namespace:"book",key:"card_blurb"},{namespace:"book",key:"age_range"},
      {namespace:"book",key:"page_count"},{namespace:"book",key:"binding"},{namespace:"book",key:"highlights"},
      {namespace:"book",key:"holiday"},{namespace:"book",key:"peek_inside"},{namespace:"merch",key:"badge"}
    ]) {
      namespace key type value
      references(first: 12) { nodes { ... on MediaImage { image { url altText width height } } } }
    }
  }
}
```

## 10. Building now with mock data behind an interface

Layout, all server-only except the UI:
```
src/lib/commerce/types.ts        // domain types (Shopify-shaped: gid strings, Money {amount: string, currencyCode})
src/lib/commerce/provider.ts     // CommerceProvider interface
src/lib/commerce/index.ts        // picks provider by COMMERCE_PROVIDER
src/lib/commerce/mock/{data.ts,provider.ts}      // seeded from the live catalog in §1/§9
src/lib/commerce/shopify/{client.ts,fragments.ts,queries.ts,mutations.ts,reshape.ts,provider.ts}
src/app/actions/cart.ts          // server actions: add/update/remove/discount/buyNow
src/app/api/webhooks/shopify/route.ts
src/lib/analytics/track.ts       // track(event, payload) -> console now; Meta/GA4/Klaviyo later
```

```ts
// types.ts
export type Money = { amount: string; currencyCode: 'USD' };
export type Img = { url: string; altText: string | null; width: number; height: number };
export type Variant = { id: string; title: string; sku?: string; barcode?: string; availableForSale: boolean;
  requiresShipping: boolean; price: Money; compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
  components?: { variantId: string; productHandle: string; quantity: number }[] };
export type Product = { id: string; handle: string; title: string; subtitle?: string; cardBlurb?: string;
  descriptionHtml: string; ageRange?: string; pageCount?: number; binding?: string; highlights: string[];
  holiday?: 'christmas' | 'easter'; badge?: string; images: Img[]; peekInside: Img[];
  variants: Variant[]; isBundle: boolean; tags: string[]; seo: { title?: string; description?: string } };
export type CartLine = { id: string; quantity: number; variantId: string; productHandle: string; productTitle: string;
  variantTitle: string; image?: Img; unitPrice: Money; compareAtUnitPrice?: Money; total: Money;
  attributes: { key: string; value: string }[]; components?: { title: string; quantity: number }[] };
export type Cart = { id: string; checkoutUrl: string; totalQuantity: number; lines: CartLine[];
  subtotal: Money; total: Money; discountCodes: { code: string; applicable: boolean }[];
  attributes: { key: string; value: string }[] };
export type LineInput = { variantId: string; quantity: number; attributes?: { key: string; value: string }[] };

// provider.ts
export interface CommerceProvider {
  getProduct(handle: string): Promise<Product | null>;
  getProducts(opts?: { collection?: string }): Promise<Product[]>;
  getRecommendations(productId: string): Promise<Product[]>;
  getCart(cartId: string): Promise<Cart | null>;
  createCart(input: { lines?: LineInput[]; discountCodes?: string[]; attributes?: { key: string; value: string }[];
    buyerIdentity?: { email?: string; countryCode?: 'US' } }): Promise<Cart>;
  addLines(cartId: string, lines: LineInput[]): Promise<Cart>;
  updateLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart>;
  removeLines(cartId: string, lineIds: string[]): Promise<Cart>;
  setDiscountCodes(cartId: string, codes: string[]): Promise<Cart>;
  setAttributes(cartId: string, attrs: { key: string; value: string }[]): Promise<Cart>;
  setBuyerIdentity(cartId: string, identity: { email?: string; countryCode?: 'US' }): Promise<Cart>;
}

// index.ts
import 'server-only';
import { mockProvider } from './mock/provider';
import { shopifyProvider } from './shopify/provider';
export const commerce: CommerceProvider =
  process.env.COMMERCE_PROVIDER === 'shopify' ? shopifyProvider : mockProvider;
```

```ts
// app/actions/cart.ts
'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { refresh } from 'next/cache';
import { commerce } from '@/lib/commerce';
const COOKIE = 'tw_cart';
const opts = { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 24 * 14 };

export async function addToCart(lines: LineInput[]) {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  const attrs = readAttribution(jar);                    // utm_*, fbclid saved by proxy.ts or client on landing
  const cart = id ? await commerce.addLines(id, lines) : await commerce.createCart({ lines, attributes: attrs });
  jar.set(COOKIE, cart.id, opts);
  refresh();
  return cart;
}
export async function buyNow(lines: LineInput[]) {       // straight to Shopify checkout
  const cart = await commerce.createCart({ lines, attributes: readAttribution(await cookies()) });
  redirect(cart.checkoutUrl);
}
```

**Mock provider:**
- **Stateless cart:** make the mock cart ID the encoded lines, e.g. `mock:<base64url JSON>`. Every mutation returns a new ID and the server action rewrites the cookie. No database is needed and it works on serverless. The Shopify provider returns a stable ID, and the same action code works for both.
- **Checkout stand-in:** the mock `checkoutUrl` points to `/checkout/mock`.
- **Placeholder IDs:** use Shopify-style IDs (`gid://shopify/ProductVariant/mock-nephite-hc`) so swapping providers only changes data, not types.
- **Shopify client:** `shopify/client.ts` sends `Shopify-Storefront-Private-Token`. It adds `Shopify-Storefront-Buyer-IP` only on request-time calls, from `x-forwarded-for` or `x-real-ip`, read outside `'use cache'`.
- **Keep all Shopify types inside `reshape.ts`;** the UI imports only `types.ts`.

## 11. Open questions for the client or lead

1. **Wholesale:** Shopify's native B2B needs Plus (from ~$2,300/mo). Options: keep a manual workflow (inquiry form plus Shopify draft orders or invoices), use a wholesale app (most need a Liquid theme), or accept a separate hidden product with the 12-unit minimum enforced only in our UI.
2. **Prices:** confirm clean price points and truthful compare-at prices (bundle regular price of $59.98 vs a $54.98 sum). Are the book-level sale prices permanent?
3. **Product-page express pay:** is Shop Pay only on the product page (Apple Pay available at checkout) acceptable? It's the single biggest conversion argument for Liquid.
4. **Ownership:** who owns the tracking setup (Meta pixel and server-side events, GA4, consent) after launch, and is there a maintenance retainer?
5. **Puzzle and canvas:** in-house stock or print-on-demand? Print-on-demand affects which apps and fulfillment flows are compatible.
6. **Shopify plan:** Basic at $39/mo monthly or $29/mo billed yearly, 2.9% + 30¢ online card rate. Is Shopify Payments available? Without it there's a 2% third-party transaction fee on Basic.
7. **Shipping:** is there a free-shipping threshold (for a cart progress bar), and what are the holiday shipping cutoff dates?
8. **Pre-orders:** will the client ever want pre-orders or subscriptions for new titles? Selling plans are incompatible with Shopify Bundles.

## Sources

- Storefront API reference, auth and rate limits: https://shopify.dev/docs/api/storefront
- API versioning: https://shopify.dev/docs/api/usage/versioning
- Cart guide: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- Cart reference: https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate · .../cartLinesAdd · .../cartLinesRemove · .../input-objects/CartInput · .../CartBuyerIdentityInput · .../objects/Cart · .../objects/CartCost · .../objects/ComponentizableCartLine · .../objects/ProductVariant
- Storefront API getting started and Headless channel: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started · https://shopify.dev/docs/storefronts/headless/bring-your-own-stack · https://shopify.dev/docs/storefronts/headless/getting-started/build-options · https://apps.shopify.com/headless
- Hydrogen and Oxygen plans: https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals · https://shopify.dev/docs/storefronts/headless/hydrogen/getting-started
- Analytics cookie migration: https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/cookies · https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/cookies-custom-setup
- Consent and checkout domain: https://shopify.dev/docs/storefronts/headless/hydrogen/analytics/consent · https://shopify.dev/docs/api/customer-privacy
- Hydrogen proxy source: https://github.com/Shopify/hydrogen/blob/27066a28577484f406222116a959eb463d255685/packages/hydrogen/src/storefront.ts
- ShopPayButton: https://shopify.dev/docs/api/hydrogen-react/latest/components/shoppaybutton
- Storefront Web Components: https://shopify.dev/docs/api/storefront-web-components · https://shopify.dev/docs/api/storefront-web-components/getting-started · https://shopify.dev/docs/api/storefront-web-components/components/shopify-cart
- Checkout Kit and accelerated checkouts: https://shopify.dev/docs/storefronts/mobile/checkout-kit · https://shopify.dev/docs/storefronts/mobile/checkout-kit/accelerated-checkouts-overview
- Apple Pay on headless (Shopify staff): https://community.shopify.dev/t/implementing-apple-pay-on-headless-site/21604/5
- Bundles: https://shopify.dev/docs/apps/build/product-merchandising/bundles · https://shopify.dev/docs/apps/build/product-merchandising/bundles/start-building · https://shopify.dev/docs/apps/build/product-merchandising/bundles/turn-on-publishing · https://help.shopify.com/en/manual/products/bundles/eligibility-and-considerations · https://help.shopify.com/en/manual/products/bundles/shopify-bundles
- Digital downloads: https://help.shopify.com/en/manual/products/digital-service-product/digital-downloads
- Cart permalinks: https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks
- Post-purchase and checkout extensions: https://shopify.dev/docs/apps/build/checkout/product-offers/post-purchase · https://shopify.dev/docs/apps/build/checkout
- Webhook HMAC: https://shopify.dev/docs/apps/build/webhooks/subscribe/https
- Pixels: https://help.shopify.com/en/manual/promoting-marketing/pixels/overview · https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels · https://shopify.dev/docs/api/web-pixels-api
- Meta data sharing: https://help.shopify.com/en/manual/promoting-marketing/analyze-marketing/meta-data-sharing
- Pricing and plans: https://www.shopify.com/pricing · https://help.shopify.com/en/manual/intro-to-shopify/pricing-plans/plans-features/shopify-starter-plan
- JS Buy SDK deprecation: https://shopify.dev/changelog/js-buy-sdk-deprecation-notice
- Vercel: https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel · https://github.com/vercel/commerce (package.json, next.config.ts, lib/constants.ts, lib/shopify/index.ts, branches, PRs) · https://vercel.com/pricing
- Third-party (not official): Judge.me API https://judge.me/help/en/articles/8409180-using-judge-me-api · Okendo headless https://docs.okendo.io/on-site/advanced-widget-installs/installing-widget-plus-on-headless-instances · Klaviyo headless https://developers.klaviyo.com/en/docs/integrate_with_a_shopify_hydrogen_store · Littledata headless https://help.littledata.io/sources/shopify/headless-shopify/working-with-a-headless-shopify-setup · WeltPixel cross-domain https://weltpixel.com/blogs/news/cross-domain-tracking-on-shopify-hydrogen-headless-and-multi-domain-stores
- Next.js 16 local docs: `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`, `02-guides/upgrading/version-16.md`, `03-api-reference/04-functions/revalidateTag.md`, `03-api-reference/01-directives/use-cache.md`
- Current site catalog: https://tiffany-wheeler.com/wp-json/wc/store/v1/products