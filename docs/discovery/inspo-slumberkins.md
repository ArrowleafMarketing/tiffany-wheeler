# Slumberkins conversion teardown, for the Tiffany Wheeler build (2026-09-22)

**How this was gathered:** I pulled the server-rendered HTML with curl. That covered the homepage, `/products.json?limit=250`, `/collections/all`, sets, books, `build-your-own-bundle` and `holiday-sale`, the gift-guide, FAQ, shipping, loyalty-FAQ, our-story and HSA pages, and 7 product pages. I also fetched the dynamic cart and card templates (`/collections?__modals_data=true`), the Klaviyo form config and the Privy campaigns. No JS was run, so anything drawn only in the browser is marked as an inference.

**Platform:** Shopify, store `spoon-moon.myshopify.com`. The theme is built on Platter (Alpine.js, Tailwind, Barba.js page transitions).

## 1. Homepage, top to bottom (quotes are exact)
1. **Announcement bar:** "Free U.S. Shipping On Orders Over $100". It rotates.
2. **Free-shipping progress bar:** appears only when the cart has items. Target is $100. Copy is "Add [difference] more for free US shipping!", which becomes "Free shipping unlocked! 🚚". Bar colour is #077496.
3. **Nav:** logo, Shop All, About Us, Resources, For Educators, Rewards, Parenting Book, then search, account and cart icons.
4. **Hero carousel (3 slides, one CTA each):**
   - **Slide 1**
     - H2: "Calm with Capybara"
     - Subhead: "Capybara helps children tune into their bodies and move through big feelings with simple somatic practices."
     - CTA: "SHOP NOW", linking to a collection.
   - **Slide 2**
     - H2: "Carry The Colors Within"
     - Subhead: "Discover the story and surprise companions that help kids celebrate their emotions from the inside out."
     - CTA: "Order Now", linking to a product.
   - **Slide 3**
     - H2: "There's More Beneath / Mad Feelings"
     - Subhead: "Help kids look beneath big reactions to understand what they're really feeling and need."
     - CTA: "order now", linking to a product.
   - **The formula:** [character] + [verb/outcome] as the headline. The subhead says "helps kids [do skill]". The CTA goes straight to the product page.
5. **Press logo marquee:** ESPN, Motherly, Romper, Good Housekeeping Seal, Yahoo, The Bump, Goop.
6. **"Shop Our Bestsellers":** a slider with tabs for Kins, Books and Curriculum. Its first 10 items are all plush + book bundles.
7. **"HOW IT WORKS", in 3 steps:**
   - "Our books teach emotional lessons."
   - "Our plush creatures bring lessons to life."
   - "Our affirmations build an inner voice that lasts a lifetime."
8. **Press pull-quotes:**
   - Good Housekeeping: "Think of it as social emotional learning that kids can snuggle."
   - Romper: "…safety and support during the most crucial times of childhood."
   - Motherly: "These snuggly toys help little kids handle big feelings."
9. **Stat and claim tiles, each with a link:**
   - "Over 1.5M books & creatures in little hands." / READ REVIEWS
   - "Used by educators in classrooms across all 50 states." / FOR EDUCATORS
   - "Research backed and founded by a teacher and a therapist." / OUR STORY
   - "Parent trusted. Kid approved."
   - "Created in line with highest safety standards."
10. **Founders block:** "Meet Kelly & Callie". Quote: "Teachers call it science. Parents call it magic. We know it's a little of both." CTA: Our Story.
11. **Partner logos:** We Rock The Spectrum, Ronald McDonald House Charities, Kendra Scott Foundation, Seacrest Studios.
12. **Shop by Category tiles:** Kins, Snugglers, Books, Activities, Sets, Minis.
13. **Reviews block:** "10,000 + 5-STAR REVIEWS", one quote from "Meghan B.", and "Read more reviews".
14. **"More Ways for Parents & Kids to Grow":** Parenting Book, "Emmy-Nominated Series on AppleTV+", Free Resources, App, Music, Blog.
15. **Email block:** "Join the SlumberFam." / "Join the SlumberFam to stay in the loop on new products, resources, promotions, and more!"
16. **Footer:** a second newsletter signup and a large link list, including HSA/FSA, Military, Foster Care and Registry.

