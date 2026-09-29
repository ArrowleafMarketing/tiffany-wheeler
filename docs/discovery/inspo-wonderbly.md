Sources are the raw HTML (Astro and Prismic island props), the public Algolia product index the collection pages load in the browser, and the Trustpilot widget API, all fetched on 2026-09-22. Raw files are in `/private/tmp/claude-501/-Users-ryanmata-Desktop-Arrowleaf-Marketing-tiffany-wheeler/86c2c9b5-128c-496e-bb63-b781462a7d36/scratchpad/wonderbly/`.

Pages fetched: `/` (homepage), `/personalized-books/bestsellers`, `/personalized-books/occasions/christmas`, `/personalized-books/kids/themes/christmas`, `/personalized-books/kids/occasions/easter`, `/personalized-books/occasions/black-friday`, three product pages (`lost-my-name-v2-book`, `together-at-christmas-book`, `santa-search-and-find-book`), the personalization flow (`together-at-christmas-book/create/start`), `/pages/christmas-delivery`, `/pages/delivery-info`, `/offers` and `/help`. I also pulled `/pages/terms`, `/pages/our-story` and `/pages/refer-a-friend`. The Mother's Day and Valentine's delivery pages were fetched but not parsed.

## A. Observed facts

**1. Stack**
- Astro site, content in Prismic, product listings from Algolia (index `products_us`), Optimizely for A/B testing, GTM, Trustpilot widgets, and Cloudinary video in the product gallery.
- Product data comes from a Solidus/Spree backend.
- The hero CTA and the product grids render on the client only.

**2. Homepage, top to bottom (copy verbatim)**
1. Announcement bar: "Buy one book, get a second half price with code BOGO50"
2. Header:
   - Logo.
   - Four mega-menu dropdowns ("Our books", "Kids", "Adults", "Occasion").
   - One direct seasonal link, "Christmas", already live on Sep 22.
   - Search, account and cart.
3. Hero (a single slide, not a carousel):
   - H1: "Bedtime tales for little dreamers"
   - Subhead: "Our coziest personalized stories to lull them to the Land of Nod"
   - CTA: "Shop bedtime stories"
   - Lifestyle photo (mum and baby reading), with a separate mobile crop (780x660 vs 1920x1000). The image file is named "EVERGREENMARKETINGPUSH".
   - Lilac panel with a zigzag edge.
4. Trustpilot micro widget.
5. H2 "Personalize a bestseller": four cards, each with image, title, a one-line hook (e.g. "A festive sibling story") and a "Personalize" button. No prices on homepage cards. Two of the four are Christmas titles.
6. Brand block: "Ready… set… explore!" / "Search-and-find stories where they'll spot themselves on every page"
7. "Meaningful gifts, made in minutes", a four-step strip:
   - Find a book they'll love
   - Personalize it with care
   - Add a message ("We'll print your words on the very first page")
   - Give a gift to remember ("Something they'll want to keep forever")
8. "New in": four cards, two of them Christmas.
9. "Thoughtfully made": "Award-winning authors, illustrators and translators craft our books with care…"
10. SEO FAQ accordion with seven questions (Who is Wonderbly, How do I make…, How much…, etc.). It includes "Since 2013… delighted over 10 million happy readers".
11. "We've helped 10 million people make someone's day" plus a Trustpilot slider filtered to 4–5 star reviews only (`data-stars="5,4"`).
12. Newsletter: "Sign up to our newsletter and get $5 off your first order"
13. Footer:
    - Help, Delivery information, "Coupon codes & book discounts", Refer a friend, and a Penguin Random House link.
    - Payment icons: Visa, Mastercard, PayPal, Klarna, Amex, Apple Pay.
    - Trustpilot microstar and social links.

**3. CTA hierarchy**
- Each page has one primary action.
- Hero: category CTA. Cards: "Personalize". Product page: a single full-width "Personalize my book" (first person).
- There is no secondary CTA in the product buy box, no "Add to wishlist" and no quantity selector.
- Primary buttons are racing green `#1e5751` or near-black `#23231e`, with white text.

**4. How product is shown**
- Square gallery images (1160x1160) with side thumbnails on desktop.
- Lost My Name uses a Cloudinary video in the first slot.
- Together at Christmas starts with two animated GIFs ("GIF of different front covers", "GIF showing the personalized pages").
- Galleries mix interior spreads, kids holding the book, a testimonial image, and a closing "gift boxes on festive background" slide.
- Lost My Name has a mobile-specific first image (`Mobile_First_Carousel_01`).
- Every product page has a bullet reading "Preview all 22/34/36 pages before buying".
- No video on the homepage.

