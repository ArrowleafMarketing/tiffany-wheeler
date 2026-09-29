# Next.js 16.2.9 engineering cheatsheet: Tiffany Wheeler storefront

Scope: a fast marketing and e-commerce site (headless Shopify, paid-ad traffic) built on this repo's exact stack.
Doc paths are relative to `node_modules/next/dist/docs/01-app/`. I abbreviate that root as `D/`.
Labels used below:
- [OBS] I verified this in the docs, the installed `node_modules` source, or the repo files.
- [INF] This is my inference or recommendation. It is not stated in the docs.

Saved copy: /private/tmp/claude-501/-Users-ryanmata-Desktop-Arrowleaf-Marketing-tiffany-wheeler/86c2c9b5-128c-496e-bb63-b781462a7d36/scratchpad/nextjs16-docs/CHEATSHEET.md

---

## 0. Installed environment [OBS]

| Item | Value | Source |
|---|---|---|
| next | 16.2.9 | `node_modules/next/package.json` |
| react / react-dom | 19.2.4 (package.json). The App Router actually runs Next's vendored React `19.3.0-canary-3f0b9e61-20260317`. | `node_modules/next/dist/compiled/react/cjs/react.production.js` (`exports.version`) |
| @types/react | 19.2.17. `Activity` and `useEffectEvent` are in `index.d.ts`. `ViewTransition` types exist only in `@types/react/canary.d.ts`. | node_modules |
| tailwindcss / @tailwindcss/postcss | 4.3.1 / 4.3.1 | node_modules |
| typescript | 5.9.3 (minimum is 5.1.0) | `D/02-guides/upgrading/version-16.md` |
| eslint / eslint-config-next | 9.39.4 / 16.2.9 | node_modules |
| Node (local) | v22.14.0 (minimum is 20.9.0) | `D/02-guides/upgrading/version-16.md` "Node.js runtime and browser support" |
| Browser floor | Chrome/Edge/Firefox 111+, Safari 16.4+ | same |

The Browser floor row matters for ad traffic. iOS Safari older than 16.4 is outside Next 16's supported floor.

- No lockfile exists in any parent directory, so Turbopack root auto-detection uses this project's `package-lock.json`. See `D/03-api-reference/05-config/01-next-config-js/turbopack.md` "Root directory".
- The project uses the `src/` folder:
  - `src/app/*` holds routes.
  - `proxy.ts` and `instrumentation-client.ts` go in `src/`.
  - `.env*` files stay in the project root. See `D/02-guides/environment-variables.md` "Good to know".

## 1. Repo baseline and immediate fixes [OBS]

Files:
- `next.config.ts` is empty (`const nextConfig: NextConfig = {}`).
- `postcss.config.mjs` uses `{ plugins: { "@tailwindcss/postcss": {} } }`.
- `tsconfig.json`:
  - `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `plugins: [{ name: "next" }]`.
  - The path alias is `@/* -> ./src/*`.
  - `include` has `.next/types/**/*.ts` and `.next/dev/types/**/*.ts`. The dev build writes to `.next/dev`.
- `eslint.config.mjs` is flat config: `defineConfig([...nextVitals, ...nextTs, globalIgnores([...])])`. It imports `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- `package.json` scripts:
  - `dev: next dev`
  - `build: next build`
  - `start: next start`
  - `lint: eslint`
  - There are no `--turbopack` flags. Turbopack is the default.
- `src/app/layout.tsx` loads `Geist` and `Geist_Mono` from `next/font/google` as CSS variables (`--font-geist-sans`, `--font-geist-mono`). The metadata is still the placeholder "Create Next App".

Issues to fix when scaffolding:
1. **`src/app/page.tsx` uses `<Image priority />`.** `priority` is deprecated in v16; use `preload`. See §6.
   - Passing both `priority` and `preload` throws: "Only 'preload' should be used". Source: `node_modules/next/dist/shared/lib/get-img-props.js` line ~404.
2. **`src/app/globals.css` has an unlayered `body { font-family: Arial, Helvetica, sans-serif; }`.**
   - Tailwind preflight sets the default font from `--default-font-family: --theme(--font-sans, …)` (`node_modules/tailwindcss/theme.css` line 494).
   - The unlayered `body` rule beats layered base styles, so body text renders in Arial, not the `next/font` family.
   - Fix: delete that rule, or put `font-sans` on `<body>`.
3. `globals.css` auto-switches to dark mode through `@media (prefers-color-scheme: dark)`. Decide whether a children's-book storefront should do this. [INF: probably remove it.]
4. **`.gitignore` has `.env*`.** That also ignores `.env.example`. Add `!.env.example` if you want to commit one.
5. The `.gitignore` excludes heavy media under `/assets/media-library/*.{pdf,mov,m4v,mp4}`.
   - Images you use on the site should be static-imported: from `src/…`, from `assets/…` (inside the Turbopack root), or from `public/`.
   - Static imports get automatic width, height and blurDataURL, plus `Cache-Control: public, max-age=31536000, immutable`.
   - Sources: `D/01-getting-started/12-images.md`, `D/03-api-reference/05-config/01-next-config-js/headers.md` "Cache-Control".

## 2. Breaking changes vs Next 14/15 (quick list)

Primary source: `D/02-guides/upgrading/version-16.md`.

**Removed or breaking:**
- **Sync request APIs are removed.**
  - Affected: `cookies()`, `headers()` and `draftMode()`, plus `params` in `layout`, `page`, `route`, `default`, `opengraph-image`, `twitter-image`, `icon` and `apple-icon`.
  - Also affected: `searchParams` in `page`.
  - All of these must be awaited or `use()`'d.
- **Image-generation props are Promises.**
  - `opengraph-image`, `twitter-image`, `icon` and `apple-icon` default exports get `params` and `id` as Promises: `const { slug } = await params; const imageId = await id`.
  - `generateImageMetadata` still gets synchronous `params`.
- **The `sitemap({ id })` argument is `Promise<string>`** when you use `generateSitemaps`.
- **`next lint` is removed.**
  - `next build` no longer lints.
  - The `eslint` key in next.config is removed.
  - Also in `D/03-api-reference/05-config/03-eslint.md`.
- **Removed features:** AMP, `serverRuntimeConfig`/`publicRuntimeConfig`, and `unstable_rootParams`.
- **Removed `devIndicators` options:** `appIsrStatus`, `buildActivity` and `buildActivityPosition`.
- **Experimental flags are replaced.** `experimental.ppr`, the `experimental_ppr` segment export, `experimental.dynamicIO` and `experimental.useCache` are replaced by top-level `cacheComponents: true`.
- **Parallel-route slots need an explicit `default.js`**, or the build fails.
- **`next/image` defaults changed:**
  - `qualities` is `[75]`.
  - `minimumCacheTTL` is 14400 (4 hours).
  - `imageSizes` drops `16`.
  - `maximumRedirects` is 3.
  - `dangerouslyAllowLocalIP` is false.
  - Local `src` with a query string needs `images.localPatterns[].search`.