**CTA hierarchy**
- **Primary button:** filled pill, #077496 with cream text, 50px radius, at least 52px tall, uppercase 14px/600 with 1.4px letter-spacing. Used for hero CTAs, Add To Cart and Checkout.
- **Secondary:** uppercase text links such as Shop All, READ REVIEWS, OUR STORY and READ FAQS.
- **No dual CTA:** the homepage never pairs two buttons in the hero, unlike our mockup.
- **Prices:** none above the fold. They first appear in the Bestsellers slider.
- **Inference:** a "Kinect" app loads `/apps/kinect/lp-assets/kinect-experience.js`, which suggests paid traffic lands on dedicated landing pages rather than the homepage.

## 2. How they frame outcomes for parents
- **Skill labels on every product:** the skill appears in a handwritten font ("Conflict Resolution"), and the product page shows "Promotes: Conflict Resolution, Emotional Regulation, Responsibility".
- **"How This Helps" / "great for" bullets** name real parent problems, for example:
  - "De-shaming anger…"
  - "Tantrums and Coping strategies to calm"
  - "Sibling and Peer conflict"
- **Problem, agitation, solution copy.** The Capybara product page reads: "When your child is overwhelmed… telling them to 'calm down' rarely works… That is where Capybara comes in."
- **Recurring value lines:**
  - "more than just a toy, it's an educational tool"
  - "Simple tools for a lifetime of benefits."
  - "Empowering kids to become caring, confident, and resilient adults."
- **Science-flavoured authority:** "research shows that the inner voice is set for kids by the age of 7!"
- **Gift occasions in the description:** "Perfect for Baby Showers, Birthdays, or Holiday gifts…"
- **Books include "Reflect & Connect Questions"**, and product pages promise "Downloadable Resources: Free resources like coloring and activity sheets."

## 3. Bundles, pricing and how savings are shown
All figures are from products.json.
- **Core offer, the "Kin Double Bundle"** (plush + 2 board books): $58.00, compare-at $67.98, about 15% off.
  - The "Bundled Savings" badge is part of the first product image itself.
  - These bundles fill most of the Bestsellers list.
- **Book-only sets:**
  - Introduction to Caring Book Trio: $30.00 vs $38.97 (23% off)
  - A Lesson in Confidence Book Set, 5 books: $54.00 vs $64.95 (17%)
  - Board-book libraries: $163–173 vs $195–208
- **Sets named after a need, at one fixed price of $59.99:**
  - Raise Caring Kids Bedtime Bundle: $59.99 vs $106.95 (44%)
  - Also Divorced Parents Toolkit, Separation Anxiety Set and Raise Confident Kids Set
- **Build Your Own Bundle:** "Order 2 items and save 20%. Order 3+ items and save 30%." This is a tiered quantity discount.
- **Upgrade version:** a Capybara + parenting guide bundle at $81 vs $89.99. There are also "Mystery Boxes", e.g. $100 vs $204.97.
- **How savings are displayed:**
  - Product page: strike-through compare-at price only (line-through at 50% opacity). There is no "You save $X" text.
  - Product cards: a badge generated from price data, formatted "X% off". The theme can also show "Save $X" or "Sale", but cards are set to percentage.
  - Collection header: "Intentionally curated by a teacher and therapist, these bundles were created with your specific need in mind."

## 4. Social proof
- **Reviews app: Okendo** (reviews-widget-plus). A Judge.me web pixel also exists, probably left over.
- **On the product page:**
  - Near the title: "46 reviews", which scrolls to #reviews.
  - A highlight block with a lifestyle photo, "4.8 Average Rating", a customer pull-quote, and "Hammerhead Kin assists with: …".