**5. Social proof**
- Trustpilot: 4.5 TrustScore, "Excellent", 89,981 reviews (widget API).
- Lost My Name product reviews: 4.8 from 1,714.
- Placement:
  - Stars and a "Read reviews" anchor sit directly under the product title.
  - A one-line quote with a first name sits beside the buy box, then a second quote ("Written by Lucy").
  - A full Trustpilot product-reviews widget (700px) sits further down.
  - Search for Santa uses a native review list instead ("Rated 4.7 out of 5", five named reviews).
- Scale claims are inconsistent: "10 million readers" (homepage), "over 9 million readers" (bestsellers page), "sold over 8 million" (Lost My Name FAQ).
- Each product page has a "Meet the illustrator/author" block with photo and bio.
- No press-logo bar and no UGC or Instagram gallery were observed.
- JSON-LD on product pages is Product plus Offer only, with no AggregateRating.

**6. Urgency and scarcity**
- No countdown timers or low-stock badges anywhere.
- Urgency is date-based:
  - `/pages/christmas-delivery`: "Get your gifts in time for Christmas", with a last-order-date table by US state (softcover only). Idaho and Utah are 19 Dec; about half the states are 17 Dec.
  - Format scarcity: "The closer you order to our final delivery dates, the more likely that we'll only have softcover books available."
  - At checkout, each shipping option is labeled "Standard (Get it by {date})"; tiers are Standard, Express and Priority express.
- Historical promo copy in Prismic (2022) includes "Ends midnight! Get 30% off 2+ books with code…", "Flash sale!", and "Very Earlybird Christmas Gifters" campaigns split into Grandparents and Early Buyers segments.

**7. Offers**
- Always-on multi-buy: BOGO50 (second book half price), shown in the announcement bar.
- The same offer appears as an interstitial card inside the product grid with a "Copy promo code" button. Two other grid cards rotate:
  - "Personalize your book in the blink of an eye…"
  - "Missing someone? We'll send their gift anywhere in the world."
- Other offers:
  - Newsletter: $5 off.
  - Checkout email opt-in: "Join our members email to get 20% off your next order."
  - Refer a friend: $20 off.
  - Bulk: 30% off 50+ books.
  - A Black Friday placeholder page.
- Terms: one code per order, and codes don't apply to shipping.
- No free-shipping threshold was observed; shipping is paid.
- PayPal Pay Later message sits directly under the product CTA; Klarna is listed in payment options.
- Price anchoring by format (Together at Christmas, US):
  - Softcover $26.99
  - Hardcover $41.99, badged "Most popular"
  - Layflat $59.99, badged "Lifetime keepsake"
  - The product page shows only "From $26.99 USD".
- Collection-page kids' books cost $24.99–$39.99.

**8. Product page anatomy, top to bottom**
1. Announcement bar and header.
2. Gallery.
3. Optional eyebrow social proof. Lost My Name: "THE STORY FAMILIES KEEP COMING BACK TO, YEAR AFTER YEAR"; its H1 is a claim, "The book that started Wonderbly. And never stopped being a favorite."
4. H1, stars plus "Read reviews", and the one-line subtitle.
5. A 2–3 sentence emotional description that ends on meaning, e.g. "…the best thing about Christmas is spending it with each other."
6. Four icon bullets: age ("Best for ages 0 to 8"), "Preview all N pages before you buy", "Printed and dispatched in 2-4 working days", "Upload a special photo".
7. Price ("From $X USD"), the full-width CTA, and the PayPal Pay Later message.
8. "Product details" accordion: "How is the book personalized?", "What's the story?"/"What's inside?", and "Size & quality" (e.g. "34 pages • 11.7" x 8.3" • Made in the USA • paper from sustainable forests").
9. Review quote and a second quote.
10. Story blocks: brand origin, Meet the illustrator, and a cross-sell block ("More Christmas books for kids").
11. Full reviews widget.
12. Product-specific FAQs (3–5), e.g.:
    - "Is this suitable for siblings of different ages?"
    - "What if I'm buying for step-siblings, adopted siblings or cousins?"
    - "What age is this… for?"
13. "Who are you buying for?": four recipient cards (babies, kids, family, adults).
14. Newsletter.
15. Mobile sticky bar with the same CTA (`.StickyBar`, `position:sticky`, `display:none` at ≥1040px).

