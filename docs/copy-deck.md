# Copy deck: first build (Christmas mode)

Version 1 · 2026-09-22 · For the Next.js 16 storefront and the mock product catalog.
Sources: `docs/discovery/current-site.md`, `book-nephite-christmas.md`, `book-easter-journey.md`, `book-text/*.txt`, `market-cro.md`, `inspo-wonderbly.md`, `inspo-slumberkins.md`, `videos-printables.md`, `docs/PLAN.md`.

## How to use this deck

- Text in quote blocks, table cells and after a **Field:** label is final copy. Paste it as written.
- `[CONFIRM]` marks a claim, number or price Tiffany has not verified. The text before the tag is the intended copy. Strip the tag when pasting, and keep the claim out of production until §5 is answered.
- `{token}` is a runtime value, for example `{remaining}` renders as “$20.01” and `{title}` as “Nephite Christmas”.
- Punctuation is typographic (’ “ ” — × ″). That also keeps JSX clear of the `react/no-unescaped-entities` lint rule.
- Book titles can be set in italics in body copy. Button labels are Title Case; everything else is sentence case.
- Reviews are verbatim from the live site. “…” marks a trim; nothing else was changed except straight quotes becoming curly ones. Reviewer names are shown as first name + last initial, for privacy and consistency (full names are in §2.8).

## Voice and compliance rules (for anyone adding copy later)

- Warm, reverent, family-centered. Short sentences, benefit first, American English.
- Say “Latter-day Saint”. Never “Mormon” as a people or church name, and never “LDS Church”. “Book of Mormon” (the book’s name) and “Nephites” are fine.
- Never imply the Church publishes, sells or endorses anything. The footer disclaimer appears on every page, landing pages included.
- Describe the book, never the reader’s faith. Write “A Book of Mormon Christmas story in rhyme”, not “LDS moms, you’ll love this.” This matters most on `/lp/*` pages and in anything that might become ad copy (Meta policy).
- Easter Journey reaches Christians of every denomination. On its product page, avoid Latter-day Saint program names (Primary, family home evening, Come, Follow Me) and don’t push Nephite Christmas as the main offer.
- No fake timers, “only 3 left”, or permanent “Sale!” labels. Strike-through prices only when the compare-at price is real (today that means only the Complete Set: $54.98 if bought separately).
- Use real counts only. Nephite Christmas has 20 five-star reviews on the site and a 5.0 rating from 22 ratings on Amazon. Easter Journey has 0 reviews, so show no stars for it.
- Every delivery promise needs a basis (FTC Mail Order Rule). Use the configured cutoffs, never invented ones.

---

## 1. Global

### 1.1 Site identity and home metadata

| Field | Copy |
|---|---|
| Site name | Tiffany Wheeler |
| Tagline (chosen) | Christ-centered picture books for Christmas and Easter |
| Tagline (alternate, Tiffany’s own Instagram line) | Creating traditions that help connect families |
| Title template | `%s \| Tiffany Wheeler` |
| Home meta title (52 chars) | Nephite Christmas & Easter Journey \| Tiffany Wheeler |
| Home meta description (155 chars) | A Book of Mormon Christmas story in the rhythm of ’Twas the Night Before Christmas, plus an 8-day Holy Week journey. Get both books for $49.99, ships free. [CONFIRM price + threshold] |
| OG title | Nephite Christmas & Easter Journey, by Tiffany Wheeler |
| OG description | Two illustrated hardcovers for His birth and His Resurrection. Get both books for $49.99 with free US shipping. [CONFIRM] |
| OG image alt | Nephite Christmas and Easter Journey hardcovers side by side |

Search copy note: “LDS” is not used anywhere in this deck. If Tiffany approves it for search terms, use it only in search metadata, never in headlines or body copy (§5, item 34).

### 1.2 Announcement bar, by season mode

Rotate messages every 5–6 seconds; pause on hover or focus; each message links where shown. Dates are Mountain Time.

| Mode | Dates | Message | Link |
|---|---|---|---|
| christmas | Sep 15 – Dec 15 | 1. Order by Dec 15 for Christmas delivery [CONFIRM] | `/shipping` |
| | | 2. Free US shipping on orders $45+ · The Complete Set ships free [CONFIRM] | `/books/complete-set` |
| | | 3. Packed by hand and shipped from Idaho in 1–2 business days [CONFIRM] | `/shipping` |
| | | Alternate for 3, if signed copies are confirmed: Signed copies available through Dec 11 [CONFIRM] | `/faq#signed` |
| christmas, after standard cutoff | Dec 16 – Dec 17 | 1. Still time for Christmas: choose Priority shipping at checkout by Dec 17 [CONFIRM] | `/shipping` |
| | | 2. No shipping, no waiting: PDF editions download instantly | `/shop/nephite-christmas-pdf` |
| last-minute | Dec 18 – Dec 24 | 1. Too late to ship for Christmas? The PDF edition downloads instantly. | `/shop/nephite-christmas-pdf` |
| | | 2. Order the hardcover today and it ships Dec 26 [CONFIRM] | `/books/nephite-christmas` |
| | | 3. (optional) Local to Boise? Free pickup through Dec 23 [CONFIRM] | `/shipping#pickup` |
| after-christmas | Dec 26 – Jan 4 | 1. Next up: Easter Journey, an 8-day Holy Week tradition. Easter is March 28. | `/books/easter-journey` |
| | | 2. Free US shipping on orders $45+ [CONFIRM] | `/shipping` |
| easter | Jan 5 – Mar 28 | 1. Order by Mar 15 to start Easter Journey on Palm Sunday, Mar 21 [CONFIRM] | `/shipping` |
| | | 2. Free US shipping on orders $45+ [CONFIRM] | `/shipping` |
| | | 3. From Mar 16: Start this Palm Sunday. The Easter Journey PDF downloads instantly. | `/shop/easter-journey-pdf` |
| off-season | Mar 29 – Sep 14 | 1. Free US shipping on orders $45+ [CONFIRM] | `/shipping` |
| | | 2. Free printable activity pack for your family. Get it by email. | `/freebies` |
| | | 3. Buying for a class or ward? Save 10% on 5 or more books [CONFIRM] | `/bulk-orders` |

If Tiffany runs a real Black Friday or General Conference offer, it replaces message 3 in christmas mode for the offer’s dates only, and ends when it says it ends.

### 1.3 Header and navigation

| Element | Copy |
|---|---|
| Skip link | Skip to main content |
| Logo alt | Tiffany Wheeler, home |
| Nav (christmas, after-christmas, off-season order) | Nephite Christmas · Easter Journey · Complete Set · Shop All · Free Printables · About |
| Nav (easter mode order) | Easter Journey · Nephite Christmas · Complete Set · Shop All · Free Printables · About |
| Cart button | Cart ({count}) |
| Cart button aria-label | Open cart, {count} items |
| Mobile menu button aria-label | Open menu / Close menu |
| Mobile drawer extra links | FAQ · Shipping & Christmas Delivery · Contact Tiffany |
| Mobile drawer footer line | Free US shipping on orders $45+ [CONFIRM] |
| Landing pages (`/lp/*`) | Logo only, no nav links. The logo is not a link. |

### 1.4 Trust strip (4–5 items)

Use on the homepage under the hero and under Add to Cart on product pages (first four items there).

| Icon suggestion | Text | Optional tooltip or subline |
|---|---|---|
| truck | Free US shipping $45+ [CONFIRM] | Under $45, a flat $5.99 [CONFIRM] |
| package (or map pin) | Ships from Idaho in 1–2 days [CONFIRM] | Packed by hand [CONFIRM] |
| star | 20 five-star reviews | Plus 5.0 on Amazon from 22 ratings |
| pen / signature | Signed copies available [CONFIRM] | Free. Just check the box in your cart. [CONFIRM] |
| heart-in-shield | Love it or your money back [CONFIRM] | 30 days, no hassle [CONFIRM] |
| gift | Free gift note | We’ll tuck your message in the box |

The homepage band and the physical buy-box rows use the gift note in place of reviews or signed copies (see §2.2).

### 1.5 Footer

**Blurb:**
> Tiffany Wheeler writes Christ-centered picture books that help families make traditions around the Savior’s birth and Resurrection. Illustrated by Kelley Hicken. Packed and shipped from Idaho.

**Mini signup:** heading “Free printables + holiday shipping reminders” · input placeholder “Your email” · button “Sign Up” · success “You’re in! Check your inbox.”

**Columns:**

| Shop | Help | About |
|---|---|---|
| Nephite Christmas | FAQ | Meet Tiffany |
| Easter Journey | Shipping & Christmas Delivery | Illustrator Kelley Hicken |
| The Complete Set | Returns & Guarantee | Free Printables |
| Gifts & Add-ons | Contact Tiffany | Wholesale for Retailers |
| Instant Downloads | Bulk & Ward Orders | |

**Legal row:** Privacy Policy · Terms of Service · Accessibility

**Social:** Instagram (@tiffanywheelerbooks) · Facebook (Tiffany Wheeler Books) [CONFIRM which Facebook page: the live About page links a personal profile]

**Disclaimer (required, every page):**
> Independent publication. Not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints.

**Copyright:** © {year} Tiffany Books LLC. Illustrations by Kelley Hicken. [CONFIRM legal entity; the live site says “© 2026 Tiffany Wheeler.”]

**Payment line (once Shopify is live):** Secure checkout · Shop Pay · PayPal · Visa · Mastercard · Amex [CONFIRM enabled methods]

### 1.6 Shop All page header

- H1: Shop
- Sub: Books, bundles and little extras for Christmas and Easter.
- Filter tabs: All · Books & Sets · Gifts & Add-ons · Instant Downloads · Easter
- Digital section note: Instant downloads arrive by email. Nothing ships.

---

## 2. Homepage (Christmas mode)

Section order: announcement bar → header → hero → trust strip → product cards → Complete Set bar → Why families love Nephite Christmas → Peek inside → Video → Reviews → Make it a tradition → How families use it → Email capture → Meet the author → Bulk & where to find it → FAQ → footer.

### 2.1 Hero

Visual: Nephite Christmas cover in front and larger, Easter Journey behind it. Mobile: books above the headline, and the whole hero fits one screen.

Condensed on 2026-09-25 after a buyer-panel review: four buyer personas, CRO, copywriting, the real reviews, and a compliance check. Cold ad traffic already knows what the book is from the ad. The old hero told them three times (a script lead-in, a 4-line H1 and a lede) and never said why they'd want the second book, so every persona tapped the single book. The hero now says what it is once and spends its words on the choice. It is about 39 words on phones and desktop, down from about 62 and 105.

| Field | Copy |
|---|---|
| Rating line (above the H1) | ★★★★★ {count} Nephite Christmas reviews (links to reviews; names the title because the stars sit beside a two-book offer) |
| Eyebrow | (none; eyebrows only appear when they carry a date) |
| H1 | ’Twas the night before Christmas… in the Book of Mormon. [CONFIRM with Tiffany] |
| Lede | Hardcover · Ages 3–10 [CONFIRM] · Find the hidden dove |
| Primary CTA | Christmas + Easter Set — $49.99 [CONFIRM price and set naming] |
| Line under the primary CTA | One for His birth, one for His Resurrection · Ships free |
| Secondary CTA | Just Nephite Christmas — $24.99 [CONFIRM] |
| Subhead, microtrust | (removed; the trust band sits right below the hero) |
| Hero image alt | Nephite Christmas and Easter Journey hardcovers, with Nephite Christmas in front |