- **The Okendo widget:**
  - Average rating and star breakdown (40/5/0/0/1).
  - "98% would recommend this product".
  - A carousel of customer photos.
  - "Reviews Summary – Generated by AI from 44 most recent customer reviews".
  - Filters and sorting; reviews with photos show first by default (`orderBy=has_media desc`).
  - "Verified Buyer" and "I recommend this product" labels, "Was this helpful?" votes, and some imported Google reviews.
- **Site-wide review numbers:**
  - Homepage: "10,000 + 5-STAR REVIEWS".
  - Product and collection sliders: "4.7 | 937 Reviews" plus "Over 1.5M books & creatures…".
  - These two numbers don't agree.
- **Video testimonials:** the Platter Plus video-testimonials extension and `.mp4` files are in the product page code. They are rendered by JS.
- **Press and awards:** the logo marquee; a Good Housekeeping Seal; "Emmy-Nominated Series on AppleTV+"; Shark Tank 2017 on the Our Story page.
- **Experts:** "Founded by a special education teacher and a family therapist", plus an "Our Experts" page. There are no third-party therapist quotes on the product pages.

## 5. Urgency, offers and gifting
- **Free shipping at $100+** appears in 5 places:
  - Announcement bar
  - Cart drawer header ("Free US Shipping On Orders $100+")
  - Progress bar
  - Trust row on the product page ("Free US Shipping $100+")
  - Mobile menu footer
- **Holiday shipping cutoff** (from a search result, not live now): "Place U.S. orders by December 12th for guaranteed holiday delivery." The shipping page adds "timelines may be extended around Holidays…".
- **Waitlists for early access** (Klaviyo embedded forms):
  - "Get ready for more of our Shine Bright Collection by joining the waitlist for your 1-hour early access!"
  - Success message: "You'll get first-access to the rest of our holiday collection, starting Monday 10/24 at 9am PT."
  - A Valentine's waitlist too.
- **Scarcity:**
  - "Notify Me" back-in-stock button and modal.
  - A hidden `low-stock` collection tag exists, but I saw no visible low-stock badge.
  - FAQ: "Items in your cart are not held. All items go to the first to complete the checkout process."
- **Gifting:**
  - Cart drawer has a "This is a gift" checkbox that opens a textarea ("Write you gift note here", their typo). It is saved as the cart note, and per the FAQ the note is printed and included in the box.
  - Gift cards.
  - Gift-guide page "Gifts for Moments that Matter", organised by life moment (gratitude, new sibling, bedtime, long-distance family, big feelings), then by category, "Trending Gifts", and by age (0–3, 4+).
  - "Gifts Under $20" collection and a Babylist registry link.
- **Other:** HSA/FSA payment through Flex ("net savings of 30-40%"), and a "bigger-than-black-friday-sale" collection.

## 6. Product page structure (hammerhead-kin), top to bottom
1. Announcement bar and nav
2. Gallery with 6 images: bundle packshot with the savings badge, close-ups, book covers. On desktop the columns stay fixed while you scroll.
3. Breadcrumb, handwritten skill label, H1
4. Review count link
5. Kinect AI question chips: "What makes this worth it?", "Who is this best for?", "What makes Slumberkins different?", "What should I know before buying?". They open an AI chat.
6. Price with strike-through
7. Sibling selector ("Product : Kin")
8. Full-width "Add To Cart", which becomes "Notify Me" when out of stock. **No quantity selector and no Buy-it-now button.**
9. Shop Pay Installments message (`<shopify-payment-terms>`)
10. Flex HSA/FSA badge
11. Icon trust row: "Skill Building", "Highest Certifications", "Free US Shipping $100+"
12. "Pair It With:" 2 cross-sell cards, each with its own Add button
13. Description: Promotes, What's Included, How This Helps
14. Section nav: As Seen In | Features | FAQs | Reviews | Recommended. It sticks below the header on desktop over 1280px only and is hidden on mobile.
15. The highlight review block
16. "What's Included" 3-up: The Kin / The Board Books / Downloadable Resources
17. "Intentionally designed." specs: machine washable, no detachable plastic, sizes, and "affirmations in the back of the books"
18. Brand banner, then the press marquee
19. FAQ "Questions? We're here to help." with tabs for Safety, Product, Care, Shipping
20. Testimonial slider
21. Okendo reviews
22. "You May Also Love"