**9. Personalization flow, cart and checkout**
- Stepper with celebratory microcopy ("Superlative dedication. Shakespeare would approve.", "Just one step to go!"), plus one-page and two-page preview.
- Formats step: "Choose a format for your book".
- Gift step: "Add a final flourish", "Choose from our collection of recyclable gift boxes and wraps". Includes a Deluxe gift box ("presentation-style box with gold foil detailing") and a "No giftwrap option". Parsed prices are roughly $6–15; the mapping to specific items is approximate.
- Add-ons step: "Wrap it up in magic", "Add one or more of these delightful extras" (sticker pack, coloring poster, activity book), with "Look inside", "Add to order" and "No thanks".
- Cart drawer: "Basket (n)", upsell "Who else in your life would love the magic of Wonderbly?" with "Add another item now", then "Go to cart".
- Checkout: three steps (Shipping Details → Delivery → Review & Pay; shortened on mobile to Shipping/Delivery/Pay), an "Express" payment separator, and "Coupon code / Apply coupon".
- Order-summary reassurance tiles (Delivery / Returns / Help).
- SMS checkbox: "Text me with news and offers".
- After purchase: order status tracker and "Edit ({x} hour(s) left)".

**10. Guarantee and returns**
- The policy is weak because the books are personalized: "Our books are wonderfully personalized so we can't always offer refunds or exchanges. However, you'll have a short window after you've ordered to make any changes."
- Misprints: "free post replacement service".

**11. Gift framing**
- Free dedication (up to 400 characters / 10 lines) and photo upload.
- Gift wrap: "arrives ready to go straight under the tree".
- Ship to the recipient: "We never include any invoices, pricing, or billing information in the package."
- Recipient-based navigation.
- Keepsake and tradition language: "perfect for bringing out year after year at Christmas time".
- Stocking-stuffer FAQ.

**12. Navigation**
- Deep taxonomy: age, occasion (including Easter and Baptism), recipient and theme, plus Algolia search.
- Collection pages: breadcrumb, H1 and subhead, filter/sort, "Load more… You've viewed X of Y", and SEO FAQ.
- The Easter collection has 13 products, only 2 of them Easter-specific. They re-tag evergreen books into seasonal collections.

**13. Mobile patterns**
- Sticky CTA bar.
- Mobile hero crop and mobile-first gallery image.
- Menu drawer.
- Shortened checkout step labels.

**14. Visual vibe**
- Background: kraft-paper cream (`#fbf4e8` / `#fdf8f1`).
- Primary: racing green `#1e5751`. Text: `#23231e`.
- Pastel accents: lilac `#cebcfa`, butter `#ffeba3`, lily-pad green `#9fe778`, sky `#d0ebff`, pink `#e98ec1`, orange `#d8460d`.
- Zigzag and wave section edges.
- Headings in serif "Rza" (weight 500); body in sans "Atak".
- Whimsical British copy voice ("helpful Angels", "stupendous sticker packs").

## B. Inferences (not verified)
- Christmas merchandising starts in September: the nav link and half of the featured cards are already Christmas.
- The discount-code habit (codes page, emails, BOGO) suggests an audience trained to wait for deals.
- The "mm_situation" parameter on the referral link suggests Mention Me as the referral platform.
- Christmas campaigns were segmented by audience (grandparents vs early buyers), so grandparents are a key buyer group.
- Baptism appears as an occasion. For a Latter-day Saint audience, baptism at age 8 is a strong second gifting moment.

## C. The 15 most transferable tactics, ranked (Next.js 16 + Shopify Storefront API)

1. **One primary CTA per page, plus a sticky mobile bar.**
   - Buy box has one full-width "Add to Cart" or "Get Both Books".
   - Add a sticky `<StickyBuyBar>` on narrow screens, shown once the main CTA scrolls out of view (IntersectionObserver), with price and CTA.
   - Paid-social landing pages should drop the full nav.
2. **A bundle offer that applies itself, with no code.**
   - Wonderbly's BOGO50 needs a code copied into checkout, which adds friction.
   - Create a "Complete Set" product (or use the Shopify Bundles app) with compare-at pricing for the strike-through, or an automatic discount.
   - Announce it in the announcement bar, in the buy box, and in the cart.
3. **Honest "Get it by" deadlines, not fake timers.**
   - Add a `<DeliveryPromise>` near the CTA: "Order by Dec 17 for Christmas delivery". It is computed from ship-from-Idaho cutoffs per shipping method and stored in config or metaobjects.
   - Add a `/christmas-delivery` page with the cutoff table, and show it in the announcement bar from Dec 1.
   - Reuse the same component for Easter (a moving date).
   - Shipping from stock is an advantage over their 2–4 day print time: "Ships from Idaho in 1 business day."
4. **Look inside, preview-before-you-buy.**
   - A "Take a Peek Inside" spread carousel.
   - A 20–30 second flip-through video in gallery slot 1, reusable as the Meta ad creative.
   - Animated cover/spread loops as lightweight video, not GIF.
   - A bullet: "See N sample pages".