- **Scroll behavior.** Next no longer overrides `scroll-behavior: smooth` during navigation. To get the old behavior, add `<html data-scroll-behavior="smooth">`.
- **Build output.** `next build` no longer prints `size` or `First Load JS`. Use Lighthouse, or `next experimental-analyze`.
- **Config loading.** During `next dev` the config is loaded once, so `process.argv.includes('dev')` is false in next.config. Use `process.env.NODE_ENV` or `phase`.

**Renamed or deprecated:**
- **`middleware.ts` is now `proxy.ts`.**
  - The function is `export function proxy(request)`.
  - `skipMiddlewareUrlNormalize` becomes `skipProxyUrlNormalize`.
  - Proxy is Node.js runtime only and cannot be configured. Keep deprecated `middleware` only if you need edge.
  - Details in §5.
- **`revalidateTag(tag)` with one argument is deprecated** (TS error). Use `revalidateTag(tag, 'max')`. Details in §3.
- **Prefixes dropped:** `unstable_cacheLife` and `unstable_cacheTag` are now `cacheLife` and `cacheTag` from `next/cache`.
- **Image APIs:** `next/legacy/image` and `images.domains` are deprecated. Use `next/image` and `remotePatterns`.
- **Moved to top level:**
  - `experimental.turbopack` becomes top-level `turbopack`.
  - `experimental.typedRoutes` becomes top-level `typedRoutes`, per `D/03-api-reference/05-config/01-next-config-js/typedRoutes.md`.
  - `experimental.adapterPath` becomes top-level `adapterPath` (16.2.0).

**New defaults and features:**
- Turbopack is the default for `next dev` and `next build`.
  - Opt out with `--webpack`.
  - A custom `webpack` config makes `next build` fail unless you pass `--webpack`, or `--turbopack` to ignore it.
- `next dev` writes to `.next/dev`, so `dev` and `build` can run concurrently. A lockfile prevents two `next dev` instances.
- Routing is overhauled: layout deduplication and incremental prefetching. There may be more prefetch requests, but they are smaller.
- `reactCompiler: true` is stable. It is off by default and needs `babel-plugin-react-compiler`.
- New cache APIs: `updateTag` and `refresh` (both Server-Actions-only).

**Codemod:** `npx @next/codemod@canary upgrade latest`. Individual codemods are listed in `D/02-guides/upgrading/codemods.md` under "16.0":
- `remove-experimental-ppr`
- `remove-unstable-prefix`
- `middleware-to-proxy`
- `next-lint-to-eslint-cli`

**Carried over from v15** (still true):
- `fetch` is not cached by default ("auto no cache"). Source: `D/03-api-reference/04-functions/fetch.md`.
- `GET` Route Handlers are dynamic by default. Source: `D/03-api-reference/03-file-conventions/route.md` Version History.
- The client router `staleTimes.dynamic` default is 0s. Source: `D/03-api-reference/05-config/01-next-config-js/staleTimes.md`.

## 3. Caching model

There are two mutually exclusive modes. The switch is `cacheComponents` in next.config, which defaults to `false` (`dist/server/config-shared.d.ts` `defaultConfig`).

### 3a. Cache Components mode (`cacheComponents: true`)

Sources:
- `D/01-getting-started/08-caching.md`
- `D/01-getting-started/09-revalidating.md`
- `D/03-api-reference/05-config/01-next-config-js/cacheComponents.md`
- `D/03-api-reference/01-directives/use-cache.md`

**Mental model:**
- Data access is dynamic by default.
- You opt in to caching with the `'use cache'` directive. It works at file level (all exports must be async), component level, or function level.
- At build time Next prerenders a **static shell**. This is Partial Prerendering (PPR), and it is the default in this mode.
- Anything uncached or runtime-dependent must be either:
  - cached with `'use cache'`, or
  - wrapped in `<Suspense fallback>`, which puts the fallback in the shell and streams the content later.
- Otherwise dev and build error with "Uncached data was accessed outside of <Suspense>" (docs/messages/blocking-route).
- Runtime APIs (`cookies()`, `headers()`, `searchParams`, and `params` without `generateStaticParams`) must be read inside `<Suspense>`.
- Non-deterministic calls (`Math.random()`, `Date.now()`, `crypto.randomUUID()`) need one of:
  - `await connection()` (from `next/server`) plus Suspense, or
  - a `'use cache'` wrapper.
- Synchronous I/O, module imports and pure computation are prerendered automatically.

**Cache keys** are built from the build ID, the function ID, the serialized args or props, and closed-over variables. Closures are captured automatically.