**Mobile sticky Add-to-Cart:** none found in the server HTML. `x-ref="stickyAtc"` appears only in a Simprosys script's selector list. I can't rule out one injected by JS.

## 7. Cards, cart drawer and upsells
- **Product card:** handwritten skill badge, title, "[count] Reviews", price, compare-at price, "% off" badge, and a quick "Add To Cart" / "Add" button. Images load lazily.
- **Cart drawer:**
  - "Your Cart ([quantity])"
  - Progress bar
  - Line items
  - "We Also Recommend" upsell carousel. It uses Shopify's native `/recommendations/products?intent=related|complementary` and falls back to 3 fixed products.
  - Gift checkbox and note
  - "Subtotal", then "Shipping and taxes calculated at checkout."
  - Checkout button
  - SavedBy "Checkout+" package protection, with an opt-out: "Continue Without Package Protection"
- **Gift-with-purchase:** the theme supports it (`gift_products`) but it isn't set up right now.
- **In Cart Upsell:** its script (incartupsell.com) is also loaded.

## 8. Rewards, subscription and referrals
- **Loyalty: Rediem (Ripple Rewards).**
  - Points for purchases, photos, reviews, watching the TV show, and time-limited challenges.
  - Redeem for discounts, charity donations or products.
  - Log in with Shop.
  - Points expire after 12 months without use.
- **Referrals:** "Refer A Friend" in the footer; one review says "A friend sent me a referral code".
- **Affiliates:** GoAffPro, Pepperjam, and Saral for creators.
- **Subscriptions:** only older "Subscription" product types and an educator curriculum hub. Not a current consumer tactic.

## 9. Email and SMS capture
- **No welcome-discount popup found.** Klaviyo's `full-forms` API returns only 2 embedded waitlist forms. Privy `campaigns.json` returns `[]`, although the Privy script still loads. Coupon sites mention 10–15% codes and a "$50 gift card" sign-up draw; neither is verified.
- **Capture that is live:**
  - Homepage and footer "Join the SlumberFam" forms
  - Seasonal waitlists
  - Back-in-stock email
  - An SMS T&C page
  - Retention.com, which identifies anonymous visitors from add-to-cart events
  - The Klaviyo pixel with Added-to-Cart events enabled

## 10. Trust, guarantee and FAQ
- **Safety:** "safety tested and ASTM certified at the highest level", no small plastic parts, member of ICTI's ethical toy program.
- **Returns are weak:** within 7 days, unused, tags on. Free return shipping in the US.
- **Policies:** one discount code per order, no retroactive price adjustments, orders can't be edited once placed.
- **Support:** "we are a small team…"
- **Shipping table:**
  - Standard: 6–15 business days
  - Priority: 4–6
  - 2-Day: 3
  - Overnight: 2
- **FAQ page:** 25 questions, including SavedBy.

## 11. Navigation
- **Mega-menu:**
  - Shop All: Our Creatures, Trending Now, Most Loved, Curriculum, Educator Products, New Arrivals, Blog
  - SHOP BY SKILL: 17 skills
  - Shop by Category: Sale, HSA/FSA, Kins, Snugglers, Weighted Kins, Books, Books for Parents, Parenting Guides, Sets, Pillow Sets, Gifts Under $20, Games, Minis, Therapeutic Play, Educator, Party Supplies
  - About, Resources, For Educators
- **Mobile menu:** "Not sure where to start? Take the quiz." (links to `/pages/product-recommendation-quiz`), then New Arrivals, Bestsellers, Kins, Snugglers, Books, Games & Activities, Shop All.
- **Collection filters:** by Skill, Category, Availability and Price.

## 12. Look and feel
- **Fonts:**
  - Headings H1–H4: "Bitstream Cooper", a soft retro serif
  - Body, H5, H6: "Galano Classic", a geometric sans
  - Skill badges: a "Hand-Written" font
