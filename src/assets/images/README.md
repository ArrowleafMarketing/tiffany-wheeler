# Site image masters

This folder holds curated, web-optimized masters for the Tiffany Wheeler storefront. Each image has **one** high-quality master at its maximum useful width. Import it statically and `next/image` generates the responsive sizes and the blur placeholder at build time:

```tsx
import Image from "next/image";
import ncCover from "@/assets/images/books/nc-cover.jpg";

<Image src={ncCover} alt="Nephite Christmas book cover" placeholder="blur" sizes="(min-width: 768px) 40vw, 90vw" />
```

**121 files, 30.7 MB** (100 JPG, 18 WebP, 2 PNG, 1 SVG). Two app icons live in `src/app/` and are listed at the end. This README is not counted.

## Encoding

- **Opaque art and photos:** progressive JPEG, q84, 4:2:0, all metadata stripped, sRGB. Embedded ICC profiles were converted to sRGB rather than dropped: Generic CMYK, Adobe RGB (1998), and an "LG HDR 4K" monitor profile. The CMYK and LG HDR conversions were checked against the book PDFs and match them.
- **Real transparency:** WebP via `cwebp -q 88 -alpha_q 100 -m 6 -sharp_yuv`. Alpha is lossless, and every file was checked to confirm the alpha is really used. Transparent padding was trimmed to a ~2% margin.
- A few files are named `.webp` but are opaque: `coloring-book.webp` and `ornament-star.webp`. After their transparent side bars were trimmed, no transparency was left. They are encoded as plain lossy WebP.
- Nothing was upscaled. Widths are capped at 2400px, or lower where the brief says so. Several sources are small (see Notes), so avoid showing those images much wider than their pixel size.
- Video stills come from `Horizontal-4k.mov` (bt709 to sRGB, Lanczos downscale to 2400w) and from `Vertical-1080.mov` at its native 1080w. Frames were chosen by eye for sharpness and open eyes, at mid-shot.
- Sources marked `.pdf pN` were rendered with `pdftoppm` at the embedded image's native resolution.
- `alt` suggestions describe what is visible. `""` means the image can be treated as decorative.

**Peek-inside text versions.** The Nephite Christmas pages PDF, used for `peek/mobile/nc-*`, and the spreads PDF, used for `peek/nc-peek-*`, are two different text versions. The pages PDF sets its text visibly smaller, and some wording differs. The last page reads "Merry Christmas" in script in the pages PDF and "MERRY CHRISTMAS" in green capitals in the spreads PDF. Which version was printed is unconfirmed.