**Serialization rules:**
- Args must be RSC-serializable: primitives, plain objects, arrays, Date, Map, Set and typed arrays.
- JSX and functions are allowed only as pass-through (for example `children`, or a Server Action prop you don't call).
- Class instances, URL instances and Symbols are not allowed.

**Restrictions inside `'use cache'`:**
- `cookies()`, `headers()` and `searchParams` cannot be called. Read them outside and pass the values in as arguments.
- `draftMode().isEnabled` is allowed.
- `React.cache` is isolated inside `use cache` scopes.

**Build-hang pitfalls:**
- Passing a Promise of runtime data, such as an un-awaited `cookies()`, into a `'use cache'` function times out the build after 50 seconds.
- The error reads: "Filling a cache during prerender timed out…".

**Storage:**
- `'use cache'` entries live in an in-memory LRU on the server.
- On **serverless platforms** (for example Vercel) entries typically don't persist across requests. Build-time caching works normally.
- `'use cache: remote'` is a durable, platform-backed cache that carries platform fees. See `D/03-api-reference/01-directives/use-cache-remote.md`.
- `'use cache: private'` is experimental and meant for compliance cases.
- Debug with `NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev`.

**`cacheLife(profile | {stale, revalidate, expire})`** (`D/03-api-reference/04-functions/cacheLife.md`):
- It must be called inside a `'use cache'` scope and throws at module scope.
- Use one call per invocation.
- **Presets.** These values are verified against the runtime `dist/server/config-shared.js`. The table in `09-revalidating.md` differs for `seconds.stale` and `max.expire`; trust this one.

| profile | stale | revalidate | expire |
|---|---|---|---|
| `default` (implicit) | 5m (client) | 15m | never |
| `seconds` | 30s | 1s | 1m |
| `minutes` | 5m | 1m | 1h |
| `hours` | 5m | 1h | 1d |
| `days` | 5m | 1d | 1w |
| `weeks` | 5m | 1w | 30d |
| `max` | 5m | 30d | 1y |

- **Custom profiles** go in next.config `cacheLife: { name: { stale, revalidate, expire } }`. Omitted fields inherit from `default`. `expire` must be greater than `revalidate`.
- **Short-lived caches become dynamic holes.** This applies to `seconds`, `revalidate: 0`, or `expire` under 5 minutes. They are excluded from the prerender and need Suspense.
- **The client router enforces a minimum 30s `stale`.** The server sends it via the `x-nextjs-stale-time` header. Any revalidation call from a Server Action clears the whole client cache.

**`cacheTag(...tags)`** (`D/03-api-reference/04-functions/cacheTag.md`):
- Call it inside `'use cache'`.
- Up to 128 tags per call, 256 characters each. Tags are case-sensitive.
- Tags can be computed from fetched data, for example `cacheTag('product', data.id)`.

**Invalidation** (all imported from `next/cache`):

| API | Where it can be called | Semantics | Source |
|---|---|---|---|
| `revalidateTag(tag, profile)` | Server Functions and Route Handlers. Not in Client Components or Proxy. | With `'max'` (recommended), marks stale and serves stale-while-revalidate on the next visit. With `{ expire: 0 }`, expires immediately; use this for webhooks. The one-argument form is deprecated. | `D/03-api-reference/04-functions/revalidateTag.md` |
| `updateTag(tag)` | **Server Actions only**. Throws in Route Handlers. | Read-your-own-writes: expires now, and the next request blocks for fresh data. | `D/03-api-reference/04-functions/updateTag.md` |
| `revalidatePath(path)` | Server Functions and Route Handlers | Invalidates everything for a path. Prefer tags. | `D/03-api-reference/04-functions/revalidatePath.md` |
| `refresh()` | **Server Actions only** | Refreshes the client router. Does **not** revalidate tags. | `D/03-api-reference/04-functions/refresh.md` |

**Route segment config under Cache Components:**
- `dynamic`, `revalidate`, `fetchCache` and `dynamicParams` are removed.
- `runtime = 'edge'` is not supported.
- Remaining options: `runtime` (nodejs), `preferredRegion` and `maxDuration`.
- Sources: `D/03-api-reference/03-file-conventions/02-route-segment-config/index.md` and `D/02-guides/migrating-to-cache-components.md`.
- Migration mapping:
  - `force-dynamic`: delete it.
  - `force-static`: use `'use cache'` with `cacheLife('max')`.
  - `revalidate = N`: use `cacheLife(...)`.
  - `fetchCache`: not needed.

**Dynamic routes** (`D/03-api-reference/03-file-conventions/dynamic-routes.md` "With Cache Components", `D/03-api-reference/04-functions/generate-static-params.md`):
- **Without `generateStaticParams`**, `params` is runtime data. Read it inside Suspense, for example `{params.then(({slug}) => <X slug={slug}/>)}`.
- **With `generateStaticParams`:**
  - It must return **at least one** entry. An empty array is a build error.
  - The build validates the sample params.
  - Pages rendered for other params are saved to disk after the first request.

**Metadata under Cache Components** (`D/03-api-reference/04-functions/generate-metadata.md` "With Cache Components"):
- If `generateMetadata` touches runtime or uncached data while the rest of the page is fully prerenderable, Next raises an error.
- Fix it one of two ways:
  - put `'use cache'` inside `generateMetadata`, or
  - add a `<Suspense><Connection/></Suspense>` "DynamicMarker", where `Connection` calls `await connection()`.

**GET Route Handlers under Cache Components** follow the page model. They are prerendered when they don't touch uncached or runtime data, and reading `request.*`, `headers()` or `connection()` stops the prerender. You cannot put `'use cache'` directly in the handler body; extract it into a helper. Source: `D/01-getting-started/15-route-handlers.md` "With Cache Components".

**Navigation with Activity:**
- With `cacheComponents`, routes you navigate away from are kept in `<Activity mode="hidden">` instead of being unmounted.
- State, form inputs and `useActionState` results persist across back and forth navigation.
- Effects clean up on hide and **re-run on re-show**.
- `<video>` keeps playing unless you pause it in `useLayoutEffect` cleanup.
- Hidden DOM stays in the document, which affects e2e selectors.
- Sources: `D/03-api-reference/05-config/01-next-config-js/cacheComponents.md`, `D/02-guides/preserving-ui-state.md`.

**Instant-navigation validation** (draft docs; verified present in 16.2.9 source `dist/server/app-render/dynamic-rendering.js`):
- Enable it with `export const unstable_instant = { prefetch: 'static' }` in a page or layout. It requires `cacheComponents` and does not work in Client Components.
- Opt a segment out with `export const unstable_instant = false`.
- The DevTools toggle is `experimental.instantNavigationDevToolsToggle: true`.
- For e2e tests there is `import { instant } from '@next/playwright'`.
- Sources: `D/02-guides/instant-navigation.md`, `D/03-api-reference/03-file-conventions/02-route-segment-config/instant.md`.

### 3b. Previous model (`cacheComponents` off, the current repo default)

Source: `D/02-guides/caching-without-cache-components.md`.
- `fetch` is not cached by default. Opt in per call:
  - `fetch(url, { cache: 'force-cache' })`
  - `fetch(url, { next: { revalidate: 3600, tags: ['products'] } })`
  - `cache: 'no-store'` forces fresh data.
  - Conflicting options are ignored with a warning.
  - Source: `D/03-api-reference/04-functions/fetch.md`.
- For non-fetch functions, use `unstable_cache(fn, keyParts, { tags, revalidate })`.
- Segment config works in this mode:
  - `export const dynamic = 'auto'|'force-dynamic'|'error'|'force-static'`
  - `revalidate = false|0|N` (the value must be a static literal)
  - `fetchCache`
- Use `React.cache` for per-render deduplication of non-fetch calls.
- GET `fetch` with the same URL and options is memoized per render pass. Opt out with an `AbortController` signal. Memoization does not apply in Route Handlers.

### 3c. Recommendation for this site [INF]

**Enable `cacheComponents: true`.** It gives the fastest ad-landing TTFB and LCP, because the whole landing page becomes a CDN-served static shell. The pattern is `D/02-guides/public-static-pages.md`. The pieces:

- **Catalog data** (2 books plus a bundle, via Shopify Storefront API GraphQL POST):
  - Wrap it in `'use cache'` helpers with `cacheLife('hours')` or `'max'` and `cacheTag('products')` / `cacheTag(\`product-${handle}\`)`.
  - The cache key is the function args, so POST GraphQL is fine inside `'use cache'`. [INF: the docs do not cover POST-fetch caching in the previous model; avoid relying on it.]
- **Cart badge and cart drawer contents:**
  - They read the `cartId` cookie, so render them inside `<Suspense>` in the header.
  - The rest of the page stays in the static shell.
- **Product pages `/books/[handle]`:** use `generateStaticParams` to return both handles. This gives full prerender plus build validation.
- **Shopify webhook to Route Handler:** call `revalidateTag('products', 'max')`, or `revalidateTag('products', { expire: 0 })` when you need an immediate price or stock change.
- **Cart mutations:**
  - Use Server Actions.
  - Call `updateTag('cart')` if the cart read is cached per cartId. Otherwise `refresh()`.
- **UTM, fbclid and offer-code capture:** avoid `searchParams` in the page, because it forces dynamic rendering. Read them either:
  - client-side in `src/instrumentation-client.ts` (`window.location.search`), or
  - in a small `'use client'` component using `useSearchParams()` inside `<Suspense>`. On a prerendered route, `useSearchParams` makes the client tree up to the nearest Suspense client-render. Source: `D/03-api-reference/04-functions/use-search-params.md` "Prerendering".

## 4. Request-time APIs and typing [OBS]

- **Async signatures:**
  - `const cookieStore = await cookies()` (from `next/headers`)
  - `await headers()`
  - `await draftMode()`
  - `const { slug } = await params`
  - `const q = await searchParams`
  - Source: `D/03-api-reference/04-functions/cookies.md`.
- **Global type helpers** are generated by `next dev`, `next build` or `next typegen`, and need no import:
  - `PageProps<'/books/[handle]'>`
  - `LayoutProps<'/route'>` (includes typed parallel-route slots)
  - `RouteContext<'/api/x/[id]'>` (for Route Handler `ctx.params`)
  - Sources: `D/03-api-reference/03-file-conventions/page.md` "Page Props Helper", `layout.md` "Layout Props Helper", `D/01-getting-started/15-route-handlers.md` "Route Context Helper".
  - In CI, run `next typegen && tsc --noEmit`. Source: `D/03-api-reference/06-cli/next.md`.
- **Cookie writes** (`.set` and `.delete`) work only in Server Functions or Route Handlers, never during Server Component render.
  - Setting a cookie inside a Server Action re-renders the current page and layouts in the same round trip.
  - Options: `name`, `value`, `expires`, `maxAge`, `domain`, `path` (default `/`), `secure`, `httpOnly`, `sameSite`, `priority`, `partitioned`.
- **`connection()`** from `next/server` replaces `unstable_noStore`. It defers rendering to request time. Source: `D/03-api-reference/04-functions/connection.md`.
- **`after(cb)`** from `next/server` runs work after the response.
  - It is not a request-time API.
  - In Server Components, read `cookies()` and `headers()` before calling `after`.
  - In Route Handlers and Server Actions, you can read them inside the callback.
  - Use it for server-side conversion events, for example Meta CAPI. Source: `D/03-api-reference/04-functions/after.md`.

## 5. Proxy (formerly Middleware) [OBS]

Sources: `D/01-getting-started/16-proxy.md`, `D/03-api-reference/03-file-conventions/proxy.md`.
- **File:** `src/proxy.ts`, because the project uses `src`. Only one proxy file is allowed.
- **Export:** `export function proxy(request: NextRequest) { … }`, or a default export. Add `export const config = { matcher: '/path/:path*' }`.
- **Runtime:** Node.js only. Setting `runtime` throws.
- **Caching:** fetch caching options have no effect in Proxy.
- **Use it for:** A/B rewrites, geo or header redirects, and header manipulation.
  - Prefer `next.config` `redirects()` for static redirects, such as old WooCommerce URLs.
  - Proxy is not for slow data fetching or full auth.
- **Migration:** `npx @next/codemod@canary middleware-to-proxy .`

## 6. next/image [OBS]

Sources: `D/01-getting-started/12-images.md`, `D/03-api-reference/02-components/image.md`, `D/03-api-reference/05-config/01-next-config-js/images.md`, and runtime defaults in `dist/shared/lib/image-config.js`.

**Props:**
- `src` and `alt` are required.
- Sizing: `width`/`height` or `fill` (the parent needs `position: relative|fixed|absolute`), plus `sizes`.
- Other props: `quality`, `preload`, `loading`, `placeholder`, `blurDataURL`, `unoptimized`, `overrideSrc`, `decoding` (default `async`), `onLoad`, `onError`, `loader` and `style`.
- `onLoad`, `onError` and `loader` need a Client Component.
- `onLoadingComplete` is deprecated; use `onLoad`.

**LCP and hero images:**
- **`priority` is deprecated in v16; use `preload`.**
  - `preload={true}` inserts `<link rel="preload">` in `<head>` (`ReactDOM.preload` in the App Router).
  - Don't combine `preload` with `loading` or `fetchPriority`.
  - The docs say: "In most cases, you should use `loading="eager"` or `fetchPriority="high"` instead of `preload`."
- In the source, `preload` and `priority` only disable lazy loading and add the preload link. They do **not** set `fetchpriority` automatically.
- [INF] Use `preload` for the single hero composite image. If the hero is art-directed per breakpoint (`getImageProps` plus `<picture>`), use `fetchPriority="high"`.
- `loading` defaults to `lazy`.

**Placeholders:**
- Values: `placeholder="empty"` (default), `"blur"`, or a `data:image/...` URL.
- Static imports of jpg, png, webp or avif get `blurDataURL` automatically.
- Remote images need a manual `blurDataURL` of 10px or less.

**`sizes`:**
- Required when you use `fill` or CSS-responsive sizing. Without it the browser assumes `100vw`.
- It also switches `srcset` from 1x/2x descriptors to width descriptors.

**`quality`:**
- It must be in `images.qualities`. The **default is `[75]`**, and a mismatched value is coerced to the closest allowed one.
- Add e.g. `qualities: [60, 75, 90]` if the book-cover art needs 90.

**Config (`images`) defaults (verified):**

| key | default |
|---|---|
| `deviceSizes` | `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]` |
| `imageSizes` | `[32, 48, 64, 96, 128, 256, 384]` |
| `formats` | `['image/webp']`. Add `['image/avif','image/webp']` for AVIF-first; order matters. |
| `minimumCacheTTL` | `14400` |
| `maximumRedirects` | `3` |
| `maximumResponseBody` | `50000000` |
| `dangerouslyAllowSVG` | `false`. `.svg` src is auto-`unoptimized`. |
| `contentDispositionType` | `'attachment'` |
| `localPatterns` | `undefined` |
| `remotePatterns` | `[]` |

- There is no API to invalidate the optimized-image cache. Change the `src` or delete `<distDir>/cache/images`.
- New in 16.1: `maximumDiskCacheSize`.
- New in 16.2: `cacheHandler` can also cache image optimization. Source: `D/03-api-reference/05-config/01-next-config-js/incrementalCacheHandlerPath.md`.

**`remotePatterns`:**
- It accepts `URL` objects (since 15.3), e.g. `new URL('https://cdn.shopify.com/**')`, or objects `{ protocol, hostname, port, pathname, search }`.
- `*` matches one segment or subdomain. `**` matches many, but only at the end of a path or the start of a hostname.
- An omitted field implies `**`.
- [INF] Shopify files are served from `cdn.shopify.com/s/files/...`. A tight pattern is `{ protocol:'https', hostname:'cdn.shopify.com', pathname:'/s/files/**' }`.

**`localPatterns`:** a local `src` with a query string, e.g. `/x.png?v=2`, needs `localPatterns: [{ pathname:'/…/**', search:'?v=2' }]`.

**Other:**
- `getImageProps()` from `next/image` gives raw `<img>` props for `<picture>` art direction and CSS backgrounds. It cannot be used with `placeholder`.
- The `@next/next/no-img-element` lint rule is on in core-web-vitals. Source: `D/03-api-reference/05-config/03-eslint.md`.

## 7. next/font [OBS]

Sources: `D/01-getting-started/13-fonts.md`, `D/03-api-reference/02-components/font.md`.
- **Google fonts:** `import { Fredoka, Nunito } from 'next/font/google'`.
  - Fonts are self-hosted at build time, so the browser makes no requests to Google.
  - Prefer variable fonts. Otherwise `weight` is required.
- **Local fonts:** `import localFont from 'next/font/local'` with `localFont({ src: './fonts/x.woff2' | [{path, weight, style}], … })`. Paths resolve relative to the calling file.
- **Options:**
  - `weight`, `style`, `subsets` (google only; preloaded subsets), `axes` (google only), `fallback`, `variable` and `declarations` (local only).
  - `display` defaults to `'swap'`.
  - `preload` defaults to `true`.
  - `adjustFontFallback` defaults to `true` for google and `'Arial'` for local.
- **Preload scope** depends on where the loader is called:
  - root layout: every route
  - nested layout: that subtree
  - page: that route only
- **Tailwind v4 pattern:**
  1. Put `variable: '--font-x'` on the loader.
  2. Add `className={x.variable}` on `<html>`.
  3. Map it in CSS: `@theme inline { --font-sans: var(--font-x); --font-display: var(--font-y); }`.
  4. Use the `font-sans` / `font-display` utilities.
  - The repo already does steps 1 to 3 for Geist; replace it with the brand fonts.
- **OG images:** `ImageResponse` needs raw `ttf`, `otf` or `woff` data read with `readFile`. It cannot use `next/font`. See §8.

## 8. Metadata, OG, sitemap, robots, icons, JSON-LD [OBS]

Sources: `D/01-getting-started/14-metadata-and-og-images.md`, `D/03-api-reference/04-functions/generate-metadata.md`, `generate-viewport.md`, and `D/03-api-reference/03-file-conventions/01-metadata/*`.

**Static and dynamic metadata:**
- Static: `export const metadata: Metadata = {…}`. Dynamic: `export async function generateMetadata({ params, searchParams }, parent: ResolvingMetadata): Promise<Metadata>`.
- Both are Server Component only. You cannot export both from the same segment.
- `parent` is a Promise; use it to extend e.g. `openGraph.images`.
- Segments merge **shallowly**, root to leaf. Nested objects like `openGraph` are replaced, not deep-merged.
- File-based metadata overrides the config.

**Key fields:**
- Set `metadataBase: new URL('https://tiffany-wheeler.com')` in the root layout. **Relative URL fields without `metadataBase` are a build error.**
- `title: { default, template: '%s | Tiffany Wheeler' }`
- `description`, `openGraph` (`type`, `images`, `siteName`, `locale`), `twitter`, `alternates.canonical`, `robots`, `icons`, `verification` and `other`.

**Viewport:**
- `themeColor`, `colorScheme` and `viewport` inside `metadata` are deprecated.
- Use `export const viewport: Viewport = { themeColor: '…' }` or `generateViewport`.

**Streaming metadata:**
- For dynamic pages, `generateMetadata` output is streamed and appended to `<body>`.
- HTML-limited bots still get it blocking, in `<head>`. The default `htmlLimitedBots` regex includes `facebookexternalhit|facebookcatalog|Twitterbot|Slackbot|…` (verified in `dist/server/config-shared.d.ts`). Meta ad previews and catalog crawlers therefore get proper `<head>` tags.
- To disable streaming entirely: `htmlLimitedBots: /.*/`.

**Deduplicating data:** fetch is memoized across `generateMetadata`, the page and `generateStaticParams`. For non-fetch data use `React.cache`, or a `'use cache'` helper in Cache Components mode.

**File conventions:**
- **OG and Twitter images:**
  - Static files go in any segment: `opengraph-image.(jpg|jpeg|png|gif)` and `twitter-image.*`, with optional `opengraph-image.alt.txt`.
  - Size limits: OG 8MB, Twitter 5MB. Oversize files fail the build.
  - Generated images: `opengraph-image.tsx` exporting `alt`, `size = { width: 1200, height: 630 }` and `contentType = 'image/png'`, with `export default async function Image({ params }) { const { handle } = await params; return new ImageResponse(<div style={{display:'flex'}}>…</div>, { ...size, fonts:[{ name, data, weight, style }] }) }`.
  - `ImageResponse` comes from `next/og`. It supports flexbox only (no grid) and has a 500KB bundle limit.
  - Generated images are statically optimized unless they use request-time APIs.
  - Sources: `D/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`, `D/03-api-reference/04-functions/image-response.md`.
- **Icons:** `favicon.ico` (top level of `app/` only), `icon.(ico|jpg|jpeg|png|svg)` and `apple-icon.(jpg|jpeg|png)`. Can also be generated with `icon.tsx`. Source: `D/03-api-reference/03-file-conventions/01-metadata/app-icons.md`.
- **`src/app/sitemap.ts`:** `export default function sitemap(): MetadataRoute.Sitemap { return [{ url, lastModified, changeFrequency, priority, images: [...] }] }`. It supports `images` and `videos` entries and is a cached special Route Handler.
  - [INF] Under Cache Components, avoid `new Date()` for `lastModified`; use fixed ISO strings, because non-deterministic calls stop prerendering.
- **`src/app/robots.ts`:** `export default function robots(): MetadataRoute.Robots { return { rules: { userAgent:'*', allow:'/', disallow:'/cart' }, sitemap: 'https://…/sitemap.xml' } }`.

**JSON-LD** (`D/02-guides/json-ld.md`):
- Render a native `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />` in the page. **Do not** use `next/script`.
- [INF] Use `@type: 'Product'`/`'Book'` with `offers` (price, availability) for Google Shopping and rich results. Optional typing via `schema-dts`.

**Resource hints:** use `ReactDOM.preload`, `ReactDOM.preconnect` or `ReactDOM.prefetchDNS` from a Client Component. For example, preconnect to the Shopify checkout domain or the pixel domain. Source: `generate-metadata.md` "Resource hints".

## 9. Server Actions, Server Functions and forms [OBS]

Sources: `D/01-getting-started/07-mutating-data.md`, `D/02-guides/forms.md`, `D/03-api-reference/01-directives/use-server.md`, `D/03-api-reference/05-config/01-next-config-js/serverActions.md`.

**Defining them:**
- Use `'use server'` at the top of an async function (inline in a Server Component) or at the top of a file (all exports).
- Client Components cannot define them. They import them from a `'use server'` file, or receive them as props.
- A Server Action is invoked through `<form action={fn}>` or `<button formAction={fn}>`, which wraps it in a transition. It can also be called from event handlers or `useEffect`.
- It is always a POST. Forms in Server Components work without JS (progressive enhancement).

**Security:** Server Functions are reachable by direct POST. Validate every input (for example with zod) inside every action.

**Serial dispatch:** the client dispatches and awaits Server Functions **one at a time**. For fast cart quantity changes, use `useOptimistic` so the UI stays snappy.

**Hooks:**
- `const [state, formAction, pending] = useActionState(action, initialState)` from `react`. The action signature becomes `(prevState, formData)`.
- `useFormStatus()` from `react-dom`, in a child of the `<form>`, returns `pending`, `data`, `method` and `action`.
- `useOptimistic(state, reducer)` from `react`.

**Inside an action you can:**
- call `cookies().set` or `.delete`
- call `revalidateTag`, `updateTag`, `revalidatePath` or `refresh()`
- call `redirect(url)` from `next/navigation`. It throws, so nothing after it runs. Revalidate before redirecting.
- [INF] For checkout, call `redirect(cart.checkoutUrl)` to the Shopify-hosted checkout. External URLs are fine.

**Config** (still under `experimental`, verified in the `config-shared.d.ts` experimental key list):
- `experimental.serverActions.bodySizeLimit` (default 1MB)
- `experimental.serverActions.allowedOrigins` (CSRF allowlist; same-origin by default)

**`<Form>` from `next/form`:** for forms that update URL search params (e.g. `action="/search"`). It prefetches loading UI, navigates client-side on submit and works without JS. Source: `D/03-api-reference/02-components/form.md`.

**Cache Components side effect:** form inputs and `useActionState` messages persist when the user navigates back (Activity). Reset them in the submit handler or in a cleanup effect. Source: `D/02-guides/preserving-ui-state.md`.

## 10. Route Handlers [OBS]

Sources: `D/01-getting-started/15-route-handlers.md`, `D/03-api-reference/03-file-conventions/route.md`.
- **File:** `src/app/api/<name>/route.ts`, exporting `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD` or `OPTIONS`. An unsupported method returns 405.
- **Conflicts:** a `route.ts` cannot sit in the same segment as a `page.tsx`.
- **Signature:** `export async function POST(request: Request | NextRequest, ctx: RouteContext<'/api/x/[id]'>)`, where `ctx.params` is a Promise.
- **Caching:**
  - Not cached by default. Only `GET` can be cached.
  - Previous model: `export const dynamic = 'force-static'`.
  - Cache Components: the handler is prerendered if it is pure; put `'use cache'` in a helper.
- **Webhook pattern:** `const body = await request.text()` (no bodyParser needed). Verify the signature, call `revalidateTag('products', 'max' | { expire: 0 })`, then `return new Response('ok')`.
  - [INF] Shopify sends the `X-Shopify-Hmac-Sha256` header, computed over the raw body with the app secret. Verify it before revalidating.
- **Avoid self-calls:** don't call your own Route Handlers from Server Components; that adds an extra hop. Source: `D/02-guides/production-checklist.md`.

## 11. Third-party scripts, pixels and analytics [OBS]

Sources: `D/02-guides/scripts.md`, `D/03-api-reference/02-components/script.md`, `D/02-guides/third-party-libraries.md`, `D/02-guides/analytics.md`, `D/03-api-reference/03-file-conventions/instrumentation-client.md`, `D/02-guides/prefetching.md`.

**`next/script`:**
- Usage: `import Script from 'next/script'` with `<Script src|id strategy onLoad onReady onError />`.
- Strategies:
  - `beforeInteractive` must be in the **root layout**. It is always injected in `<head>` and meant for consent managers and bot detectors.
  - `afterInteractive` is the **default**. Use it for tag managers and analytics.
  - `lazyOnload` loads at browser idle time.
  - `worker` (Partytown) is experimental and does **not** work with the App Router. Turbopack also lists `experimental.nextScriptWorkers` as unsupported (`D/03-api-reference/08-turbopack.md`).
- Inline scripts **require an `id`**. The lint rule is `@next/next/inline-script-id`.
- `onLoad`, `onReady` and `onError` work only in Client Components.
- Extra attributes, e.g. `nonce` or `data-*`, are forwarded.
- A script placed in a layout loads once even across navigations.

**`@next/third-parties`** (experimental; install with `npm i @next/third-parties@latest`):
- It exports `GoogleTagManager` (`gtmId`, `gtmScriptUrl`, `dataLayer`, `auth`, `preview`), `sendGTMEvent`, `GoogleAnalytics` (`gaId`, `nonce`), `sendGAEvent`, `GoogleMapsEmbed` and `YouTubeEmbed`.
- GA4 SPA pageviews rely on GA's "Enhanced Measurement → Page changes based on browser history events".
- **There is no Meta Pixel, TikTok or Pinterest component.** Use `<Script id="meta-pixel" strategy="afterInteractive">{`…fbq('init', ID); fbq('track','PageView')`}</Script>` in the root layout. [INF]

**`src/instrumentation-client.ts`:**
- It runs after the HTML loads and before hydration. There are no required exports.
- It can export `onRouterTransitionStart(url, navigationType: 'push'|'replace'|'traverse')`.
- Dev warns if initialization takes longer than 16ms.
- [INF] It is the best place for:
  - SPA `fbq('track','PageView')` on client navigations
  - UTM, fbclid and `_fbc` capture into a first-party cookie or localStorage without touching `searchParams`
  - error tracking

**Web vitals:** `useReportWebVitals` from `next/web-vitals`, in a tiny `'use client'` component mounted in the root layout.

**Gotchas:**
- Side effects in layout or page bodies fire during **prefetch**. Put tracking in `useEffect` or in Server Actions (`D/02-guides/prefetching.md` "Troubleshooting").
- With `cacheComponents`, effects **re-run when a hidden route is re-shown** on back and forward navigation. [INF] Guard `ViewContent` and `AddToCart` events against double fire, using a ref pattern from `D/02-guides/preserving-ui-state.md` "Distinguishing first mount from re-show".
- [INF] Server-side conversions (Meta CAPI): send from the Server Action or Route Handler inside `after()`.

## 12. Turbopack, CLI and build [OBS]

Sources: `D/03-api-reference/08-turbopack.md`, `D/03-api-reference/05-config/01-next-config-js/turbopack.md`, `turbopackFileSystemCache.md`, `D/03-api-reference/06-cli/next.md`.

**Turbopack defaults and behavior:**
- Turbopack is the default for dev and build. `--turbopack`/`--turbo` force it and `--webpack` opts out.
- Webpack plugins and a `webpack()` config are ignored or unsupported. Loaders are supported via `turbopack.rules`.
- PostCSS configs (`postcss.config.mjs` etc.) are processed automatically, so Tailwind v4 works.
- Babel is used automatically if a Babel config file exists (v16.0 history). [INF] Don't add a `.babelrc`.
- Filesystem cache:
  - Dev: `experimental.turbopackFileSystemCacheForDev` is **on by default since 16.1**. It persists in `.next`.
  - Build: `experimental.turbopackFileSystemCacheForBuild` is opt-in and experimental.
- CSS: Lightning CSS handles transforms. The CSS Modules `@value`, standalone `:local`/`:global` and ICSS features are unsupported.

**CLI:**
- `next dev [-p] [-H] [--experimental-https]`
- `next build [--debug] [--debug-prerender] [--debug-build-paths=<glob>] [--profile] [--experimental-app-only]`
- `next start [--keepAliveTimeout]`
- `next typegen`
- `next upgrade [--revision]` (16.1)
- `next experimental-analyze [-o]` (16.1). This is the Turbopack bundle analyzer and writes `.next/diagnostics/analyze`.
- `next info`
- `next telemetry --disable`
- `next` with no command is `next dev`.
- `--no-lint` still appears in the table, but builds don't lint in 16.

**Build output legend:** `○` Static, `◐` Partial Prerender, `ƒ` Dynamic. There are Revalidate and Expire columns. Source: `D/02-guides/public-static-pages.md`.

**Debug prerender errors** with `next build --debug-prerender`. Dev only.

**Deploying:** `D/01-getting-started/17-deploying.md` lists verified adapters: Vercel and Bun. Node server and Docker support all features.

## 13. React 19.2 features available [OBS]

Sources: `D/02-guides/upgrading/version-16.md` "React 19.2", `D/02-guides/view-transitions.md`, `D/03-api-reference/05-config/01-next-config-js/viewTransition.md`, `D/03-api-reference/02-components/link.md`.

**`<Activity mode="visible|hidden">`** from `react`:
- Hides UI with `display:none` and keeps its state. Hidden content prerenders at lower priority.
- Next uses it automatically for routes when `cacheComponents` is on.
- Use cases: tabs, "peek inside" panels, and the cart drawer.
- Typed in `@types/react/index.d.ts`.

**`useEffectEvent(fn)`** from `react`: non-reactive Effect logic. Typed in `index.d.ts`.

**`<ViewTransition>`** from `react`:
- Requires `experimental: { viewTransition: true }`, which defaults to false. Its status is experimental.
- It animates on Transitions, Suspense reveals and `useDeferredValue`, not on plain `setState`. Next route navigations count as transitions.
- `<Link transitionTypes={['slide-in']}>` (16.2.0) feeds `React.addTransitionType`.
- If the browser lacks support, the page renders without animation.
- [INF] The types live only in `@types/react/canary.d.ts`. Add `/// <reference types="react/canary" />`, or `"types": ["react/canary"]`, if TS complains.

**Form hooks:** `useActionState`, `useOptimistic`, `use()` and `useFormStatus` (from `react-dom`). See §9.

**`reactCompiler`:**
- Stable but off by default.
- Enable with `reactCompiler: true`, or `{ compilationMode: 'annotation' }` plus `'use memo'`. Requires `npm i -D babel-plugin-react-compiler`.
- Builds get slower (Babel). Source: `D/03-api-reference/05-config/01-next-config-js/reactCompiler.md`.

**Other Next APIs:**
- `useLinkStatus()` from `next/link` returns `{ pending }` for inline navigation feedback. Source: `D/03-api-reference/04-functions/use-link-status.md`.
- Error recovery:
  - `error.tsx` receives `unstable_retry()` (16.2), which re-fetches and re-renders. Prefer it over `reset()`.
  - `unstable_catchError(Fallback)` from `next/error` (16.2) creates component-level error boundaries.
  - `global-error.tsx` must render its own `<html>` and `<body>`, and cannot export metadata.
  - Sources: `D/03-api-reference/03-file-conventions/error.md`, `D/03-api-reference/04-functions/catchError.md`.
- `global-not-found.tsx` needs `experimental.globalNotFound: true`. A plain `app/not-found.tsx` is enough for a single root layout. Next injects `noindex` on 404 responses. Source: `D/03-api-reference/03-file-conventions/not-found.md`.

## 14. ESLint [OBS]

Source: `D/03-api-reference/05-config/03-eslint.md`.
- **Flat config only.** `@next/eslint-plugin-next` defaults to flat config.
- **Configs:** `eslint-config-next` (base), `eslint-config-next/core-web-vitals` (turns CWV rules into errors) and `eslint-config-next/typescript`. The repo uses the latter two.
- **Running it:** `next lint` is removed. Run `npx eslint .`; the repo's `npm run lint` runs `eslint`. `next build` does not lint, so add lint to CI.
- **Relevant rules enabled:**
  - `no-img-element`
  - `no-html-link-for-pages`
  - `inline-script-id`
  - `next-script-for-ga`
  - `no-sync-scripts`
  - `no-head-element`
  - `no-async-client-component`
  - `google-font-display`
  - `no-before-interactive-script-outside-document`. It is written for the Pages Router; if it flags a root-layout `beforeInteractive` script, override it. [INF]

## 15. Environment variables [OBS]

Source: `D/02-guides/environment-variables.md`.
- **Location:** `.env*` files load from the **project root**, not `src/`.
- **Load order** (first match wins): `process.env`, `.env.$(NODE_ENV).local`, `.env.local` (skipped in test), `.env.$(NODE_ENV)`, `.env`. `$VAR` expansion is supported.
- **Client exposure:**
  - Only `NEXT_PUBLIC_*` values reach the client. They are **inlined at build time**, so dynamic lookups like `process.env[name]` are not inlined.
  - Non-public vars become an empty string on the client.
- **Runtime reads:** to read a value at request time instead of baking it in at build, call `await connection()` first. `serverRuntimeConfig` and `publicRuntimeConfig` are removed.
- **Server-only modules:** `import 'server-only'` makes a module fail the build if it is imported client-side. Installing the package is optional; Next handles it internally.
- **Taint:** `experimental.taint` offers taint APIs to block values from reaching the client.
- [INF] Suggested names:
  - `SHOPIFY_STORE_DOMAIN`
  - `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` (server only)
  - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN` (only if you call Shopify from the client)
  - `SHOPIFY_WEBHOOK_SECRET`
  - `SHOPIFY_REVALIDATION_SECRET`
  - `NEXT_PUBLIC_META_PIXEL_ID`
  - `META_CAPI_TOKEN`
  - `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID`
  - `NEXT_PUBLIC_SITE_URL`

## 16. Tailwind CSS v4 conventions in this repo

**Observed in the repo:**
- There is no `tailwind.config.js`.
- `postcss.config.mjs` uses the `@tailwindcss/postcss` plugin.
- `src/app/globals.css` starts with `@import "tailwindcss";` and defines tokens CSS-first:

```css
:root { --background: #ffffff; --foreground: #171717; }
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

- `--color-*` generates `bg-background`, `text-foreground` and so on.
- `--font-*` generates `font-sans`, `font-mono` and so on.
- `inline` makes utilities reference the variable at the use site. That is needed when the token points at another CSS variable, such as a next/font variable.
- The Next doc shows the same pattern in `D/03-api-reference/02-components/font.md` "With Tailwind CSS" and `D/01-getting-started/11-css.md`.

**Default theme namespaces** (`node_modules/tailwindcss/theme.css`):
- `--color-*`, `--font-*`, `--text-*`, `--tracking-*`, `--leading-*`
- `--breakpoint-*` (sm 40rem, md 48rem, lg 64rem, xl 80rem, 2xl 96rem)
- `--container-*`, `--radius-*`, `--shadow-*`, `--blur-*`, `--ease-*`, `--animate-*`, `--perspective-*`
- `--spacing: 0.25rem` (the base unit for `p-4` and similar)
- Layers: `@layer theme, base, components, utilities`. Unlayered CSS beats all of them; that is the Arial bug in §1.

**v4 authoring conventions** [INF, from Tailwind v4 docs knowledge; not in the Next docs]:
- **Brand tokens:** `@theme { --color-cranberry-600: #…; --color-cream: #…; --font-display: var(--font-fredoka); --radius-card: 1.25rem; }`. These generate `bg-cranberry-600`, `font-display` and `rounded-card`.
- **Animations:** `@theme { --animate-wiggle: wiggle 1s ease-in-out infinite; @keyframes wiggle { … } }`.
- **Custom utilities:** `@utility name { … }`.
- **Custom variants:** `@custom-variant dark (&:where(.dark, .dark *));` for class-based dark mode. The default `dark:` follows `prefers-color-scheme`.
- **Plugins:** `@plugin "@tailwindcss/typography";`.
- **Extra content paths:** `@source "../path";`. Content detection is automatic.
- **Arbitrary values:** `bg-[--my-var]` becomes `bg-(--my-var)` in v4 syntax.
- **Browser floor:** Tailwind v4 needs Safari 16.4+, Chrome 111+ and Firefox 128+. This is roughly Next 16's floor, except Firefox 128 vs 111.
- **CSS delivery:** for ad-driven first-visit traffic, test `experimental.inlineCss: true`.
  - It inlines CSS into `<head>`, which suits Tailwind's small atomic CSS.
  - It is production-only and global, and styles are duplicated in the RSC payload.
  - Source: `D/03-api-reference/05-config/01-next-config-js/inlineCss.md`.
  - [INF: likely a good fit; measure LCP both ways.]

## 17. Deprecations and removals checklist

Do not use:

| Don't use | Use instead | Source |
|---|---|---|
| `<Image priority>` | `preload`, or `loading="eager"` / `fetchPriority="high"` | image.md |
| `next/legacy/image`, `images.domains` | `next/image`, `remotePatterns` | version-16.md |
| `onLoadingComplete` | `onLoad` | image.md |
| `middleware.ts`, `export function middleware` | `src/proxy.ts`, `export function proxy` | proxy.md |
| `skipMiddlewareUrlNormalize` | `skipProxyUrlNormalize` | version-16.md |
| `revalidateTag(tag)` (one argument) | `revalidateTag(tag, 'max')`, or `updateTag(tag)` in actions | revalidateTag.md |
| `unstable_cacheLife`, `unstable_cacheTag` | `cacheLife`, `cacheTag` | version-16.md |
| `experimental.ppr`, `experimental_ppr`, `experimental.dynamicIO`, `experimental.useCache` | `cacheComponents: true` | cacheComponents.md |
| `experimental.turbopack` | top-level `turbopack` | version-16.md |
| `experimental.typedRoutes` | top-level `typedRoutes` | typedRoutes.md |
| `next lint`, the `eslint` next.config key, `.eslintrc` | ESLint CLI with flat config | eslint.md |
| `serverRuntimeConfig`, `publicRuntimeConfig`, `getConfig()` | env vars (plus `connection()` for runtime reads) | version-16.md |
| sync `cookies()`, `headers()`, `params`, `searchParams` | `await …` | version-16.md |
| `unstable_noStore` | `connection()` | connection.md |
| `metadata.themeColor`, `metadata.colorScheme`, `metadata.viewport` | `export const viewport` | generate-metadata.md |
| `runtime = 'edge'` with Cache Components; `dynamic`, `revalidate`, `fetchCache`, `dynamicParams` with Cache Components | `'use cache'` with `cacheLife` | migrating-to-cache-components.md |
| `strategy="worker"` | not supported in the App Router or Turbopack | scripts.md, turbopack.md |
| `@next/bundle-analyzer` | `next experimental-analyze`. The bundle analyzer is webpack-only; the production checklist still mentions it. | production-checklist.md, next.md |

## 18. Doc inconsistencies and traps [OBS]

1. **`cacheLife` preset tables disagree.**
   - `D/01-getting-started/09-revalidating.md` lists `seconds.stale = 0` and `max.expire = ~indefinite`.
   - `D/03-api-reference/04-functions/cacheLife.md` and the runtime `config-shared.js` say `seconds.stale = 30` and `max.expire = 365d`. Trust the runtime values.
2. **Some examples still use the deprecated one-argument `revalidateTag('…')`:** `D/03-api-reference/04-functions/cacheTag.md` and `D/02-guides/caching-without-cache-components.md`. Always pass the second argument.
3. **Some examples use synchronous params (`params: { slug: string }`), which is invalid in v16.** Affected: `D/01-getting-started/14-metadata-and-og-images.md`, in both the "Memoizing data requests" and "Generated Open Graph images" examples. Always type as `Promise<…>` and `await`.
4. **`D/03-api-reference/04-functions/cookies.md` says sync access still works "in Next.js 15".** In v16 it is removed.
5. **The upgrade guide says to "enable" `turbopackFileSystemCacheForDev`.** It has been on by default since 16.1 (`turbopackFileSystemCache.md` and `config-shared.d.ts` defaults).
6. **`serverActions` config is still `experimental.serverActions`**, even though Server Actions themselves are stable.
7. **The `images.md` config doc says "`qualities` … is required starting with Next.js 16".** In practice there is a default of `[75]`. Any other `quality` value silently coerces unless you add it.
8. **`D/02-guides/instant-navigation.md` and `instant.md` are `version: draft`.** The `unstable_instant` API is present in 16.2.9 but unstable.
9. **Nesting `'use cache'` with runtime Promises hangs the build for 50 seconds.** Always await runtime values outside and pass primitives in.
10. **Placing `<Suspense fallback={null}>` around `<body>` in the root layout** removes the static shell for the whole app. Don't do this. Source: `08-caching.md` "Opting out of the static shell".
11. **Activity keeps hidden pages mounted.** A hidden page's global `<style>`, z-index or accent tokens can leak into the visible page. See `preserving-ui-state.md` "Global styles" for the fix: toggle `media` in a ref cleanup.

## 19. Suggested starting config and file layout [INF]

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,              // PPR static shell + 'use cache'
  typedRoutes: true,                  // typed <Link href>
  cacheLife: {
    catalog: { stale: 300, revalidate: 3600, expire: 86400 * 7 },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/s/files/**' },
    ],
  },
  experimental: {
    inlineCss: true,                  // A/B measure; prod-only
    // viewTransition: true,          // optional polish
  },
  async redirects() {
    return [
      // map legacy WooCommerce/WordPress URLs from tiffany-wheeler.com -> new routes (308)
      // { source: '/product/:slug', destination: '/books/:slug', permanent: true },
    ]
  },
}

export default nextConfig
```

Redirects preserve query strings, so UTMs survive (`redirects.md`).

```
src/
  app/
    layout.tsx               # fonts (next/font vars), metadataBase, viewport, <Script> pixel, Header with <Suspense><CartBadge/></Suspense>
    page.tsx                 # landing: hero (preload), product cards, bundle bar, peek-inside, reviews, trust row (all static/cached)
    books/[handle]/page.tsx  # generateStaticParams -> 2 handles; JSON-LD Product; opengraph-image.tsx
    cart/                    # optional page; mostly a drawer
    api/shopify/webhook/route.ts   # POST: verify HMAC -> revalidateTag('products', 'max' | {expire:0})
    sitemap.ts  robots.ts  icon.png  apple-icon.png  opengraph-image.png  not-found.tsx  error.tsx  global-error.tsx
  lib/shopify/               # 'server-only'; 'use cache' + cacheTag fetchers; typed GraphQL
  actions/cart.ts            # 'use server': addToCart/updateLine/removeLine -> cookies().set('cartId') + updateTag('cart'); checkout -> redirect(checkoutUrl)
  components/                # client islands: AddToCart (useOptimistic/useActionState), CartDrawer (Activity), PixelEvents
  instrumentation-client.ts  # UTM/fbclid capture, onRouterTransitionStart -> fbq('track','PageView')
  proxy.ts                   # only if needed (A/B tests, geo)
```