Why this H1: it is the book’s own first line and the ad’s spoken opening, and it keeps both hooks (’Twas the Night and Book of Mormon) in 3 lines. Earlier options: “You know what happened in Bethlehem. Now read what happened across the sea.” (Tiffany’s hook; now lives in the “same holy night” section) and “The Book of Mormon Christmas story, in the rhythm of ’Twas the Night Before Christmas.” (the ad caption; still the H1 on `/lp/christmas-tradition`).

The “if bought separately” price ($54.98) moved out of the hero to the Complete Set bar. The announcement bar pins the order-by date on the homepage instead of rotating.

Tests worth running once ads are live, one at a time:
1. Set line: “One for His birth, one for His Resurrection · Ships free” vs “Christmas + Easter · Ships free · Save $4.99”.
2. Under the single-book button: nothing vs “Ships for $5.99 · 2 copies ship free”.
3. H1: the book’s first line vs the ad caption.

### 2.2 Trust strip

Four items from §1.4, in this order: shipping, ships from, gift note, guarantee. Reviews are left out because the hero’s rating row sits just above, and four items give phones a clean 2 × 2 grid. While the hero leads with the PDF (last-minute), the guarantee is swapped for “Instant download”, because downloaded PDFs can’t be refunded.

### 2.3 Product cards

**Nephite Christmas**

| Field | Copy |
|---|---|
| Badge | Bestseller [CONFIRM] |
| Title | Nephite Christmas |
| Subtitle | The Book of Mormon Christmas story, in rhyme |
| Rating | ★★★★★ 5.0 (20) |
| Blurb | On the night before Christmas, the believers watch for Samuel’s sign: a night with no darkness. A read-aloud rhyme inspired by 3 Nephi 1, with a dove hidden on every page [CONFIRM]. |
| Age line | Ages 3–10 [CONFIRM] · Hardcover · [CONFIRM] pages |
| Bullet 1 | In the rhythm of ’Twas the Night Before Christmas |
| Bullet 2 | A hidden dove to find on every page [CONFIRM] |
| Bullet 3 | Reads aloud in under 5 minutes |
| Price | $24.99 [CONFIRM] |
| CTA | Add to Cart |
| Link | Look inside → |

**Easter Journey**

| Field | Copy |
|---|---|
| Badge | For Easter · March 28, 2027 |
| Title | Easter Journey |
| Subtitle | An interactive Holy Week journey through Jerusalem |
| Rating | (hide until real reviews exist) |
| Blurb | Step through the gates of Jerusalem and meet the people who knew Jesus, from the man born blind to Mary Magdalene at the empty tomb. Read it as an 8-day Easter advent, Palm Sunday to Easter morning. |
| Age line | Ages 8–80 · great for the whole family · Hardcover · 9″ × 11″ · 46 pages [CONFIRM] |
| Bullet 1 | Built-in 8-day advent with questions for each day |
| Bullet 2 | Kids join in: “We seek Jesus of Nazareth.” |
| Bullet 3 | Seek-and-find 8 symbols of Christ |
| Price | $29.99 [CONFIRM] |
| CTA | Add to Cart |
| Note under CTA (christmas mode) | Ships now. Tuck it away for Holy Week. |

### 2.4 Complete Set bar

| Field | Copy |
|---|---|
| Badge | Best value |
| Headline (chosen) | His birth and His Resurrection, in one set. |
| Headline alternate A | One set. Two holidays. A year of Christ-centered traditions. |
| Headline alternate B | Christmas Eve and Easter morning, together for $49.99. |
| Sub | Read Nephite Christmas on Christmas Eve, then walk through Holy Week with Easter Journey. Two illustrated hardcovers that come back out every year. |
| Includes line | Includes: Nephite Christmas (hardcover) + Easter Journey (hardcover) |
| Price display | **$49.99** ~~$54.98~~ [CONFIRM] |
| Price label | $54.98 if bought separately · You save $4.99 · Free US shipping [CONFIRM] |
| CTA | Get Both Books — $49.99 |
| Microline | Both books ship together from Idaho in 1–2 business days. [CONFIRM] |

### 2.5 Why families love Nephite Christmas

Heading: **Why families love Nephite Christmas**

| # | Title | Line |
|---|---|---|
| 1 | It reads like the poem you already know | Rhyming couplets in the rhythm of ’Twas the Night Before Christmas make it easy to read aloud and fun to hear. |
| 2 | Kids hunt for the hidden dove | A dove is tucked into every page [CONFIRM], and the afterword invites kids to count the stars, too. |
| 3 | The same holy night, across the sea | Samuel’s sign, Nephi’s prayer and a night with no darkness, from 3 Nephi 1: the night before the Savior was born. |

Optional proof line under the three: “…the kids love finding the dove.” — Noel

### 2.6 Peek inside

- Heading: **Take a peek inside**
- Intro: Every spread is painted by Idaho illustrator Kelley Hicken. Here are a few favorite pages.
- Tabs: Nephite Christmas · Easter Journey
- Carousel controls (aria): Previous spread · Next spread · Spread {n} of {total}
- Mobile hint: Swipe to turn the page →

Story lines below are quoted exactly from the book text (`book-text/`). The Nephite Christmas lines come from the spreads PDF. Two PDF versions differ slightly (see §5, item 25).

**Nephite Christmas** (`assets/derived/peek-inside/nephite-christmas/`)

| # | File | Caption | Line from the spread | Alt text |
|---|---|---|---|---|
| Opening (bonus, hero or ad hook) | `nc-peek-00-opening-page.jpg` | It all begins on the night before Christmas | “’Twas the night before Christmas, and all through the land…” | The opening page of Nephite Christmas, set in an ancient American village |
| 1 | `nc-peek-01-samuels-prophecy.jpg` | A village waits for Samuel’s promised sign | “For Samuel the prophet said the sign would soon come, but the wait had just gotten too long for some.” | Villagers in an ancient American town wait for Samuel’s sign as the wicked threaten the believers |
| 2 | `nc-peek-02-night-without-darkness.jpg` | Nephi teaches Jacob about the sign | “You must wait for the day and the night that are one, a night without darkness, with no setting sun!” | The prophet Nephi teaches Jacob, the boy in the red headband, about the coming sign |
| 3 | `nc-peek-03-lift-up-your-head.jpg` | Nephi’s prayer is answered in a grove filled with light | “Son, lift up your head, and be of good cheer! For the time is at hand, and the sign is so near!” | Nephi kneels in prayer in a grove of trees filled with light |
| 4 | `nc-peek-04-for-of-mary.jpg` | Jacob draws as the Savior’s birth in Bethlehem draws near | “For of Mary tomorrow I shall be born, in Bethlehem of Judea, that first Christmas morn.” | Jacob draws beside a scene of the Nativity in Bethlehem beneath a bright star |
| 5 | `nc-peek-05-no-darkness-came.jpg` | The miracle: a glorious night with no darkness | “So that glorious night, no darkness came.” | The Nephite village glows with light on a night without darkness |
| 6 | `nc-peek-06-merry-christmas.jpg` | An ending that brings the message home | “And so from the Nephites of old unto you, remember Christ came to save all of us, too! … Merry Christmas to all, and to all a good night!” | The closing spread: “Merry Christmas” beside Jacob’s drawings of the shepherd, the Nativity and the wise men |

**Easter Journey** (`assets/derived/peek-inside/easter-journey/`)

| # | File | Caption | Line from the spread | Alt text |
|---|---|---|---|---|
| 1 | `ej-peek-1-triumphal-entry-p04-05.jpg` | Palm Sunday: the city welcomes its King | “Today, Jesus rode into our Great City upon the back of a young colt—a symbol of his royal lineage and purpose.” | Jesus rides into Jerusalem on a colt as crowds welcome Him with palm branches |
| 2 | `ej-peek-2-blind-man-healed-p06-07.jpg` | The man born blind sees for the first time | “Light and color overtook me, and the darkness disappeared. I could see!” | Jesus heals the man born blind |
| 3 | `ej-peek-3-last-supper-p14-15.jpg` | In the upper room, Jesus serves His apostles | “…that we should love one another, even as He has loved us.” | The Last Supper in the upper room, with Jesus’s hands breaking bread |
| 4 | `ej-peek-4-he-is-risen-p38-39.jpg` | He is risen! | “I am the resurrection, and the life… Believest thou this?” (John 11:25–26 KJV) | The risen Christ smiles in front of the open garden tomb |
| 5 | `ej-peek-5-symbols-seek-find-p42-43.jpg` | Find 8 symbols of Christ hidden in the art | “Can You Find These Symbols of Christ Throughout this Book?” | The seek-and-find page: a cross, Easter lily, oil lamp, dove, fig, pelican, palm leaves and door knocker |
| 6 | `ej-peek-6-easter-advent-guide-p44-45.jpg` | A built-in 8-day advent, Palm Sunday to Easter morning | “Use this as a daily reflection at the end of each story segment.” | The Easter Journey Advent page beside a painting of Jesus holding a scroll |

Under the carousel: **CTA:** Get Both Books — $49.99 · **Link:** Or shop each book →

Alt text above was drafted from the book reports, not from the images themselves. Check each one against its image before launch.

### 2.7 Video

**Trailer (30s lifestyle edit)**

- Heading: **Watch families read it by the fire**
- Sub: Grandmas, moms and kids gathered around Nephite Christmas. (0:30)
- Play button: Play Trailer
- Play aria-label: Play the Nephite Christmas trailer, 30 seconds, with sound
- Poster alt: A mother and her children read Nephite Christmas together by the fireplace
- Captions track label: English
- Note: captions are required (Meta autoplays muted); the transcript is pending (§5, item 11).

**Read-aloud excerpt** (from `IMG_3989.mov`: a 20–40s excerpt, not the full 3:11)

- Heading: **Hear Tiffany read it** [CONFIRM it’s Tiffany in the video]
- Sub: Pull up a chair. Author Tiffany Wheeler reads the opening pages aloud.
- Play button: Listen ({duration})
- Poster alt: Tiffany Wheeler reads Nephite Christmas aloud in front of her fireplace [CONFIRM]
- End card text (optional): Finish the story at home. Nephite Christmas — $24.99

### 2.8 Reviews

- Heading: **What families are saying**
- Summary line: ★★★★★ 5.0 · 20 reviews of Nephite Christmas
- Amazon line (no link, no quotes from Amazon): Also rated 5.0 out of 5 on Amazon (22 ratings) [CONFIRM count at launch]
- Buttons: Read All 20 Reviews · Write a Review
- Label for verified reviews only: Verified buyer

**Featured testimonial** (verbatim, trimmed) [CONFIRM written permission, and whether they received a free copy; if so, add “Received a complimentary copy.” under the name]