| File | Size (px) | Bytes | Alpha | Source | Suggested alt | Notes |
|---|---|---:|:---:|---|---|---|
| **books/** | | | | | | |
| `books/both-books.jpg` | 1254×1254 | 214,044 | no | nephite-christmas-easter-journey-bundle.png | Nephite Christmas and Easter Journey hardcover books standing side by side |  |
| `books/ej-cover-3d.webp` | 1800×1486 | 539,574 | yes | closed-book.png | Easter Journey hardcover book | Cutout, padding trimmed |
| `books/ej-cover.jpg` | 1600×1955 | 571,186 | no | book-cover-scaled.jpg | Easter Journey book cover |  |
| `books/ej-open-book.webp` | 2400×1735 | 545,204 | yes | Thin_Book_Hard_Cover_Mockup_5-scaled.png | Easter Journey open to a page of Mary Magdalene meeting the risen Jesus at the tomb | Cutout; the source is a 249-colour palette PNG, so there is slight dither |
| `books/ej-title.webp` | 853×462 | 110,660 | yes | Easterlogo.png | Easter Journey | Cream/white lettering: use it on dark or photo backgrounds |
| `books/nc-book-coloring-cutout.webp` | 1034×713 | 131,414 | yes | Adobe-Express-file-1.png | Nephite Christmas hardcover with the Nephite Christmas Coloring and Activity Book |  |
| `books/nc-cover.jpg` | 1716×1379 | 334,315 | no | pages-nephite-christmas.pdf p1 (cropped to match Nephite-Christmas-Thumbnail-copy.png) | Nephite Christmas book cover | Rendered from the print PDF and cropped to the same framing as the 800px thumbnail (2.1x the resolution) |
| `books/nc-gift-set-cutout.webp` | 1034×768 | 137,440 | yes | Adobe-Express-file-2.png | Nephite Christmas hardcover, coloring and activity book, and star ornament gift set |  |
| `books/nc-title.webp` | 468×366 | 25,662 | yes | NephiteChristmasTitle_transparent.png | Nephite Christmas | Black lettering: use it on light backgrounds only |
| **lifestyle/** | | | | | | |
| `lifestyle/child-coloring.jpg` | 866×600 | 114,100 | no | 8.png | Child coloring a page from the Nephite Christmas coloring book | Low-res source (866px) |
| `lifestyle/family-01.jpg` | 2400×1350 | 301,585 | no | Horizontal-4k.mov frame 66 (t=2.750s, shot 1) | Grandmother reading Nephite Christmas to two girls in an armchair | Shot 1 |
| `lifestyle/family-02.jpg` | 2400×1350 | 323,740 | no | Horizontal-4k.mov frame 108 (t=4.500s, shot 2) | Mother reading Nephite Christmas aloud to three children by the fireplace | Shot 2 (same set-up as 04 and 08) |
| `lifestyle/family-03.jpg` | 2400×1350 | 363,928 | no | Horizontal-4k.mov frame 216 (t=9.000s, shot 3) | Grandmother and four grandchildren reading together in an armchair by the stairs | Shot 3 |
| `lifestyle/family-04.jpg` | 2400×1350 | 331,692 | no | Horizontal-4k.mov frame 282 (t=11.750s, shot 4) | Smiling children listening as their mother reads Nephite Christmas by the fire | Shot 4; every face smiling and the cover legible. Best poster frame |
| `lifestyle/family-05.jpg` | 2400×1350 | 334,664 | no | Horizontal-4k.mov frame 435 (t=18.125s, shot 5) | Mother and two daughters pointing at a page inside the book | Shot 5 |
| `lifestyle/family-06.jpg` | 2400×1350 | 217,651 | no | Horizontal-4k.mov frame 516 (t=21.500s, shot 6) | Mother and toddler son laughing while reading together | Shot 6 is a soft, shallow-focus shot throughout; this is its best frame |
| `lifestyle/family-07.jpg` | 2400×1350 | 284,604 | no | Horizontal-4k.mov frame 618 (t=25.750s, shot 7) | Grandmother and granddaughters smiling over Nephite Christmas | Shot 7 |
| `lifestyle/family-08.jpg` | 2400×1350 | 314,684 | no | Horizontal-4k.mov frame 678 (t=28.250s, shot 8) | Family reading Nephite Christmas together on the floor in front of a fireplace | Shot 8, wide |
| `lifestyle/family-vertical-01.jpg` | 1080×1920 | 203,640 | no | Vertical-1080.mov frame 618 (t=25.750s) | Grandmother and granddaughters smiling over Nephite Christmas |  |
| `lifestyle/family-vertical-02.jpg` | 1080×1920 | 210,524 | no | Vertical-1080.mov frame 282 (t=11.750s) | Mother reading Nephite Christmas to her children by the fireplace |  |
| `lifestyle/grandma-reading.jpg` | 1216×842 | 188,913 | no | 1.png | Grandmother reading Nephite Christmas with two smiling granddaughters |  |
| `lifestyle/holiday-flatlay.jpg` | 2400×1600 | 533,674 | no | 500A2551-scaled.jpeg | Nephite Christmas book and coloring book in a holiday flat lay with a gift box, snowflake and bells |  |
| `lifestyle/mom-and-son.jpg` | 866×600 | 91,764 | no | 9.png | Mother reading with her young son as he points at the book | Low-res source (866px) |
| `lifestyle/nc-flatlay-white.jpg` | 2250×1500 | 277,193 | no | Nephite-Christmas-2025-white-banner.png | Nephite Christmas book and coloring book on a white wood table with holiday decor | Left ~40% fades to white, leaving space for copy |
| `lifestyle/nc-flatlay.jpg` | 2250×1125 | 410,581 | no | Nephite-Christmas-2025-ads-website-banner.png | Nephite Christmas book and coloring book surrounded by bead garland, gifts and gold ornaments |  |
| `lifestyle/nc-stocking.jpg` | 2000×1333 | 517,983 | no | nephite-christmas-23-1.jpg | Nephite Christmas hardcover on a red and white Christmas backdrop with pine branches |  |
| **art/** | | | | | | |
| `art/dove.webp` | 1000×1266 | 192,034 | yes | dove2.png | "" (decorative) or "White dove in flight" |  |
| `art/ej-blind-man.jpg` | 1498×1498 | 390,444 | no | Jesus-and-the-blind-man-square.png | Jesus gently holding the face of a blind man |  |
| `art/ej-he-is-risen.jpg` | 2400×1788 | 553,322 | no | He-is-Risen-Wallpaper-scaled.jpg | The risen Jesus smiling outside the empty tomb |  |
| `art/ej-james.webp` | 945×1004 | 135,796 | yes | James-square.png | Illustration of the apostle James with his hand on his head |  |
| `art/ej-jerusalem-dusk.jpg` | 2000×1125 | 553,125 | no | feature-image.jpg | Illustrated garden path outside the walls of Jerusalem at dusk |  |
| `art/ej-jerusalem-gate.jpg` | 2000×1125 | 416,828 | no | Flipped-Jerusalem-Gate-copy.jpg | Illustrated Jerusalem city gate and olive trees at sunset | A horizontal mirror of ej-jerusalem-dusk |
| `art/ej-mary-garden.jpg` | 1498×1498 | 431,430 | no | Mary-in-Garden-square.png | Tearful Mary Magdalene in a head covering in a garden |  |
| `art/ej-merchant-wide.jpg` | 1600×900 | 338,449 | no | Feature-merchant.jpg | Smiling merchant welcoming visitors to a lamplit Jerusalem market street |  |
| `art/ej-merchant.jpg` | 800×800 | 152,847 | no | merchant-square.jpg | Smiling merchant in a Jerusalem market street |  |
| `art/ej-tomb.jpg` | 2400×1788 | 738,481 | no | Tomb-Wallpaper-scaled.jpg | Garden tomb with the stone rolled away at sunrise, red tulips in front |  |
| `art/lamp.webp` | 1000×603 | 92,162 | yes | lamp.png | "" (decorative) or "Lit clay oil lamp" |  |
| `art/nc-jacob-draws.jpg` | 800×930 | 49,035 | no | NC-JacobDraws.jpg | Jacob, a Nephite boy in a red headband, drawing on a tablet |  |
| `art/nc-jacob-hug.jpg` | 900×985 | 53,197 | no | NC-JacobFatherHug.jpg | Jacob, the Nephite boy, sharing a warm hug with a bearded man |  |
| `art/nc-jesus-art.jpg` | 900×1139 | 73,158 | no | NC-Jesus_Art.jpg | Two illustrations of Jesus Christ |  |
| `art/nc-kid-art.jpg` | 1200×934 | 90,671 | no | NC-Kid_Art.jpg | Jacob's drawings of a shepherd, the Nativity and the wise men |  |
| `art/nc-night-bg.jpg` | 1600×975 | 128,022 | no | NephiteBackground.jpg | Starry purple night sky over a Mesoamerican temple and palm trees |  |
| `art/nc-page-village-night.jpg` | 2400×1932 | 498,383 | no | Page1-scaled.jpg | Illustrated Nephite village of thatched huts beneath a temple, from the first page of Nephite Christmas | CMYK source converted to sRGB through its embedded profile (matches the PDF page). Same art as peek/nc-peek-00 |
| `art/olive.webp` | 771×1020 | 117,784 | yes | olive.png | "" (decorative) or "Olive branch" |  |
| `art/palm.webp` | 802×1077 | 175,240 | yes | palm.png | "" (decorative) or "Palm frond" |  |
| `art/watercolor-bg.jpg` | 1536×1024 | 162,348 | no | ChatGPT-Image-Feb-12-2026-07_25_58-AM.png | "" (decorative background; soft lavender watercolor of a temple in mist) | Texture, not upscaled (1536px) |
| `art/waving-boy.webp` | 554×587 | 762,602 | yes | Animated-cropped-waving-boy.gif | Animated Jacob, the Nephite boy, waving hello | Animated, 38 frames, 4.1s loop. next/image serves it as-is; do not use a blur placeholder. The 1-bit GIF alpha leaves a faint white fringe, so place it on light backgrounds |
| **peek/** | | | | | | |
| `peek/ej-peek-1.jpg` | 2000×1222 | 538,302 | no | Easter-Journey-Spreads-ppiam1.pdf p4 (same spread as derived ej-peek-1-triumphal-entry-p04-05.jpg) | Inside Easter Journey: The Triumphal Entry: a merchant greets the reader as a crowd waves palms for Jesus | Re-rendered from the spreads PDF at q84 (single generation) |
| `peek/ej-peek-2.jpg` | 2000×1222 | 442,040 | no | Easter-Journey-Spreads-ppiam1.pdf p5 (same spread as derived ej-peek-2-blind-man-healed-p06-07.jpg) | Inside Easter Journey: Jesus heals a blind man outside the doors of the temple | Re-rendered from the spreads PDF at q84 (single generation) |
| `peek/ej-peek-3.jpg` | 2000×1222 | 429,055 | no | Easter-Journey-Spreads-ppiam1.pdf p9 (same spread as derived ej-peek-3-last-supper-p14-15.jpg) | Inside Easter Journey: The Last Supper: Jesus breaks bread and washes the disciples' feet | Re-rendered from the spreads PDF at q84 (single generation) |
| `peek/ej-peek-4.jpg` | 2000×1222 | 395,886 | no | Easter-Journey-Spreads-ppiam1.pdf p21 (same spread as derived ej-peek-4-he-is-risen-p38-39.jpg) | Inside Easter Journey: He is risen: Jesus smiles outside the empty tomb, "I am the resurrection, and the life" | Re-rendered from the spreads PDF at q84 (single generation) |
| `peek/ej-peek-5.jpg` | 2000×1222 | 429,262 | no | Easter-Journey-Spreads-ppiam1.pdf p23 (same spread as derived ej-peek-5-symbols-seek-find-p42-43.jpg) | Inside Easter Journey: Seek-and-find guide to the symbols of Christ, beside three crosses on a hill | Re-rendered from the spreads PDF at q84 (single generation) |
| `peek/ej-peek-6.jpg` | 2000×1222 | 404,412 | no | Easter-Journey-Spreads-ppiam1.pdf p24 (same spread as derived ej-peek-6-easter-advent-guide-p44-45.jpg) | Inside Easter Journey: The Easter Journey Advent reading guide beside Jesus holding a scroll | Re-rendered from the spreads PDF at q84 (single generation) |
| `peek/nc-peek-00.jpg` | 2000×1610 | 394,690 | no | assets/derived/peek-inside/nephite-christmas/nc-peek-00-opening-page.jpg | Inside Nephite Christmas: Opening page: a Nephite village at dusk, "'Twas the night before Christmas, and all through the land..." | Single opening page |
| `peek/nc-peek-01.jpg` | 2000×815 | 343,574 | no | assets/derived/peek-inside/nephite-christmas/nc-peek-01-samuels-prophecy.jpg | Inside Nephite Christmas: Samuel the prophet preaches from the temple steps while Jacob and a friend watch the wicked threaten | Lossless copy of the assets/derived export (progressive, q82) |
| `peek/nc-peek-02.jpg` | 2000×815 | 227,427 | no | assets/derived/peek-inside/nephite-christmas/nc-peek-02-night-without-darkness.jpg | Inside Nephite Christmas: Nephi tells Jacob to wait for "a night without darkness, with no setting sun" | Lossless copy of the assets/derived export (progressive, q82) |
| `peek/nc-peek-03.jpg` | 2000×815 | 183,630 | no | assets/derived/peek-inside/nephite-christmas/nc-peek-03-lift-up-your-head.jpg | Inside Nephite Christmas: Nephi's prayer is answered in a glowing grove: "Son, lift up your head, and be of good cheer!" | Lossless copy of the assets/derived export (progressive, q82) |
| `peek/nc-peek-04.jpg` | 2000×815 | 191,303 | no | assets/derived/peek-inside/nephite-christmas/nc-peek-04-for-of-mary.jpg | Inside Nephite Christmas: Jacob draws while Mary and Joseph hold baby Jesus under the star | Lossless copy of the assets/derived export (progressive, q82) |
| `peek/nc-peek-05.jpg` | 2000×815 | 230,075 | no | assets/derived/peek-inside/nephite-christmas/nc-peek-05-no-darkness-came.jpg | Inside Nephite Christmas: Villagers look up in wonder: "So that glorious night, no darkness came" | Lossless copy of the assets/derived export (progressive, q82) |
| `peek/nc-peek-06.jpg` | 2000×815 | 219,885 | no | assets/derived/peek-inside/nephite-christmas/nc-peek-06-merry-christmas.jpg | Inside Nephite Christmas: Jacob shares a hug: "Merry Christmas to all, and to all a good night!", beside his drawings of the Nativity | Lossless copy of the assets/derived export (progressive, q82) |
| **peek/mobile/** | | | | | | |
| `peek/mobile/ej-peek-1-l.jpg` | 1200×1467 | 324,662 | no | Easter-Journey-Pages-qzyf3m.pdf p6 (printed p4) | Easter Journey page: Story text beside the merchant in a Jerusalem street | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-1-r.jpg` | 1200×1467 | 388,451 | no | Easter-Journey-Pages-qzyf3m.pdf p7 (printed p5) | Easter Journey page: Jesus rides through the city gate as the crowd waves palm branches | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-2-l.jpg` | 1200×1467 | 286,088 | no | Easter-Journey-Pages-qzyf3m.pdf p8 (printed p6) | Easter Journey page: Jesus holds the face of a blind man | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-2-r.jpg` | 1200×1467 | 297,357 | no | Easter-Journey-Pages-qzyf3m.pdf p9 (printed p7) | Easter Journey page: Story text: Outside the Doors of the Temple | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-3-l.jpg` | 1200×1467 | 204,306 | no | Easter-Journey-Pages-qzyf3m.pdf p16 (printed p14) | Easter Journey page: Jesus breaks bread at the Last Supper | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-3-r.jpg` | 1200×1467 | 356,129 | no | Easter-Journey-Pages-qzyf3m.pdf p17 (printed p15) | Easter Journey page: Jesus washes a disciple's feet | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-4-l.jpg` | 1200×1467 | 201,651 | no | Easter-Journey-Pages-qzyf3m.pdf p40 (printed p38) | Easter Journey page: The risen Jesus smiling outside the tomb | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-4-r.jpg` | 1200×1467 | 310,964 | no | Easter-Journey-Pages-qzyf3m.pdf p41 (printed p39) | Easter Journey page: "I am the resurrection, and the life" above red tulips | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-5-l.jpg` | 1200×1467 | 227,984 | no | Easter-Journey-Pages-qzyf3m.pdf p44 (printed p42) | Easter Journey page: Can You Find These Symbols of Christ Throughout this Book? | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-5-r.jpg` | 1200×1467 | 326,285 | no | Easter-Journey-Pages-qzyf3m.pdf p45 (printed p43) | Easter Journey page: Three crosses on a green hill | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-6-l.jpg` | 1200×1467 | 290,839 | no | Easter-Journey-Pages-qzyf3m.pdf p46 (printed p44) | Easter Journey page: Jesus holding a scroll | Pages PDF p = printed p + 2 |
| `peek/mobile/ej-peek-6-r.jpg` | 1200×1467 | 225,834 | no | Easter-Journey-Pages-qzyf3m.pdf p47 (printed p45) | Easter Journey page: Easter Journey Advent: daily reading guide for Holy Week | Pages PDF p = printed p + 2 |
| `peek/mobile/nc-peek-01-l.jpg` | 1200×966 | 229,190 | no | pages-nephite-christmas.pdf p4 | Nephite Christmas page: Samuel the prophet preaches from the temple steps as the wicked threaten | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-01-r.jpg` | 1200×966 | 242,568 | no | pages-nephite-christmas.pdf p5 | Nephite Christmas page: Jacob holds up his drawing as a girl points and scowling men look on | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-02-l.jpg` | 1200×966 | 106,816 | no | pages-nephite-christmas.pdf p10 | Nephite Christmas page: Nephi and Jacob sit together on a log | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-02-r.jpg` | 1200×966 | 197,930 | no | pages-nephite-christmas.pdf p11 | Nephite Christmas page: "You must wait for the day and the night that are one" above a temple | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-03-l.jpg` | 1200×966 | 129,260 | no | pages-nephite-christmas.pdf p16 | Nephite Christmas page: Jacob watches the prophet Nephi in a glowing green grove | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-03-r.jpg` | 1200×966 | 122,425 | no | pages-nephite-christmas.pdf p17 | Nephite Christmas page: "Son, lift up your head, and be of good cheer!" | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-04-l.jpg` | 1200×966 | 128,172 | no | pages-nephite-christmas.pdf p18 | Nephite Christmas page: Jacob drawing on a tablet | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-04-r.jpg` | 1200×966 | 131,975 | no | pages-nephite-christmas.pdf p19 | Nephite Christmas page: Mary and Joseph hold baby Jesus under the star | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-05-l.jpg` | 1200×966 | 161,998 | no | pages-nephite-christmas.pdf p20 | Nephite Christmas page: A mother and child look up at the bright night sky | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-05-r.jpg` | 1200×966 | 160,756 | no | pages-nephite-christmas.pdf p21 | Nephite Christmas page: "So that glorious night, no darkness came" | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-06-l.jpg` | 1200×966 | 119,462 | no | pages-nephite-christmas.pdf p26 | Nephite Christmas page: Jacob shares a hug: "Merry Christmas to all, and to all a good night!" | From the pages PDF; see the text-version note |
| `peek/mobile/nc-peek-06-r.jpg` | 1200×966 | 179,807 | no | pages-nephite-christmas.pdf p27 | Nephite Christmas page: Jacob's drawings of the Nativity, a shepherd and the wise men on a table | From the pages PDF; see the text-version note |
| **products/** | | | | | | |
| `products/bundle-book-coloring.jpg` | 1055×1054 | 137,050 | no | 7.png | Nephite Christmas hardcover and Coloring and Activity Book bundle |  |
| `products/bundle-gift-set.jpg` | 1055×1054 | 142,390 | no | Bundle-with-ornament.png | Nephite Christmas hardcover, coloring and activity book and star ornament gift set |  |
| `products/canvas-1.jpg` | 2048×2048 | 345,193 | no | 16513748483500245155_2048.jpeg | He Spoke My Name canvas print: Mary Magdalene at the empty tomb with the risen Christ | Primary image |
| `products/canvas-2.jpg` | 2048×2048 | 452,205 | no | 13926739497957928813_2048.jpeg | Angled view of the Mary Magdalene canvas print showing its wrapped edge |  |
| `products/canvas-3.jpg` | 2048×2048 | 611,034 | no | 11343436479279271422_2048.jpeg | Mary Magdalene canvas print hanging above a console with a vase |  |
| `products/canvas-4.jpg` | 2048×2048 | 135,969 | no | 10260435129459230675_2048.jpeg | Mary Magdalene canvas print hanging on a white wall above a shelf |  |
| `products/coloring-book-pdf.webp` | 1001×1124 | 123,192 | yes | coloring-book-download-cover-thumbnail.png | Nephite Christmas Coloring and Activity Book cover with a PDF Download label | Semi-transparent PDF badge overhangs the right edge |
| `products/coloring-book.webp` | 1600×2077 | 284,026 | no | RGB-Nephite-Christmas-Coloring-and-Activity-Book-With-Cover.pdf p1 embedded cover image (matches coloring-book-cover-thumbnail.png framing) | Nephite Christmas Coloring and Activity Book cover | Taken from the cover image embedded in the coloring-book PDF (2550px) instead of the 832px thumbnail. Opaque |
| `products/coloring-page-1.jpg` | 1200×1553 | 251,010 | no | assets/derived/coloring-book/nc-coloring-p01.jpg | Coloring and Activity Book cover: Jacob waving in front of a temple | This is the coloring-book cover (p1), not an interior page |
| `products/coloring-page-2.jpg` | 1200×1553 | 407,545 | no | assets/derived/coloring-book/nc-coloring-p07.jpg | Seek-and-find coloring page of a Nephite village |  |
| `products/coloring-page-3.jpg` | 1200×1553 | 299,723 | no | assets/derived/coloring-book/nc-coloring-p08.jpg | Maze activity page: Help Jacob find Nephi |  |
| `products/coloring-page-4.jpg` | 1200×1553 | 433,369 | no | assets/derived/coloring-book/nc-coloring-p15.jpg | A Missing Prophet Mystery logic puzzle page |  |
| `products/coloring-page-5.jpg` | 1200×1553 | 214,318 | no | assets/derived/coloring-book/nc-coloring-p23.jpg | Coloring page of Mary, Joseph and baby Jesus under a star |  |
| `products/digital-bundle.webp` | 1031×1017 | 152,134 | yes | Digital-Bundle-Download.png | Nephite Christmas digital bundle: PDF book, coloring book and nativity craft, labeled Instant Download |  |
| `products/ej-pdf.webp` | 760×832 | 156,468 | yes | Easter-Journey-Download-Cover.png | Easter Journey book cover with a PDF Download label | Badge overhangs the edge (alpha) |
| `products/ej-tomb-spread.jpg` | 2400×1479 | 673,655 | no | Easter-Journey-for-canva18-scaled.jpg | Easter Journey spread: an angel at the open tomb with the words "He is not here! He is Risen!" | Converted from Adobe RGB to sRGB |
| `products/nativity-holy-family.jpg` | 787×1080 | 76,317 | no | Nativity-Jesus-Mary-and-Joseph.png | Printable nativity cutouts of Mary, Joseph and baby Jesus to color |  |
| `products/nativity-instructions.jpg` | 787×1083 | 93,246 | no | Nativity-Instructions.png | Step-by-step instructions for assembling the paper nativity pieces | Embedded monitor profile ("LG HDR 4K") converted to sRGB |
| `products/nativity-jacob-dad.jpg` | 787×1017 | 47,635 | no | Nativity-Jacob-and-Dad.png | Printable nativity cutouts of Jacob and his father praying |  |
| `products/nativity-kit.jpg` | 1050×1050 | 85,565 | no | Nativity-feature-image-2.jpg | Colored paper nativity figures of Joseph, Mary and baby Jesus |  |
| `products/nativity-nephi-family.jpg` | 787×1018 | 60,519 | no | Nativity-Nephi-Mom-and-Sister.png | Printable nativity cutouts of Nephi, a mother and a sister |  |
| `products/nc-nativity-spread.jpg` | 1471×598 | 130,837 | no | Nativity-Spread.png | Nephite Christmas spread: Jacob draws while Mary and Joseph hold baby Jesus under the star | Same spread as peek/nc-peek-04, which is higher-res (2000px) |
| `products/nc-pdf.webp` | 824×676 | 88,524 | yes | Nephite-Christmas-Download-cover.png | Nephite Christmas book cover with a PDF Download label | Badge overhangs the edge (alpha) |
| `products/nc-unbelievers-spread.jpg` | 1471×598 | 193,707 | no | Unbelievers-Threaten-Spread.png | Nephite Christmas spread: unbelievers threaten the faithful beside a waterfall |  |
| `products/ornament-dove.jpg` | 648×648 | 50,906 | no | Peace-Dove-Ornament.png | White peace dove ornament with star cutouts hanging on a Christmas tree |  |
| `products/ornament-star-photo.jpg` | 500×538 | 39,197 | no | NephiteChristmas-Ornament2.jpg | Nephite Christmas star ornament on a Christmas tree |  |
| `products/ornament-star.webp` | 615×798 | 67,754 | no | NC-Ornament-c.png | Round white Nephite Christmas ornament with a gold star hanging on a Christmas tree | Transparent side bars trimmed; the photo is opaque |
| `products/puzzle-1.jpg` | 2048×2048 | 285,584 | no | 6225826769189115882_2048.jpeg | Jigsaw puzzle of Jesus holding a scroll, with loose pieces | Primary image: the loose pieces show at a glance that it is a puzzle |
| `products/puzzle-2.jpg` | 2048×2048 | 445,864 | no | 1711526216898823065_2048.jpeg | Completed puzzle showing Jesus holding a scroll among olive trees |  |
| `products/puzzle-3.jpg` | 2048×2048 | 343,095 | no | 16637536903398360573_2048.jpeg | Puzzle box labeled 11x14 Puzzle, 252 pieces |  |
| **people/** | | | | | | |
| `people/kelley-hicken.jpg` | 600×723 | 45,194 | no | Kelley-Heckin.jpg | Illustrator Kelley Hicken |  |
| `people/tiffany-banner.jpg` | 1920×1083 | 131,205 | no | TiffanyWheeler-Hero3.jpg | Author Tiffany Wheeler | Subject small, centred on a white wall |
| `people/tiffany-portrait-2.jpg` | 500×652 | 37,851 | no | TiffanyWheeler-AboutUs.jpg | Author Tiffany Wheeler | Low-res source (500px) |
| `people/tiffany-portrait.jpg` | 600×564 | 37,468 | no | TiffanyWheeler-About2.jpg | Author Tiffany Wheeler | Low-res source (600px) |
| **brand/** | | | | | | |
| `brand/logo-white.png` | 583×213 | 13,833 | yes | TiffanyWheeler-WhiteLogo.png | Tiffany Wheeler | Trimmed. Colour is #F4F4F4, not pure white |
| `brand/logo.png` | 583×213 | 14,243 | yes | TiffanyWheelerLogo.png | Tiffany Wheeler | Trimmed. Single colour #6771C8 |
| `brand/logo.svg` | 583×213 | 49,345 | yes | potrace vector trace of TiffanyWheelerLogo.png | Tiffany Wheeler | Faithful trace (mean pixel error 0.6/255). Use it with `unoptimized`, or as an inline SVG or plain img |
| **src/app/ (outside this folder)** | | | | | | |
| `src/app/apple-icon.png` | 180×180 | 10,884 | no | butterfly mark from TiffanyWheelerLogo.png (vector trace) | (touch icon; no alt needed) | Butterfly on cream #FBF6EC |
| `src/app/icon.png` | 512×512 | 42,126 | yes | butterfly mark from TiffanyWheelerLogo.png (vector trace) | (favicon; no alt needed) | Butterfly from the logo; y-tail removed; stroke thickened about 1.5x for small sizes |

Unless a path is given, sources are in `assets/media-library/`. Sources under `assets/derived/` are exports made earlier from the book PDFs.
