# Build conventions

These are the rules for everyone (people and agents) writing code in this repo. Read `docs/design-system.md` for the visuals and `docs/copy-deck.md` for the words.

## Stack facts

- **Framework:** Next.js **16.3.6** App Router, React 19.2, Tailwind v4 (CSS-first `@theme` in `src/app/globals.css`, no tailwind config file). TypeScript strict. `@/*` maps to `src/*`.
- **Docs first.** Before using any Next API, check the bundled docs in `node_modules/next/dist/docs/`. The summary is `docs/discovery/nextjs16-docs.md`, written for 16.2.9. Newer in 16.3: `io()` from `next/cache`, the stable `retry` prop in `error.tsx`, and `partialPrefetching`.
- **`cacheComponents: true`.** Pages are prerendered static shells.
  - Anything that reads `cookies()`, `headers()`, `searchParams`, `new Date()` or `Math.random()` must sit inside `<Suspense>` or a `'use cache'` scope. Otherwise the build fails with a "blocking route" error.
  - Don't read `searchParams` in marketing pages at all; it makes them dynamic.
  - Route segment configs `dynamic`, `revalidate` and `fetchCache` don't exist in this mode.
- **Images:**
  - Use `next/image` through `<Img>` (`src/components/ui/img.tsx`). Always pass `sizes`.
  - `priority` is deprecated.
  - Use `preload` only on the one LCP image. It also sets `fetchPriority="high"`. Use `eager` for other above-the-fold images.
  - The blur placeholder is opt-in (`blur`): hero, gallery primary and large covers only.
  - `quality` must be one of 60, 75, 85 or 90.
- **Params:** `params` is a Promise. Use `PageProps<'/products/[handle]'>`, which is generated globally. Run `npx next typegen` after moving routes.
- **CSS** is inlined in production (`experimental.inlineCss`).

## Routes

- `src/app/layout.tsx` (root): renders `<SkipLink/>` first, then `CartProvider` + `CartDrawerRoot`. It has no header or footer.
- `src/app/(store)/…`: the storefront. Its layout renders the announcement bar, `SiteHeader` and `SiteFooter`. Every page renders its own `<main id="main">`.
- `src/app/(lp)/…`: paid-traffic landing pages. Minimal header (logo not a link, cart kept), a fixed deadline bar, a minimal footer with the Church disclaimer. `noindex`.
- `src/app/not-found.tsx` sits outside both groups and renders its own header and footer.
- Legacy WooCommerce URLs are 301/308-redirected in `next.config.ts`.

## Data

- **Catalog:** Server Components read it through `getProduct()`, `getProducts()` and `getReviews()` from `@/lib/commerce`. These are cached with `'use cache'` and tagged `products`. **Never import `mock/*` from UI code.**
- **Reviews:**
  - `getReviews()` returns published reviews only. Duplicates and pre-purchase notes are excluded for content-neutral reasons; see `mock/reviews.ts`.
  - Ratings are derived from them. Never hardcode a review count; read `product.ratings`.
  - Amazon ratings are not shown anywhere.
- **Types:** everything comes from `@/lib/commerce/types`.
- **Cart:** client components use `useCart()` from `@/components/cart/cart-context`. It reads and mutates the cart through `/api/cart`, a Route Handler that returns cart JSON and sets the cookie. The cart is **not** server-rendered, which keeps every page fully static.
- **Season:** `await getCurrentSeason()` from `@/lib/season`.
  - It uses the short `season` cache profile, is tagged `season`, and a daily cron at `/api/revalidate/season` refreshes it.
  - It gives `mode`, `featured`, `holiday`, `holidayDate`, `orderBy`, and the full `christmas` and `easter` date sets.
- **Dates:** every shipping date comes from `@/lib/delivery`:
  - A business-day calendar that skips weekends and US federal holidays.
  - `estimateDelivery`, `christmasDates`, `easterDates` and the `format*` helpers.
  - Never write a literal date or a "ships Dec 26" string in copy. Interpolate.
- **Claims:** `CLAIMS` in `@/lib/store-config` gates every promise Tiffany hasn't confirmed: guarantee, free shipping, signed copies, pickup, Priority, gift slips, "dove on every page", the Bytheway testimonial and the Bestseller badge.
  - Anything that renders one of these must check its flag and fall back to honest copy.
  - To turn a claim on after written confirmation, flip its flag.
- **Commercial constants** live in `@/lib/store-config`: `FREE_SHIPPING_THRESHOLD`, `FLAT_RATE_SHIPPING`, handling and transit days, `BULK_DISCOUNT`, `CART_MAX_QUANTITY`, `GIFT_NOTE_MAX`, `HANDLES` and `SHIPS_FROM`. Don't hardcode prices or handles in components; read them from products or config.
- **Prices:** `<Price>` always qualifies a compare-at price ("separately"). The only compare-at we have is a sum of separate prices. Never label it "regular" or "sale".
- **Money:** use `formatMoney()`, `toNumber()` and `percentOff()` from `@/lib/money`.
- **Analytics:** use `track()` from `@/lib/analytics`. Fire it from event handlers, never during render. For effects, guard against re-runs: with Cache Components, hidden routes re-show and effects run again.

## Components

- **Server Components by default.** Add `"use client"` only to small interactive islands: add-to-cart, drawer, carousel, accordion, sticky bar, email form.
- **Pass data in.** Client islands receive plain serializable props (for example product, variant ids and prices). They don't fetch the catalog themselves.
- **Sticky bottom bars** set `document.documentElement.dataset.stickyBar = "on"` while visible, so focused elements scroll clear of them (`scroll-padding-bottom`).
- **Folders:** `src/components/{ui,layout,cart,product,home,info,lp}`. Use one component per file, kebab-case filenames and named exports.
- **Copy:** static site copy lives in `src/content/*.ts`, typed and exported. Product copy lives in the catalog.
- **Styling:** Tailwind utilities plus the tokens. No inline hex colors, no CSS modules, no new global CSS unless it's a genuinely reusable `@utility`. Form fields use `border-field`.
- **Icons:** `lucide-react` (v1; verify an icon name exists in `node_modules/lucide-react` before using it).
- **Fonts:**
  - Fraunces is a local, instanced file; see `src/app/fonts/README.md`.
  - Figtree and Caveat come from `next/font/google`. Caveat isn't preloaded.

## Verify before you're done

- **Type-check:** `npx tsc --noEmit -p .`. Filter the output for your own files; other in-progress work may have unrelated errors.
- **Lint:** `npx eslint <your files>`.
- **Build:** `npx next build`. This is safe while `next dev` runs, because dev writes to `.next/dev`.
- **Render:** a dev server runs at http://localhost:3000 (don't start another one). Fetch your route with `curl -s localhost:3000/<route>` and check the HTML. The Next MCP endpoint at `/_next/mcp` reports compilation issues.
- **Screenshots:** use your own headless Chrome profile, not the shared browser pane.