> “We just received your Nephi Christmas book and it is absolutely beautiful. Thank you so much for adding to our Christmas collection in such a beautiful way. Thank you for helping make a new tradition in our home. … many thanks for this lovely treasure.”
> — Kim and John Bytheway

Short version for a hero pull or ad: “…it is absolutely beautiful. … Thank you for helping make a new tradition in our home.” — Kim and John Bytheway

The original (“Nephi Christmas”, their wording) opens with “This is Kim and John Bytheway” and a heart emoji; that opening is trimmed above.

**Featured customer reviews** (8 cards, in this order; all 5 stars)

| # | Display name | Original name on site | Date | Verified | Review (verbatim) | Theme |
|---|---|---|---|---|---|---|
| 1 | Karen B. | Karen H Bartlett | 2025-11-21 | no | “I have wanted to include the Christmas story … in our family’s Christmas Eve nativity play for years. This book makes it so easy to include this Christmas story from the Book of Mormon. Thank you so much!” | Christmas Eve |
| 2 | Noel | Noel | 2025-10-03 | no | “We love this book! It is sweet and the kids love finding the dove.” | Dove |
| 3 | LeeAnn J. | LeeAnn Jett | 2024-11-17 | no | “I smiled the whole time reading this beautiful story! Well written and illustrated for today’s children and adults alike! I love the familiar rhythm of the prose.” | Rhythm |
| 4 | Kathy H. | Kathy Horning | 2024-12-06 | yes | “I love this simple well written story from the viewpoint of the Nephites. It will become a tradition at my family’s Christmas Eve program. I have given copies to my children…” | Tradition, gifting |
| 5 | Austin V. | Austin Vach | 2024-12-01 | no | “Nephite Christmas is a well written retelling of the Book of Mormon story matching the cadence of the original Christmas poem. My family received it as a gift and I loved it as much as my kids did.” | Gift, rhythm |
| 6 | Merrilee B. | Merrilee Boyack | 2024-11-05 | no | “Loved this story! Beautifully written and great illustrations. My grandchildren will love this!!” | Grandparents |
| 7 | Kate A. | Kate Asbury | 2024-11-10 | no | “This book is very well done. It’s written as a catchy rhyme and it flows so nicely. The pictures are great too! It will make a great gift!” | Rhyme, gift |
| 8 | Nate | Nate | 2024-07-20 | no | “Really fun twist on a classic christmas story! My 4 year old son loves it :)” | Young kids |

Alternates (for landing pages or a second row):

| Display name | Original name | Date | Verified | Review (verbatim) |
|---|---|---|---|---|
| Candice A. | Candice andrus | 2024-10-09 | no | “My grandma used to include the story of Samuel the Lamanite and the sign during our Christmas story telling. She would be thrilled to know someone else did something to make that a yearly tradition. … I love the star and the dove.” |
| Kendra S. | Kendra Santa Cruz | 2024-09-28 | yes | “Such a sweet story! I only wish I had this last week when I was talking to my kids about Samuel! It is beautifully illustrated and it is just a lovely new Christmas tale to share every Christmas!” |
| Tim | Tim | 2024-11-09 | no | “Beautiful and well written book! Reading this book together as a family will become one of our new Christmas traditions.” |
| D. F. | D Fuller | 2025-11-17 | no | “I love this book. Looking forward to sharing with my family for our Christmas devotional.” |
| Jeanne | Jeanne | 2024-12-05 | yes | “This book has meaningful love on every page.” |

Do not feature: Dana Dow and Paula Harlow (both written before receiving the book), or the second Kendra and Lynn reviews (duplicates). They can stay in the full list only if the count stays honest (§5, item 12).

**Easter Journey reviews, empty state** (EJ tab and EJ product page)

- Heading: Reviews for Easter Journey
- Body: Easter Journey doesn’t have reviews yet. Read it with your family this Holy Week? We’d love to hear how it went.
- Button: Write the First Review

### 2.9 Make it a tradition (add-ons row)

- Heading: **Make it a tradition**
- Sub: Little extras that keep the story going all season.
- Card button: Add · {price}
- Card aria: Add {title} to cart, {price}

| Add-on | Line | Price |
|---|---|---|
| Nephite Christmas Coloring & Activity Book | 13 puzzles and games plus 12 coloring pages. Help Jacob find Nephi, decode a secret message, and more. | $7.99 |
| Nephite Christmas Star Ornament | Hide it on the tree each night and let the kids seek the star, like the wise men of old. | $2.99 |
| Peace Dove Ornament | A white dove with star cutouts, a gold ribbon and a card that turns it into a family hide-and-seek tradition. | $2.99 |
| Nativity Craft (PDF) | Print, color, cut and stand up your own nativity, with Nephi and a Nephite family beside Mary, Joseph and baby Jesus. | $2.99 |
| Nephite Christmas (PDF) | The whole book on your TV or tablet, perfect for ward parties, Primary and Christmas Eve. Instant download. | $6.99 |
| The Promised Messiah Puzzle | 252 pieces of Kelley Hicken’s painting of the Savior before the walls of Jerusalem. | $24.99 [CONFIRM] |
| He Spoke My Name Canvas | The moment Mary hears Him speak her name, on a 10″ × 8″ canvas. | $24.99 [CONFIRM] |

### 2.10 How families use it

Heading: **How families use Nephite Christmas**

| Use | Line |
|---|---|
| Christmas Eve program | Read it after the Bethlehem story in Luke 2, and let the kids act out the watching believers and the night with no darkness. |
| Family home evening | It reads aloud in under five minutes, and then the dove hunt, the coloring book and the nativity craft keep the lesson going. |
| Primary and ward activities | Put the PDF on the big screen at a ward Christmas party, and set out nativity crafts at the craft table. |
| A gift from Grandma and Grandpa | Send a copy to every grandchild’s home with a gift note in your own words. Five or more books save 10% [CONFIRM]. |

### 2.11 Email capture

**Inline section**

| Field | Copy |
|---|---|
| Eyebrow | Free printables |
| Headline | Free: the Nephite Christmas Family Activity Pack |
| Sub | Fold an origami dove, build a paper cube dove, and color two scenes from the book: Nephi preaching and a family at prayer. Four printable pages, sent straight to your inbox. |
| Input label | Email address |
| Input placeholder | you@example.com |
| Button | Send My Free Pack |
| Fine print | We’ll email your printables right away, plus occasional notes from Tiffany about new books and holiday shipping dates. Unsubscribe anytime. We never share your email. See our Privacy Policy. |
| Success | It’s on its way! Check your inbox for your Family Activity Pack. |
| Success follow-up | While you’re here: Nephite Christmas ships from Idaho in 1–2 business days. [Shop Nephite Christmas] |
| Error, invalid email | Please enter a valid email address. |
| Error, server | Something went wrong on our end. Please try again in a moment. |
| Visual alt | The four printables: an origami dove, a cube dove, and coloring pages of Nephi preaching and a family praying |

**Popup variant** (show after 8 seconds or 50% scroll; not on product pages before an add-to-cart; once per visitor per 14 days)

- Headline: A free Christmas activity pack for your family
- Sub: Four printables from Nephite Christmas: two paper doves and two coloring pages.
- Button: Email Me the Pack
- Dismiss link: No thanks
- Close aria-label: Close

Includes (for the email and the freebies page): Origami Dove · Cube Dove · Nephi Preaching coloring page · Family Praying coloring page. The Family Praying page also appears in the paid coloring book (§5, item 16).

### 2.12 Meet the author

- Heading: **Meet Tiffany**
- Bio (first person, about 60 words, adapted from her About page):

> Hi, I’m Tiffany Wheeler. I live in Idaho’s Treasure Valley with my husband, John, and our six children. As a girl I spent summers biking to the library and reading beneath the lilac bushes. Now I write faith-filled stories that bring families closer to one another and to Jesus Christ. My mantra is “Enjoy the Journey.” I’m so glad our paths have crossed.

- Illustrator line: Both books are illustrated by Idaho artist Kelley Hicken, who believes creativity is inherent in every human being.
- Optional credential line: Named one of Idaho Business Review’s 2025 Women of the Year. [CONFIRM she wants this used]
- Link: Read Tiffany’s story →
- Photo alt: Tiffany Wheeler, author of Nephite Christmas and Easter Journey
- Illustrator photo alt: Kelley Hicken, illustrator

### 2.13 Bulk orders and where to find it

- Heading: **Gifts for the whole family, or the whole ward**
- Sub: Buy 5 or more books and save 10% on each, applied automatically at checkout. [CONFIRM]

| Card | Title | Line | Link |
|---|---|---|---|
| 1 | Grandparents and big families | Send a copy to every grandchild’s home. Mix and match titles; 5+ books save 10% [CONFIRM]. | Shop the books → |
| 2 | Primary, ward and classroom | Hardcovers for teachers, PDFs for the big screen, and nativity crafts for the craft table. | See instant downloads → |
| 3 | Stores and gift shops | Carry Nephite Christmas and the Coloring & Activity Book at wholesale prices (reseller permit required). | Apply for Wholesale → |
| 4 | Find it in stores | Nephite Christmas is also carried by BYU Store, Eborn Books in Provo, Barnes & Noble in Sandy, and This Is the Place Bookstore in Palmyra, NY and Kirtland, OH. [CONFIRM still current] | (no outbound links) |

- Contact line: Questions about a large order? Email tiffany@tiffany-wheeler.com [CONFIRM customer-service address]

### 2.14 FAQ

Heading: **Questions? We’re here to help.** Add FAQPage JSON-LD with the same text.

**1. What ages are the books for?**
Nephite Christmas is a read-aloud picture book for ages 3–10. The rhyme keeps little ones listening, and older kids can read it on their own. The whole family will enjoy it. Easter Journey is a longer read, best for ages 8–80. It’s great for the whole family, with speaking parts that older kids and grown-ups can take turns reading, reader’s-theater style, if they wish. (Tiffany, Oct 2026)

**2. How big are the books, and how many pages?**
Nephite Christmas is a landscape hardcover with a dust jacket, about 10.75″ × 8.75″ [CONFIRM], with [CONFIRM] pages. Easter Journey is a 9″ × 11″ hardcover with a dust jacket and 46 pages [CONFIRM].

**3. What’s the story? Is it based on scripture?**
Yes. Nephite Christmas is inspired by 3 Nephi 1 in the Book of Mormon and Samuel the Lamanite’s prophecy of a night without darkness. The believers watch and pray, Nephi pleads with the Lord, and the Lord answers, “Son, lift up your head, and be of good cheer!” That night, no darkness comes. Easter Journey follows the Gospel accounts of Holy Week and quotes the King James Bible.

**4. Is this published by The Church of Jesus Christ of Latter-day Saints?**
No. Nephite Christmas and Easter Journey are independent publications by author Tiffany Wheeler. They are not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints.

**5. How much is shipping, and how fast is it?**
Orders of $45 or more ship free anywhere in the US [CONFIRM]. Orders under $45 ship for a flat $5.99 [CONFIRM]. We pack every order by hand and ship from Idaho in 1–2 business days; most packages arrive 2–5 business days later by USPS [CONFIRM]. Digital downloads arrive by email right away. Local to Boise? Choose free pickup at checkout [CONFIRM].

