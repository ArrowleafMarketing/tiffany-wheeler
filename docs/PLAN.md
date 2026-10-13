# Tiffany Wheeler store rebuild: plan

Goal: turn paid-ad (mostly Meta/Instagram, mobile, in-app browser) traffic into purchases of **Nephite Christmas**, **Easter Journey**, and the two-book set. Research from 2026-09-22 lives in [`docs/discovery/`](discovery/README.md).

## What we're working with

- **Products.** Nephite Christmas hardcover is $24.99, shown on a standing "sale" at $22.49. Easter Journey hardcover is $29.99. The two-book bundle is $49.98, shown against a crossed-out $59.98 that isn't real: the two books add up to $54.98. Add-ons: coloring and activity book $7.99, two $2.99 ornaments, a nativity craft PDF, and PDF editions of both books. There are also a print-on-demand puzzle ($24.73) and canvas ($22.92), plus wholesale.
- **Proof.**
  - Nephite Christmas has 20 five-star reviews on the site and 22 on Amazon.
  - There is a testimonial from Kim & John Bytheway.
  - The book is stocked at BYU Store, Eborn Books, Barnes & Noble Sandy and This is the Place.
  - Tiffany was named to Idaho Business Review's 2025 Women of the Year.
  - Easter Journey has **0 reviews**.
- **Assets.**
  - Excellent art in both books. Six "peek inside" spreads per book are exported to `assets/derived/peek-inside/`.
  - A lifestyle video of families reading, cut 30s at 16:9 and 9:16.
  - A 3-minute video of Tiffany reading the book aloud.
  - Strong product photos, including both books together.
  - Gaps: covers are only about 800px, and the logo exists only as a 600px PNG.
- **Current site problems.**
  - The hero has no headline, offer or button.
  - No prices, reviews, shipping info or email capture on the homepage.
  - Links send visitors off to other retailers.
  - About 15 MB of page weight, and a 51 MB video on the product page.
  - No privacy policy.
  - **Urgent:** the paid Nephite Christmas PDFs can be downloaded publicly from `/wp-content/uploads/2025/07/`.

## Strategy

1. **The two-book set is the main offer.** Show an honest crossed-out price ($54.98). Set free shipping at about $45, so one book alone doesn't qualify and the set does. Offer signed copies as something Amazon can't match (Amazon currently undercuts the site at $20.85).
2. **Season modes from one config.**
   - Christmas first: now until Dec 25.
   - Last-minute: Dec 18–24, pushing the instant PDF.
   - Easter first: Jan 5 until Easter (Mar 28, 2027).
   - Off-season: evergreen "both holidays" message.
   - Real shipping cutoffs appear in the announcement bar and as a "Get it by" line next to Add to Cart.
3. **Pages built to convert.**
   - Stars and review count next to the price.
   - Sticky add-to-cart bar on mobile.
   - Cart drawer with a free-shipping progress bar, one-tap $2.99/$7.99 add-ons, and a gift note.
   - FAQ that answers objections, including "Is this published by the Church?".
   - Free printable in exchange for an email.
4. **Ad landing pages with no nav**, one per ad angle: Christmas tradition, grandparent gift, and later Easter/Holy Week.
5. **Tone and compliance.**
   - Warm and reverent, with no fake timers.
   - Crossed-out prices only when they're real (FTC).
   - Footer disclaimer that the books are not affiliated with the Church.
   - Ad copy describes the book and never addresses the viewer's faith (Meta policy).

## Architecture

- **Next.js 16 front end** (headless), deployed on Vercel. **Shopify handles checkout** through the Storefront API, on `checkout.tiffany-wheeler.com`.
- Commerce goes through a `CommerceProvider` interface. A **mock provider** is seeded from the live catalog and reviews (`docs/discovery/live-site-products-and-reviews.json`), and a Shopify provider replaces it later.
- **`cacheComponents: true`.**
  - Pages are pre-rendered static shells.
  - The cart lives in `<Suspense>` and reads a cookie.
  - Server actions handle cart changes.
  - A Shopify webhook calls `revalidateTag`.
- **Trade-off we're accepting:** the product page can show a Shop Pay button but not Apple Pay or Google Pay. Those appear at the top of Shopify checkout. Apple Pay often doesn't show in the Facebook and Instagram in-app browsers anyway.
- **Tracking:**
  - On our pages we fire Meta Pixel plus server-side Conversions API, GA4 and Klaviyo through one `track()` function.
  - Shopify's apps cover checkout and purchase.
  - Keep the existing IDs: Meta `1232618954522587`, GA4 `G-WP1LN2QBSK`, Google Ads `AW-18011862389`.

## Build phases

0. **Foundation**
   - Upgrade `next` 16.2.9 → 16.3.6 (security advisory).
   - Fix template issues: `priority` → `preload`, and the Arial `body` rule.
   - Design tokens and fonts.
   - Curate and optimize assets into `public/`, including web video encodes.
   - Commerce interface with the mock provider.
   - Season config and a `track()` stub.
