# tiffany-wheeler.com: live site inventory (crawled 2026-09-22)

The site is WordPress + WooCommerce on the Salient theme. It lists 15 retail products, 3 wholesale products and 1 test product. There are 21 on-site reviews, all 5-star. There is no email capture, no shipping info and no privacy policy. Several paid PDFs can be downloaded by anyone who has the link.

**Method.** I used curl on the rendered HTML, `wp-sitemap.xml`, the WP REST API (`/wp/v2/pages`, `/media` with 259 items, `/popups`, `/users`), the WooCommerce Store API (`/products?per_page=100`, `/products/reviews`) and the decoded `wcSettings`. External sources were Amazon, Google Books, Goodreads, This is the Place Bookstore and Idaho Business Review. Unless a line is marked **(inference)**, it was observed directly.

**Raw data files** (all under `/private/tmp/claude-501/-Users-ryanmata-Desktop-Arrowleaf-Marketing-tiffany-wheeler/86c2c9b5-128c-496e-bb63-b781462a7d36/scratchpad/site-inventory/`):
- `content_export.json`: all 19 products (every field, clean copy, images with a local-file match flag) and all 21 reviews.
- `pages_text_export.txt`: rendered text of every content page.
- `products.json`, `reviews.json`, `pages.json`, `media_index.json` (all 259 media items), `html/*.html` (raw page captures).
- `sheet1.jpg`–`sheet5.jpg`, `frames_sheet.jpg`: contact sheets of the promo, product and video assets.

---

## 1. Pages found