**6. When do I need to order for Christmas?**
Order by December 15 for Christmas delivery with standard shipping [CONFIRM]. After that, faster shipping is available at checkout through December 17 [CONFIRM]. Running late? The PDF editions download instantly, right up to Christmas Eve. Sending it as a gift? Add a free gift note in your cart and ship straight to the recipient.

**7. Can I get a signed copy?** (anchor `#signed`)
Yes [CONFIRM]. Check “Have Tiffany sign my books” in your cart. It’s free. To have it signed to someone, add their name in the box that appears. Please order signed copies by December 11 for Christmas delivery [CONFIRM].

**8. What if we don’t love it?**
Then we’ll make it right. If a book isn’t a fit for your family, email us within 30 days of delivery for a full refund [CONFIRM terms]. If anything arrives damaged, send a photo and we’ll replace it free. Digital downloads can’t be returned, but if a file won’t open, we’ll fix it.

**9. Do you offer bulk or ward orders?**
Yes. Buy 5 or more books, mixing titles if you like, and you’ll save 10% on each automatically [CONFIRM]. It’s a favorite for grandparents, Primary teachers and ward gifts. For large orders, email tiffany@tiffany-wheeler.com. Stores can apply for wholesale pricing.

**10. What’s the difference between the PDF and the hardcover?**
The hardcover is the keepsake: a dust-jacketed book your family can pull out every year. The PDF is an instant download with two versions, single pages for reading on a tablet and two-page spreads for a TV or projector. It’s perfect for ward parties, Primary lessons or a last-minute Christmas Eve. PDFs are for personal, family and classroom use; please don’t copy or share the files.

**11. How does the hidden dove work?**
A small dove, a symbol of peace, is tucked into the illustrations on every page [CONFIRM]. Kids love hunting for it as you read. The afterword also invites them to count the stars, a symbol of Christ’s light. Want to keep the game going? The Peace Dove Ornament comes with a card for a hide-the-dove tradition on your tree.

**12. How does the Easter Journey 8-day advent work?**
At the back of the book is an 8-day reading guide from Palm Sunday to Easter Sunday. Each day, read one part of the story (a fig symbol behind the page number shows where to stop), then talk through a few questions together. Saturday has no reading; it’s a day to remember Christ in the tomb. In 2027, start on Palm Sunday, March 21, and finish on Easter morning, March 28.

### 2.15 Hero variants for the other season modes

Same rules as §2.1: an eyebrow only when it carries a date, an H1 of 3 lines or fewer, a one-line lede, no subhead, and buttons that name what you get plus the price. Stars only show while Nephite Christmas leads.

| Mode | Eyebrow | H1 | Lede | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|
| last-minute (Dec 16–24) | (none) | Read Nephite Christmas this Christmas Eve. | No shipping. It’s in your inbox in minutes. | Instant PDF — $6.99 | Order the Hardcover — $24.99 (the pinned bar says “Hardcovers may not arrive by Christmas”) [CONFIRM] |
| priority (Dec 16–17, only if Priority is offered) | (none) | Still time for Christmas with Priority shipping. | Choose it at checkout by {priorityBy}. | Christmas + Easter Set — $49.99, line: “One for His birth, one for His Resurrection” (no “Ships free”) | Nephite Christmas PDF — $6.99 |
| after-christmas (Dec 26–Jan 4) | Next up: Easter, March 28 | An 8-day Easter advent, Palm Sunday to Easter morning. | Hardcover · Ages 8–80 · Questions for each day | Easter Journey — $29.99 | Christmas + Easter Set — $49.99, with the §2.1 line |
| easter (Jan 5–Mar 28) | Holy Week · March 21–28, 2027 | Walk through Holy Week with the people who knew Jesus. | Hardcover · A built-in 8-day Holy Week advent | Easter Journey — $29.99 | Look Inside |
| off-season (Mar 29–Sep 14) | (none) | His birth and His Resurrection, in two picture books. | Nephite Christmas + Easter Journey, in hardcover | Christmas + Easter Set — $49.99, line: “Ships free · Save $4.99” | Shop the Books |

The old after-christmas and off-season H1s (“Your family’s Easter tradition…”, “…your family will keep”) were replaced because they speak about the reader’s own practice, which is borderline under Meta’s personal-attributes policy.

Easter mode note: the secondary CTA is “Look Inside”, not the set, so the Easter page works for Christians of every denomination. The set still appears lower on the page.

---

## 3. Product detail pages

### 3.0 Catalog summary (for the mock provider)

Prices use the working assumptions. “Compare-at” appears only when it is a real sum of parts.

| Handle | Title | Type | Price | Compare-at | Badge | Legacy URL (301 source) |
|---|---|---|---|---|---|---|
| `nephite-christmas` | Nephite Christmas | Physical book | $24.99 [CONFIRM] | none | Bestseller [CONFIRM] | `/product/nephite-christmas/` |
| `easter-journey` | Easter Journey | Physical book | $29.99 [CONFIRM] | none | Holy Week tradition | `/product/easter-journey/` |
| `complete-set` | The Complete Set: Nephite Christmas + Easter Journey | Physical bundle | $49.99 [CONFIRM] | $54.98 (“if bought separately”) | Best value · Ships free | `/product/nephite-christmas-easter-journey-book-bundle/` |
| `nephite-christmas-bundle` | Nephite Christmas Bundle | Physical bundle | $32.98 | none (see note) | Book + activity book | `/product/nephite-christmas-bundle/` |
| `nephite-christmas-bundle-with-ornament` | Nephite Christmas Bundle with Ornament | Physical bundle | $35.97 | none (see note) | Gift-ready | `/product/nephite-christmas-bundle-with-ornament/` |
| `nephite-christmas-coloring-activity-book` | Nephite Christmas Coloring & Activity Book | Physical + digital variants | Printed $7.99 · PDF $5.99 | none | Pairs with the book | `/product/nephite-christmas-coloring-and-activity-book/` and `/product/nephite-christmas-coloring-and-activity-book-pdf-download/` (→ `?format=pdf`) |
| `nephite-christmas-ornament` | Nephite Christmas Star Ornament | Physical | $2.99 | none | Under $3 | `/product/nephite-christmas-ornament/` |
| `nephite-christmas-peace-dove-ornament` | Nephite Christmas Peace Dove Ornament | Physical | $2.99 | none | Under $3 | `/product/nephite-christmas-peace-dove-ornament/` |
| `nephite-christmas-nativity-craft` | Nephite Christmas Nativity Craft (PDF) | Digital | $2.99 | none | Instant download | `/product/nephite-christmas-nativity-craft/` |
| `nephite-christmas-pdf` | Nephite Christmas (PDF Edition) | Digital | $6.99 | none | Instant download | `/product/nephite-christmas-pdf-download/` |
| `easter-journey-pdf` | Easter Journey (PDF Edition) | Digital | $8.99 | none | Instant download | `/product/easter-journey-pdf-download/` |
| `nephite-christmas-digital-bundle` | Nephite Christmas Digital Bundle | Digital bundle | $15.97 | none (see note) | Instant download | `/product/nephite-christmas-digital-bundle-pdf-download/` |
| `easter-journey-puzzle` | The Promised Messiah: An Easter Journey Puzzle | Physical (print-on-demand) | $24.99 [CONFIRM] (was $24.73) | none | Made to order [CONFIRM] | `/product/the-promised-messiah-an-easter-journey-puzzle-of-the-savior/` |
| `he-spoke-my-name-canvas` | He Spoke My Name Canvas Print | Physical (print-on-demand) | $24.99 [CONFIRM] (was $22.92) | none | Made to order [CONFIRM] | `/product/he-spoke-my-name-8-x-10-canvas-print/` |

**Pricing note on the other bundles.** At regular prices, three bundles cost exactly the sum of their parts: the Nephite Christmas Bundle ($24.99 + $7.99 = $32.98), the Bundle with Ornament ($24.99 + $7.99 + $2.99 = $35.97) and the Digital Bundle ($6.99 + $5.99 + $2.99 = $15.97). So their copy sells convenience (“everything in one click”), never savings, and shows no strike-through. If Tiffany wants them to carry a real saving, suggested prices are $29.99, $32.99 and $12.99, each shown against its sum of parts [CONFIRM]. See §5, item 1.

Not carried over: the three wholesale products (replaced by a wholesale inquiry form) and the WooCommerce test product.

### 3.0a Shared PDP microcopy

- Rating link: ★★★★★ 5.0 · {count} reviews (links to `#reviews`)
- Quantity label: Quantity
- Add to Cart states: Add to Cart → Adding… → Added!
- Buy-box trust row (physical): the first four items of §1.4
- Buy-box trust row (digital): Instant download · Print as many times as you need · Delivered by email · Questions? We’ll help
- Section tabs or accordions: What’s Inside · Details · About the Story · Reviews · FAQ
- Cross-sell heading: Pairs well with
- Reviews label for bundles that contain Nephite Christmas: Reviews of Nephite Christmas (included in this set)

**Digital usage terms (every digital product, verbatim meaning kept from the live site):**
> Instant download. This is a digital product; no physical item will be shipped. Download once and print as many times as you need for personal, family or classroom use. Please do not copy or share the digital files. Thank you!

Extra line for the two book PDFs: Sharing it on screen at a family, church or classroom gathering is welcome. [CONFIRM]
Extra line for the large book PDFs: These are large, high-resolution files. We recommend downloading on Wi-Fi.

---

### 3.1 Nephite Christmas

- **Handle:** `nephite-christmas`
- **Title:** Nephite Christmas
- **Subtitle:** The Book of Mormon Christmas story, in the rhythm of ’Twas the Night Before Christmas
- **Badges:** Bestseller [CONFIRM]
- **Price:** $24.99 [CONFIRM] · **Compare-at:** none
- **Rating line:** ★★★★★ 5.0 · 20 reviews

**Short description:**
> On the night before Christmas, the Nephites watch and pray for the sign Samuel promised: a night without darkness. Nephite Christmas tells their story from 3 Nephi 1 in rhyming verse that reads like the poem your family already knows, with a hidden dove on every page [CONFIRM]. Read it together each Christmas and remember that Christ came to save all of us.

**Buy-box icon bullets:**
- Ages 3–10 [CONFIRM]
- Hardcover with dust jacket · [CONFIRM] illustrated pages
- Ships from Idaho in 1–2 business days [CONFIRM]
- Love it or your money back [CONFIRM]

**Option picker (optional, like the landing-page picker):** heading “Choose your gift”
- Hardcover — $24.99
- Christmas Bundle: book + coloring book + star ornament — $35.97
- Complete Set: add Easter Journey — $49.99 · Ships free · Best value [CONFIRM]

**Signed-copy checkbox (if confirmed):** Have Tiffany sign it (free) [CONFIRM]

**Pull quote near the buy box:** “We love this book! It is sweet and the kids love finding the dove.” — Noel

**What’s inside:**
- A rhyming read-aloud in the rhythm of ’Twas the Night Before Christmas
- Samuel’s sign, Nephi’s prayer and the night with no darkness, from 3 Nephi 1
- A dove hidden on every page [CONFIRM], plus stars to count
- A short afterword that explains the prophecies of Christ’s birth and invites kids to find the dove and the star
- Warm, detailed illustrations by Idaho artist Kelley Hicken
- A hardcover with a dust jacket, made to come out every Christmas