1. **Core funnel:** homepage (mockup plus research additions), `/books/nephite-christmas`, `/books/easter-journey`, `/books/complete-set`, cart drawer, mock checkout.
2. **Ad landing pages:** `/lp/christmas-tradition`, `/lp/grandparent-gift`, and Easter later.
3. **Supporting pages:**
   - About (Tiffany and illustrator Kelley Hicken), FAQ, shipping and Christmas delivery dates, returns/guarantee, privacy, terms.
   - Freebies page (email-gated), 404. (Wholesale and bulk/ward orders were removed from the site on Oct 13, 2026.)
   - Metadata, OG images, JSON-LD (Product, AggregateRating, FAQ), sitemap and robots.
   - 301 redirects from the old WooCommerce URLs.
4. **Shopify wiring:**
   - Products, bundles, metafields and the Digital Downloads app.
   - Import reviews into Judge.me; set up Klaviyo.
   - Pixels and Conversions API, the checkout domain, and consent.
5. **QA and launch:**
   - Mobile LCP under 2.5s in the Meta in-app browser.
   - Test orders and tracking verification.
   - Target: **live by about Nov 2**, ahead of Black Friday (Nov 27).

## Status (2026-09-23)

- **Phases 0–3 are built** on sample data and pass `tsc`, `eslint` and `next build`. Every page prerenders static.
  - Store: homepage, 14 product pages, shop, cart drawer, sample checkout.
  - Ad landing page `/lp/christmas-tradition`.
  - Info pages, SEO files and legacy redirects.
- **Six-lens review done.** The review covered visual, conversion, code, accessibility, performance and copy/compliance. Its 103 findings are fixed, apart from the client-dependent items below. Details are in `docs/discovery/` and the session reports.
- **Measured at 390×844:**

  | Page | First Add to Cart | Page height |
  |---|---|---|
  | Homepage | 579px | about 10,800px |
  | Nephite Christmas | 607px | |
  | Landing page | 583px | |

  - No horizontal overflow at 320px.
  - The hero font is 37 KB and the CSS is inlined.
- **Not started:** Shopify wiring (phase 4) and launch QA (phase 5).

## Before launch: claims switchboard

Every unconfirmed promise is gated by `CLAIMS` in `src/lib/store-config.ts`. While a flag is off the site shows honest fallback copy. To turn a claim on after Tiffany confirms it in writing, flip its flag.

| Flag | Now | Needs from Tiffany |
|---|---|---|
| `moneyBackGuarantee` | on | Confirmed Oct 13, 2026: 60-day returns on unused items, return shipping deducted from the refund (see /returns). Made-to-order items are final sale; original shipping isn't refunded |
| `freeShipping` | on | Confirm free shipping at $45+ and the $5.99 flat rate below it |
| `signedCopies` | off | Can she sign copies, and until when? The cart checkbox is built and hidden. |
| `localPickup` | off | Keep Boise pickup? |
| `priorityShipping` | off | Offer Priority at checkout for late orders? |
| `giftSlipsHidePrices` | off | Do packing slips omit prices? |
| `doveOnEveryPage` | off | Is a dove hidden on *every* page, or only "throughout"? |
| `bythewayTestimonial` | off | Written permission from Kim & John Bytheway, and whether their copy was complimentary |
| `bestsellerBadge` | off | OK to say "Bestseller"? The site shows "Family favorite" for now. |

**Other things to confirm:**
- Handling and transit days (`HANDLING_BUSINESS_DAYS`, `TRANSIT_BUSINESS_DAYS`). All cutoffs derive from them: Christmas Dec 15 and Easter Mar 10, 2027.
- Whether she pauses shipping around Christmas. The copy currently says hardcovers "may not arrive by Christmas" after Dec 15.
- Book specs: Nephite Christmas pages and size, and the age ranges. "Ages 3–10" is now the most prominent line under the homepage headline, and the book review suggested 3–8.
- Homepage hero (condensed 2026-09-25, copy deck §2.1):
  - Is Tiffany OK with her book's first line as the headline ("’Twas the night before Christmas… in the Book of Mormon.")? Her Bethlehem / across-the-sea line moved down the page.
  - Should the set be called "Christmas + Easter Set" everywhere? Only the hero buttons use that name today; the product and cart still say "The Complete Set".
- Legal review of `/privacy`, `/terms` and `/accessibility`.
- Captions (`public/video/*.vtt`) for the trailer and the read-aloud clip.

## Open questions for Tiffany

1. **Pricing.** What should standing prices be instead of the permanent sale? Confirm the set price ($49.99?), the free-shipping threshold, shipping rates and carrier, and whether signed or inscribed copies are possible and until what December date.
2. **Specs.**
   - Nephite Christmas: 26 or 36 pages, and what dimensions?
   - Age range for each book.
   - ISBN for Easter Journey.
   - Which of the two Nephite Christmas PDF text versions matches the printed book.
3. **Proof.** Can we use the Bytheway name and quote in ads, and did they receive a free copy? Is the "5,000+ copies sold" figure real? Are the retail partners still current? Can she collect Easter Journey reviews now?
4. **Assets.**
   - Print-resolution front covers for both books.
   - A vector (SVG) logo.
   - Is the woman in `IMG_3989.mov` Tiffany, and can we use it in ads?
   - What is the audio on the 30s video (voice-over or live reading)?
   - Is any Easter video coming?
5. **Catalog and ops.**
   - Keep the puzzle and canvas? (Wholesale and the bulk discount are dropped.)
   - Keep Boise pickup?
   - What return address should the returns policy use?
   - May we lock down the public Nephite Christmas PDFs on the live site now?
6. **Brand.** OK to use "LDS" in search copy? Should the cancer story appear on sales pages?