| URL | Status | What's there |
|---|---|---|
| `/` (page 17, modified 2026-09-03) | 200 | Hero is a 650px autoplay muted video (`silentvideo.mp4`) with an empty title and no CTA. Below it: a Nephite Christmas section (composite image `Adobe-Express-file-2.png`, title art `NephiteChristmasTitle_transparent.png`, H2 "Make the Book of Mormon Part of Your Christmas Tradition.", Buy Now). Then an Easter section (`Easter-Journey-Cover-2.jpg` plus 2 illustrations, `Easterlogo.png`, H2 "Continue the story—experience Easter together.", Buy Now). Then "About Tiffany Wheeler / My Story" with Learn More. Two rows are disabled: a "Pre Thanksgiving Sale: Order Today & Save" button and a `Black-Friday-Sale.jpg` banner. The page has no H1. |
| `/shop/` | 200 | "Looking for digital items? Continue scrolling ↓". "Physical Products" (9) and "Digital Products" (5) grids. |
| `/about-the-author/` (`/about/` redirects here) | 200 | Full bio, illustrator bio, social links. |
| `/contact-the-author/` (`/contact/` redirects here) | 200 | Gravity Form "Send Tiffany a Message" (Name, Email and confirm, Comments, CAPTCHA). No email address shown. |
| `/home/freebies/` | 200 | Free, ungated PDFs and wallpapers (listed in section 3e). |
| `/the-nephite-christmas-collection/` | 200 | Book, coloring book and ornament cards with Add to Cart, plus the Boise pickup code **DOVE**. |
| `/easter-journey/` | 200 | Long-form Easter Journey story page. Still says "[Preorder Your Copy Today →] Orders will ship beginning February 1st." (stale). |
| `/nephite-christmas/` (2024) | 200 | Minimal page: waving-boy GIF, title art, one paragraph. |
| `/refund_returns/` | 200 | Boilerplate WooCommerce returns template, lightly edited (section 5). |
| `/cart/`, `/checkout/` (checkout redirects to cart when empty), `/my-account/` | 200 | Block cart with cross-sells. |
| `/sample-page/` | 200 | Default WordPress "Hello" sample page, still live and in the sitemap. |
| `/home_slider/5006/` | 200 | Empty Nectar slider post. |
| `/product/*` (19), `/product-category/{books,collectibles,digital,downloadable,physical,retail,wholesale,uncategorized}/`, `/product-tag/easter/`, `/author/{tiffany-wheeler,kelley-hicken,a19a062d_admin}/` | 200 | `/product-category/wholesale/` shows "No products were found". |
| `/faq/`, `/events/`, `/blog/`, `/wholesale/`, `/shipping/`, `/privacy-policy/`, `/terms/`, `/shop-wholesale/` (linked from the wholesale product), `/wholesale-orders/` (in Google's index) | **404** | There is no FAQ, events, blog, privacy, terms or shipping page. |

**Other details**
- There are 0 blog posts.
- Main nav: Home · Shop · Freebies · About The Author · Contact Tiffany · account · cart.
- The top bar and footer link off-site to **connectionisthecureidaho.org** ("Connection Is The Cure").
- The header "account" link is broken: `href="http://my-account"`.
- Footer: "© 2026 Tiffany Wheeler.", Facebook, LinkedIn, Instagram.
- `robots.txt` allows everything. Site name: "Tiffany Wheeler". Tagline: "The Author of Nephite Christmas".

---

## 2. Products

### 2a. Catalog table

- **No product has a SKU.**
- All products report "in stock"; quantities are not exposed.
- Every Christmas item carries a permanent "Sale!" at about 10% off. Easter items are full price.
- All 46 product image files exist under identical filenames in `assets/media-library`, and so do all 90 upload files referenced anywhere on the live site.

| ID | Product | Format | Regular → current | Categories | Reviews | Primary image (local file) |
|---|---|---|---|---|---|---|
| 49 | **Nephite Christmas** | Hardcover, dust jacket | $24.99 → **$22.49** | Books/Physical/Retail | **20 (5.00)** | `Nephite-Christmas-Thumbnail.png` (+ `NC-JacobDraws.jpg`, `Page1-scaled.jpg`, `NC-JacobFatherHug.jpg`, `NC-Kid_Art.jpg`) |
| 1525 | **Easter Journey** | Hardcover, 9″×11″, 46 pp, dust jacket | **$29.99**. The API also has an inactive sale price of $27.00. | Books/Physical/Retail, tag Easter | 0 | `Easter-Journey-Cover.png` (+ `Thin_Book_Hard_Cover_Mockup_5-scaled.png`, `Jesus-and-the-blind-man-square.png`, `Mary-in-Garden-square.png`, `James-square.png`, `Easter-Journey-for-canva18-scaled.jpg`) |
| 4999 | **Nephite Christmas & Easter Journey Book Bundle** (created 2026-09) | Both hardcovers | **$59.98 → $49.98**. The copy says "$49.99", and the sum of the parts is $54.98. | Books/Physical/Retail | 0 | `nephite-christmas-easter-journey-bundle.png` (+ `1.png`, `9.png`, `closed-book.png`) |
| 1595 | Nephite Christmas Bundle | Book + coloring/activity book | $32.98 → $29.68 | Books/Physical/Retail | 1 (5.00) | `7.png` (+ `1.png`, `8.png`, `9.png`) |
| 1865 | Nephite Christmas Bundle with Ornament | Book + coloring book + ornament | $35.97 → $32.37 | Books/Physical/Retail | 0 | `Bundle-with-ornament.png` (+ `1`, `8`, `9.png`, `NephiteChristmas-Ornament.jpg`) |
| 1425 | Nephite Christmas Coloring and Activity Book | Softcover, 8.5″×11″ (per wholesale copy) | $7.99 → $7.19 | Books/Physical/Retail | 0 | `coloring-book-cover-thumbnail.png` (+ `CB2`–`CB6.png`) |
| 754 | Nephite Christmas Ornament | Round white ornament with gold star | $2.99 → $2.69 | Collectibles | 0 | `NephiteChristmas-Ornament2.jpg` |
| 2532 | Nephite Christmas Peace Dove Ornament | Dove ornament, gold ribbon, message card | $2.99 → $2.69 | Collectibles | 0 | `Peace-Dove-Ornament.png` |
| 1583 | The Promised Messiah – An Easter Journey Puzzle of the Savior | Variable: one variant only, 14″×11″ (252 pcs) | $24.73 | Physical/Retail | 0 | `1711526216898823065_2048.jpeg`, `6225826769189115882_2048.jpeg`, `16637536903398360573_2048.jpeg` |
| 1589 | He Spoke My Name – 8 x 10 Canvas Print | Variable: 10″×8″ horizontal, 0.75″ depth | $22.92 | Physical/Retail | 0 | `16513748483500245155_2048.jpeg`, `13926739497957928813_…`, `10260435129459230675_…`, `11343436479279271422_…` |
| 1661 | Nephite Christmas Digital Bundle (PDF) | NC PDF + coloring PDF + nativity PDF | $15.97 → $14.37 | Digital/Downloadable | 0 | `Digital-Bundle-Download.png` (+ `Nephite-Christmas-Download-cover.png`, `coloring-book-download-cover-thumbnail.png`, `Nativity-feature-image-2.jpg`) |
| 1231 | Nephite Christmas (PDF download) | Spreads + single pages | $6.99 → $6.29 | Digital | 0 | `Nephite-Christmas-Download-cover.png` (+ `Unbelievers-Threaten-Spread.png`, `Nativity-Spread.png`) |
| 1187 | NC Coloring & Activity Book (PDF) | PDF | $5.99 → $5.39 | Digital | 0 | `coloring-book-download-cover-thumbnail.png` (+ `CB2`–`CB6`) |
| 1248 | NC Nativity Craft (PDF) | Printable color-your-own nativity | $2.99 → $2.69 | Digital | 0 | `Nativity-feature-image-2.jpg` (+ `Nativity-Instructions.png`, `Nativity-Jesus-Mary-and-Joseph.png`, `Nativity-Jacob-and-Dad.png`, `Nativity-Nephi-Mom-and-Sister.png`) |
| 1619 | Easter Journey (PDF Download) | 45 pp, single pages + spreads | $8.99 | Digital, tag Easter | 0 | `Easter-Journey-Download-Cover-3.jpg` (+ the same Easter square images) |
| 1390 | Nephite Christmas (Wholesale), hidden | Hardcover | $12.50 (SRP $24.99, MOQ 12) | Wholesale | 0 | same as #49 |
| 1437 | Coloring Book (Wholesale), hidden | Softcover | $4.00 (SRP $7.99, MOQ 12) | Wholesale | 0 | same as #1425 |
| 1440 | Start Here to Purchase Wholesale | $0 product carrying a Gravity Form for reseller-permit upload | $0 | Wholesale | 0 | `upload-reseller-permit.jpg` |
| 1375 | WooCommerce Automated Testing Product (junk) | — | $1.00 | Retail | — | Publicly reachable and listed in the sitemap. Delete it. |

**Book specs (conflicting sources, need client confirmation)**
- **Nephite Christmas**
  - Wholesale copy: "26-page hardcover", "Hardcover with Dust Jacket Dimensions: 10.75″ x 8.75″ x 5/8″", "Weight: 15.3 oz".
  - Amazon (ASIN B0DP7X2NQ3): 36 pages, 10×8.5×0.25 in, 1 lb, reading age 3+, publisher **Rhino Media**, published Sept 16, 2024, **ISBN-13 979-8989343553**.
  - Kindle (ASIN B0FP4BLWJ1): "Nephite Christmas: The first 'Night before Christmas'", Rhino Books, Aug 28, 2025, ages 3–18.
- **Easter Journey**: ISBN 979-8989343584 (Google Books, Rhino Media, 2026). Not found on Amazon.
- **Illustrator for both books: Kelley Hicken.** Her name appears on both covers.
- **Age range:** the site never states one. Amazon says 3+. The Easter copy says "all ages" and "any age and level of your family".
- **(inference)** The puzzle and canvas look like print-on-demand items: Printify-style mockup filenames and odd prices. The puzzle copy says "Choose from 120, 252, or 500" pieces, but only 252 is offered.

### 2b. Full copy of the core products (verbatim, lightly de-HTML'd)

**Nephite Christmas (#49)**

Short description:
> Discover Nephite Christmas, the perfect book to share with your family this season. Many choose a new Christmas story each year—make this the one for your family! This heartwarming book intertwines the nativity story with the Book of Mormon, creating a tradition that your family will cherish.
> Start a new Christmas tradition with Nephite Christmas and bring the light of Christ into your holiday.
> Nephite Christmas will be available in select stores in Utah this year! You can find it at Eborn Books in Provo, the BYU Bookstore, and Barnes & Noble in Sandy. It will also be available at This is the Place Bookstore in both Palmyra, NY, and Kirtland, OH! Please support our wonderful retail partners.
> Bulk purchases of 5 or more get an automatic 10% off each book!
> Add a beautiful ornament to your book purchase for just $2.99!

Description tab. H3 "A New Christmas Tradition", beside the `Vertical-1080.mov` video:
> Experience the Christmas story like never before with Nephite Christmas, inspired by 3 Nephi 1 in the Book of Mormon. This unique tale transports you to Ancient America, where the faithful Nephites witnessed miraculous signs of Christ's birth, just as the shepherds and wise men did in Bethlehem.
> With vivid storytelling and illustrations, Nephite Christmas captures the anticipation and joy as ancient prophecies were fulfilled. Perfect for families and friends, this book is a testament to faith and the unity of believers across time and continents.
> Order your copy today and enrich your holiday season with this inspiring story.
> Exclusive Discounts: If you live in the Boise area and want to pick up your order select Pickup during checkout.
> Nephite Christmas is the retelling of the Christmas story as told in 3 Nephi 1 in the Book of mormon. The Book of Mormon is a record of the people that lived in Ancient America from 600 BC to 400AD. Like the Bible it was written by those that followed Jesus. For centuries Prophets foretold of Christ's birth. When the time came, the Nephites, like the shepherds and wisement in Bethlehem, witnessed the signs of that miraculous event in the Americas on that same silent night so long ago.
> "Want to learn more, Click Here" (links to churchofjesuschrist.org/comeuntochrist/ps/book-of-mormon-lesson)

The "About the Author / About the Illustrator" blocks and the Bytheway testimonial also sit in this tab; see sections 3 and 4.

Retail-appeal copy from the wholesale page (useful for the PDP):
> Nephite Christmas brings a fresh and deeply meaningful twist to the holiday season—a beautifully illustrated, 26-page hardcover children's book that retells the nativity story through the lens of 3 Nephi in the Book of Mormon. Presented in the poetic cadence reminiscent of "'Twas the Night Before Christmas," it transports readers to Ancient America, where the Nephites witness the miraculous signs of Christ's birth just like the shepherds and wise men in Bethlehem. A touching blend of tradition and faith, this heartwarming story is becoming a cherished part of holiday rituals in LDS families.

Bullets from the same page: "Vivid storytelling and warm, uplifting illustrations by Kelley Hicken"; "Rated 5 out of 5 with glowing reviews; customers describe it as 'absolutely beautiful'"; "Newly released in 2024"; "Compact and Gift-Ready"; "Bundling Potential: Consider pairing with the coloring and activity book".

**Easter Journey (#1525)**

Short description:
> Easter Journey is a beautifully illustrated hardcover book that invites families to step into Jerusalem and experience the story of Christ in a higher and holier way. With rich artwork, a fun seek-and-find, and thoughtful discussion questions, it helps readers of all ages feel the Savior's love and discover their own place in the Easter story.

Description:
> Easter Journey — Hardcover | 9″ x 11″ | 46 pages | Dust Jacket
> Easter Journey is more than a story—it's an experience. Step into beautifully illustrated scenes of Jerusalem and meet those who knew Jesus. Each page draws you closer to the Savior through rich storytelling and stunning artwork that brings the Easter story to life.
> Along the way, you'll hear of His miracles and teachings and discover for yourself if He truly is the Messiah who was prophesied to come. Meet the merchant whose heart was touched by Christ's words, the blind man who was healed, the apostles following Jesus, and the women who witnessed His resurrection. Hear His mother testify of His divine calling—and even face Caiaphas, asking yourself: Am I willing to stand up for Jesus?
> The greatest part of Easter Journey is realizing that the Easter story isn't over—it's ongoing. Just like the people you meet along the way, you have a role to play. Christ came and died for you—today! Through this journey, you'll see how His teachings and miracles continue to shape our lives.
> At the end of the book, you'll find thoughtful discussion questions to spark meaningful family conversations and a fun seek-and-find featuring symbols of Christ woven throughout the artwork.
> Whether you read it aloud, perform it as a reader's theater, or enjoy it as a family advent, Easter Journey helps all ages experience Easter in a higher and holier way.
> We hope your family will enjoy "seeking Jesus of Nazareth" along your Easter Journey and begin a tradition that draws you closer to Him year after year.
> Books are now available! Order your copy today. Shalom!
> Exclusive Discounts: If you live in the Boise area and want to pick up your order select Pickup during checkout

**NC + EJ Bundle (#4999)**
- Short: "**Get both books for $49.99!** A great gift idea for families!"
- Description: "Celebrate the Savior's birth and Resurrection with two beautifully illustrated family books: *Nephite Christmas* and *Easter Journey*. Share both stories throughout the year and create meaningful family traditions centered on Jesus Christ."

**Nephite Christmas Bundle (#1595)**
> Bring the wonder of Christ's birth to life with the Nephite Christmas Bundle—featuring the beautifully illustrated storybook Nephite Christmas and its perfect companion, the Nephite Christmas Adventure Coloring & Activity Book. Inspired by 3 Nephi 1 in the Book of Mormon, Nephite Christmas transports readers to Ancient America, where the faithful Nephites witnessed miraculous signs of the Savior's birth. Through vivid storytelling and stunning artwork, families will feel the same anticipation and joy that filled hearts in Bethlehem. The companion activity book invites children to engage even more deeply with the story through coloring pages, puzzles, mazes, and creative challenges that celebrate the light of Christ. Designed for home use, Primary classes, or family devotionals, it's a meaningful and fun way for all ages to connect with the true spirit of Christmas. Together, these two books create a powerful family tradition…

Its description tab is an upsell to the ornament and the nativity printable.

**Bundle with Ornament (#1865)** uses the same copy plus:
> This makes the ultimate gift! … The ornament can be used as decoration or as a fun family game you can play all season long. (Think Elf on the Shelf but with deeper meaning and purpose as children seek the star like the wise men of old.)

**Peace Dove Ornament (#2532)**
> …smooth white dove accented with tiny star-shaped cutouts and a radiant central star—representing the light we are invited to "seek and find"… comes with a shimmering gold ribbon… includes a coordinating message card that invites families to hide the dove in their Christmas tree and take turns finding it…

"Perfect for": Family Christ-centered traditions / Pairing with the picture book / Neighbor gifts, ministering gifts, and stocking stuffers / Creating a peaceful, intentional holiday season.

**Coloring & Activity Book (#1425)**
> "A perfect companion to the story book!" … coloring pages, puzzles, mazes, and challenges that highlight the message of Christ's birth through the lens of the Book of Mormon … at home, in primary classes, or as part of your family Christmas tradition…

**Round ornament (#754)**
> "…intricate details that capture the essence of faith, hope, and joy… Pair it with the Nephite Christmas book for a heartfelt gift set…"

**Digital products.** Full copy is in `content_export.json`. Key selling points:
- NC PDF: "full-page spreads and individual page options… perfect for sharing on a large screen during family gatherings, primary lessons, ward parties".
- Nativity kit includes Baby Jesus, Mary, Joseph, three wise men, a shepherd with sheep, animals, the Nephite prophet and family, a Nephite temple and the Christmas star. The copy also gives a long "Perfect for" list (FHE, Primary/Sharing Time, ward party craft tables…).
- All digital listings carry: "Download once… print as many times as you need… personal use… please do not copy or share."
- EJ PDF: "PDF Download | 45 pages … single-pages version … full-spreads version".
- The coloring PDF has stale copy: "keep an eye out for the audiobook, e-book, and downloadable PDF that are coming soon!"

**Puzzle and canvas copy**
- Puzzle: "celebrate Easter in a Higher and Holier way… 9.25″ x 7.4″ x 2″ paper box… chipboard…"
- Canvas: "On that first Easter morning, Mary stood weeping—until she heard Him speak her name… 100% polyester canvas… pinewood frame… Assembled in the USA".

### 2c. Digital fulfilment files (all present locally)

| File | Size | Public URL status |
|---|---|---|
| `pages-nephite-christmas.pdf` | 183 MB | 200 |
| `Spreads-Nephite-Christmas.pdf` | 187 MB | 200 |
| `RGB-Nephite-Christmas-Coloring-and-Activity-Book-With-Cover.pdf` | 32.6 MB | 200 |
| `Full-Nativity-Kit.pdf` | — | 200 |
| `Easter-Journey-Pages-qzyf3m.pdf` | 102 MB | 403 (in `woocommerce_uploads/`) |
| `Easter-Journey-Spreads-ppiam1.pdf` | 102 MB | 403 (in `woocommerce_uploads/`) |

**Revenue leak:** the four paid Nephite Christmas PDFs are publicly downloadable from `/wp-content/uploads/2025/07/…`. Anyone can find their URLs through `/wp-json/wp/v2/media`. The Easter PDFs are correctly protected. The client should move or protect the NC PDFs now, whatever happens with the migration.

---

## 3. Author and brand

**About page bio (verbatim; 3 opening paragraphs; the remaining 4 paragraphs cover Connection Crates, the ACT podcast, her "Enjoy the Journey" mantra and a closing — full text in `pages_text_export.txt`):**
> Hi, I'm Tiffany Wheeler. If we were sitting together around the breakfast table, I'd probably start by telling you about my family. I live in Idaho's beautiful Treasure Valley with my husband, John, and we have six incredible children. Family is my greatest joy and the place where I learn and grow the most. When I'm not gathering people together, you'll probably find me kayaking on a mountain lake, hiking somewhere with a view, planning my next trip, or curled up with a good book.
> I've loved books for as long as I can remember. As a child, I spent my summers biking to the library, filling my basket with books, and reading beneath the lilac bushes until dinnertime. Stories such as Little Women, The Count of Monte Cristo, and To Kill a Mockingbird taught me that a good book can shape our character and help us see the world differently. Now, as the author of Nephite Christmas and Easter Journey, I love creating faith-filled stories and experiences that bring families closer to one another and to Jesus Christ.
> In 2022, breast cancer caused me to pause and think about what I wanted to do with my life. During that time, a friend gave me a journal with the words, "What the caterpillar calls the end of the world, the Master calls the butterfly." That message encouraged me to uncover talents I had buried and trust God to help me become something more. It's also why there's a small butterfly in my logo—it reminds me where my wings come from.

The remaining paragraphs cover:
- Connection Crates: "creating connection tools for families… delivered to your front door", and a planned book series on connection.
- Her background in youth service and suicide/addiction prevention.
- Teaching early-morning seminary, and the "ACT: Applying Christ's Teachings" podcast launching this year.
- Her mantra "Enjoy the Journey".
- The closing: "I'm so glad our paths have crossed…"

**Short bios**
- Homepage: "I love traveling, family, and fostering connections. As a mother of six amazing children… Treasure Valley near Boise, Idaho, with my wonderful husband John… kayaking mountain lakes or hiking… a good book."
- NC product page: "Tiffany Wheeler loves traveling, family and traditions… Inspired by her daughters love for the Book of Mormon and her own testimony of the Savior, Tiffany Wheeler has enjoyed watching Nephite Christmas come to life."

**Illustrator: Kelley Hicken** (kelleyhicken.com). She is not "Heckin". The legacy file `Kelley-Heckin.jpg` and its alt text are misspelled.
- About page: "Kelley Hicken is passionate about all things creative, with illustration and fiction writing topping the list. She believes creativity is inherent in every human being — and she lives that belief through her work in children's literature, poetry, and, of course, illustration. Kelley lives in Idaho with her husband and their two children, who give her equal parts anxiety, immeasurable joy, and endless story-fire kindling." Headshot: `KelleyHickenHeadshot.webp`.
- PDP version: "…Kelley brings her artistic talents and testimony of Jesus Christ to life in 'Nephite Christmas.' Each page of her work reflects her profound love for the Savior and the Book of Mormon. She loves to hear from readers."

**Easter Journey origin story** (`/easter-journey/`, strong material):
- It started in 2007 as a church Easter event, originally a play.
- "The first year we did the play, about a thousand people walked through the story of Christ…"
- "One 10-year-old told me he wanted to go through it again and again, saying it was even better than Disneyland."
- "Based on the stories from the Gospels, this story is made to be shared by Christians of every denomination."
- "We need to up our game when it comes to putting Christ back into Easter."
- Ways to use it: story, reader's theater, advent leading up to Easter. Includes discussion questions and a seek-and-find of symbols of Christ.

**Brand assets**
- Logos: `TiffanyWheelerLogo.png`, `TiffanyWheeler-WhiteLogo.png` (600×215), wordmark `TiffanyWheeler.png`.
- Title art: `NephiteChristmasTitle_transparent.png`, `Easterlogo.png`.
- Mascot: Jacob, the boy with the red headband. `Animated-cropped-waving-boy.gif` shows him waving.
- Photos: `TiffanyWheeler-AboutUs.jpg`, `TiffanyWheeler-About2.jpg`.
- Font: only Open Sans is loaded.
- Recurring phrases: "higher and holier way", "Enjoy the Journey", "Shalom!", "seek Jesus of Nazareth", seek-and-find dove/star, "The first Night Before Christmas" (Kindle subtitle).
- Homepage hooks: "You Know What Happened in Bethlehem. But Do You Know What Happened Across the Sea?" and "Just like the shepherds and wise men, the Nephites too were witnesses of the miracle of Christ's birth."
- Easter section subline: "Invite your family to experience the Easter Story in a way they will never forget!"

**Video assets (local)**
- `silentvideo.mp4` (30s, 8.1 MB, homepage hero): family-reading lifestyle b-roll.
- `Horizontal-1080.mov`/`.m4v`, `Horizontal-4k.mov` (30s) and `Vertical-1080.mov` (30s, 51 MB, on the NC PDP): the same b-roll in other cuts.
- `video.m4v` (30s): alternate cut.
- **`IMG_3989.mov` (3:11): Tiffany reading Nephite Christmas aloud.** High value for the PDP and ads.

**Lifestyle photos:** `1.png` (grandmother reading to two girls), `9.png` (mom and boy), `8.png` (child coloring), `500A2551-scaled.jpeg`, `nephite-christmas-23-1.jpg`, `IMG_2693.jpg`.

**Peek-inside assets**
- NC: `Nativity-Spread.png`, `Unbelievers-Threaten-Spread.png`, `Page1-scaled.jpg`.
- EJ: `Thin_Book_Hard_Cover_Mockup_5-scaled.png`, `Easter-Journey-for-canva18-scaled.jpg` (tomb spread), plus `Mary-in-Garden-square.png`, `James-square.png`, `Jesus-and-the-blind-man-square.png`.
- Coloring book: `CB1`–`CB6.png`.
- **(inference)** The pages/spreads PDFs could be rasterized to make more spreads.

**Press, retail and the wider web**
- **Idaho Business Review, 2025 Women of the Year** (Sept 16, 2025). It lists her as co-director of Connection is the Cure, board chair of Treasure Valley Children's Theater and of the Rocky Mountain HS Choir, a religious instructor, and author/owner of "Tiffany Books". Usable as an "As featured in" badge.
- **Retail partners named on the site:** Eborn Books (Provo), BYU Store, Barnes & Noble Sandy (The Commons at Southtowne, 10433 S. State St), and This is the Place Bookstore (Palmyra, NY and Kirtland, OH), where the book is live at $24.99.
- No Deseret Book or Seagull listing found. A search result says Seagull stores were closing Dec 24, 2025.
- **Amazon:**
  - Hardcover: 5.0 stars, 22 ratings. On 2026-09-22 the buy box was a third-party seller at **$20.85**, which undercuts the site's $22.49.
  - Kindle: 5.0 stars, 3 ratings.
- Goodreads: 4.00 stars, 2 ratings.
- **No Kickstarter found.** No events or signings content exists on the site. The "Website-Slider-Signings" filenames are actually retail and Black Friday banners.
- **(inference)** One review ("Just listened her read it") suggests a live or recorded reading.
- A search-engine snippet claims "Over 5,000 copies have been sold". That line is not on any current page, so it needs client confirmation before we use it.

**Contact and social**
- Email: tiffany@tiffany-wheeler.com (it appears only on the returns page).
- Facebook page "Tiffany Wheeler Books": facebook.com/profile.php?id=61567716267980.
- The About page instead links a personal profile: facebook.com/wheelerjt.
- Instagram @tiffanywheelerbooks: "Tiffany Wheeler | Children's Book Author", about 378 followers, bio "Creating traditions that help connect families".
- LinkedIn: in/tiffany-wheeler-5a2805197.

---

## 4. Social proof

**Featured testimonial** (NC product description; the emoji is rendered as text here):
> "This is Kim and John Bytheway [heart emoji]. We just received your Nephi Christmas book and it is absolutely beautiful. Thank you so much for adding to our Christmas collection in such a beautiful way. Thank you for helping make a new tradition in our home. We wish you all the success and again, many thanks for this lovely treasure." — Kim and John Bytheway

**(inference)** John Bytheway is a well-known LDS author and speaker, so this is a strong endorsement. Confirm permission to use the name prominently.

**All 21 on-site reviews, all 5 stars.** Source: `/wc/store/v1/products/reviews`. Original spelling is kept.

| Product | Reviewer | Date | Verified | Review |
|---|---|---|---|---|
| NC | Nate | 2024-07-20 | no | Really fun twist on a classic christmas story! My 4 year old son loves it :) |
| NC | Ellise | 2024-07-20 | no | My family absolutely loves this book! It brings the Christmas spirit to life from the perspective of people in the americas. Highly recommend!! |
| NC | Kendra Santa Cruz | 2024-09-28 | yes | Such a sweet story! I only wish I had this last week when I was talking to my kids about Samuel! It is beautifully illustrated and it is just a lovely new Christmas tale to share every Christmas! |
| NC | Kendra Santa Cruz | 2024-09-28 | yes | An absolute, beautiful. And worthwhile story! I love to read it and the illustrations were absolutely gorgeous! I only wish I had this book last week when I was talking to my kids about Samuel! I really encourage everyone to get this book and read it and enjoy it every Christmas. Unless you enjoy Christmas all year like me, in which case you will read it all the time! |
| NC | Karen Manthey | 2024-10-05 | no | I love it! So creative and original! |
| NC | Candice andrus | 2024-10-09 | no | I love this book! My grandma used to include the story of Samuel the Lamanite and the sign during our Christmas story telling. She would be thrilled to know someone else did something to make that a yearly tradition. The illustration is awesome and the words makes it clear that the author loves and cherishes the nephites and the Book of Mormon. What a wonderful opportunity to have this book in my home to read yearly now! I love the star and the dove. |
| NC | Merrilee Boyack | 2024-11-05 | no | Loved this story! Beautifully written and great illustrations. My grandchildren will love this!! |
| NC | Tim | 2024-11-09 | no | Beautiful and well written book! Reading this book together as a family will become one of our new Christmas traditions. |
| NC | Kate Asbury | 2024-11-10 | no | This book is very well done. It's written as a catchy rhyme and it flows so nicely. The pictures are great too! It will make a great gift! |
| NC | LeeAnn Jett | 2024-11-17 | no | I smiled the whole time reading this beautiful story! Well written and illustrated for today's children and adults alike! I love the familiar rhythm of the prose. |
| NC | Austin Vach | 2024-12-01 | no | Nephite Christmas is a well written retelling of the Book of Mormon story matching the cadence of the original Christmas poem. My family received it as a gift and I loved it as much as my kids did. |
| NC | Jeanne | 2024-12-05 | yes | This book has meaningful love on every page. |
| NC | Kathy Horning | 2024-12-06 | yes | I love this simple well written story from the viewpoint of the Nephites. It will become a tradition at my family's Christmas Eve program. I have given copies to my children along with the copy of the new Hymn, "Star Brite". |
| NC | Lynn Archibald | 2024-12-15 | no | Wonderful book |
| NC | Lynn Archibald | 2024-12-15 | no | Wonderful Story |
| NC | Paula Harlow | 2024-12-16 | no | Just listened her read it and I am so excited to get it! |
| NC | Noel | 2025-10-03 | no | We love this book! It is sweet and the kids love finding the dove. |
| NC | Dot Hamer | 2025-10-22 | no | Such a Beautiful book and a wonderful way to help the littles remember this event. |
| NC | D Fuller | 2025-11-17 | no | I love this book. Looking forward to sharing with my family for our Christmas devotional. |
| NC | Karen H Bartlett | 2025-11-21 | no | I have wanted to include the Christmas story from the Book of Morman in our family's Christmas Eve nativity play for years. This book makes it so easy to include this Christmas story from the Book of Mormon. Thank you so much! |
| NC Bundle | Dana Dow | 2025-11-18 | no | This looks great |

**Notes**
- Easter Journey and the new bundle have **no reviews**.
- There are duplicates: Kendra ×2 and Lynn ×2. Two reviews are pre-purchase: Dana Dow and Paula Harlow.
- The best pull-quotes cover four themes: traditions, rhyme/cadence, the dove/star seek-and-find, and grandparents.

---

## 5. Policies

**Returns (`/refund_returns/`)** is the WooCommerce boilerplate with a few edits. Key terms:
- 30-day window. Items must be unused, in original packaging, with a receipt.
- It still includes template exclusions (perishables, gift cards, software, and "CD, DVD, VHS…" partial refunds).
- Refunds are processed within 7 days.
- **"Only regular priced items may be refunded. Sale items cannot be refunded."** Nearly every Christmas item is permanently "on sale", so in practice this means no refunds.
- Exchanges only for defective or damaged items.
- The buyer pays return shipping, and shipping costs are non-refundable.
- Includes a gift-credit clause.
- Contact: tiffany@tiffany-wheeler.com.
- The return address is a street address in Eagle, ID 83616. **(inference)** It looks residential; confirm before republishing and consider a PO box.

**Shipping**
- No shipping policy, rates, speeds or free-shipping threshold appear anywhere.
- WooCommerce Table Rate Shipping is installed, and the cost only appears after an address is entered (`shippingCostRequiresAddress: true`).
- Local pickup for the Boise area: "select Pickup during checkout". Older copy says to use code **DOVE**.
- Taxes are enabled; prices display excluding tax.
- Holiday deadline banners from 2025: order by Dec 19, "*FOR MOST STATES -NOT GUARANTEED".

**Missing pages:** privacy policy, terms (WooCommerce privacy/terms pages are unset), FAQ, shipping. Meta ads and Shopify both expect a privacy policy.

**Digital terms:** "This is a digital product; no physical item will be shipped… personal use… please do not copy or share the digital files."

**Wholesale**
- Terms: $12.50 per hardcover (SRP $24.99) and $4.00 per coloring book (SRP $7.99), MOQ 12, buyer pays shipping and return shipping, returns within 180 days in resaleable condition with approval.
- A reseller permit upload is required through the Gravity Form "Wholesale License Submission" (business name, contact, phone, email, billing and shipping address, file up to 20 MB, CAPTCHA).
- Its "Return to the Wholesale Catalog" link goes to `/shop-wholesale/`, which is a 404.

**Bulk discount:** "Bulk purchases of 5 or more get an automatic 10% off each book!" This runs through Woo Discount Rules Pro.

**Payments**
- Stripe via Payment Plugins for Stripe (`woo-stripe-payment` v4.0.14), Payment Element, live mode.
- `stripe_cc` "Credit/Debit Cards" is the only listed method.
- No PayPal, and no express checkout buttons were observed in the settings.
- Coupons and Smart Coupons are enabled.

---

## 6. Marketing and promo history

Sources: media library dates and filenames, OCR of the banners, and the timer/popup configs.

**2024**
- 2024-11-18 `ThanksgivingSale.jpg`: "10% Off Thanksgiving Sale — Order Early for Christmas!"
- Homepage (disabled row): "Pre Thanksgiving Sale: Order Today & Save".
- 2024-11-27 `Black-Friday-Sale.jpg`: "$5 off Black Friday Sale 11/28–12/2".

**2025**
- 2025-07-24 popup "Free boxes of books" (currently inactive) with `box-of-misprints.jpg`. It offered imperfectly printed NC books free to Primary leaders and families, with delivery possible in Boise/SLC.
- 2025-10-01 `Conference-Sale.jpg`: "General Conference 20% Off Sale… CODE: GENCONF".
- 2025-10 (Oct 14–15) Easter Journey preorder launched: "Orders will ship beginning February 1st". The puzzle and canvas were added at the same time.
- 2025-10-15 ad creative: `Nephite-Christmas-2025-ads-website-banner.png` and `-white-banner.png` (flat-lay of the book and coloring book).
- 2025-10-22 `Nectar-Slider.png` / `SHARE-slider.webp`: "Buy 2 books, get 20% off your whole order with code: SHARE".
- 2025-10-29 `scary.png` / `Scary-deal.webp`: "Halloween Sale — FREE Coloring Book when the bundle is purchased" (auto-applied).
- 2025-11 `Website-Slider-Signings-1-scaled0.jpg`: "Black Friday Pre-Sale BOGO 50% Off All Nephite Christmas Products".
- 2025-11-27 `2-scaled.jpg`: "Black Friday 24 HR Flash Sale BOGO Free! Friday only".
- 2025-11-28 `Website-Slider-Signings.zip-5.png`: "$5 off per book, Free ornament with $50 purchase, Free download with $75 purchase".
- HurryTimer campaign #2870 ended **2025-12-02 23:59 MT**. Its text was "$5 off Nephite Christmas Books / $3 off Coloring Books / Free Ornament with $50 purchase / Free Digital Bundle with $75 purchase / Hurry! Sale ends in: / Get the deal!". The markup is still in every non-Easter PDP; JS hides it.
- 2025-12-02 `dec9slider-scaled.jpg`: "20% OFF EVERYTHING! Free activity book with $50 purchase; Free nativity craft download with $75 purchase".
- 2025-12-16 `December-16th-scaled.jpg`: "Order before December 19th — Final Week Blowout Sale BOGO 50% off".
- 2025-12-16 `December-19th-1-scaled.jpg`: "HURRY! Final day to order and receive it before Christmas — December 19th".
- 2025-12-16 `Website-Slider-Signings-1-scaled.jpg` (titled "late shipping"): "Didn't order in time to get it before Christmas? Find Nephite Christmas at BYU Store, Eborn Books, Barnes & Noble".

**2026**
- 2026-02 homepage redesign: ChatGPT watercolor background, Easter section.
- 2026-09-03 homepage video hero; NC + EJ bundle created.

**Known codes:** DOVE (Boise pickup), GENCONF, SHARE. **Patterns:** heavy use of BOGO, gift-with-purchase at $50/$75 thresholds, and deadline urgency. **(inference)** Q4 Christmas is the revenue season.

---

## 7. Tracking and tech

**Platform and hosting**
- WordPress 7.1.2 and WooCommerce 11.1.0, reported by `wcSettings`.
- Salient theme plus a child theme, WPBakery (`js_composer_salient`), Salient Core/Portfolio/Social.
- Host: **Nexcess / Liquid Web managed WooCommerce** (REST namespaces `nexcess-mapps` and `liquidweb/harbor`, header `x-cache-nxaccel`, nginx).

**Plugins observed**
- Commerce and marketing: woocommerce, woocommerce-product-addons (installed, unused on PDPs), woocommerce-table-rate-shipping, woo-discount-rules(+pro), woocommerce-smart-coupons, hurrytimer, rac (Recover Abandoned Cart), popup-maker, woo-stripe-payment.
- Tracking and feeds: facebook-for-woocommerce, google-listings-and-ads (Google for WooCommerce), google-site-kit.
- Other: gravityforms, loginpress-pro, ithemes-security, jetpack, code-snippets, AI Engine (`mwai`).

**Tracking IDs to preserve on the new site**
- **Meta Pixel `1232618954522587`** via Facebook for WooCommerce. Fires PageView and ViewContent client-side, plus CAPI through `meta-capi-param-builder` (loaded from unpkg). The server sets the `_fbp` cookie on the first response.
- **Google tag `GT-WVC6VHRJ` → GA4 `G-WP1LN2QBSK`** (Site Kit).
- **Google Ads `AW-18011862389`** (GLA group: page_view, view_item). **(inference)** It also runs a Merchant Center / Shopping feed.
- Not present: GTM container, Pinterest, TikTok, Klaviyo/Mailchimp, Clarity/Hotjar, consent banner.

**Speed (PSI API quota was exhausted; measured manually)**
- TTFB is 0.7–0.9s.
- Homepage: 49 JS files (~605 KB compressed), 24 CSS files (~143 KB), about 6 MB of full-size PNG/JPG images, and an 8.1 MB autoplay video. That is **about 15 MB total**.
- NC PDP: 66 JS and 31 CSS files, about 1.3 MB of images, and an **embedded 51 MB `.mov` with `preload="auto"`**.
- The viewport meta disables zoom (`maximum-scale=1, user-scalable=0`).

**SEO**
- No meta descriptions and no Open Graph tags on any page, so shared links preview poorly.
- The homepage has no H1.
- PDPs have product JSON-LD.
- Most product images have empty alt text.

**Hygiene**
- Sample page and test product are live and in the sitemap.
- Broken account link.
- 404 wholesale catalog.
- Stale copy: the preorder message, "available in select stores in Utah this year", and "PDF… coming soon".

---

## 8. Conversion critique

### What works
1. **Real, abundant social proof.** There are 20 five-star reviews on NC plus 22 five-star ratings on Amazon. The Bytheway testimonial is a strong endorsement, and reviewers mention tradition, rhyme and grandchildren.
2. **Distinctive positioning with clear hooks.** "You know what happened in Bethlehem. But do you know what happened across the sea?" The NC story follows the "Night Before Christmas" cadence. Easter Journey promises "higher and holier", with an origin story (1,000 attendees, "better than Disneyland").
3. **Excellent visual assets.** The illustration style is consistent, there is professional family-reading photography and video b-roll, and there is a read-aloud video. All of it is ready for ads, landing pages and peek-inside sections.
4. **Tradition mechanics that justify add-ons.** The dove/star seek-and-find and the ornament hide-and-seek game ("Elf on the Shelf but with deeper meaning") make natural low-cost add-ons.
5. **A product ladder already exists.** Book, then bundle, then bundle with ornament. The new NC + EJ bundle ($49.98) works year-round, and digital versions serve ward, Primary and FHE buyers.

### What hurts conversion (for paid cold traffic)
1. **The hero does not sell.** The top 650px is a silent video with no headline, offer, price or CTA, and the page has no H1. The first CTA sits below the fold on mobile, and there are only two "Buy Now" buttons, each for a single book.
2. **The homepage has none of these:**
   - the bundle offer
   - prices
   - star rating or reviews
   - shipping, returns or guarantee information
   - a peek inside the books
   - age range or format specs
3. **Traffic leaks off-site:**
   - The top bar links to "Connection Is The Cure".
   - The PDP short description, above Add to Cart, links to Eborn, BYU Store, B&N and This is the Place.
   - Amazon's buy box ($20.85) undercuts the site ($22.49).
4. **Pricing credibility:**
   - Every Christmas item has shown "Sale!" at 10% off for a long time.
   - The bundle's $59.98 strike-through price is not the sum of its parts ($54.98), and the copy says $49.99 while the price is $49.98.
   - POD prices like $22.92 and $24.73 look arbitrary.
5. **Shipping is a blind spot.** There is no cost, speed or free-shipping threshold shown before checkout, and the cost appears only after an address is entered. There is also no threshold to lift AOV, even though past promos used $50/$75 gift thresholds.
6. **Risk reversal is negative.** The generic template policy combined with "sale items cannot be refunded" means effectively no refunds. There is no guarantee and no secure-checkout or payment-badge messaging.
7. **Checkout friction.** Card is the only visible payment method: no Shop Pay, Apple Pay, Google Pay or PayPal express. Moving to Shopify solves this.
8. **No lead capture.**
   - There is no email or SMS signup anywhere, and the freebies are ungated.
   - Popup Maker has no active popup.
   - The abandoned-cart plugin cannot work without emails.
   - Cold ad traffic that doesn't buy is simply lost.
9. **Easter Journey is under-supported.** It has 0 reviews, and its landing page still says "Preorder… ship beginning February 1st". The site title and meta still say "The Author of Nephite Christmas" only.
10. **PDP layout issues:**
    - Long walls of text.
    - Reviews hidden in a tab below related products.
    - Leftover expired-countdown markup.
    - An autoplaying 51 MB video payload.
    - No sticky mobile Add to Cart, no "what's inside" or specs block, and no stated age range.
    - Page count is inconsistent: 26 pages vs 36 on Amazon.
11. **Catalog clutter.** There are 15 retail products, several near-duplicate bundles, and POD items with copy mismatches (puzzle sizes not offered; the "8 x 10" canvas is sold as 10″×8″). The physical/digital split is confusing ("Continue scrolling").
12. **Performance.** About 15 MB on the homepage and 60+ scripts on PDPs will hurt mobile LCP from Meta in-app browsers, and zoom is disabled.
13. **Trust and hygiene.** Broken account link, 404 wholesale link, public test product and sample page, no privacy policy or terms, and no OG tags.

---

## 9. Content we must carry over (checklist)

**Products and copy**
- Core: NC hardcover; EJ hardcover; NC + EJ bundle (hero offer); NC bundle; NC bundle with ornament; coloring book; 2 ornaments.
- Digital: NC PDF, coloring PDF, nativity PDF, NC digital bundle, EJ PDF. Use a Shopify digital-delivery app, and check its per-file size limit, because the files are 100–190 MB.
- Decide with the client whether to keep the puzzle, the canvas and wholesale. Wholesale options: a Shopify B2B catalog or a separate reseller form.

**Reviews and proof**
- Import all 21 reviews into the Shopify review app, deduping Kendra and Lynn.
- Bytheway testimonial (with permission).
- Amazon rating as an aggregate claim ("5.0★ on Amazon"), with no quotes.
- Idaho Business Review 2025 Women of the Year badge.
- Retail partner logos: BYU Store, Eborn, B&N Sandy, This is the Place (confirm they are still current).

**Story and brand**
- About bio and butterfly story; Kelley Hicken bio and headshot.
- Easter Journey origin story; NC 3 Nephi explainer; "Night Before Christmas" cadence hook.
- Homepage hooks; ornament tradition copy; Primary/FHE/ward use cases.

**Lead magnets (gate behind email)**
- Coloring pages: `Nephi-preaching.pdf`, `Family-Praying.pdf`.
- Activities: `Origami-Dove.pdf`, `Cube-Dove.pdf`.
- 5 Easter wallpapers: `Tomb-`, `Mary-`, `Jesus-`, `He-is-Risen-`, `Crosses-Wallpaper-scaled.jpg`.

**Media**
- Covers, title art, logos, lifestyle photos (`1.png`, `9.png`, `8.png`, `500A2551`), spreads, coloring pages, nativity pieces, video b-roll, `IMG_3989.mov` read-aloud, `Animated-cropped-waving-boy.gif`.
- **All are already in `assets/media-library` under identical filenames.** Local-only extras are `*0.webp` duplicates.

**Offers and ops**
- Bulk 5+ = 10% off; Boise local pickup; Christmas shipping deadline messaging; gift-with-purchase thresholds.
- Codes to decide on: DOVE, GENCONF, SHARE.

**Tracking continuity**
- Meta Pixel `1232618954522587`, GA4 `G-WP1LN2QBSK`, Google Ads `AW-18011862389`, Merchant Center feed.

**Policies to write fresh**
- Shipping (rates, speed, free threshold), returns/guarantee, privacy, terms, FAQ.

**301 redirects** from `/product/{slug}/`, `/shop/`, `/easter-journey/`, `/nephite-christmas/`, `/the-nephite-christmas-collection/`, `/home/freebies/`, `/about-the-author/`, `/contact-the-author/` and `/product-category/*` to the new routes.

## 10. Open questions for the client
1. What are the definitive specs for NC (26 or 36 pages, dimensions) and EJ, and what age range should we state?
2. Is the "5,000+ copies sold" figure real?
3. Can we use the Bytheway name and quote prominently?
4. What shipping rates and carriers should we use? Do they want a free-shipping threshold (for example $50)?
5. Should Boise pickup stay?
6. Keep or drop the puzzle, canvas and wholesale on the new site? Who fulfils the POD items?
7. Are the retail partners still current, and is Easter Journey on Amazon or in stores?
8. May we move or protect the publicly accessible NC PDFs on the live site now?
9. What return address should the new policy use? A PO box?
10. What should the standing price strategy be (instead of a permanent "Sale!"), and what is the real bundle anchor price?