**Specs:**

| Spec | Value |
|---|---|
| Format | Hardcover with dust jacket |
| Size | About 10.75″ × 8.75″, landscape [CONFIRM] |
| Pages | [CONFIRM] pages (sources say 26, 28 and 36) |
| Ages | 3–10 [CONFIRM] |
| Read-aloud time | Under 5 minutes |
| Author | Tiffany Wheeler |
| Illustrator | Kelley Hicken |
| Publisher | Rhino Media, 2024 [CONFIRM] |
| ISBN-13 | 979-8989343553 [CONFIRM] |

**About the story:**
> ’Twas the night before Christmas in ancient America, and the wicked were threatening. Samuel the prophet had promised a sign of the Savior’s birth, a night without darkness, but the wait had grown too long for some. Now the unbelievers have set a day: if the sign doesn’t come, the believers will die. While young Jacob watches and draws, the prophet Nephi kneels in a grove outside town and pours out his heart to the Lord.
>
> The Lord answers: “Son, lift up your head, and be of good cheer!” That night, no darkness comes. The faithful are saved, and the very next day the Savior is born in Bethlehem. The story ends with a small act of forgiveness from Jacob and a message for every reader: “remember Christ came to save all of us, too!”

**Perfect for:**
- Christmas Eve, right after the Bethlehem story
- A Christmas Eve program or nativity play
- Family home evening in December
- Primary lessons and ward Christmas parties
- Gifts for grandchildren, neighbors and ministering friends
- A first Christmas book for little ones

**Pairs well with:** Nephite Christmas Coloring & Activity Book · Nephite Christmas Star Ornament · Peace Dove Ornament · The Complete Set (upgrade)

**Product FAQs:**

*Does it follow the scripture?*
Closely. As in 3 Nephi 1, the unbelievers set a day to put the believers to death, Nephi pours out his heart to the Lord, the Lord answers, “Son, lift up your head, and be of good cheer!” and that night there is no darkness. Jacob, the boy who draws his way through the pictures, is a character created for the book, and some details are simplified to fit the rhyme.

*How long does it take to read?*
Under five minutes read straight through. Plan a few extra minutes for the dove hunt.

*Is it a good fit for young children?*
Yes. It’s a picture book for ages 3–10 [CONFIRM]. The tension is gentle, and the story ends with forgiveness. A few scripture-style words like “saith” and “nigh” are a fun chance to talk about how the Book of Mormon sounds.

*Book, bundle or set: which should I get?*
The hardcover on its own is $24.99. The Nephite Christmas Bundle adds the Coloring & Activity Book, and the Bundle with Ornament adds the star ornament too. The Complete Set pairs it with Easter Journey for $49.99 and ships free [CONFIRM].

**SEO title (57):** Nephite Christmas | Book of Mormon Christmas Picture Book
**Meta description (150):** The Book of Mormon Christmas story from 3 Nephi 1, told in the rhythm of ’Twas the Night Before Christmas. Hardcover with a hidden dove on every page. [CONFIRM dove claim]
**Primary image alt:** Nephite Christmas hardcover, written by Tiffany Wheeler and illustrated by Kelley Hicken

---

### 3.2 Easter Journey

- **Handle:** `easter-journey`
- **Title:** Easter Journey
- **Subtitle:** An interactive Holy Week journey through Jerusalem
- **Badges:** Holy Week tradition
- **Price:** $29.99 [CONFIRM] · **Compare-at:** none
- **Rating line:** hidden (0 reviews); show the empty state from §2.8 in the reviews section

**Short description:**
> Step through the gates of Jerusalem and meet the people who knew Jesus: a friendly merchant, the man born blind, His apostles, His mother and Mary Magdalene at the empty tomb. Your family becomes part of the story, answering “We seek Jesus of Nazareth” as you go, and reading one part each day from Palm Sunday to Easter morning. It’s a Holy Week tradition that ends where Easter begins: He is risen.

**Buy-box icon bullets:**
- Ages 8–80 · great for the whole family
- Hardcover with dust jacket · 9″ × 11″ · 46 pages [CONFIRM]
- Ships from Idaho in 1–2 business days [CONFIRM]
- Love it or your money back [CONFIRM]

**Christmas-mode line under the CTA:** Ships now. Easter is March 28, 2027; Holy Week starts Palm Sunday, March 21.

**What’s inside:**
- Eyewitness chapters from Palm Sunday to Easter morning, told by about a dozen people who knew Jesus
- Call-and-response lines so kids can join in: “We seek Jesus of Nazareth.”
- An 8-day Easter Journey Advent with discussion questions for each day
- A seek-and-find of 8 symbols of Christ in the art: cross, Easter lily, oil lamp, dove, fig, pelican, palm leaves and door knocker
- Scripture from the King James Bible, including John 11:25–26
- A gentle telling: the crucifixion itself is never shown
- Rich, full-spread paintings by Kelley Hicken

**Specs:**

| Spec | Value |
|---|---|
| Format | Hardcover with dust jacket |
| Size | 9″ × 11″, portrait |
| Pages | 46 pages [CONFIRM] |
| Ages | 8–80 · great for the whole family |
| Daily reading | About 5–10 minutes a day [CONFIRM] |
| Author | Tiffany Wheeler |
| Illustrator | Kelley Hicken |
| Publisher | Tiffany Books LLC, 2025 [CONFIRM] |
| ISBN-13 | 979-8989343584 [CONFIRM] |

**About the story:**
> Shalom! Easter Journey welcomes your family through the gates of Jerusalem as travelers looking for Jesus of Nazareth. A merchant sends you into the city, and one by one you meet the people who knew Him: the man born blind, Matthew and Andrew in the upper room, James and John in Gethsemane, a brave woman in the home of Caiaphas, Mary His mother, and Mary Magdalene at the garden tomb.
>
> Whenever someone asks whom you seek, your family answers together, “We seek Jesus of Nazareth.” Hand out the speaking parts for a reader’s theater, or read one part each day of Holy Week with the built-in advent guide. The journey ends at the empty tomb, with the merchant’s reminder that the Easter story hasn’t ended: “Each of you still has a role in it.”

**How it began (optional block):**
> Easter Journey began in 2007 as an Easter play at Tiffany’s church. About a thousand people walked through the story the first year, and one 10-year-old said it was even better than Disneyland. Families kept asking for a copy to share at home, so Tiffany and illustrator Kelley Hicken turned it into this book.

**Perfect for:**
- Holy Week, from Palm Sunday to Easter morning
- An Easter basket that points to Jesus
- Family nights and quiet Sunday afternoons
- A reader’s theater with kids, cousins or a church group
- Sunday school and homeschool lessons on the Gospels
- A grandparent’s Easter gift

**Pairs well with:** The Promised Messiah Puzzle · He Spoke My Name Canvas · Easter Journey (PDF Edition), for the big screen. (Do not lead with the Nephite Christmas set on this page; it can appear once, below the fold, as “Also by Tiffany”.)

**Product FAQs:**

*How does the 8-day advent work?*
Start on Palm Sunday. Each day, read one part of the story (a fig symbol behind the page number shows where to stop), then talk through the questions for that day. Saturday has no reading; it’s a day to remember Christ in the tomb. On Easter Sunday you read the last part together.

*Is it too intense for young children?*
Easter Journey tells the whole Holy Week story, including the arrest and the crucifixion, but it’s told gently through the people who loved Jesus, and the art never shows the crucifixion itself. With younger children, the day-by-day format makes it easy to pause and talk.

*Who is it written for?*
Families who want Easter to center on Jesus. It follows the Gospel accounts and quotes the King James Bible, and it was written to be shared by Christians of every denomination.

*Can we act it out?*
Yes. Every speaker is labeled, from the merchant to Mary Magdalene, so it works as a reader’s theater for your family, a class or a church group.

**SEO title (54):** Easter Journey | Holy Week Picture Book & 8-Day Advent
**Meta description (152):** Walk through Holy Week in Jerusalem with the people who knew Jesus. An interactive, illustrated hardcover with an 8-day Easter advent and seek-and-find.
**Primary image alt:** Easter Journey hardcover, written by Tiffany Wheeler and illustrated by Kelley Hicken

---

### 3.3 The Complete Set

- **Handle:** `complete-set`
- **Title:** The Complete Set: Nephite Christmas + Easter Journey
- **Subtitle:** Both hardcovers, for His birth and His Resurrection
- **Badges:** Best value · Ships free
- **Price:** $49.99 [CONFIRM] · **Compare-at:** $54.98, labeled “$54.98 if bought separately”
- **Rating line:** ★★★★★ 5.0 · 20 reviews of Nephite Christmas

**Short description:**
> Read Nephite Christmas on Christmas Eve, then walk through Holy Week with Easter Journey in the spring. Two illustrated hardcovers by Tiffany Wheeler and Kelley Hicken, together for $49.99 with free US shipping [CONFIRM]. It’s a set your family will open year after year, every time you celebrate the Savior.

**Value stack:**

| Item | Price |
|---|---|
| Nephite Christmas, hardcover | $24.99 |
| Easter Journey, hardcover | $29.99 |
| If bought separately | $54.98 |
| **The Complete Set** | **$49.99** · you save $4.99 |
| Shipping | Free (orders $45+) [CONFIRM] |

**What’s inside:**
- Nephite Christmas: the Book of Mormon Christmas story in rhyme, with a hidden dove on every page [CONFIRM]
- Easter Journey: an interactive Holy Week journey with a built-in 8-day advent
- Both books are hardcovers with dust jackets, illustrated by Kelley Hicken

**Specs:** Two hardcovers · Nephite Christmas about 10.75″ × 8.75″, [CONFIRM] pages · Easter Journey 9″ × 11″, 46 pages [CONFIRM] · Ages 3–12 [CONFIRM]

**Pairs well with:** Peace Dove Ornament · Coloring & Activity Book · The Promised Messiah Puzzle

**Product FAQs:**

*Do both books ship now?*
Yes. Both ship together from Idaho in 1–2 business days [CONFIRM], so you can wrap Nephite Christmas for December and save Easter Journey for Palm Sunday.

*Can I send it as a gift?*
Of course. Add a free gift note in your cart and enter the recipient’s address at checkout. [CONFIRM: packing slips show no prices]

**SEO title (56):** Nephite Christmas + Easter Journey Set | Tiffany Wheeler
**Meta description (148):** Both illustrated hardcovers, Nephite Christmas and Easter Journey, for $49.99 with free US shipping. A tradition for His birth and His Resurrection. [CONFIRM price]
**Primary image alt:** Nephite Christmas and Easter Journey hardcovers standing side by side

---

### 3.4 Nephite Christmas Bundle

- **Handle:** `nephite-christmas-bundle`
- **Title:** Nephite Christmas Bundle
- **Subtitle:** The storybook + the Coloring & Activity Book
- **Badges:** Book + activity book
- **Price:** $32.98 · **Compare-at:** none (sum of parts; see §3.0 note)
- **Rating line:** ★★★★★ 5.0 · 20 reviews of Nephite Christmas