5. **Rating and count right under the title, with an anchor to reviews.**
   - Use a reviews app with an API or metafields (Judge.me, Okendo or Yotpo).
   - Order: stars and count → quote next to the buy box → full reviews lower down with a photo-review filter.
   - Show 4–5 star quotes up top, but keep the full list honest.
   - Add AggregateRating to JSON-LD; Wonderbly omits it, so this is an edge for us.
6. **Icon reassurance stack under the description.**
   - Four bullets such as: "Ages 3–10", "32 illustrated pages", "Ships from Idaho in 1 day", and a content-trust point ("Scripture references included" or "Reviewed by…", only if true).
7. **Gift layer.**
   - Gift-wrap add-on (a Shopify product, or a line-item property plus a fee).
   - Free gift note (a cart attribute).
   - "Ship directly to them — no prices in the box."
   - Optional "Signed by the author" inscription, which Wonderbly cannot offer.
   - End the gallery with a gift-wrapped slide.
8. **Good-better-best tiers with a "Most popular" badge.**
   - Single book / Complete Set ("Most popular" / "Best value") / Gift Set (set, wrap and signed copy).
   - The top tier anchors the price and makes the set look reasonable.
9. **Cart drawer cross-sell and an order-value lever.**
   - A slide-out cart built on the Storefront API cart.
   - Upsell: "Complete the set — add Easter Journey and save $X".
   - Add a free-shipping progress bar; Wonderbly has none, but it is standard for $20–30 items.
10. **Product FAQ accordion that answers objections.**
    - Age fit, what the story covers, size and quality, shipping time, gift wrap, "Is this an official Church publication?" (answer honestly), and suitability for Primary or family home evening.
    - Add FAQPage JSON-LD.
11. **Seasonal re-merchandising and occasion landing pages.**
    - Swap the hero by season: Christmas Sep–Dec, Easter Jan–Apr.
    - Add a seasonal nav link.
    - Build one landing page per ad angle (grandparents, a Christmas Eve tradition, Easter with young kids, a baptism or Primary teacher gift).
12. **Email and SMS capture tied to the second holiday.**
    - Klaviyo pop-up on a delay or exit, offering "$5 off" or a free printable (coloring pages).
    - Email and SMS consent checkboxes at checkout.
    - Flow: Christmas buyers get the Easter launch, then next Christmas; each buyer is worth two seasonal purchases a year.
13. **Meet the author block.**
    - Tiffany's photo and story (Idaho mom, why she wrote it) on each product page and in a short About.
    - Trust in the author matters more to a faith audience than illustrator credits.
14. **Tradition and keepsake copy formula.**
    - Pattern: headline states the occasion or benefit; subhead is warm and specific; CTA is a verb plus the object; description ends on meaning.
    - Example: "The Christmas story your family will read every year."
    - First-person CTA: "Add my set to cart".
15. **Payment trust and express checkout.**
    - Shop Pay, Apple Pay and Google Pay on the product page and in the cart. On a headless build, check Shopify's Shop Pay button component for custom storefronts; if it isn't available, send buyers straight to checkout.
    - Payment icons in the footer and buy box.
    - Pay-later messaging only if the set's order value justifies it.

## D. Tactics that don't transfer, and why
- **Personalization engine** (name, character, live preview, photo upload, dedication): Tiffany's books are stock print runs. The nearest substitutes are a signed inscription (manual, limited capacity) and a gift note.
- **Mega-menu, Algolia search, and recipient/age/theme taxonomies:** she has two products. Navigation should be at most Shop, Look Inside, Reviews, About and Cart, and ad landing pages should have no nav.
- **Scale social proof** ("10 million readers", 89,981 Trustpilot reviews): she can't claim it truthfully. Use real counts and specific named testimonials, and skip Trustpilot at low volume.
- **Heavy coupon culture** (codes page, "mystery send" emails, "biggest sale of the year"): it trains buyers to wait and adds friction. Use one clean automatic bundle offer.
- **Weak returns policy:** it only exists because the books are personalized. She can offer a stronger guarantee, e.g. "Love it or your money back". Treat this as an advantage.
- **Multiple formats, jumbo/layflat editions, and add-on catalog** (stickers, posters): only relevant if those formats or items exist. Otherwise use tiers built from bundles.
- **Global shipping, country switcher, multi-currency, per-state print houses:** she sells US-only from Idaho, so the cutoff table becomes a few USPS delivery zones.
- **Post-purchase edit window and deep A/B testing:** these depend on print-on-demand and high traffic. At low volume, test only big swings (offer, hero).
- **Partial transfer, bulk pricing:** Wonderbly offers 30% off 50+ books. A "Ward/Primary bulk pricing (10+ copies)" option could work as a quiet side page.