- **Colours:**
  - Text: charcoal #4d4d4f
  - Backgrounds: cream #fefdf5 / #fefdf6 and white
  - Primary: #077496 (deep teal-blue)
  - Accents: coral #f3906d, periwinkle #a1aac7, mint #eef5f4 / #ddede9, sage #75b089
  - Stars: #ffbc24
- **Photography:** studio lifestyle shots of parent and child reading or hugging on pastel backgrounds.
- **Overall:** warm, soft, therapeutic.

## 13. Apps and tracking seen in the HTML
- **Reviews:** Okendo (Judge.me pixel is probably left over)
- **Email:** Klaviyo, Privy (loaded but idle), Retention.com
- **Loyalty:** Rediem
- **Payments:** Shop Pay Installments, Sezzle widget embed, Flex for HSA/FSA
- **Protection:** SavedBy
- **Upsell:** In Cart Upsell, plus the theme's native recommendations
- **AI:** Kinect assistant, Microsoft Clarity "brandAgents", Okendo AI summaries
- **Tracking:**
  - Analyzify (GA4, Google Ads, TikTok, Snapchat)
  - Triple Whale
  - Meta pixel 144348096186187 through the Facebook & Instagram app
  - Google & YouTube app (AW-828059200)
  - Microsoft Clarity and Bing UET
  - Pinterest
  - AppLovin Axon
  - Simprosys Google Shopping feed
  - mysathi
  - GDPR cookie-consent script
- **Other:** POWr, Sky Pilot (digital downloads), BookEasy, Patrol (accessibility), Shogun (uninstalled, sections left behind)

## 14. The 15 most transferable tactics, ranked
For a store with 2 holiday books, faith-based, getting cold traffic from paid social. "Native" means Shopify admin or an app; "Custom" means we build it in the Next.js front end.

1. **Make "Get Both Books" the default hero offer.** Show a strike-through compare-at price, a "% off" badge, and a "Bundle savings" badge on the image. This mirrors their Kin Double Bundle, their best seller.
   - Native: Shopify Bundles app, which keeps inventory right for both books and is exposed in the Storefront API as a product with `compareAtPrice`.
   - Custom: calculate and show the % off from the API.
2. **Add a quantity-tier automatic discount**, e.g. "2+ books save X%", like their BYOB "Order 2 items and save 20%. Order 3+…". It rewards grandparents buying for several grandchildren.
   - Native: automatic discount or a Discount Function; the cart API returns `discountAllocations`.
   - Custom: messaging near the quantity picker.
3. **Set the free-shipping threshold so one book misses it and the bundle clears it**, then repeat it in 4–5 places.
   - Native: shipping rates.
   - Custom: announcement bar, trust row, and a drawer progress bar using `cart.cost.subtotalAmount` with "Add $X more for free shipping", then "unlocked".
4. **Build a slide-out cart drawer with a one-tap cross-sell** ("Complete the set: add Easter Journey"). It should open on Add To Cart instead of sending people to a cart page.
   - Custom: drawer on the Storefront Cart API (`cartCreate` / `cartLinesAdd`).
   - Native, optional: `productRecommendations(intent: COMPLEMENTARY)` configured in Search & Discovery. With only 2 products, hard-coding works fine.
5. **Mobile sticky Add-to-Cart bar and a section nav on the product page.** Slumberkins only has a desktop section nav. Mobile is where Meta traffic lands, so this is where we can beat them.
   - Custom: IntersectionObserver on the main button, showing a price-and-add bar once it scrolls away.
6. **Reviews with photos, placed near the title.** Star count link, a highlight review block with a lifestyle photo, customer photos first, and "% would recommend".
   - Native, app: Judge.me (headless API), Okendo or Junip.
   - Custom: render in React and add `AggregateRating` JSON-LD.
   - Collect only real reviews through post-purchase emails.
7. **Outcome-first copy.** Headline pattern: [holiday] + [outcome for the family]. Then problem, agitation, solution in the subhead and description, a "Teaches:" label (their "Promotes:"), and "Perfect for…" bullets (Christmas Eve tradition, Easter baskets, Primary or FHE gifts).
   - Content in Shopify metafields or metaobjects (native), rendered by us (custom).