**Short description:**
> Read the story, then keep it going. This bundle pairs the Nephite Christmas hardcover with its companion Coloring & Activity Book: mazes, puzzles and coloring pages drawn from the storybook’s scenes. Together they turn one Christmas Eve reading into a whole season with the story of Christ’s birth.

**What’s inside:**
- Nephite Christmas, hardcover with dust jacket
- Nephite Christmas Coloring & Activity Book, 8.5″ × 11″ softcover: 13 activities, 12 coloring pages and an answer key [CONFIRM print matches PDF]

**Specs:** Hardcover + softcover · Ages 3–10 [CONFIRM] · Ships together

**Pairs well with:** Star Ornament (or choose the Bundle with Ornament) · Nativity Craft (PDF)

**SEO title (58):** Nephite Christmas Bundle | Book + Coloring & Activity Book
**Meta description (138):** The Nephite Christmas hardcover plus its Coloring & Activity Book: mazes, puzzles and coloring pages that keep the story going all season.
**Primary image alt:** Nephite Christmas hardcover with the Nephite Christmas Coloring & Activity Book

---

### 3.5 Nephite Christmas Bundle with Ornament

- **Handle:** `nephite-christmas-bundle-with-ornament`
- **Title:** Nephite Christmas Bundle with Ornament
- **Subtitle:** Storybook + Coloring & Activity Book + star ornament
- **Badges:** Gift-ready
- **Price:** $35.97 · **Compare-at:** none (sum of parts; see §3.0 note)
- **Rating line:** ★★★★★ 5.0 · 20 reviews of Nephite Christmas

**Short description:**
> Everything for a Nephite Christmas, in one gift: the hardcover storybook, the Coloring & Activity Book, and the star ornament. Hang the ornament as a keepsake, or hide it on the tree each night and let the kids seek the star, like the wise men of old. It’s a tradition that fills the whole season with the story of the Savior’s birth.

**What’s inside:**
- Nephite Christmas, hardcover with dust jacket
- Nephite Christmas Coloring & Activity Book, softcover
- Nephite Christmas Star Ornament

**Specs:** Hardcover + softcover + ornament · Ages 3–10 [CONFIRM] · Ships together

**Pairs well with:** Peace Dove Ornament · Nativity Craft (PDF) · The Complete Set

**SEO title (43):** Nephite Christmas Gift Bundle with Ornament
**Meta description (151):** The Nephite Christmas hardcover, Coloring & Activity Book and star ornament in one gift. Hide the star on the tree and let the kids seek it all season.
**Primary image alt:** Nephite Christmas hardcover, coloring book and star ornament arranged together

---

### 3.6 Nephite Christmas Coloring & Activity Book

- **Handle:** `nephite-christmas-coloring-activity-book`
- **Title:** Nephite Christmas Coloring & Activity Book
- **Subtitle:** Join Jacob for a Nephite Christmas adventure
- **Badges:** Pairs with the book
- **Variants:** Format: Printed Book — $7.99 · Printable PDF — $5.99 · **Compare-at:** none
- **Variant helper text:** Printed Book ships from Idaho. Printable PDF arrives by email; print as many copies as you need.

**Short description:**
> Help Jacob find Nephi, guide the wise men to the star, and decode a secret message from the prophet. This companion to Nephite Christmas is packed with puzzles, mazes and coloring pages drawn from the storybook’s scenes. It keeps little hands busy and the story of Christ’s birth close all season long.

**What’s inside:**
- 13 activity pages: Decode Nephi’s Message, Help the Wise Men Follow the Star, two connect-the-dots, Unscramble the Letters, Seek and Find, Help Jacob Find Nephi, Spot 10 Differences, I Spy, a Christmas fill-in-the-blank story, a word search, picture riddles and A Missing Prophet Mystery logic puzzle
- 12 coloring pages drawn from the storybook
- An answer key
- A full-color cover starring Jacob

**Specs:**

| Spec | Printed Book | Printable PDF |
|---|---|---|
| Format | Softcover | PDF download |
| Size | 8.5″ × 11″ | US Letter (8.5″ × 11″) |
| Pages | 25 activity and coloring pages + answer key [CONFIRM print matches PDF] | Same |
| Ages | 4–12 [CONFIRM]; the mystery puzzle suits ages 8–12 | Same |

PDF variant shows the digital usage terms from §3.0a.

**Pairs well with:** Nephite Christmas (hardcover) · Nativity Craft (PDF) · Star Ornament

**SEO title (51):** Nephite Christmas Coloring & Activity Book for Kids
**Meta description (149):** Mazes, puzzles and 12 coloring pages from Nephite Christmas. Help Jacob find Nephi and guide the wise men to the star. Printed book or printable PDF.
**Primary image alt:** Cover of the Nephite Christmas Coloring & Activity Book, with Jacob waving

---

### 3.7 Nephite Christmas Star Ornament

- **Handle:** `nephite-christmas-ornament`
- **Title:** Nephite Christmas Star Ornament
- **Subtitle:** A keepsake for the tree, and a seek-the-star game
- **Badges:** Under $3
- **Price:** $2.99 · **Compare-at:** none

**Short description:**
> A white ornament with a gold star, inspired by the new star in Nephite Christmas [CONFIRM design description]. Hang it as a keepsake, or hide it on the tree each night and let the kids seek the star, like the wise men of old. It’s a small, daily reminder of the light of Christ.

**Details:**
- White round ornament with a gold star design [CONFIRM]
- Ready to hang [CONFIRM]
- Size: [CONFIRM] · Material: [CONFIRM]

**Pairs well with:** Nephite Christmas (hardcover) · Peace Dove Ornament

**SEO title (52):** Nephite Christmas Star Ornament | Christmas Keepsake
**Meta description (131):** A white and gold star ornament inspired by Nephite Christmas. Hide it on the tree and let the kids seek the star like the wise men.
**Primary image alt:** Round white Nephite Christmas ornament with a gold star

Naming note: the live site calls this “Nephite Christmas Ornament”. “Star Ornament” separates it from the dove. [CONFIRM rename]

---

### 3.8 Nephite Christmas Peace Dove Ornament

- **Handle:** `nephite-christmas-peace-dove-ornament`
- **Title:** Nephite Christmas Peace Dove Ornament
- **Subtitle:** Hide the dove, find the peace
- **Badges:** Under $3
- **Price:** $2.99 · **Compare-at:** none

**Short description:**
> A smooth white dove with tiny star-shaped cutouts and a radiant central star, just like the dove hidden throughout Nephite Christmas. It comes with a gold ribbon and a message card that invites your family to hide the dove in the tree and take turns finding it. A gentle reminder that peace is something we can always seek, and always find, in Christ.

**Details:**
- White dove ornament with star cutouts and a central star
- Shimmering gold ribbon for hanging
- Includes a message card for a hide-the-dove family tradition
- Size: [CONFIRM] · Material: [CONFIRM]

**Perfect for:** Christ-centered family traditions · Pairing with the picture book · Neighbor gifts, ministering gifts and stocking stuffers

**Pairs well with:** Nephite Christmas (hardcover) · Star Ornament

**SEO title (49):** Peace Dove Christmas Ornament | Nephite Christmas
**Meta description (151):** A white dove ornament with star cutouts and a gold ribbon, plus a card for a hide-the-dove family tradition. Inspired by the dove in Nephite Christmas.
**Primary image alt:** White Nephite Christmas peace dove ornament with a gold ribbon and message card

---

### 3.9 Nephite Christmas Nativity Craft (PDF)

- **Handle:** `nephite-christmas-nativity-craft`
- **Title:** Nephite Christmas Nativity Craft (PDF)
- **Subtitle:** A color-your-own nativity from Bethlehem and ancient America
- **Badges:** Instant download
- **Price:** $2.99 · **Compare-at:** none

**Short description:**
> Print, color, cut and stand up your own nativity set. Alongside baby Jesus, Mary, Joseph, the wise men and a shepherd, you’ll find the prophet Nephi, a Nephite family, a Nephite temple and the Christmas star. Kids build the scene with their own hands and tell the story of Christ’s birth from both sides of the world.

**What’s inside:**
- Baby Jesus, Mary and Joseph
- Three wise men
- A shepherd with sheep
- Nativity animals, including a donkey and an ox
- The Nephite prophet and a Nephite family
- A Nephite temple and the Christmas star
- Step-by-step assembly instructions and stand templates

**Specs:** 12-page printable PDF · Print on cardstock · Instant download · For ages 4+ with grown-up help for cutting [CONFIRM]

**Perfect for:** Family home evening · Primary classes or sharing time · Christmas Eve activities · Craft time with grandkids · Ward party craft tables · Homeschool or classroom lessons

**Ideas:** Laminate it for a lasting decoration · Glue figures to craft sticks for a puppet show · Build a shoebox stable · Turn the figures into tree ornaments

Digital usage terms from §3.0a.

**Pairs well with:** Nephite Christmas (hardcover) · Coloring & Activity Book · Nephite Christmas Digital Bundle

**SEO title (48):** Printable Nativity Craft | Nephite Christmas PDF
**Meta description (150):** A color-your-own printable nativity with Mary, Joseph, baby Jesus, the wise men, and the prophet Nephi, a Nephite family and temple. Instant download.
**Primary image alt:** Colored paper nativity figures standing together, including Nephite figures and a temple

---

### 3.10 Nephite Christmas (PDF Edition)

- **Handle:** `nephite-christmas-pdf`
- **Title:** Nephite Christmas (PDF Edition)
- **Subtitle:** The whole book, ready for the big screen
- **Badges:** Instant download
- **Price:** $6.99 · **Compare-at:** none

**Short description:**
> The complete Nephite Christmas picture book as an instant download, in two versions: single pages for a tablet and full two-page spreads for a TV or projector. It’s perfect for ward parties, Primary lessons, family gatherings or a cozy last-minute Christmas Eve. Share the story of that first Christmas night with everyone in the room.

**What’s inside:**
- Single-page version, for reading on a phone or tablet
- Two-page spread version, for TVs, projectors and presentations
- Every illustration and rhyme from the hardcover

**Specs:** PDF download · 2 versions · Ages 3–10 [CONFIRM] · Large, high-resolution files [CONFIRM final file sizes]

Digital usage terms from §3.0a, plus the on-screen sharing line.

**Last-minute mode headline (Dec 18–24):** Read it tonight. No shipping, no waiting.

**Pairs well with:** Nativity Craft (PDF) · Nephite Christmas Digital Bundle · Nephite Christmas (hardcover), the keepsake edition

**SEO title (40):** Nephite Christmas PDF | Instant Download
**Meta description (149):** Download Nephite Christmas instantly, with single pages for tablets and full spreads for the TV. Perfect for ward parties, Primary and Christmas Eve.
**Primary image alt:** Nephite Christmas PDF shown on a tablet and a TV screen

---

### 3.11 Easter Journey (PDF Edition)

- **Handle:** `easter-journey-pdf`
- **Title:** Easter Journey (PDF Edition)
- **Subtitle:** The Holy Week journey, ready for any screen
- **Badges:** Instant download
- **Price:** $8.99 · **Compare-at:** none

