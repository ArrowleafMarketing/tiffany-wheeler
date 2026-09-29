# Tiffany Wheeler DTC: market and conversion research, and landing-page strategy
Research date: 2026-09-22. [O] marks something I saw on a page. [I] marks my own inference. [V] marks a number from a vendor blog, which is a weaker source. Copies of the current site's pages are saved in `/private/tmp/claude-501/-Users-ryanmata-Desktop-Arrowleaf-Marketing-tiffany-wheeler/86c2c9b5-128c-496e-bb63-b781462a7d36/scratchpad/market-cro/`.

---

## 0. Current site findings

**Platform and products**
- [O] The site runs WordPress 7.1.2, WooCommerce 11.1.0 and the WPBakery page builder.
- [O] The Nephite Christmas product page loads 66 external script tags and 31 stylesheets.
- [O] One test from here took 0.89s to first byte. Google's speed-test API was over its daily quota, so I have no lab score.
- [O] The public product list comes from `/wp-json/wc/store/v1/products`. It also shows a "WooCommerce Automated Testing Product" to the public.

**Product facts**
- [O] Book title is **"Nephite Christmas"**, not "A Nephite Christmas".
  - Amazon calls it a hardcover with 36 pages, 10x8.5 in, "Reading age 3+", published by Rhino Media on 2024-09-16, ISBN 979-8989343553.
  - Other listings say 26 pages, so the page count needs confirming.
  - It is written in the rhythm of "'Twas the Night Before Christmas". The story comes from 3 Nephi 1 (Samuel the Lamanite's sign). Illustrator is **Kelley Hicken**.
- [O] **"Easter Journey"**: hardcover, 9x11 in, 46 pages, dust jacket.
  - It includes a seek-and-find and discussion questions. It can be read aloud, used as a reader's theater, or used as a "family advent" before Easter.
  - The Easter page says: "made to be shared by Christians of every denomination." That makes its audience wider than Nephite Christmas.
  - The related puzzle is named "The Promised Messiah – An Easter Journey Puzzle."

**Prices**

| Product | Regular | Current (sale) |
|---|---|---|
| Nephite Christmas | $24.99 | $22.49 |
| Easter Journey | $29.99 | $29.99 |
| Both-book bundle | shown as $59.98 | $49.98 |
| Nephite Christmas + coloring book | $32.98 | $29.68 |
| Nephite Christmas + coloring book + ornament | $35.97 | $32.37 |
| Coloring book | $7.99 | |
| Ornaments | $2.99 each | |
| Nephite Christmas PDF | $6.99 | |
| Nephite Christmas digital bundle | $15.97 | |
| Easter Journey PDF | $8.99 | |
| Easter Journey puzzle | $24.73 | |
| Canvas print | $22.92 | |
| Nephite Christmas wholesale | $12.50 | |

**Pricing problems**
- [O] **The bundle's crossed-out price is inflated.** $24.99 + $29.99 = $54.98, but the page shows $59.98 as the original. The copy says "$49.99" while the price is $49.98.
  - Real savings are $5.00 (9%) against regular prices, or $2.50 against the current Nephite Christmas sale price. That is a weak reason to buy the set, and the inflated price is an FTC pricing risk (see §4).
- [O] **Amazon undercuts the site.** Nephite Christmas sells for **$20.85** with Prime shipping and 5.0 stars from 22 ratings. I could not find Easter Journey in Amazon's book search, so it looks like a direct-only title.
- [O] A sitewide sale is always on: "$5 off books, $3 off coloring books, free ornament over $50, free digital bundle over $75, Hurry! Sale ends in: [timer]". A timer that never really ends hurts trust and carries legal risk.

**Reviews and social proof**
- [O] Nephite Christmas has **20 five-star reviews** on site and 22 on Amazon.
  - Reviewers keep mentioning the same uses: a **Christmas Eve program or nativity play**, **kids finding the dove on the pages**, and the **Samuel story**.
  - There is a testimonial from **"Kim and John Bytheway."** John Bytheway is a well-known Latter-day Saint speaker and author who publishes with Deseret Book.
  - Easter Journey has **0 reviews**, and so does the both-book bundle.
- [O] Stores carrying Nephite Christmas: Eborn Books (Provo), the BYU Store, Barnes & Noble (Sandy), and This Is the Place Bookstore (Palmyra, NY and Kirtland, OH).
- [O] Existing perks: 10% off orders of 5+ books, and local pickup in Boise.
- [O] The Easter Journey Kickstarter raised $1,976 of a $3,000 goal from 32 backers and did not fund. Don't use it as social proof. The 32 backers are people you could ask for reviews.

**Past promotions (from the media library)**
- [O] General Conference 20% off, code GENCONF.
- [O] Black Friday $5 off, 11/28–12/2.
- [O] "Final Week Blowout BOGO 50%, order before Dec 19."
- [O] "Final day to order… December 19th, for most states, not guaranteed." This banner uses a stock photo of a delivery man and misspells "RECIEVE".

**Assets that support a "Peek Inside" section**
- [O] Full interior spread PDFs for both books: `Spreads-Nephite-Christmas.pdf` and `Easter-Journey-Spreads-*.pdf`.
- [O] Trailer videos in vertical and horizontal 1080: `Vertical-1080.mov`, `Horizontal-1080.mov`.
- [O] Photos from book signings.
- [O] Free printables: nativity kit, origami dove, wallpapers, coloring pages.

**Brand**
- [O] The header tagline "Connection Is The Cure" belongs to her other project (Connection Crates). It does not match the books.
- [O] The About page includes her 2022 breast cancer story, her six children, living near Boise, and teaching early-morning seminary.

---

## 1. Competitors

### Prices of similar hardcover picture books

| Product | Seller | Price | Positioning |
|---|---|---|---|
| **A Book of Mormon Christmas** (Kendall) | Cedar Fort | $16.99 HC / $12.99 PB | Nephite nativity "in picture, verse, and song"; family night and Primary use |
| **Papa's Book of Mormon Christmas** | Cedar Fort | $14.99 HC | Grandpa tells the story at Christmas; ages 8 and under |
| **A Book of Mormon Easter** | Cedar Fort | $14.99 HC / $12.99 PB | Resurrection story "in picture, verse, and song" |
| Angels Foretold of Baby Jesus | Cedar Fort | $13.59 (list $16.99) | Birth prophecies from the Bible and Book of Mormon |
| The Symbols of Easter / The First to See: Mary's Easter Story | Cedar Fort | $16.99 | Symbols and teaching |
| Mini Ministers: Jesus Christ 25 Days 25 Ways | Cedar Fort | $16.99 | Advent-style service countdown |
| Celebrating a Christ-Centered Christmas (Children's Ed.) | Deseret Book / Amazon | ~$17.99 list | "Family traditions," 7 days of Christ-centered Christmas |
| Christmas from Heaven | Deseret Book | $21.99 HC | |
| Keepsake Christmas Stories / Witnesses of Christmas | Deseret Book | up to $24.99 / $25.99 | Keepsake, heirloom |
| The Book of Mormon Storybook V1 | forlittlesaints.com (independent author) | $29.95 HC, cloth binding | Premium art-book; free shipping at $60 |
| **Holy Week Easter Countdown Set** | holyweekset.com (single-product Shopify site) | **$120** | "Make Easter Mean More." Wooden track plus daily book from Palm Sunday |
| Holy Week for Latter-day Saint Families (Rosborough) | Deseret Book / Amazon | price not captured | Day-by-day Holy Week guide |
| Book of Mormon advent scripture cards, Samuel the Lamanite activities | Etsy | low-cost printables | Tied to Come, Follow Me |

Sources:
- https://www.cedarfort.com/products/a-book-of-mormon-christmas
- https://www.cedarfort.com/collections/childrens-books-lds
- https://deseretbook.com/t/books/christmas/christmas-childrens
- https://deseretbook.com/t/books/childrens/religious-picture-books
- https://forlittlesaints.com/product/bmsb-v1/
- https://www.holyweekset.com/
- https://www.amazon.com/Holy-Week-Latter-day-Saint-Families/dp/1629721484
- https://www.etsy.com/listing/485300087/book-of-mormon-advent-scripture

**What this means**
- [I] Religious picture books from the big publishers cluster at **$14.99–$18.99**, with sales down to $4–$10.
  - Nephite Christmas at $24.99 and Easter Journey at $29.99 are **premium**.
  - The price has to be earned on the page: format (9x11 with dust jacket), rhyme, seek-and-find, "keepsake tradition," signed by the author.
  - It cannot be earned by competing on price.
- [I] A Holy Week tradition product can sell for $120. Buyers pay heirloom prices for an "annual Easter tradition." Easter Journey should be sold as a **Holy Week family experience**, not just a book.
- [I] The only direct competitor on the Nephite Christmas story is Cedar Fort's *A Book of Mormon Christmas*, first published in 2011 and cheaper. Nephite Christmas stands apart with modern art, the "Night Before Christmas" rhythm, a hidden dove to find, and reviews.

### Shipping charges elsewhere
- [O] Deseret Book: free shipping on orders of **$49+**.
- [O] Cedar Fort: free on **$40+** (contiguous US).
- [O] For Little Saints: free on **$60+**.
- [O] Slumberkins: free on **$100+**, with a progress bar in the cart drawer.
- [O] Seagull Book: threshold not confirmed (reported as $50, varies by promotion).
- [I] A free-shipping threshold of about $45–50 matches this category.

### Advent and tradition tie-ins (checked)
- **Come, Follow Me** is the Church's home-study schedule. Each year covers one book of scripture:
  - 2024: Book of Mormon.
  - 2025: Doctrine and Covenants.
  - **2026: Old Testament.** Dec 14–20 is Malachi; Dec 21–27 is a "Christmas" lesson.
  - **2027: New Testament.** Jan–Mar covers the Gospels. The **Easter lesson is Mar 22–28, 2027**, which lands exactly on Holy Week 2027 (Easter is Mar 28).
  - **2028 should be the Book of Mormon year again** [I, based on the 4-year rotation]. That would be Nephite Christmas's biggest year.
  - Sources: https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026?lang=eng and https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-new-testament-2027?lang=eng
- [I] **The Come, Follow Me hook is strong for Easter Journey in 2027.** The people in the book (the blind man, the apostles, Mary, the women at the tomb) are the Gospel stories families will be studying Jan–Mar 2027.
- [I] The hook is weak for Nephite Christmas in 2026. Lead with "the Christmas story from the Book of Mormon most families have never read aloud" and the Samuel sign, not the curriculum.
- **Light the World** is the Church's December campaign. The 2025 theme invited people to "add the Light of Jesus Christ to their Christmas traditions" (video released Nov 30, 2025).
  - That fits "start a new Christmas tradition" closely.
  - The 2026 theme was not announced as of today; recheck in November.
  - Sources: https://www.thechurchnews.com/living-faith/2025/11/30/light-the-world-video-and-initiative-add-christ-light-to-traditions/ and https://newsroom.churchofjesuschrist.org/article/light-the-world-2025
- The Church is encouraging a more Christ-centered Easter. President Dallin H. Oaks invited members to "deepen their Easter observance," and wards are running eight-day Holy Week calendars.
  - The "higher and holier" wording on Tiffany's Easter page echoes Church leaders' messaging. Use the idea, but don't attribute a quote to a leader.
  - Source: https://newsroom.churchofjesuschrist.org/article/how-latter-day-saints-are-celebrating-easter-in-holier-ways
- **General Conference** is Oct 3–4, 2026 (11 days away) and Apr 3–4, 2027 (after Easter). Tiffany has run a Conference sale before.

---

## 2. Seasonality plan

### Key dates
**Christmas 2026**
- Oct 3–4: General Conference sale window.
- Nov 26: Thanksgiving. Nov 27–30: Black Friday through Cyber Monday.
- About Dec 1: Light the World begins (runs Dec 1–25 in 2025).
- **USPS 2026 "ship by" dates for the lower 48:**
  - Ground Advantage and First-Class: **Dec 17**
  - Priority: **Dec 18**
  - Priority Express: **Dec 19**
  - Source: https://postalemployeenetwork.com/news/2026/09/22/usps-recommends-2026-holiday-mailing-shipping-dates/
  - Avoid Media Mail in December. It is cheapest (about $4.39 for the first pound retail in 2026 [V]) but slow and has no guaranteed dates.

**Easter 2027**
- Ash Wednesday: Feb 10 (Lent begins; relevant for the broader Christian audience).
- Palm Sunday: Mar 21. Good Friday: Mar 26. **Easter: Mar 28, 2027** (early, so a short season).
- Sources: https://www.farmersalmanac.com/when-is-easter and https://www.timeanddate.com/holidays/us/palm-sunday

**Demand data**
- NRF 2025: 42% of holiday shoppers planned to start before November, and 56% had started by the first week of November.
- NRF Easter 2026: $24.9B total, 64% buying gifts, 34% shopping online.
- Sources: https://nrf.com/research-insights/holiday-data-and-trends/winter-holidays and https://nrf.com/media-center/press-releases/easter-spending-expected-to-reach-a-record-24-9-billion

### Season modes (drive from a date-based config in Next.js, Mountain Time)
1. **Christmas: Sept 15 – Dec 25.**
   - Nephite Christmas leads the hero. The Complete Set is second.
   - The announcement bar changes by week: free shipping on the set → Black Friday offer → shipping cutoff countdown.
2. **Last-minute: Dec 18 – Dec 24.**
   - Hero switches to the **instant PDF** plus a printable "gift certificate / your book ships Dec 26" card.
   - Local Boise pickup runs through about Dec 23.
3. **After Christmas: Dec 26 – Jan 4.**
   - Digital products, and "a tradition for next year."
   - Start teasing Easter Journey (the 2027 New Testament study starts Dec 28).
4. **Easter: Jan 5 – Mar 28.**
   - Easter Journey leads. Plus the "Holy Week plan" printable and the puzzle.
   - Physical cutoff about Mar 15–16 so books arrive before Palm Sunday. Digital runs through Easter.
5. **Off-season: Apr – mid-Sept.**
   - Evergreen "both holidays" page, email capture, wholesale and ward bulk orders, "Christmas in July."

### Tactics
- **Answer "will it arrive in time?" everywhere.**
  - Sitewide bar: "Order by Dec 15 for Christmas delivery." Set Tiffany's own cutoff 1–2 days before USPS to cover packing time from Eagle, ID.
  - Next to Add to Cart: a dynamic "Get it by [date]" line, the way Wonderbly calculates delivery dates at checkout and publishes last-order pages by holiday (https://www.wonderbly.com/pages/christmas-delivery).
  - A cutoff ladder by shipping method: signed or inscribed (about Dec 11–12), standard (Dec 15), Priority (Dec 17), Express (Dec 18).
  - Timers must reflect real deadlines. Vendors claim 8–18% lifts from real deadline timers [V], so treat that number as directional.
- **Pre-orders:** use Shopify selling plans for pre-orders (supported through the Storefront API). Show the ship date on the product page, in the cart and in email. This is required under the FTC Mail Order Rule (§4).
- **Gifting:**
  - Gift note (a cart attribute) and ship to a different address (native in Shopify checkout).
  - **Signed copy, optionally with a personal inscription.** Amazon can't offer this, which answers the $20.85 Amazon price.
  - A gift-wrap add-on. Gift receipt with no prices.

---

## 3. Conversion research for paid-social landing pages

Baseline benchmarks:
- Littledata: average Shopify conversion is about 1.4%. Top 20% is above 3.2%; top 10% is above 4.7%. https://www.littledata.io/ecommerce-conversion-rate
- Unbounce: the median ecommerce landing page converts around 4.2%. https://unbounce.com/average-conversion-rates-landing-pages/

Topics, with evidence and how they apply:

1. **Match the ad and use a dedicated landing page.** [O/I]
   - Focused single-offer landing pages beat homepages for paid traffic; Unbounce's median across all landing pages is 6.6% [V-ish].
   - DTC Newsletter (Dec 2025): long "advertorial" pre-sell pages suit products over $150 that need explaining. For impulse or lower-priced items, **product and collection pages usually win**. https://www.directtoconsumer.co/newsletter/dtc968-presell-pages-financial-case-for-cro-and-speed-up-video-performance
   - So: build **short, product-first landing pages, one per ad angle**, not advertorials.
2. **Page speed.**
   - Deloitte/Google, "Milliseconds Make Millions" (2020, 37 brands): 0.1s faster on mobile gave +8.4% retail conversions and +9.2% order value. https://web.dev/case-studies/milliseconds-make-millions
   - For Meta ads, landing page views divided by link clicks should be above 70% [V].
   - Meta clicks open in the Facebook/Instagram in-app browser.
3. **Fast checkout.**
   - Shopify: Shop Pay converts up to 50% better than guest checkout and at least 10% better than other fast-checkout buttons (study by a "Big Three" consulting firm, April 2023). https://www.shopify.com/blog/shop-pay-checkout
   - Shopify BFCM 2025: 32% of orders used Shop Pay; average cart was $114.70. https://www.shopify.com/news/bfcm-data-2025
   - **Apple Pay often does not appear inside the Facebook/Instagram in-app browsers.** https://github.com/stripe/stripe-payments-demo/issues/84 and https://community.shopify.com/t/apple-pay-g-pay-not-available-on-cart-page-when-clicked-through-from-instagram-bio-or-facebook/16591
   - So Shop Pay and PayPal carry more weight for this traffic. Shopify's `ShopPayButton` component works in headless Next.js: https://shopify.dev/docs/api/hydrogen-react/latest/components/shoppaybutton
4. **Surprise costs.**
   - Baymard: 70.22% average cart abandonment. Extra costs (shipping, tax) are the top fixable reason, cited by 39% of US abandoners. https://baymard.com/lists/cart-abandonment-rate
   - Show shipping cost or the free-shipping rule **above the fold**.
5. **Bundles, free-shipping threshold, and add-ons.** [I]
   - Common rule of thumb: set the threshold 20–30% above the typical order [V].
   - With $25–30 books, a **threshold near $45–50** means one book doesn't qualify and the set does. The whole offer should rest on that.
   - Add-ons for the cart drawer: ornament $2.99, coloring book $7.99, and a **"one for each grandchild's family" quantity discount** (3+).
   - Bundle lift numbers of +20–30% order value are all vendor-reported [V].
6. **Where reviews go.**
   - Spiegel Research Center: five reviews make a purchase 270% more likely than zero. The lift is +190% for lower-priced items, and purchase likelihood peaks at ratings of 4.0–4.7. https://spiegel.medill.northwestern.edu/how-online-reviews-influence-sales/
   - Put stars and the review count next to the price. **Easter Journey (0 reviews) needs genuine reviews collected before January.**
7. **Sticky mobile Add to Cart.**
   - GrowthRock A/B test: +7.9% orders on desktop. On mobile, a drawer-style sticky bar gave +5.2% orders; a plain "scroll to section" version showed no change. https://growthrock.co/sticky-add-to-cart-button-example/
8. **Email and SMS capture.**
   - Omnisend 2025 (1.24B popup views): average popup converts 2.1%. A 6–10 second delay converts 2.4%; showing immediately converts 1.9%. Mobile-optimized forms 2.2%. Four or more fields drop to 1.5%. Discount offers 2.4% vs 1.7% without. Spin-to-win 3.5%. https://www.omnisend.com/blog/email-popup-statistics/
   - Klaviyo's target is 3% or more. https://www.klaviyo.com/blog/sign-up-form-best-practices
   - Klaviyo: abandoned-cart emails earn the most per recipient ($3.65 on average) with a 3.33% order rate. https://www.klaviyo.com/blog/abandoned-cart-benchmarks
   - [I] Skip spin-to-win; it doesn't fit the tone. Offer a **free printable matched to how reviewers use the book:**
     - "Nephite Christmas Eve family program" script.
     - "8-day Holy Week reading plan for Easter Journey."
     - Optionally add a small first-order discount.
9. **Upsell after purchase.**
   - ReConvert reports a 4.7% average take rate across 40k+ merchants [V]. https://www.zipchat.ai/blog/post-purchase-upsell-strategies
   - Shopify's post-purchase offer page runs on Shopify's hosted checkout, so it works with a headless storefront. https://shopify.dev/docs/apps/build/checkout/product-offers/build-a-post-purchase-offer
   - Offer: the other holiday's book at a set discount, or the coloring book plus ornament.
10. **Quiz funnels.** [I] Low value with only two books and one decision. Skip them.
11. **Ad copy rules.**
    - Meta ad copy may not "assert or imply" religion. "Are you Christian?" is not allowed; "Date Christian singles!" is. https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/
    - Meta also removed religion-based targeting options, so the creative and landing page do the targeting.
    - Describe the book ("A Book of Mormon Christmas story in the rhythm of 'Twas the Night Before Christmas"). Never address the viewer's faith ("LDS moms, …").

---

## 4. Audience, tone and legal

**Tone and imagery** [I, backed by practitioner guidance]
- Warm, reverent and family-centered. Honest urgency (real shipping dates) instead of "BLOWOUT BOGO" red banners and stock delivery photos.
- Show real families reading together, Christmas Eve scenes, the book's own art, and hands turning pages. Modest dress.
- Don't use Church-owned art, temple photos or images of Church leaders.

**Trust signals**
- A real author: mom of six in Idaho, with her story in her own voice.
- Illustrator credit.
- 5.0 stars from 20+ reviews on site and 22 on Amazon.
- The Bytheway testimonial.
- **Stores that carry the book** (BYU Store; This Is the Place Bookstore in Palmyra and Kirtland). Confirm she's allowed to name them.
- "Ships from Idaho," a clear returns promise, and a real contact email.

**Two audiences**
1. Nephite Christmas is for Latter-day Saint families (concentrated in Utah, Idaho and Arizona).
2. Easter Journey also reaches **all Christians**. The broad-audience Easter page should:
   - Avoid Church-specific terms (Primary, family home evening, Come, Follow Me).
   - **Not push the Nephite Christmas bundle as the main offer.** Cross-sell the Easter Journey puzzle and PDF instead.
   - A separate Latter-day Saint version can mention the 2027 study year.

**Buyer types**
- Moms, the main buyer.
- Grandmothers buying several copies. They need larger text, PayPal, and a visible phone number or email.
- Primary teachers and ward leaders, who buy in bulk or buy the PDF to project at ward parties (the PDF listing already targets this use).

**Church trademarks and naming**
- "Book of Mormon," "Mormon," "LDS" and Church logos are Church trademarks.
  - Don't use them in a brand, product or company name in a way that implies affiliation.
  - Describing the book as "inspired by the Book of Mormon" is common in the market; Cedar Fort sells a book titled *A Book of Mormon Christmas*.
  - Referring to a named Church program ("pairs with Come, Follow Me study") is generally allowed. Don't use the Come, Follow Me or Light the World logos, or the #LightTheWorld tag in paid ads.
- Use a footer disclaimer, as the Church itself suggested in one of its disputes: "Independent publication; not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints."
- Church style guide: say "Latter-day Saint(s)." Avoid "Mormon Church" and "LDS Church." Whether to use "LDS" for search terms is Tiffany's call.
- Sources:
  - https://www.churchofjesuschrist.org/reference/trademark-guidelines?lang=eng
  - https://newsroom.churchofjesuschrist.org/article/getting-it-right-clarifying-trademark-branding-concerns
  - https://newsroom.churchofjesuschrist.org/style-guide

**FTC rules**
- **Reviews rule** (in effect since Oct 21, 2024): no fake or AI reviews, no hiding negative reviews, and incentives can't depend on the review being positive. Penalties are up to $51,744 per violation. https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers
- **Endorsement Guides:** the Bythewell note suggests they received a copy. If it was free, disclose that when using it in ads, and get their written permission.
- **Former-price comparisons:** a crossed-out price must be a real price the item was sold at. **Fix the $59.98 bundle price**, or label it "$54.98 if bought separately." https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233/section-233.1
- **Mail Order Rule:** you need a reasonable basis for any shipping promise (or ship within 30 days), and you must send delay notices with a cancel option. This applies to pre-orders and "arrives by Christmas" claims. https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule
- Also: accessibility (aim for WCAG 2.1 AA), and don't collect children's data.

---

## 5. Recommendations, ranked by expected effect on conversion

1. **Seasonal landing pages that match the ads, built as fast static pages.**
   - One per angle, for example `/lp/christmas-tradition`, `/lp/grandparent-gift`, `/lp/easter-holy-week`.
   - Use static routes rather than reading URL parameters, to keep them fast.
   - Header without navigation, the offer above the fold, and the same pixel ID carried over from the Woo site.
2. **Rebuild the offer.**
   - A "Complete Set" (both books, plus ornament and printable) at about $49.99 with **free shipping**.
   - Free shipping starts around $45–50, so a single book doesn't qualify.
   - Honest crossed-out price. Pre-select the set, or the book + coloring book + ornament option in December.
   - Direct-only extras (signed copy, ornament, printable) answer the $20.85 Amazon price.
3. **Show delivery certainty.**
   - Cutoff bar, a dynamic "Get it by" line next to Add to Cart, the cutoff ladder by method, and the digital pivot after Dec 17. Easter version with a Mar 15–16 cutoff.
4. **Make checkout quick.**
   - Shopify hosted checkout with Shop Pay, PayPal and Google Pay. Also add a Shop Pay button on the product and landing pages.
   - Guest checkout. Shipping cost stated before the cart.
5. **Put social proof next to the price.**
   - Stars and review count, the Bytheway quote (with permission), customer photos, and the list of stores.
   - **Collect Easter Journey reviews now** from Easter 2026 buyers, the 32 Kickstarter backers and advance readers. Import the 20 Woo reviews into the new review app.
6. **"Peek Inside" and video.**
   - 4–6 spreads from the PDFs, the vertical trailer, and a callout like "find the hidden dove on every page."
   - Use the same clips as the ads so the page matches.
7. **Mobile speed budget.**
   - LCP under 2.5s on 4G, `next/image`, few third-party scripts (pixel, Klaviyo and reviews loaded late).
   - Track landing page views divided by link clicks, aiming for 70% or more.
8. **Sticky mobile Add to Cart**, showing the selected option and its price, after the hero scrolls away.
9. **Cart drawer.**
   - Free-shipping progress bar, one-tap ornament and coloring book add-ons, a quantity discount for 3+ copies, and a gift note field.
10. **Email and SMS capture plus Klaviyo automations.**
    - Popup with the free printable after a 6–10 second delay or on scroll, with email only.
    - Automations: welcome, abandoned cart and checkout, shipping-deadline campaign, and post-purchase review request.
11. **Post-purchase one-click upsell** of the other holiday's book or the add-ons.
12. **Bulk and ward path**: 5+ copies for 10% off, a wholesale link, and the PDF for projecting at ward events.
13. **Tracking**: Meta pixel and Conversions API across both the storefront and Shopify checkout (checkout runs on a separate Shopify-hosted domain). Redirects from the old `/product/...` URLs.
14. Skip quizzes and advertorials for now.

---

## 6. Proposed section order

### (a) Homepage (changes with the season; Christmas version shown)
1. Announcement bar: free shipping on the Complete Set, or the order-by date.
2. Header: logo, Books, Complete Set, Freebies, About, cart.
3. Hero:
   - Both books.
   - Headline: "Two Christ-centered traditions your family will keep."
   - Primary button "Get Both Books – $49.99, free shipping"; secondary "Shop individually."
   - Stars and review count. In Christmas season, Nephite Christmas is visually first.
4. Trust row: free shipping on the set, signed by the author, 5-star reviews, gift-ready, ships from Idaho.
5. Two product cards: cover, subtitle, short blurb, ages, pages and size, price, quantity, Add to Cart.
6. Complete Set bar: honest crossed-out price, what's included, Add Set.
7. Peek Inside: tabs per book with spreads and the video.
8. Reviews: the featured Bytheway quote plus review cards.
9. "How families use them": Christmas Eve program, Holy Week advent, Primary and family night. Email capture with the printable goes here.
10. Add-ons row: ornaments, coloring book, PDFs, puzzle.
11. Meet Tiffany and Kelley.
12. Where to find it: store names, bulk and ward orders, wholesale.
13. FAQ: ages, size, shipping and cutoffs, signed copies, returns, "Is this Church-published?"
14. Email signup, then footer with the disclaimer and policies.

### (b) Ad landing page (Nephite Christmas, mobile-first)
1. Slim bar: "Order by Dec 15 for Christmas · Free shipping on the set."
2. Hero:
   - Headline taken from the ad, for example "The Book of Mormon Christmas story, in the rhythm of 'Twas the Night Before Christmas."
   - Stars and review count. Book, ornament and coloring book image.
   - **Option picker:** Book / Book + Coloring + Ornament / Complete Set with both books.
   - Price, Add to Cart, Shop Pay button, "Get it by [date]" line.
   - Micro-trust line: signed, returns, secure checkout.
3. Peek Inside carousel plus 20–30s flip-through video.
4. Three reasons, one line each: rhythm and rhyme, find the dove, Samuel's sign from 3 Nephi 1.
5. Reviews: Bytheway quote plus 4–6 cards mentioning Christmas Eve and grandkids, and the "22 five-star ratings on Amazon" line.
6. "Make it your Christmas Eve tradition": the free family-program printable, delivered by email or with the order.
7. Value stack for the offer, then a second call to action.
8. Short author bio with photo.
9. FAQ: 5–6 items, including shipping cutoffs and Church affiliation.
10. Final call to action with a guarantee. Minimal footer with the disclaimer. **Sticky Add to Cart bar** appears after the hero.

The Easter version uses the same order. Swap in: "8-day Holy Week journey from Palm Sunday to Easter," the seek-and-find, the reader's-theater use, the Mar 15–16 cutoff, and the puzzle/PDF cross-sell. There is a general-Christian variant and a Latter-day Saint variant that mentions "pairs with the 2027 New Testament study." The mockup the client likes covers sections 3–5 and 7–8 of the homepage. The main things it's missing are the delivery date, stars next to the price, FAQ, email capture and the sticky mobile button.

---

## 7. Questions for the client
1. Shipping:
   - What does she charge now, and what does it cost her per 1 and 2 books?
   - Who packs and ships, and how many days does it take?
   - Can she offer signed or inscribed copies, and until what date in December?
2. What does each book cost her to print? That sets how deep discounts and free shipping can go.
3. Was the 2025 "BOGO 50%" or GENCONF 20% her best promotion? Does she have sales numbers by channel?
4. Written permission to use the Bytheway testimonial in ads, and did they receive a free copy? Permission to name the stores that carry the book?
5. Nephite Christmas page count: 26 or 36?
6. Is Easter Journey on Amazon or in stores? Can she get reviews from Easter 2026 buyers?
7. Does she want an October General Conference promotion (Oct 3–4) on the current site while the new one is built?
8. Target launch date: I recommend being live and tested by about **Nov 2, 2026**, before Black Friday (Nov 27), so the ad account has time to learn. Is that feasible?
9. Is she comfortable using "LDS" for search terms, or only "Latter-day Saint"?
10. Should the cancer story on her About page appear on the sales pages?