8. **Trust icon row under Add To Cart, plus a stronger guarantee than their 7-day returns.** For example: "Ships from Idaho in 1–2 days", "Free shipping $X+", "Gift-ready", "Love it or your money back".
   - Policies live in Shopify (native); the icon row is custom UI.
9. **Holiday urgency that's true.** A shipping-cutoff banner with countdown ("Order by Dec X for Christmas delivery"), then after the cutoff switch to an early-Easter or waitlist and pre-order mode.
   - Custom: a date-driven banner reading config from a Shopify metaobject (native).
   - Native: Klaviyo embedded waitlist form.
10. **Gift options in the cart.** A "This is a gift" checkbox that opens a gift note, plus an optional gift-wrap or signed-copy add-on product.
    - Custom: UI calling `cartNoteUpdate` / `cartAttributesUpdate`.
    - Native: the note or attribute shows on the order for packing; the add-on is a normal product.
11. **An author credibility block** (their "founded by a teacher and a therapist" and founder quote): Tiffany's photo, her Idaho family story, and why she wrote the books.
    - **Caution:** don't use Church of Jesus Christ trademarks or imply official Church endorsement.
    - Custom section.
12. **"How it works" as a family ritual, plus free printables.** Three steps like theirs, e.g. read, discuss the included questions, build a tradition. Offer printables (coloring pages, a reading plan), like their "Downloadable Resources" and "Reflect & Connect Questions".
    - Printables hosted in Shopify Files (native); the page is custom.
13. **Aggregate stats and a testimonial slider**, e.g. "X,XXX families reading…". Real numbers only.
    - Custom section; testimonial content in a metaobject.
14. **Email and SMS capture with a lead magnet or small discount, plus Klaviyo browse and cart events.** Slumberkins has no welcome popup; cold traffic needs one. Delay it or trigger on exit, and suppress it on the product page before an add-to-cart.
    - Klaviyo onsite JS works headless (native app). We send Viewed Product and Added to Cart ourselves (custom). Checkout and abandoned-checkout events come from the native integration.
15. **Faster checkout and correct ad attribution.**
    - Checkout: send people to Shopify-hosted checkout via `cart.checkoutUrl` (Shop Pay built in, native). Optionally add the `ShopPayButton` from `@shopify/hydrogen-react` on the product page (custom).
    - **Critical:** on a headless site, Shopify's native web pixels only fire at checkout. We must add Meta Pixel with Conversions API (event dedup), GA4, and ideally Pinterest and TikTok on our pages (custom). Tie them to Shopify's Customer Privacy API for consent.
    - Add Microsoft Clarity for heatmaps. It's free.

**Not worth copying yet:** SavedBy package protection (adds checkout friction), the AI chat chips, HSA/FSA, loyalty points or referrals (wait until there's repeat volume), and a large mega-menu. With 2 products, go straight to them.

## Files and sources
- **Raw data:** everything is under `/private/tmp/claude-501/-Users-ryanmata-Desktop-Arrowleaf-Marketing-tiffany-wheeler/86c2c9b5-128c-496e-bb63-b781462a7d36/scratchpad/slumberkins/`. Useful files: `home.html`, `products.json`, `p_*.html` and `.txt`, `modals.html`, `klav_v7.json`, `faq.txt`, `pages_shipping-returns.txt`.
- **Search sources:**
  - [Slumberkins Holiday Gift Guide](https://slumberkins.com/pages/holiday-gift-guide)
  - [Slumberkins Holiday Collection](https://slumberkins.com/collections/holiday-sale)
  - [Slumberkins Shipping & Returns](https://slumberkins.com/pages/shipping-returns)
  - [Slumberkins FAQ](https://slumberkins.com/pages/faq)
  - [Savings.com Slumberkins](https://www.savings.com/coupons/slumberkins.com) and [Honey Slumberkins](https://www.joinhoney.com/shop/slumberkins), for the unverified sign-up offer claims