**Short description:**
> The complete Easter Journey as an instant download, with single pages for any device and full spreads for a TV or projector. Walk the streets of Jerusalem, meet the people whose lives were changed by the Savior, and use the 8-day advent and seek-and-find together. Begin your family’s Easter Journey today, wherever you are.

**What’s inside:**
- Single-page version, for phones and tablets
- Full-spread version, for large screens and presentations
- The 8-day Easter Journey Advent and the symbols-of-Christ seek-and-find

**Specs:** PDF download · 45 pages [CONFIRM] · 2 versions · Ages 8–80 · great for the whole family

Digital usage terms from §3.0a, plus the on-screen sharing line.

**Pairs well with:** Easter Journey (hardcover) · The Promised Messiah Puzzle

**SEO title (47):** Easter Journey PDF | Holy Week Instant Download
**Meta description (147):** Download Easter Journey instantly: an illustrated Holy Week journey through Jerusalem with an 8-day advent. Single pages and full spreads included.
**Primary image alt:** Easter Journey PDF cover shown on a tablet

---

### 3.12 Nephite Christmas Digital Bundle

- **Handle:** `nephite-christmas-digital-bundle`
- **Title:** Nephite Christmas Digital Bundle
- **Subtitle:** Storybook PDF + Coloring & Activity Book PDF + Nativity Craft
- **Badges:** Instant download
- **Price:** $15.97 · **Compare-at:** none (sum of parts; see §3.0 note)

**Short description:**
> All three Nephite Christmas downloads in one click: the illustrated storybook, the Coloring & Activity Book, and the color-your-own Nativity Craft. Read the story on the big screen, then print the activities and crafts as many times as you need. A whole Christmas season of reading, coloring and creating around the Savior’s birth.

**What’s inside:**
- Nephite Christmas PDF: single pages and full spreads
- Nephite Christmas Coloring & Activity Book PDF: 13 activities and 12 coloring pages
- Nephite Christmas Nativity Craft PDF: 12 pages with stand templates

**Specs:** 3 PDF downloads · Instant delivery by email · Print as often as you need

Digital usage terms from §3.0a.

**Perfect for:** Family home evening · Primary classes · Classroom lessons · Last-minute Christmas plans

**Pairs well with:** Nephite Christmas (hardcover) · Peace Dove Ornament

**SEO title (41):** Nephite Christmas Digital Bundle | 3 PDFs
**Meta description (142):** The Nephite Christmas storybook PDF, Coloring & Activity Book PDF and Nativity Craft in one instant download. Print as many times as you need.
**Primary image alt:** The three Nephite Christmas downloads: storybook, coloring book and nativity craft

---

### 3.13 The Promised Messiah: An Easter Journey Puzzle

- **Handle:** `easter-journey-puzzle`
- **Title:** The Promised Messiah: An Easter Journey Puzzle
- **Subtitle:** 252 pieces · 14″ × 11″
- **Badges:** Made to order [CONFIRM]
- **Price:** $24.99 [CONFIRM] · **Compare-at:** none
- **Variant:** 14″ × 11″, 252 pieces (only option; drop the live listing’s “120, 252 or 500” line)

**Short description:**
> Gather around the table this Easter and piece together Kelley Hicken’s painting of the Savior, scroll in hand, before the walls of Jerusalem. The finished puzzle measures 14″ × 11″ with 252 sturdy chipboard pieces, in a gift-ready box that shows the picture. As each piece fits into place, remember the joy and promise of His Resurrection.

**Details:**
- 252 chipboard pieces
- Finished size 14″ × 11″
- Gift box 9.25″ × 7.4″ × 2″ featuring the artwork
- 100% chipboard and paper
- Ages 9+ [CONFIRM]
- Made to order; ships separately in [CONFIRM] business days

**Care:** Wipe gently with a clean, dry microfiber cloth.

**Pairs well with:** Easter Journey (hardcover) · He Spoke My Name Canvas

**SEO title (47):** The Promised Messiah Easter Puzzle | 252 Pieces
**Meta description (131):** A 252-piece Easter puzzle of the Savior before the walls of Jerusalem, painted by Kelley Hicken for Easter Journey. Gift-ready box. [CONFIRM ship time]
**Primary image alt:** Completed puzzle of Jesus holding a scroll before the walls of Jerusalem, beside its box

---

### 3.14 He Spoke My Name Canvas Print

- **Handle:** `he-spoke-my-name-canvas`
- **Title:** He Spoke My Name Canvas Print
- **Subtitle:** 10″ × 8″ canvas from Easter Journey
- **Badges:** Made to order [CONFIRM]
- **Price:** $24.99 [CONFIRM] · **Compare-at:** none
- **Variant:** 10″ × 8″ horizontal, 0.75″ deep (only option)

**Short description:**
> On that first Easter morning, Mary stood weeping until she heard Him speak her name. This canvas captures that moment of joy and recognition from Easter Journey, a reminder that the Savior lives and knows each of us by name. Display it for Easter or all year long as a symbol of hope and the promise of the Resurrection.

**Details:**
- 10″ × 8″ horizontal canvas, 0.75″ deep
- 100% polyester canvas with bright, crisp color
- Pinewood frame
- Assembled in the USA
- Hanging hardware: [CONFIRM]
- Made to order; ships separately in [CONFIRM] business days

**Care:** If the canvas gathers dust, wipe it gently with a clean, damp cloth.

**Pairs well with:** Easter Journey (hardcover) · The Promised Messiah Puzzle

**SEO title (49):** He Spoke My Name Canvas | Mary & the Risen Christ
**Meta description (137):** A 10″ × 8″ canvas of Mary Magdalene recognizing the risen Savior, from Easter Journey by Kelley Hicken. A reminder of hope all year long.
**Primary image alt:** Canvas print of Mary Magdalene recognizing the risen Jesus in the garden

---

## 4. Cart drawer and microcopy

### 4.1 Cart drawer

| Element | Copy |
|---|---|
| Title | Your Cart ({count}) |
| Close aria-label | Close cart |
| Line item variant labels | Hardcover · Printed Book · Printable PDF · 14″ × 11″, 252 pieces · 10″ × 8″ canvas |
| Digital line note | Instant download · delivered by email |
| Made-to-order line note | Made to order · ships separately [CONFIRM] |
| Remove link | Remove |
| Quantity aria-labels | Decrease quantity of {title} / Increase quantity of {title} |
| Bulk discount line (5+ books) | 5+ books: 10% off applied [CONFIRM] |
| Bulk nudge (exactly 4 books) | Add one more book and save 10% on all 5. [CONFIRM] |
| Subtotal label | Subtotal |
| Shipping row, free | Shipping: Free |
| Shipping row, not free | Shipping: $5.99 flat rate [CONFIRM], or free at $45+ |
| Tax note | Taxes calculated at checkout. |
| Keep shopping link | Keep Shopping |

**Empty state**
- Heading: Your cart is empty
- Body: Start a new Christmas tradition with Nephite Christmas, or get both books and ship free.
- Buttons: Get Both Books — $49.99 · Shop Nephite Christmas
- Mascot alt (waving Jacob): Jacob, the boy from Nephite Christmas, waving hello

**Free-shipping progress** (threshold $45 [CONFIRM]; `{remaining}` = $45 minus the physical subtotal)

| State | Message |
|---|---|
| More than $10 away | You’re {remaining} away from free US shipping. |
| $10 or less away | Almost there! Add {remaining} for free shipping. |
| Threshold reached | You’ve unlocked free US shipping! |
| Digital-only cart | Digital downloads arrive by email, so there’s nothing to ship. |
| Progress bar aria-label | Free shipping progress: {percent} percent |

Examples: Nephite Christmas alone reads “You’re $20.01 away from free US shipping.” Easter Journey alone reads “You’re $15.01 away…”. [CONFIRM whether digital items count toward the threshold]

**Upsells** (show one at a time, in this priority order)

| Condition | Heading | Body | Button |
|---|---|---|---|
| Nephite Christmas in cart, no Easter Journey or set | Complete the set | Add Easter Journey and get both books for $49.99. You save $4.99, and your order ships free. | Upgrade to the Set · +$25.00 |
| Easter Journey in cart, no Nephite Christmas or set | Complete the set | Add Nephite Christmas and get both books for $49.99. You save $4.99, and your order ships free. | Upgrade to the Set · +$20.00 |
| Nephite Christmas, a bundle or the set in cart, no ornament | Add the matching ornament | Hide it on the tree and let the kids seek the star, like the wise men of old. | Add · $2.99 |
| Nephite Christmas in cart, no coloring book | Keep the story going | The Coloring & Activity Book: 13 puzzles and games plus 12 coloring pages. | Add · $7.99 |
| Easter Journey in cart, no puzzle | For Easter afternoons | The Promised Messiah Puzzle: 252 pieces of Kelley Hicken’s art. | Add · $24.99 |
| Digital-only cart | Want the hardcover, too? | The keepsake edition, packed and shipped from Idaho. | Add Hardcover · $24.99 |

“Upgrade to the Set” swaps the single book for the `complete-set` line, so the cart shows $49.99, not $54.98.

**Gift note**
- Checkbox: This is a gift
- Field label: Gift note (free)
- Placeholder: Write your message and we’ll tuck it in the box. For example: Merry Christmas, Emma! Love, Grandma and Grandpa
- Helper: Up to 250 characters. Gift orders never include prices. [CONFIRM]
- Counter: {n}/250

**Signed copies** (only if confirmed)
- Checkbox: Have Tiffany sign my books (free) [CONFIRM]
- Field label (appears when checked): Sign it to (optional)
- Placeholder: For example: The Johnson Family
- Helper: Signed orders ship in 2–3 business days. Order by Dec 11 for Christmas. [CONFIRM]

**Checkout**
- Button: Checkout · {subtotal}
- Loading state: Heading to checkout…
- Reassurance line: Secure checkout · Ships from Idaho in 1–2 business days · 30-day money-back guarantee [CONFIRM]
- Christmas delivery line (christmas mode, until Dec 15): Order by Dec 15 for Christmas delivery. [CONFIRM]
- After the cutoff (last-minute mode, any shipped item in the cart): Shipped items may not arrive by Christmas. [CONFIRM] While Priority is offered: Choose Priority at checkout for Christmas delivery. [CONFIRM]

### 4.2 Add-to-cart toasts

| Trigger | Message | Action |
|---|---|---|
| Any product | Added to your cart: {title} | View Cart |
| Complete Set | Both books are in your cart, and your order ships free. | View Cart |
| Upgrade to the set | Upgraded! You’re getting both books for $49.99. | — |
| Add-on from drawer | {title} added. | — |
| Free-shipping threshold crossed | Free shipping unlocked! | — |
| Remove | {title} removed. | Undo |
| Error | We couldn’t add that to your cart. Please try again. | Try Again |

### 4.3 Sticky mobile add-to-cart bar

Shows after the main CTA scrolls out of view.

| Page | Left side | Button |
|---|---|---|
| Homepage (christmas mode) | Both books · $49.99 · Ships free [CONFIRM] (no “Ships free” while the Priority hero runs) | Add to Cart (screen readers also hear the product and price) |
| Product page | {title} · {price} | Add to Cart |
| Product page with option picker | {selected option} · {price} | Add to Cart |
| After adding | Added to your cart | View Cart |
| Sold out | {title} · Sold out | Notify Me |

### 4.4 “Get it by” delivery line

Place directly under Add to Cart. Compute with the business-day calendar in the season config: ship date = order date + 2 business days; delivery date = ship date + 5 business days. Always show the later, honest date.

| Situation | Format | Example |
|---|---|---|
| Physical, normal | Get it by {Weekday, Mon D} · Ships from Idaho | Get it by Tue, Oct 13 · Ships from Idaho |
| Physical, christmas mode, on or before Dec 15 | Get it by {Weekday, Mon D}, in time for Christmas | Get it by Mon, Dec 7, in time for Christmas |
| Physical, Dec 16–17 | Standard shipping won’t arrive by Christmas. Choose Priority at checkout, or get the instant PDF. [CONFIRM] | — |
| Physical, Dec 18–24 | Ships Dec 26 [CONFIRM]. Need it for Christmas Eve? Get the instant PDF. | — |
| Physical, easter mode, on or before Mar 15 | Get it by {Weekday, Mon D}, before Palm Sunday [CONFIRM] | Get it by Wed, Mar 10, before Palm Sunday |
| Signed copy | Signed copies ship in 2–3 business days [CONFIRM] | — |
| Made to order (puzzle, canvas) | Made to order · Get it by {Weekday, Mon D} [CONFIRM production time] | — |
| Digital | Instant download: in your inbox in minutes | — |

### 4.5 Out of stock and notify me

- Button: Sold Out · Notify Me
- Modal heading: Get an email when it’s back
- Modal body: We’re printing more. Leave your email and we’ll let you know the moment {title} is back in stock.
- Input placeholder: you@example.com
- Button: Notify Me
- Success: You’re on the list! We’ll email you when it’s back.
- Christmas-mode add-on line: Need it sooner? The PDF edition downloads instantly.

### 4.6 Mock checkout page (preview store)

- Heading: Checkout is coming soon
- Notice (verbatim as decided): Checkout is coming soon — this preview store isn’t taking payments yet.
- Sub: Your cart is saved, and nothing has been charged.
- Order summary heading: Your order
- Button: Back to the Store
- Secondary link: Questions? Email tiffany@tiffany-wheeler.com

### 4.7 Other states

| Element | Copy |
|---|---|
| Generic error | Something went wrong. Please try again. |
| Network error | We can’t reach the store right now. Check your connection and try again. |
| Max quantity (10) | Need more than 10? Email us about bulk pricing. |
| Loading (screen-reader only) | Loading… |
| Price, sale (Complete Set only) | Sale price {price}, regular price {compareAt} if bought separately |
| Review count aria | Rated {rating} out of 5 from {count} reviews |

---

## 5. Claims to confirm with Tiffany

Each item lists where it appears. Nothing tagged `[CONFIRM]` should ship to production until it’s answered.

**Pricing and offers**
1. **Prices.** Nephite Christmas $24.99 (drop the standing $22.49 “sale”), Easter Journey $29.99, Complete Set $49.99 against a real $54.98, puzzle $24.99 (was $24.73), canvas $24.99 (was $22.92), coloring book PDF $5.99. At regular prices the Nephite Christmas Bundle ($32.98), the Bundle with Ornament ($35.97) and the Digital Bundle ($15.97) equal the sum of their parts, so they show no savings. Would she like real bundle prices ($29.99 / $32.99 / $12.99 suggested)? *Used in:* hero, cards, set bar, §3, cart upsells, sticky bar, meta descriptions.
2. **Free shipping at $45+.** Is that the threshold? Lower 48 only, or all US? Do digital items count toward it? *Used in:* announcement bar, trust strip, hero, set bar, FAQ 5, cart progress.
3. **Flat-rate shipping under $45** (suggested $5.99) and the carrier (USPS Ground Advantage?). *Used in:* trust strip tooltip, FAQ 5, cart shipping row.
4. **Bulk discount.** Is it 10% off 5+ books, any mix of titles, applied automatically? Does it stack with the Complete Set price? *Used in:* §2.10, §2.13, FAQ 9, cart bulk lines, off-season bar.
5. **Guarantee.** *Resolved Oct 13, 2026:* 60-day returns on unused items, return shipping deducted from the refund, damaged/defective items replaced or refunded free, digital downloads and gift cards final sale. Site copy now reads “Love it or return it · 60 days.” *Original question:* A 30-day “love it or your money back” refund. Who pays return shipping? Are digital items excluded (proposed yes)? This replaces the current policy, which says sale items can’t be refunded. *Used in:* trust strip, FAQ 8, PDP bullets, cart reassurance.

**Shipping and dates**
6. **Handling time.** Ships from Idaho in 1–2 business days, packed by hand; transit 2–5 business days by USPS. *Used in:* announcement bar, trust strip, FAQ 5, “Get it by” line.
7. **Christmas cutoffs.** Standard shipping by Dec 15; Priority by Dec 17 (is Priority offered?); signed copies by Dec 11; orders from Dec 18 ship Dec 26 (does she ship that day?). *Used in:* announcement bars, FAQ 6–7, last-minute hero, “Get it by” line.
8. **Easter cutoff.** Order by Mar 15 to arrive before Palm Sunday, Mar 21, 2027. *Used in:* easter announcement bar, “Get it by” line.
9. **Boise local pickup.** Keep it? Through Dec 23? *Used in:* last-minute bar, FAQ 5.
10. **Signed copies.** Can she offer them? Free? With a short inscription? What’s the turnaround? *Used in:* trust strip, announcement alternate, FAQ 7, NC option, cart checkbox.

**Proof and permissions**
11. **Videos.** Is the woman in `IMG_3989.mov` Tiffany, and may we use a 20–40s excerpt on the site and in ads? What is the audio on the 30s trailer (needed for captions)? *Used in:* §2.7.
12. **Review count.** The site shows 20 Nephite Christmas reviews, but two are duplicates (Kendra Santa Cruz and Lynn Archibald each posted twice) and one was written before the reviewer had the book (Paula Harlow). If the new review app dedupes on import, the count becomes 18 and every “20” must change. Also confirm first name + last initial is OK for display. *Used in:* trust strip, hero rating, cards, §2.8, PDPs.
13. **Amazon rating.** 5.0 from 22 ratings, as of 2026-09-22. Recheck at launch. *Used in:* hero rating line, §2.8.
14. **Bytheway testimonial.** Written permission to use the names and quote on the site (and in ads)? Did they receive a free copy? If so, the quote needs a “complimentary copy” note. *Used in:* §2.8.
15. **Retail partners.** Are BYU Store, Eborn Books, Barnes & Noble Sandy and This Is the Place Bookstore still carrying the book, and may we name them? *Used in:* §2.13.
16. **Free Family Praying page.** It is also page 15 of the paid coloring book. OK to give it away in the Family Activity Pack? *Used in:* §2.11.
17. **Idaho Business Review 2025 Women of the Year.** Does she want this credential shown? *Used in:* §2.12 (optional line).
18. **“Bestseller” badge** on Nephite Christmas. Confirm it’s her best-selling title. *Used in:* card, PDP.

**Book facts**
19. **Nephite Christmas page count.** Sources say 26 (wholesale), 28 (PDF with cover) and 36 (Amazon). *Used in:* card, FAQ 2, PDP specs, set specs.
20. **Nephite Christmas size.** 10.75″ × 8.75″ with jacket (wholesale copy) or 10″ × 8.5″ (Amazon)? *Used in:* FAQ 2, PDP specs.
21. **Easter Journey page count.** 46 (live listing) vs 45 printed pages (PDF). *Used in:* card, FAQ 2, PDP specs; the EJ PDF says 45.
22. **Age ranges.** Nephite Christmas 3–10; Easter Journey 8–80 (Tiffany confirmed both, Oct 2026); coloring book 4–12; nativity craft 4+ with help; puzzle 9+. *Used in:* cards, FAQ 1, PDPs.
23. **“A hidden dove on every page.”** The book review found a dove on *nearly* every page. If it isn’t every page, use “a dove hidden throughout the book”. *Used in:* hero subhead, NC card, reasons, FAQ 11, NC PDP, set PDP, NC meta description.
24. **Publisher and ISBNs.** Nephite Christmas: Rhino Media, 2024, ISBN 979-8989343553. Easter Journey: Tiffany Books LLC, 2025, ISBN 979-8989343584 (Google Books lists Rhino Media, 2026). Also the footer legal entity: Tiffany Books LLC or “Tiffany Wheeler”? *Used in:* PDP specs, footer copyright.
25. **Which Nephite Christmas text matches the printed book?** The pages PDF and the spreads PDF differ slightly (for example “For Samuel the prophet” vs “For Samuel, the prophet”, “lift” vs “Lift”, and “shall the words be fulfilled” vs “shall his words be fulfilled”). The Peek Inside quotes follow the book report and the transcription, but the peek images come from the spreads PDF, so spread 1’s image reads “For Samuel, the prophet”. Match the caption to whichever version is printed. Spread 6 uses the transcription’s wording (“And so from the Nephites of old unto you, remember Christ came…”), not the report’s shortened “Remember, Christ came…”. *Used in:* §2.6.
26. **Easter Journey reading time.** Estimated 5–10 minutes a day from word count (about 3,650 words over 7 reading days). *Used in:* EJ PDP specs.
27. **Coloring book print edition.** Does the printed softcover match the PDF (13 activities, 12 coloring pages, answer key)? Note: the answer key has the I Spy and Word Search page labels swapped (it says pages 11 and 9; they are pages 9 and 11). *Used in:* §2.9, bundle PDPs, coloring book PDP.
28. **Ornament details.** Size, material and ready-to-hang for both ornaments, and the round ornament’s design (white with a gold star?). OK to rename it “Star Ornament”? *Used in:* §3.7, §3.8.

**Operations and catalog**
29. **Puzzle and canvas.** Keep them? Who fulfills them (print-on-demand?), how long do they take, and do they ship separately? Does the canvas include hanging hardware? *Used in:* §2.9, §3.13–3.14, cart line notes, “Get it by” line.
30. **Digital sharing terms.** OK to allow on-screen sharing at family, church and classroom gatherings (the live PDF listing already suggests ward parties and Primary)? *Used in:* §3.0a, FAQ 10.
31. **Gift orders.** Do packing slips leave prices off? *Used in:* cart gift helper, set FAQ.
32. **Contact email.** Is tiffany@tiffany-wheeler.com the customer-service address to publish? *Used in:* §2.13, FAQ 9, mock checkout.
33. **Social links.** Use the “Tiffany Wheeler Books” Facebook page rather than her personal profile? *Used in:* footer.
34. **“LDS” in search copy.** Not used anywhere in this deck. OK to add for search only?
35. **Last-minute printable gift card.** The market research suggests a printable “your book ships Dec 26” card for the Dec 18–24 mode. Does she want one made? (Not referenced in the copy yet.)
