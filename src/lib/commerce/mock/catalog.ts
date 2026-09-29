// Mock product catalog: all 14 storefront products, written from docs/copy-deck.md
// (§3.0 catalog summary + each product's §3.x page; card blurbs from §2.3/§2.4/§2.9;
// peek-inside captions and lines from §2.6). Image alt text comes from
// src/assets/images/README.md; the six primary images whose §3.x "Primary image alt"
// matches the actual file use the deck's wording instead.
//
// Rules this file follows:
// - Copy is final and verbatim. "[CONFIRM]" tags are stripped from the strings and
//   tracked with a `// CONFIRM` comment on the same line (see copy deck §5).
// - compareAtPrice is null everywhere except the Complete Set, whose $54.98 is the
//   real sum of the two hardcovers (FTC). The other bundles equal the sum of their
//   parts, so they sell convenience and show no strike-through (copy deck §3.0 note).
// - Easter Journey has no reviews: `ratings: []`, never invented.
// - Ids are Shopify-style gids so the Shopify provider can drop in later.
//
// Tag vocabulary (for /shop filters, §1.6): "books-sets", "gifts-add-ons",
// "instant-downloads", "christmas", "easter", "hardcover", "pdf", "made-to-order".
// "made-to-order" marks print-on-demand items (DeliveryPromise `madeToOrder`).
//
// Single-variant products have `options: []` and one descriptive variant title
// (never Shopify's "Default Title"), so cart lines read well without special-casing.

import { fromStatic } from "@/lib/images";
import { formatMoney, money } from "@/lib/money";
import { CLAIMS, FREE_SHIPPING_THRESHOLD, HANDLES, HANDLING_TIME, SHIPS_FROM } from "@/lib/store-config";
import type { Image, PeekSpread, Product, Rating, Variant } from "../types";
import { publishedReviews } from "./reviews";

// ── Images ───────────────────────────────────────────────────────────────────

import bothBooksSrc from "@/assets/images/books/both-books.jpg";
import ejCover3dSrc from "@/assets/images/books/ej-cover-3d.webp";
import ejCoverSrc from "@/assets/images/books/ej-cover.jpg";
import ejOpenBookSrc from "@/assets/images/books/ej-open-book.webp";
import ncBookColoringCutoutSrc from "@/assets/images/books/nc-book-coloring-cutout.webp";
import ncCoverSrc from "@/assets/images/books/nc-cover.jpg";
import ncGiftSetCutoutSrc from "@/assets/images/books/nc-gift-set-cutout.webp";

import childColoringSrc from "@/assets/images/lifestyle/child-coloring.jpg";
import family04Src from "@/assets/images/lifestyle/family-04.jpg";
import grandmaReadingSrc from "@/assets/images/lifestyle/grandma-reading.jpg";
import holidayFlatlaySrc from "@/assets/images/lifestyle/holiday-flatlay.jpg";
import ncFlatlaySrc from "@/assets/images/lifestyle/nc-flatlay.jpg";
import ncStockingSrc from "@/assets/images/lifestyle/nc-stocking.jpg";

import ejBlindManSrc from "@/assets/images/art/ej-blind-man.jpg";
import ejMaryGardenSrc from "@/assets/images/art/ej-mary-garden.jpg";
import ncPageVillageNightSrc from "@/assets/images/art/nc-page-village-night.jpg";

import bundleBookColoringSrc from "@/assets/images/products/bundle-book-coloring.jpg";
import bundleGiftSetSrc from "@/assets/images/products/bundle-gift-set.jpg";
import canvas1Src from "@/assets/images/products/canvas-1.jpg";
import canvas2Src from "@/assets/images/products/canvas-2.jpg";
import canvas3Src from "@/assets/images/products/canvas-3.jpg";
import canvas4Src from "@/assets/images/products/canvas-4.jpg";
import coloringBookPdfSrc from "@/assets/images/products/coloring-book-pdf.webp";
import coloringBookSrc from "@/assets/images/products/coloring-book.webp";
import coloringPage2Src from "@/assets/images/products/coloring-page-2.jpg";
import coloringPage3Src from "@/assets/images/products/coloring-page-3.jpg";
import coloringPage4Src from "@/assets/images/products/coloring-page-4.jpg";
import coloringPage5Src from "@/assets/images/products/coloring-page-5.jpg";
import digitalBundleSrc from "@/assets/images/products/digital-bundle.webp";
import ejPdfSrc from "@/assets/images/products/ej-pdf.webp";
import ejTombSpreadSrc from "@/assets/images/products/ej-tomb-spread.jpg";
import nativityHolyFamilySrc from "@/assets/images/products/nativity-holy-family.jpg";
import nativityInstructionsSrc from "@/assets/images/products/nativity-instructions.jpg";
import nativityJacobDadSrc from "@/assets/images/products/nativity-jacob-dad.jpg";
import nativityKitSrc from "@/assets/images/products/nativity-kit.jpg";
import nativityNephiFamilySrc from "@/assets/images/products/nativity-nephi-family.jpg";
import ncNativitySpreadSrc from "@/assets/images/products/nc-nativity-spread.jpg";
import ncPdfSrc from "@/assets/images/products/nc-pdf.webp";
import ncUnbelieversSpreadSrc from "@/assets/images/products/nc-unbelievers-spread.jpg";
import ornamentDoveSrc from "@/assets/images/products/ornament-dove.jpg";
import ornamentStarPhotoSrc from "@/assets/images/products/ornament-star-photo.jpg";
import ornamentStarSrc from "@/assets/images/products/ornament-star.webp";
import puzzle1Src from "@/assets/images/products/puzzle-1.jpg";
import puzzle2Src from "@/assets/images/products/puzzle-2.jpg";
import puzzle3Src from "@/assets/images/products/puzzle-3.jpg";

import ncPeek00Src from "@/assets/images/peek/nc-peek-00.jpg";
import ncPeek01Src from "@/assets/images/peek/nc-peek-01.jpg";
import ncPeek02Src from "@/assets/images/peek/nc-peek-02.jpg";
import ncPeek03Src from "@/assets/images/peek/nc-peek-03.jpg";
import ncPeek04Src from "@/assets/images/peek/nc-peek-04.jpg";
import ncPeek05Src from "@/assets/images/peek/nc-peek-05.jpg";
import ncPeek06Src from "@/assets/images/peek/nc-peek-06.jpg";
import ncPeek01LSrc from "@/assets/images/peek/mobile/nc-peek-01-l.jpg";
import ncPeek01RSrc from "@/assets/images/peek/mobile/nc-peek-01-r.jpg";
import ncPeek02LSrc from "@/assets/images/peek/mobile/nc-peek-02-l.jpg";
import ncPeek02RSrc from "@/assets/images/peek/mobile/nc-peek-02-r.jpg";
import ncPeek03LSrc from "@/assets/images/peek/mobile/nc-peek-03-l.jpg";
import ncPeek03RSrc from "@/assets/images/peek/mobile/nc-peek-03-r.jpg";
import ncPeek04LSrc from "@/assets/images/peek/mobile/nc-peek-04-l.jpg";
import ncPeek04RSrc from "@/assets/images/peek/mobile/nc-peek-04-r.jpg";
import ncPeek05LSrc from "@/assets/images/peek/mobile/nc-peek-05-l.jpg";
import ncPeek05RSrc from "@/assets/images/peek/mobile/nc-peek-05-r.jpg";
import ncPeek06LSrc from "@/assets/images/peek/mobile/nc-peek-06-l.jpg";
import ncPeek06RSrc from "@/assets/images/peek/mobile/nc-peek-06-r.jpg";

import ejPeek1Src from "@/assets/images/peek/ej-peek-1.jpg";
import ejPeek2Src from "@/assets/images/peek/ej-peek-2.jpg";
import ejPeek3Src from "@/assets/images/peek/ej-peek-3.jpg";
import ejPeek4Src from "@/assets/images/peek/ej-peek-4.jpg";
import ejPeek5Src from "@/assets/images/peek/ej-peek-5.jpg";
import ejPeek6Src from "@/assets/images/peek/ej-peek-6.jpg";
import ejPeek1LSrc from "@/assets/images/peek/mobile/ej-peek-1-l.jpg";
import ejPeek1RSrc from "@/assets/images/peek/mobile/ej-peek-1-r.jpg";
import ejPeek2LSrc from "@/assets/images/peek/mobile/ej-peek-2-l.jpg";
import ejPeek2RSrc from "@/assets/images/peek/mobile/ej-peek-2-r.jpg";
import ejPeek3LSrc from "@/assets/images/peek/mobile/ej-peek-3-l.jpg";
import ejPeek3RSrc from "@/assets/images/peek/mobile/ej-peek-3-r.jpg";
import ejPeek4LSrc from "@/assets/images/peek/mobile/ej-peek-4-l.jpg";
import ejPeek4RSrc from "@/assets/images/peek/mobile/ej-peek-4-r.jpg";
import ejPeek5LSrc from "@/assets/images/peek/mobile/ej-peek-5-l.jpg";
import ejPeek5RSrc from "@/assets/images/peek/mobile/ej-peek-5-r.jpg";
import ejPeek6LSrc from "@/assets/images/peek/mobile/ej-peek-6-l.jpg";
import ejPeek6RSrc from "@/assets/images/peek/mobile/ej-peek-6-r.jpg";

const img = {
  // books/ (primary alts for the two covers, the set and the bundles: copy deck §3.x)
  ncCover: fromStatic(ncCoverSrc, "Nephite Christmas hardcover, written by Tiffany Wheeler and illustrated by Kelley Hicken"),
  ejCover: fromStatic(ejCoverSrc, "Easter Journey hardcover, written by Tiffany Wheeler and illustrated by Kelley Hicken"),
  ejCover3d: fromStatic(ejCover3dSrc, "Easter Journey hardcover book"),
  ejOpenBook: fromStatic(ejOpenBookSrc, "Easter Journey open to a page of Mary Magdalene meeting the risen Jesus at the tomb"),
  bothBooks: fromStatic(bothBooksSrc, "Nephite Christmas and Easter Journey hardcovers standing side by side"),
  ncBookColoringCutout: fromStatic(ncBookColoringCutoutSrc, "Nephite Christmas hardcover with the Nephite Christmas Coloring and Activity Book"),
  ncGiftSetCutout: fromStatic(ncGiftSetCutoutSrc, "Nephite Christmas hardcover, coloring and activity book, and star ornament gift set"),

  // lifestyle/
  ncStocking: fromStatic(ncStockingSrc, "Nephite Christmas hardcover on a red and white Christmas backdrop with pine branches"),
  ncFlatlay: fromStatic(ncFlatlaySrc, "Nephite Christmas book and coloring book surrounded by bead garland, gifts and gold ornaments"),
  holidayFlatlay: fromStatic(holidayFlatlaySrc, "Nephite Christmas book and coloring book in a holiday flat lay with a gift box, snowflake and bells"),
  family04: fromStatic(family04Src, "Smiling children listening as their mother reads Nephite Christmas by the fire"),
  grandmaReading: fromStatic(grandmaReadingSrc, "Grandmother reading Nephite Christmas with two smiling granddaughters"),
  childColoring: fromStatic(childColoringSrc, "Child coloring a page from the Nephite Christmas coloring book"),

  // art/
  ncPageVillageNight: fromStatic(ncPageVillageNightSrc, "Illustrated Nephite village of thatched huts beneath a temple, from the first page of Nephite Christmas"),
  ejBlindMan: fromStatic(ejBlindManSrc, "Jesus gently holding the face of a blind man"),
  ejMaryGarden: fromStatic(ejMaryGardenSrc, "Tearful Mary Magdalene in a head covering in a garden"),

  // products/
  bundleBookColoring: fromStatic(bundleBookColoringSrc, "Nephite Christmas hardcover with the Nephite Christmas Coloring & Activity Book"),
  bundleGiftSet: fromStatic(bundleGiftSetSrc, "Nephite Christmas hardcover, coloring book and star ornament arranged together"),
  coloringBook: fromStatic(coloringBookSrc, "Cover of the Nephite Christmas Coloring & Activity Book, with Jacob waving"),
  coloringBookPdf: fromStatic(coloringBookPdfSrc, "Nephite Christmas Coloring and Activity Book cover with a PDF Download label"),
  coloringPage2: fromStatic(coloringPage2Src, "Seek-and-find coloring page of a Nephite village"),
  coloringPage3: fromStatic(coloringPage3Src, "Maze activity page: Help Jacob find Nephi"),
  coloringPage4: fromStatic(coloringPage4Src, "A Missing Prophet Mystery logic puzzle page"),
  coloringPage5: fromStatic(coloringPage5Src, "Coloring page of Mary, Joseph and baby Jesus under a star"),
  ornamentStar: fromStatic(ornamentStarSrc, "Round white Nephite Christmas ornament with a gold star hanging on a Christmas tree"),
  ornamentStarPhoto: fromStatic(ornamentStarPhotoSrc, "Nephite Christmas star ornament on a Christmas tree"),
  ornamentDove: fromStatic(ornamentDoveSrc, "White peace dove ornament with star cutouts hanging on a Christmas tree"),
  nativityKit: fromStatic(nativityKitSrc, "Colored paper nativity figures of Joseph, Mary and baby Jesus"),
  nativityHolyFamily: fromStatic(nativityHolyFamilySrc, "Printable nativity cutouts of Mary, Joseph and baby Jesus to color"),
  nativityNephiFamily: fromStatic(nativityNephiFamilySrc, "Printable nativity cutouts of Nephi, a mother and a sister"),
  nativityJacobDad: fromStatic(nativityJacobDadSrc, "Printable nativity cutouts of Jacob and his father praying"),
  nativityInstructions: fromStatic(nativityInstructionsSrc, "Step-by-step instructions for assembling the paper nativity pieces"),
  ncPdf: fromStatic(ncPdfSrc, "Nephite Christmas book cover with a PDF Download label"),
  ncUnbelieversSpread: fromStatic(ncUnbelieversSpreadSrc, "Nephite Christmas spread: unbelievers threaten the faithful beside a waterfall"),
  ncNativitySpread: fromStatic(ncNativitySpreadSrc, "Nephite Christmas spread: Jacob draws while Mary and Joseph hold baby Jesus under the star"),
  ejPdf: fromStatic(ejPdfSrc, "Easter Journey book cover with a PDF Download label"),
  ejTombSpread: fromStatic(ejTombSpreadSrc, "Easter Journey spread: an angel at the open tomb with the words “He is not here! He is Risen!”"),
  digitalBundle: fromStatic(digitalBundleSrc, "Nephite Christmas digital bundle: PDF book, coloring book and nativity craft, labeled Instant Download"),
  puzzle1: fromStatic(puzzle1Src, "Jigsaw puzzle of Jesus holding a scroll, with loose pieces"),
  puzzle2: fromStatic(puzzle2Src, "Completed puzzle showing Jesus holding a scroll among olive trees"),
  puzzle3: fromStatic(puzzle3Src, "Puzzle box labeled 11x14 Puzzle, 252 pieces"),
  canvas1: fromStatic(canvas1Src, "He Spoke My Name canvas print: Mary Magdalene at the empty tomb with the risen Christ"),
  canvas2: fromStatic(canvas2Src, "Angled view of the Mary Magdalene canvas print showing its wrapped edge"),
  canvas3: fromStatic(canvas3Src, "Mary Magdalene canvas print hanging above a console with a vase"),
  canvas4: fromStatic(canvas4Src, "Mary Magdalene canvas print hanging on a white wall above a shelf"),
} satisfies Record<string, Image>;

// ── Peek inside (copy deck §2.6; quotes keep their own curly quotation marks) ──

const ncPeek: PeekSpread[] = [
  {
    image: fromStatic(ncPeek00Src, "Inside Nephite Christmas: Opening page: a Nephite village at dusk, “’Twas the night before Christmas, and all through the land…”"),
    caption: "It all begins on the night before Christmas",
    quote: "“’Twas the night before Christmas, and all through the land…”",
  },
  {
    image: fromStatic(ncPeek01Src, "Inside Nephite Christmas: Samuel the prophet preaches from the temple steps while Jacob and a friend watch the wicked threaten"),
    mobilePages: [
      fromStatic(ncPeek01LSrc, "Nephite Christmas page: Samuel the prophet preaches from the temple steps as the wicked threaten"),
      fromStatic(ncPeek01RSrc, "Nephite Christmas page: Jacob holds up his drawing as a girl points and scowling men look on"),
    ],
    caption: "A village waits for Samuel’s promised sign",
    // CONFIRM: the spread image reads “For Samuel, the prophet” (copy deck §5, item 25).
    quote: "“For Samuel the prophet said the sign would soon come, but the wait had just gotten too long for some.”",
  },
  {
    image: fromStatic(ncPeek02Src, "Inside Nephite Christmas: Nephi tells Jacob to wait for “a night without darkness, with no setting sun”"),
    mobilePages: [
      fromStatic(ncPeek02LSrc, "Nephite Christmas page: Nephi and Jacob sit together on a log"),
      fromStatic(ncPeek02RSrc, "Nephite Christmas page: “You must wait for the day and the night that are one” above a temple"),
    ],
    caption: "Nephi teaches Jacob about the sign",
    quote: "“You must wait for the day and the night that are one, a night without darkness, with no setting sun!”",
  },
  {
    image: fromStatic(ncPeek03Src, "Inside Nephite Christmas: Nephi’s prayer is answered in a glowing grove: “Son, lift up your head, and be of good cheer!”"),
    mobilePages: [
      fromStatic(ncPeek03LSrc, "Nephite Christmas page: Jacob watches the prophet Nephi in a glowing green grove"),
      fromStatic(ncPeek03RSrc, "Nephite Christmas page: “Son, lift up your head, and be of good cheer!”"),
    ],
    caption: "Nephi’s prayer is answered in a grove filled with light",
    quote: "“Son, lift up your head, and be of good cheer! For the time is at hand, and the sign is so near!”",
  },
  {
    image: fromStatic(ncPeek04Src, "Inside Nephite Christmas: Jacob draws while Mary and Joseph hold baby Jesus under the star"),
    mobilePages: [
      fromStatic(ncPeek04LSrc, "Nephite Christmas page: Jacob drawing on a tablet"),
      fromStatic(ncPeek04RSrc, "Nephite Christmas page: Mary and Joseph hold baby Jesus under the star"),
    ],
    caption: "Jacob draws as the Savior’s birth in Bethlehem draws near",
    quote: "“For of Mary tomorrow I shall be born, in Bethlehem of Judea, that first Christmas morn.”",
  },
  {
    image: fromStatic(ncPeek05Src, "Inside Nephite Christmas: Villagers look up in wonder: “So that glorious night, no darkness came”"),
    mobilePages: [
      fromStatic(ncPeek05LSrc, "Nephite Christmas page: A mother and child look up at the bright night sky"),
      fromStatic(ncPeek05RSrc, "Nephite Christmas page: “So that glorious night, no darkness came”"),
    ],
    caption: "The miracle: a glorious night with no darkness",
    quote: "“So that glorious night, no darkness came.”",
  },
  {
    image: fromStatic(ncPeek06Src, "Inside Nephite Christmas: Jacob shares a hug: “Merry Christmas to all, and to all a good night!”, beside his drawings of the Nativity"),
    mobilePages: [
      fromStatic(ncPeek06LSrc, "Nephite Christmas page: Jacob shares a hug: “Merry Christmas to all, and to all a good night!”"),
      fromStatic(ncPeek06RSrc, "Nephite Christmas page: Jacob’s drawings of the Nativity, a shepherd and the wise men on a table"),
    ],
    caption: "An ending that brings the message home",
    quote: "“And so from the Nephites of old unto you, remember Christ came to save all of us, too! … Merry Christmas to all, and to all a good night!”",
  },
];

const ejPeek: PeekSpread[] = [
  {
    image: fromStatic(ejPeek1Src, "Inside Easter Journey: The Triumphal Entry: a merchant greets the reader as a crowd waves palms for Jesus"),
    mobilePages: [
      fromStatic(ejPeek1LSrc, "Easter Journey page: Story text beside the merchant in a Jerusalem street"),
      fromStatic(ejPeek1RSrc, "Easter Journey page: Jesus rides through the city gate as the crowd waves palm branches"),
    ],
    caption: "Palm Sunday: the city welcomes its King",
    quote: "“Today, Jesus rode into our Great City upon the back of a young colt—a symbol of his royal lineage and purpose.”",
  },
  {
    image: fromStatic(ejPeek2Src, "Inside Easter Journey: Jesus heals a blind man outside the doors of the temple"),
    mobilePages: [
      fromStatic(ejPeek2LSrc, "Easter Journey page: Jesus holds the face of a blind man"),
      fromStatic(ejPeek2RSrc, "Easter Journey page: Story text: Outside the Doors of the Temple"),
    ],
    caption: "The man born blind sees for the first time",
    quote: "“Light and color overtook me, and the darkness disappeared. I could see!”",
  },
  {
    image: fromStatic(ejPeek3Src, "Inside Easter Journey: The Last Supper: Jesus breaks bread and washes the disciples’ feet"),
    mobilePages: [
      fromStatic(ejPeek3LSrc, "Easter Journey page: Jesus breaks bread at the Last Supper"),
      fromStatic(ejPeek3RSrc, "Easter Journey page: Jesus washes a disciple’s feet"),
    ],
    caption: "In the upper room, Jesus serves His apostles",
    quote: "“…that we should love one another, even as He has loved us.”",
  },
  {
    image: fromStatic(ejPeek4Src, "Inside Easter Journey: He is risen: Jesus smiles outside the empty tomb, “I am the resurrection, and the life”"),
    mobilePages: [
      fromStatic(ejPeek4LSrc, "Easter Journey page: The risen Jesus smiling outside the tomb"),
      fromStatic(ejPeek4RSrc, "Easter Journey page: “I am the resurrection, and the life” above red tulips"),
    ],
    caption: "He is risen!",
    quote: "“I am the resurrection, and the life… Believest thou this?” (John 11:25–26 KJV)",
  },
  {
    image: fromStatic(ejPeek5Src, "Inside Easter Journey: Seek-and-find guide to the symbols of Christ, beside three crosses on a hill"),
    mobilePages: [
      fromStatic(ejPeek5LSrc, "Easter Journey page: Can You Find These Symbols of Christ Throughout this Book?"),
      fromStatic(ejPeek5RSrc, "Easter Journey page: Three crosses on a green hill"),
    ],
    caption: "Find 8 symbols of Christ hidden in the art",
    quote: "“Can You Find These Symbols of Christ Throughout this Book?”",
  },
  {
    image: fromStatic(ejPeek6Src, "Inside Easter Journey: The Easter Journey Advent reading guide beside Jesus holding a scroll"),
    mobilePages: [
      fromStatic(ejPeek6LSrc, "Easter Journey page: Jesus holding a scroll"),
      fromStatic(ejPeek6RSrc, "Easter Journey page: Easter Journey Advent: daily reading guide for Holy Week"),
    ],
    caption: "A built-in 8-day advent, Palm Sunday to Easter morning",
    quote: "“Use this as a daily reflection at the end of each story segment.”",
  },
];

// ── Shared copy ──────────────────────────────────────────────────────────────

/** Copy deck §3.0a, on every digital product. */
const DIGITAL_TERMS =
  "Instant download. This is a digital product; no physical item will be shipped. Download once and print as many times as you need for personal, family or classroom use. Please do not copy or share the digital files. Thank you!";
/** §3.0a extra line for the two book PDFs. */
const SCREEN_SHARING = "Sharing it on screen at a family, church or classroom gathering is welcome."; // CONFIRM (copy deck §5, item 30)
/** §3.0a extra line for the large book PDFs. */
const LARGE_FILES = "These are large, high-resolution files. We recommend downloading on Wi-Fi.";
const BOOK_PDF_TERMS = [DIGITAL_TERMS, SCREEN_SHARING, LARGE_FILES].join(" ");

/** Site reviews of Nephite Christmas (copy deck: 20 five-star reviews). */
// Derived from the published reviews (duplicates and pre-purchase notes excluded),
// so every "N reviews" on the site stays true when reviews change.
const ncReviews = publishedReviews.filter((r) => r.productHandle === "nephite-christmas");
const NC_SITE_RATING: Rating = {
  value: Math.round((ncReviews.reduce((sum, r) => sum + r.rating, 0) / ncReviews.length) * 10) / 10,
  count: ncReviews.length,
  source: "site",
};
/**
 * Bundles have no reviews of their own; they show Nephite Christmas's rating,
 * always labelled "of Nephite Christmas" and never claimed in structured data.
 */
const NC_RATING_FOR_BUNDLES: Rating = { ...NC_SITE_RATING, borrowedFrom: "Nephite Christmas" };

// ── Facts used in more than one product (one source each) ────────────────────

/** Hardcover prices (copy deck §3.0). CONFIRM prices (§5, item 1) */
const NC_PRICE = 24.99;
const EJ_PRICE = 29.99;
const SET_PRICE = 49.99;
/** The set's compare-at is the real sum of the two hardcovers (FTC). */
const SET_SEPARATELY = Math.round((NC_PRICE + EJ_PRICE) * 100) / 100;
const SET_SHIPS_FREE = CLAIMS.freeShipping && SET_PRICE >= FREE_SHIPPING_THRESHOLD;

/**
 * Easter Journey has 46 interior pages (45 printed and numbered). One number
 * everywhere: the hardcover, the PDF edition, the set and JSON-LD. CONFIRM (§5, item 21)
 */
const EJ_PAGES = 46;

/** "A hidden dove on every page" only once Tiffany confirms it (§5, item 23); the deck's fallback otherwise. */
const DOVE = CLAIMS.doveOnEveryPage
  ? { onEveryPage: "with a hidden dove on every page", highlight: "A dove hidden on every page, plus stars to count" }
  : { onEveryPage: "with a dove hidden throughout", highlight: "A dove hidden throughout the book, plus stars to count" };

// ── Ids and variants ─────────────────────────────────────────────────────────

const productId = (handle: string) => `gid://shopify/Product/mock-${handle}`;
const variantId = (handle: string, optionSlug?: string) =>
  `gid://shopify/ProductVariant/mock-${handle}${optionSlug ? `-${optionSlug}` : ""}`;

type VariantInit = Partial<Omit<Variant, "id" | "price">> & { title: string; price: number };

/** The one variant of a single-variant product. */
function onlyVariant(handle: string, init: VariantInit): Variant[] {
  const { price, ...rest } = init;
  return [
    {
      id: variantId(handle),
      availableForSale: true,
      requiresShipping: true,
      compareAtPrice: null,
      selectedOptions: [],
      ...rest,
      price: money(price),
    },
  ];
}

const component = (productHandle: string, id = variantId(productHandle)) => ({
  variantId: id,
  productHandle,
  quantity: 1,
});

const COLORING_PRINTED = variantId(HANDLES.coloringBook, "printed");
const COLORING_PDF = variantId(HANDLES.coloringBook, "pdf-download");

// ── Catalog ──────────────────────────────────────────────────────────────────

export const catalog: Product[] = [
  // §3.1
  {
    id: productId(HANDLES.nephiteChristmas),
    handle: HANDLES.nephiteChristmas,
    kind: "book",
    holiday: "christmas",
    title: "Nephite Christmas",
    subtitle: "The Book of Mormon Christmas story, in the rhythm of ’Twas the Night Before Christmas",
    // §2.3 card blurb
    cardBlurb: `On the night before Christmas, the believers watch for Samuel’s sign: a night with no darkness. A read-aloud rhyme inspired by 3 Nephi 1, ${DOVE.onEveryPage}.`, // CONFIRM dove claim (§5, item 23)
    description: `On the night before Christmas, the Nephites watch and pray for the sign Samuel promised: a night without darkness. Nephite Christmas tells their story from 3 Nephi 1 in rhyming verse that reads like the poem your family already knows, ${DOVE.onEveryPage}. Read it together each Christmas and remember that Christ came to save all of us.`, // CONFIRM dove claim (§5, item 23)
    story: [
      "’Twas the night before Christmas in ancient America, and the wicked were threatening. Samuel the prophet had promised a sign of the Savior’s birth, a night without darkness, but the wait had grown too long for some. Now the unbelievers have set a day: if the sign doesn’t come, the believers will die. While young Jacob watches and draws, the prophet Nephi kneels in a grove outside town and pours out his heart to the Lord.",
      "The Lord answers: “Son, lift up your head, and be of good cheer!” That night, no darkness comes. The faithful are saved, and the very next day the Savior is born in Bethlehem. The story ends with a small act of forgiveness from Jacob and a message for every reader: “remember Christ came to save all of us, too!”",
    ],
    highlights: [
      "A rhyming read-aloud in the rhythm of ’Twas the Night Before Christmas",
      "Samuel’s sign, Nephi’s prayer and the night with no darkness, from 3 Nephi 1",
      DOVE.highlight, // CONFIRM dove claim (§5, item 23)
      "A short afterword that explains the prophecies of Christ’s birth and invites kids to find the dove and the star",
      "Warm, detailed illustrations by Idaho artist Kelley Hicken",
      "A hardcover with a dust jacket, made to come out every Christmas",
    ],
    perfectFor: [
      "Christmas Eve, right after the Bethlehem story",
      "A Christmas Eve program or nativity play",
      "Family home evening in December",
      "Primary lessons and ward Christmas parties",
      "Gifts for grandchildren, neighbors and ministering friends",
      "A first Christmas book for little ones",
    ],
    specs: [
      { label: "Format", value: "Hardcover with dust jacket" },
      { label: "Size", value: "About 10.75″ × 8.75″, landscape" }, // CONFIRM (§5, item 20)
      // CONFIRM: "Pages" row omitted until the count is known (sources say 26, 28 and 36; §5, item 19).
      { label: "Ages", value: "3–10" }, // CONFIRM (§5, item 22)
      { label: "Read-aloud time", value: "Under 5 minutes" }, // CONFIRM read-aloud time
      { label: "Author", value: "Tiffany Wheeler" },
      { label: "Illustrator", value: "Kelley Hicken" },
      { label: "Publisher", value: "Rhino Media, 2024" }, // CONFIRM (§5, item 24)
      { label: "ISBN-13", value: "979-8989343553" }, // CONFIRM (§5, item 24)
    ],
    ageRange: "3–10", // CONFIRM (§5, item 22)
    badge: CLAIMS.bestsellerBadge ? "Bestseller" : "Family favorite", // CONFIRM (§5, item 18)
    images: [
      img.ncCover,
      img.ncStocking,
      img.ncFlatlay,
      img.ncPageVillageNight,
      img.family04,
      img.ncUnbelieversSpread,
      img.grandmaReading,
      // The buy box's "Both books" option jumps here (it's the Complete Set's primary image).
      img.bothBooks,
    ],
    peekInside: ncPeek,
    options: [],
    variants: onlyVariant(HANDLES.nephiteChristmas, { title: "Hardcover", price: NC_PRICE }), // CONFIRM price (§5, item 1)
    // Amazon ratings are deliberately not shown: they send price-sensitive visitors to a cheaper listing.
    ratings: [NC_SITE_RATING],
    faqs: [
      {
        question: "Does it follow the scripture?",
        answer:
          "Closely. As in 3 Nephi 1, the unbelievers set a day to put the believers to death, Nephi pours out his heart to the Lord, the Lord answers, “Son, lift up your head, and be of good cheer!” and that night there is no darkness. Jacob, the boy who draws his way through the pictures, is a character created for the book, and some details are simplified to fit the rhyme.",
      },
      {
        question: "How long does it take to read?",
        answer: "Under five minutes read straight through. Plan a few extra minutes for the dove hunt.",
      },
      {
        question: "Is it a good fit for young children?",
        answer:
          "Yes. It’s a picture book for ages 3–10. The tension is gentle, and the story ends with forgiveness. A few scripture-style words like “saith” and “nigh” are a fun chance to talk about how the Book of Mormon sounds.", // CONFIRM ages (§5, item 22)
      },
      {
        question: "Book, bundle or set: which should I get?",
        answer: `The hardcover on its own is ${formatMoney(NC_PRICE)}. The Nephite Christmas Bundle adds the Coloring & Activity Book, and the Bundle with Ornament adds the star ornament too. The Complete Set pairs it with Easter Journey for ${formatMoney(SET_PRICE)}${SET_SHIPS_FREE ? " and ships free" : ""}.`, // CONFIRM prices and free shipping (§5, items 1–2)
      },
    ],
    // No Complete Set here: the buy-box picker and the cart's "Upgrade to the Set"
    // already offer it, and a separate Add would put a second copy of this book in the cart.
    pairsWith: [HANDLES.coloringBook, HANDLES.starOrnament, HANDLES.doveOrnament],
    tags: ["books-sets", "christmas", "hardcover"],
    seo: {
      title: "Nephite Christmas | Book of Mormon Christmas Picture Book",
      description: `The Book of Mormon Christmas story from 3 Nephi 1, told in the rhythm of ’Twas the Night Before Christmas. Hardcover ${DOVE.onEveryPage}.`, // CONFIRM dove claim (§5, item 23)
    },
  },

  // §3.2
  {
    id: productId(HANDLES.easterJourney),
    handle: HANDLES.easterJourney,
    kind: "book",
    holiday: "easter",
    title: "Easter Journey",
    subtitle: "An interactive Holy Week journey through Jerusalem",
    // §2.3 card blurb
    cardBlurb:
      "Step through the gates of Jerusalem and meet the people who knew Jesus, from the man born blind to Mary Magdalene at the empty tomb. Read it as an 8-day Easter advent, Palm Sunday to Easter morning.",
    description:
      "Step through the gates of Jerusalem and meet the people who knew Jesus: a friendly merchant, the man born blind, His apostles, His mother and Mary Magdalene at the empty tomb. Your family becomes part of the story, answering “We seek Jesus of Nazareth” as you go, and reading one part each day from Palm Sunday to Easter morning. It’s a Holy Week tradition that ends where Easter begins: He is risen.",
    story: [
      "Shalom! Easter Journey welcomes your family through the gates of Jerusalem as travelers looking for Jesus of Nazareth. A merchant sends you into the city, and one by one you meet the people who knew Him: the man born blind, Matthew and Andrew in the upper room, James and John in Gethsemane, a brave woman in the home of Caiaphas, Mary His mother, and Mary Magdalene at the garden tomb.",
      "Whenever someone asks whom you seek, your family answers together, “We seek Jesus of Nazareth.” Hand out the speaking parts for a reader’s theater, or read one part each day of Holy Week with the built-in advent guide. The journey ends at the empty tomb, with the merchant’s reminder that the Easter story hasn’t ended: “Each of you still has a role in it.”",
      // "How it began" (optional block in §3.2)
      "Easter Journey began in 2007 as an Easter play at Tiffany’s church. About a thousand people walked through the story the first year, and one 10-year-old said it was even better than Disneyland. Families kept asking for a copy to share at home, so Tiffany and illustrator Kelley Hicken turned it into this book.",
    ],
    highlights: [
      "Eyewitness chapters from Palm Sunday to Easter morning, told by about a dozen people who knew Jesus",
      "Call-and-response lines so kids can join in: “We seek Jesus of Nazareth.”",
      "An 8-day Easter Journey Advent with discussion questions for each day",
      "A seek-and-find of 8 symbols of Christ in the art: cross, Easter lily, oil lamp, dove, fig, pelican, palm leaves and door knocker",
      "Scripture from the King James Bible, including John 11:25–26",
      "A gentle telling: the crucifixion itself is never shown",
      "Rich, full-spread paintings by Kelley Hicken",
    ],
    perfectFor: [
      "Holy Week, from Palm Sunday to Easter morning",
      "An Easter basket that points to Jesus",
      "Family nights and quiet Sunday afternoons",
      "A reader’s theater with kids, cousins or a church group",
      "Sunday school and homeschool lessons on the Gospels",
      "A grandparent’s Easter gift",
    ],
    specs: [
      { label: "Format", value: "Hardcover with dust jacket" },
      { label: "Size", value: "9″ × 11″, portrait" },
      { label: "Pages", value: `${EJ_PAGES} pages` }, // CONFIRM (§5, item 21)
      { label: "Ages", value: "5–12 · great for the whole family" }, // CONFIRM (§5, item 22)
      { label: "Daily reading", value: "About 5–10 minutes a day" }, // CONFIRM (§5, item 26)
      { label: "Author", value: "Tiffany Wheeler" },
      { label: "Illustrator", value: "Kelley Hicken" },
      { label: "Publisher", value: "Tiffany Books LLC, 2025" }, // CONFIRM (§5, item 24)
      { label: "ISBN-13", value: "979-8989343584" }, // CONFIRM (§5, item 24)
    ],
    ageRange: "5–12", // CONFIRM (§5, item 22)
    badge: "Holy Week tradition",
    images: [img.ejCover, img.ejCover3d, img.ejOpenBook, img.ejBlindMan, img.ejMaryGarden, img.ejTombSpread],
    peekInside: ejPeek,
    options: [],
    variants: onlyVariant(HANDLES.easterJourney, { title: "Hardcover", price: EJ_PRICE }), // CONFIRM price (§5, item 1)
    ratings: [],
    faqs: [
      {
        question: "How does the 8-day advent work?",
        answer:
          "Start on Palm Sunday. Each day, read one part of the story (a fig symbol behind the page number shows where to stop), then talk through the questions for that day. Saturday has no reading; it’s a day to remember Christ in the tomb. On Easter Sunday you read the last part together.",
      },
      {
        question: "Is it too intense for young children?",
        answer:
          "Easter Journey tells the whole Holy Week story, including the arrest and the crucifixion, but it’s told gently through the people who loved Jesus, and the art never shows the crucifixion itself. With younger children, the day-by-day format makes it easy to pause and talk.",
      },
      {
        question: "Who is it written for?",
        answer:
          "Families who want Easter to center on Jesus. It follows the Gospel accounts and quotes the King James Bible, and it was written to be shared by Christians of every denomination.",
      },
      {
        question: "Can we act it out?",
        answer:
          "Yes. Every speaker is labeled, from the merchant to Mary Magdalene, so it works as a reader’s theater for your family, a class or a church group.",
      },
    ],
    // Deck: don't lead with the Nephite Christmas set here ("Also by Tiffany" below the fold is fine).
    pairsWith: [HANDLES.puzzle, HANDLES.canvas, HANDLES.ejPdf],
    tags: ["books-sets", "easter", "hardcover"],
    seo: {
      title: "Easter Journey | Holy Week Picture Book & 8-Day Advent",
      description:
        "Walk through Holy Week in Jerusalem with the people who knew Jesus. An interactive, illustrated hardcover with an 8-day Easter advent and seek-and-find.",
    },
  },

  // §3.3
  {
    id: productId(HANDLES.completeSet),
    handle: HANDLES.completeSet,
    kind: "bundle",
    title: "The Complete Set: Nephite Christmas + Easter Journey",
    shortTitle: "The Complete Set",
    subtitle: "Both hardcovers, for His birth and His Resurrection",
    // §2.4 Complete Set bar sub
    cardBlurb:
      "Read Nephite Christmas on Christmas Eve, then walk through Holy Week with Easter Journey. Two illustrated hardcovers that come back out every year.",
    description: `Read Nephite Christmas on Christmas Eve, then walk through Holy Week with Easter Journey in the spring. Two illustrated hardcovers by Tiffany Wheeler and Kelley Hicken, together for ${formatMoney(SET_PRICE)}${SET_SHIPS_FREE ? " with free US shipping" : ""}. It’s a set your family will open year after year, every time you celebrate the Savior.`, // CONFIRM price and free shipping (§5, items 1–2)
    highlights: [
      `Nephite Christmas: the Book of Mormon Christmas story in rhyme, ${DOVE.onEveryPage}`, // CONFIRM dove claim (§5, item 23)
      "Easter Journey: an interactive Holy Week journey with a built-in 8-day advent",
      "Both books are hardcovers with dust jackets, illustrated by Kelley Hicken",
    ],
    specs: [
      { label: "Format", value: "Two hardcovers" },
      { label: "Nephite Christmas", value: "About 10.75″ × 8.75″" }, // CONFIRM size; page count pending (§5, items 19–20)
      { label: "Easter Journey", value: `9″ × 11″, ${EJ_PAGES} pages` }, // CONFIRM (§5, item 21)
      { label: "Ages", value: "3–12" }, // CONFIRM (§5, item 22)
    ],
    ageRange: "3–12", // CONFIRM (§5, item 22)
    badge: SET_SHIPS_FREE ? "Best value · Ships free" : "Best value", // CONFIRM free-shipping threshold (§5, item 2)
    images: [img.bothBooks, img.ncCover, img.ejCover, img.family04, img.ejOpenBook],
    peekInside: [...ncPeek, ...ejPeek],
    options: [],
    variants: onlyVariant(HANDLES.completeSet, {
      title: "Both hardcovers",
      price: SET_PRICE, // CONFIRM (§5, item 1)
      // Real sum of the separate hardcover prices ($24.99 + $29.99), never a former price.
      compareAtPrice: money(SET_SEPARATELY),
      components: [component(HANDLES.nephiteChristmas), component(HANDLES.easterJourney)],
    }),
    // UI labels this "Reviews of Nephite Christmas (included in this set)" (§3.0a).
    ratings: [NC_RATING_FOR_BUNDLES],
    faqs: [
      {
        question: "Do both books ship now?",
        answer: `Yes. Both ship together from ${SHIPS_FROM} in ${HANDLING_TIME}, so you can wrap Nephite Christmas for December and save Easter Journey for Palm Sunday.`, // CONFIRM handling time (§5, item 6)
      },
      {
        question: "Can I send it as a gift?",
        answer:
          "Of course. Add a free gift note in your cart and enter the recipient’s address at checkout.", // CONFIRM packing slips show no prices (§5, item 31)
      },
    ],
    pairsWith: [HANDLES.doveOrnament, HANDLES.coloringBook, HANDLES.puzzle],
    tags: ["books-sets", "christmas", "easter", "hardcover"],
    seo: {
      title: "Nephite Christmas + Easter Journey Set | Tiffany Wheeler",
      description: `Both illustrated hardcovers, Nephite Christmas and Easter Journey, for ${formatMoney(SET_PRICE)}${SET_SHIPS_FREE ? " with free US shipping" : ""}. A tradition for His birth and His Resurrection.`, // CONFIRM price (§5, item 1)
    },
  },

  // §3.4
  {
    id: productId(HANDLES.ncBundle),
    handle: HANDLES.ncBundle,
    kind: "bundle",
    holiday: "christmas",
    title: "Nephite Christmas Bundle",
    subtitle: "The storybook + the Coloring & Activity Book",
    cardBlurb:
      "The Nephite Christmas hardcover plus its companion Coloring & Activity Book: mazes, puzzles and coloring pages drawn from the storybook’s scenes.",
    description:
      "Read the story, then keep it going. This bundle pairs the Nephite Christmas hardcover with its companion Coloring & Activity Book: mazes, puzzles and coloring pages drawn from the storybook’s scenes. Together they turn one Christmas Eve reading into a whole season with the story of Christ’s birth.",
    highlights: [
      "Nephite Christmas, hardcover with dust jacket",
      "Nephite Christmas Coloring & Activity Book, 8.5″ × 11″ softcover: 13 activities, 12 coloring pages and an answer key", // CONFIRM print matches PDF (§5, item 27)
    ],
    specs: [
      { label: "Format", value: "Hardcover + softcover" },
      { label: "Ages", value: "3–10" }, // CONFIRM (§5, item 22)
      { label: "Shipping", value: "Ships together" },
    ],
    ageRange: "3–10", // CONFIRM (§5, item 22)
    badge: "Book + activity book",
    images: [
      img.bundleBookColoring,
      img.ncBookColoringCutout,
      img.holidayFlatlay,
      img.ncCover,
      img.coloringBook,
      img.coloringPage3,
    ],
    options: [],
    // Sum of parts ($24.99 + $7.99): no compare-at (copy deck §3.0 note; §5, item 1).
    variants: onlyVariant(HANDLES.ncBundle, {
      title: "Hardcover + activity book",
      price: 32.98,
      components: [component(HANDLES.nephiteChristmas), component(HANDLES.coloringBook, COLORING_PRINTED)],
    }),
    ratings: [NC_RATING_FOR_BUNDLES],
    pairsWith: [HANDLES.starOrnament, HANDLES.nativityCraft],
    tags: ["books-sets", "christmas", "hardcover"],
    seo: {
      title: "Nephite Christmas Bundle | Book + Coloring & Activity Book",
      description:
        "The Nephite Christmas hardcover plus its Coloring & Activity Book: mazes, puzzles and coloring pages that keep the story going all season.",
    },
  },

  // §3.5
  {
    id: productId(HANDLES.ncBundleOrnament),
    handle: HANDLES.ncBundleOrnament,
    kind: "bundle",
    holiday: "christmas",
    title: "Nephite Christmas Bundle with Ornament",
    shortTitle: "Bundle with Ornament",
    subtitle: "Storybook + Coloring & Activity Book + star ornament",
    cardBlurb:
      "Everything for a Nephite Christmas, in one gift: the hardcover storybook, the Coloring & Activity Book, and the star ornament.",
    description:
      "Everything for a Nephite Christmas, in one gift: the hardcover storybook, the Coloring & Activity Book, and the star ornament. Hang the ornament as a keepsake, or hide it on the tree each night and let the kids seek the star, like the wise men of old. It’s a tradition that fills the whole season with the story of the Savior’s birth.",
    highlights: [
      "Nephite Christmas, hardcover with dust jacket",
      "Nephite Christmas Coloring & Activity Book, softcover",
      "Nephite Christmas Star Ornament",
    ],
    specs: [
      { label: "Format", value: "Hardcover + softcover + ornament" },
      { label: "Ages", value: "3–10" }, // CONFIRM (§5, item 22)
      { label: "Shipping", value: "Ships together" },
    ],
    ageRange: "3–10", // CONFIRM (§5, item 22)
    badge: "Gift-ready",
    images: [
      img.bundleGiftSet,
      img.ncGiftSetCutout,
      img.ncFlatlay,
      img.ncCover,
      img.coloringBook,
      img.ornamentStar,
    ],
    options: [],
    // Sum of parts ($24.99 + $7.99 + $2.99): no compare-at (copy deck §3.0 note; §5, item 1).
    variants: onlyVariant(HANDLES.ncBundleOrnament, {
      title: "Hardcover + activity book + ornament",
      price: 35.97,
      components: [
        component(HANDLES.nephiteChristmas),
        component(HANDLES.coloringBook, COLORING_PRINTED),
        component(HANDLES.starOrnament),
      ],
    }),
    ratings: [NC_RATING_FOR_BUNDLES],
    // Not the Complete Set: it also contains Nephite Christmas, so adding it here would double the book.
    pairsWith: [HANDLES.doveOrnament, HANDLES.nativityCraft, HANDLES.easterJourney],
    tags: ["books-sets", "christmas", "hardcover"],
    seo: {
      title: "Nephite Christmas Gift Bundle with Ornament",
      description:
        "The Nephite Christmas hardcover, Coloring & Activity Book and star ornament in one gift. Hide the star on the tree and let the kids seek it all season.",
    },
  },

  // §3.6
  {
    id: productId(HANDLES.coloringBook),
    handle: HANDLES.coloringBook,
    kind: "activity",
    holiday: "christmas",
    title: "Nephite Christmas Coloring & Activity Book",
    shortTitle: "Coloring & Activity Book",
    subtitle: "Join Jacob for a Nephite Christmas adventure",
    // §2.9 add-on line
    cardBlurb:
      "13 puzzles and games plus 12 coloring pages. Help Jacob find Nephi, decode a secret message, and more.", // CONFIRM print matches PDF (§5, item 27)
    description:
      "Help Jacob find Nephi, guide the wise men to the star, and decode a secret message from the prophet. This companion to Nephite Christmas is packed with puzzles, mazes and coloring pages drawn from the storybook’s scenes. It keeps little hands busy and the story of Christ’s birth close all season long.",
    highlights: [
      "13 activity pages: Decode Nephi’s Message, Help the Wise Men Follow the Star, two connect-the-dots, Unscramble the Letters, Seek and Find, Help Jacob Find Nephi, Spot 10 Differences, I Spy, a Christmas fill-in-the-blank story, a word search, picture riddles and A Missing Prophet Mystery logic puzzle",
      "12 coloring pages drawn from the storybook",
      "An answer key",
      "A full-color cover starring Jacob",
    ],
    specs: [
      { label: "Format", value: "Printed softcover or PDF download" },
      { label: "Size", value: "8.5″ × 11″ (US Letter for the PDF)" },
      { label: "Pages", value: "25 activity and coloring pages + answer key" }, // CONFIRM print matches PDF (§5, item 27)
      { label: "Ages", value: "4–12; the mystery puzzle suits ages 8–12" }, // CONFIRM (§5, item 22)
    ],
    ageRange: "4–12", // CONFIRM (§5, item 22)
    badge: "Pairs with the book",
    // images[0] = printed cover, images[1] = PDF cover (use it when the PDF variant is selected).
    images: [
      img.coloringBook,
      img.coloringBookPdf,
      img.coloringPage2,
      img.coloringPage3,
      img.coloringPage4,
      img.coloringPage5,
      img.childColoring,
    ],
    options: [{ name: "Format", values: ["Printed", "PDF Download"] }],
    variants: [
      {
        id: COLORING_PRINTED,
        title: "Printed",
        availableForSale: true,
        requiresShipping: true,
        price: money(7.99),
        compareAtPrice: null,
        selectedOptions: [{ name: "Format", value: "Printed" }],
      },
      {
        id: COLORING_PDF,
        title: "PDF Download",
        availableForSale: true,
        requiresShipping: false,
        price: money(5.99), // CONFIRM (§5, item 1)
        compareAtPrice: null,
        selectedOptions: [{ name: "Format", value: "PDF Download" }],
      },
    ],
    ratings: [],
    pairsWith: [HANDLES.nephiteChristmas, HANDLES.nativityCraft, HANDLES.starOrnament],
    // Shown for the PDF Download variant.
    usageNote: DIGITAL_TERMS,
    tags: ["gifts-add-ons", "instant-downloads", "christmas", "pdf"],
    seo: {
      title: "Nephite Christmas Coloring & Activity Book for Kids",
      description:
        "Mazes, puzzles and 12 coloring pages from Nephite Christmas. Help Jacob find Nephi and guide the wise men to the star. Printed book or printable PDF.",
    },
  },

  // §3.7
  {
    id: productId(HANDLES.starOrnament),
    handle: HANDLES.starOrnament,
    kind: "ornament",
    holiday: "christmas",
    title: "Nephite Christmas Star Ornament", // CONFIRM rename from "Nephite Christmas Ornament" (§5, item 28)
    shortTitle: "Star Ornament", // CONFIRM rename (§5, item 28)
    subtitle: "A keepsake for the tree, and a seek-the-star game",
    // §2.9 add-on line
    cardBlurb: "Hide it on the tree each night and let the kids seek the star, like the wise men of old.",
    description:
      "A white ornament with a gold star, inspired by the new star in Nephite Christmas. Hang it as a keepsake, or hide it on the tree each night and let the kids seek the star, like the wise men of old. It’s a small, daily reminder of the light of Christ.", // CONFIRM design description (§5, item 28)
    highlights: [
      "White round ornament with a gold star design", // CONFIRM (§5, item 28)
      "Ready to hang", // CONFIRM (§5, item 28)
    ],
    // CONFIRM: size and material pending (§5, item 28); no specs rows until known.
    specs: [],
    badge: "Under $3",
    images: [img.ornamentStar, img.ornamentStarPhoto],
    options: [],
    variants: onlyVariant(HANDLES.starOrnament, { title: "Star ornament", price: 2.99 }),
    ratings: [],
    pairsWith: [HANDLES.nephiteChristmas, HANDLES.doveOrnament],
    tags: ["gifts-add-ons", "christmas"],
    seo: {
      title: "Nephite Christmas Star Ornament | Christmas Keepsake",
      description:
        "A white and gold star ornament inspired by Nephite Christmas. Hide it on the tree and let the kids seek the star like the wise men.",
    },
  },

  // §3.8
  {
    id: productId(HANDLES.doveOrnament),
    handle: HANDLES.doveOrnament,
    kind: "ornament",
    holiday: "christmas",
    title: "Nephite Christmas Peace Dove Ornament",
    shortTitle: "Peace Dove Ornament",
    subtitle: "Hide the dove, find the peace",
    // §2.9 add-on line
    cardBlurb:
      "A white dove with star cutouts, a gold ribbon and a card that turns it into a family hide-and-seek tradition.",
    description:
      "A smooth white dove with tiny star-shaped cutouts and a radiant central star, just like the dove hidden throughout Nephite Christmas. It comes with a gold ribbon and a message card that invites your family to hide the dove in the tree and take turns finding it. A gentle reminder that peace is something we can always seek, and always find, in Christ.",
    highlights: [
      "White dove ornament with star cutouts and a central star",
      "Shimmering gold ribbon for hanging",
      "Includes a message card for a hide-the-dove family tradition",
    ],
    perfectFor: [
      "Christ-centered family traditions",
      "Pairing with the picture book",
      "Neighbor gifts, ministering gifts and stocking stuffers",
    ],
    // CONFIRM: size and material pending (§5, item 28); no specs rows until known.
    specs: [],
    badge: "Under $3",
    images: [img.ornamentDove],
    options: [],
    variants: onlyVariant(HANDLES.doveOrnament, { title: "Peace dove ornament", price: 2.99 }),
    ratings: [],
    pairsWith: [HANDLES.nephiteChristmas, HANDLES.starOrnament],
    tags: ["gifts-add-ons", "christmas"],
    seo: {
      title: "Peace Dove Christmas Ornament | Nephite Christmas",
      description:
        "A white dove ornament with star cutouts and a gold ribbon, plus a card for a hide-the-dove family tradition. Inspired by the dove in Nephite Christmas.",
    },
  },

  // §3.9
  {
    id: productId(HANDLES.nativityCraft),
    handle: HANDLES.nativityCraft,
    kind: "activity",
    holiday: "christmas",
    title: "Nephite Christmas Nativity Craft (PDF)",
    shortTitle: "Nativity Craft (PDF)",
    subtitle: "A color-your-own nativity from Bethlehem and ancient America",
    // §2.9 add-on line
    cardBlurb:
      "Print, color, cut and stand up your own nativity, with Nephi and a Nephite family beside Mary, Joseph and baby Jesus.",
    description:
      "Print, color, cut and stand up your own nativity set. Alongside baby Jesus, Mary, Joseph, the wise men and a shepherd, you’ll find the prophet Nephi, a Nephite family, a Nephite temple and the Christmas star. Kids build the scene with their own hands and tell the story of Christ’s birth from both sides of the world.",
    highlights: [
      "Baby Jesus, Mary and Joseph",
      "Three wise men",
      "A shepherd with sheep",
      "Nativity animals, including a donkey and an ox",
      "The Nephite prophet and a Nephite family",
      "A Nephite temple and the Christmas star",
      "Step-by-step assembly instructions and stand templates",
    ],
    perfectFor: [
      "Family home evening",
      "Primary classes or sharing time",
      "Christmas Eve activities",
      "Craft time with grandkids",
      "Ward party craft tables",
      "Homeschool or classroom lessons",
    ],
    specs: [
      { label: "Format", value: "12-page printable PDF" },
      { label: "Paper", value: "Print on cardstock" },
      { label: "Delivery", value: "Instant download" },
      { label: "Ages", value: "4+ with grown-up help for cutting" }, // CONFIRM (§5, item 22)
    ],
    ageRange: "4+", // CONFIRM (§5, item 22)
    badge: "Instant download",
    images: [
      img.nativityKit,
      img.nativityHolyFamily,
      img.nativityNephiFamily,
      img.nativityJacobDad,
      img.nativityInstructions,
    ],
    options: [],
    variants: onlyVariant(HANDLES.nativityCraft, {
      title: "Printable PDF",
      price: 2.99,
      requiresShipping: false,
    }),
    ratings: [],
    pairsWith: [HANDLES.nephiteChristmas, HANDLES.coloringBook, HANDLES.ncDigitalBundle],
    usageNote: DIGITAL_TERMS,
    tags: ["gifts-add-ons", "instant-downloads", "christmas", "pdf"],
    seo: {
      title: "Printable Nativity Craft | Nephite Christmas PDF",
      description:
        "A color-your-own printable nativity with Mary, Joseph, baby Jesus, the wise men, and the prophet Nephi, a Nephite family and temple. Instant download.",
    },
  },

  // §3.10
  {
    id: productId(HANDLES.ncPdf),
    handle: HANDLES.ncPdf,
    kind: "digital",
    holiday: "christmas",
    title: "Nephite Christmas (PDF Edition)",
    shortTitle: "Nephite Christmas (PDF)",
    subtitle: "The whole book, ready for the big screen",
    // §2.9 add-on line
    cardBlurb:
      "The whole book on your TV or tablet, perfect for ward parties, Primary and Christmas Eve. Instant download.",
    description:
      "The complete Nephite Christmas picture book as an instant download, in two versions: single pages for a tablet and full two-page spreads for a TV or projector. It’s perfect for ward parties, Primary lessons, family gatherings or a cozy last-minute Christmas Eve. Share the story of that first Christmas night with everyone in the room.",
    highlights: [
      "Single-page version, for reading on a phone or tablet",
      "Two-page spread version, for TVs, projectors and presentations",
      "Every illustration and rhyme from the hardcover",
    ],
    specs: [
      { label: "Format", value: "PDF download" },
      { label: "Versions", value: "2 (single pages and full spreads)" },
      { label: "Ages", value: "3–10" }, // CONFIRM (§5, item 22)
      { label: "Files", value: "Large, high-resolution files" }, // CONFIRM final file sizes
    ],
    ageRange: "3–10", // CONFIRM (§5, item 22)
    badge: "Instant download",
    images: [img.ncPdf, img.ncUnbelieversSpread, img.ncNativitySpread, img.ncPageVillageNight],
    options: [],
    variants: onlyVariant(HANDLES.ncPdf, { title: "PDF download", price: 6.99, requiresShipping: false }),
    ratings: [],
    pairsWith: [HANDLES.nativityCraft, HANDLES.ncDigitalBundle, HANDLES.nephiteChristmas],
    usageNote: BOOK_PDF_TERMS,
    tags: ["instant-downloads", "christmas", "pdf"],
    seo: {
      title: "Nephite Christmas PDF | Instant Download",
      description:
        "Download Nephite Christmas instantly, with single pages for tablets and full spreads for the TV. Perfect for ward parties, Primary and Christmas Eve.",
    },
  },

  // §3.11
  {
    id: productId(HANDLES.ejPdf),
    handle: HANDLES.ejPdf,
    kind: "digital",
    holiday: "easter",
    title: "Easter Journey (PDF Edition)",
    shortTitle: "Easter Journey (PDF)",
    subtitle: "The Holy Week journey, ready for any screen",
    cardBlurb:
      "The complete Easter Journey as an instant download, with single pages for any device and full spreads for a TV or projector.",
    description:
      "The complete Easter Journey as an instant download, with single pages for any device and full spreads for a TV or projector. Walk the streets of Jerusalem, meet the people whose lives were changed by the Savior, and use the 8-day advent and seek-and-find together. Begin your family’s Easter Journey today, wherever you are.",
    highlights: [
      "Single-page version, for phones and tablets",
      "Full-spread version, for large screens and presentations",
      "The 8-day Easter Journey Advent and the symbols-of-Christ seek-and-find",
    ],
    specs: [
      { label: "Format", value: "PDF download" },
      { label: "Pages", value: `${EJ_PAGES} pages` }, // CONFIRM (§5, item 21)
      { label: "Versions", value: "2 (single pages and full spreads)" },
      { label: "Ages", value: "5–12 · great for the whole family" }, // CONFIRM (§5, item 22)
    ],
    ageRange: "5–12", // CONFIRM (§5, item 22)
    badge: "Instant download",
    images: [img.ejPdf, img.ejTombSpread, ejPeek[4].image, ejPeek[5].image],
    options: [],
    variants: onlyVariant(HANDLES.ejPdf, { title: "PDF download", price: 8.99, requiresShipping: false }),
    ratings: [],
    pairsWith: [HANDLES.easterJourney, HANDLES.puzzle],
    usageNote: BOOK_PDF_TERMS,
    tags: ["instant-downloads", "easter", "pdf"],
    seo: {
      title: "Easter Journey PDF | Holy Week Instant Download",
      description:
        "Download Easter Journey instantly: an illustrated Holy Week journey through Jerusalem with an 8-day advent. Single pages and full spreads included.",
    },
  },

  // §3.12
  {
    id: productId(HANDLES.ncDigitalBundle),
    handle: HANDLES.ncDigitalBundle,
    kind: "digital",
    holiday: "christmas",
    title: "Nephite Christmas Digital Bundle",
    subtitle: "Storybook PDF + Coloring & Activity Book PDF + Nativity Craft",
    cardBlurb:
      "All three Nephite Christmas downloads in one click: the illustrated storybook, the Coloring & Activity Book, and the color-your-own Nativity Craft.",
    description:
      "All three Nephite Christmas downloads in one click: the illustrated storybook, the Coloring & Activity Book, and the color-your-own Nativity Craft. Read the story on the big screen, then print the activities and crafts as many times as you need. A whole Christmas season of reading, coloring and creating around the Savior’s birth.",
    highlights: [
      "Nephite Christmas PDF: single pages and full spreads",
      "Nephite Christmas Coloring & Activity Book PDF: 13 activities and 12 coloring pages",
      "Nephite Christmas Nativity Craft PDF: 12 pages with stand templates",
    ],
    perfectFor: ["Family home evening", "Primary classes", "Classroom lessons", "Last-minute Christmas plans"],
    specs: [
      { label: "Format", value: "3 PDF downloads" },
      { label: "Delivery", value: "Instant delivery by email" },
      { label: "Printing", value: "Print as often as you need" },
    ],
    badge: "Instant download",
    images: [img.digitalBundle, img.ncPdf, img.coloringBookPdf, img.nativityKit],
    options: [],
    // Sum of parts ($6.99 + $5.99 + $2.99): no compare-at (copy deck §3.0 note; §5, item 1).
    variants: onlyVariant(HANDLES.ncDigitalBundle, {
      title: "3 PDF downloads",
      price: 15.97,
      requiresShipping: false,
      components: [
        component(HANDLES.ncPdf),
        component(HANDLES.coloringBook, COLORING_PDF),
        component(HANDLES.nativityCraft),
      ],
    }),
    ratings: [],
    pairsWith: [HANDLES.nephiteChristmas, HANDLES.doveOrnament],
    // Includes the Nephite Christmas book PDF, so its extra lines apply here too.
    usageNote: BOOK_PDF_TERMS,
    tags: ["instant-downloads", "christmas", "pdf"],
    seo: {
      title: "Nephite Christmas Digital Bundle | 3 PDFs",
      description:
        "The Nephite Christmas storybook PDF, Coloring & Activity Book PDF and Nativity Craft in one instant download. Print as many times as you need.",
    },
  },

  // §3.13
  {
    id: productId(HANDLES.puzzle),
    handle: HANDLES.puzzle,
    kind: "gift",
    holiday: "easter",
    title: "The Promised Messiah: An Easter Journey Puzzle",
    shortTitle: "The Promised Messiah Puzzle",
    subtitle: "252 pieces · 14″ × 11″",
    // §2.9 add-on line
    cardBlurb: "252 pieces of Kelley Hicken’s painting of the Savior before the walls of Jerusalem.",
    description:
      "Gather around the table this Easter and piece together Kelley Hicken’s painting of the Savior, scroll in hand, before the walls of Jerusalem. The finished puzzle measures 14″ × 11″ with 252 sturdy chipboard pieces, in a gift-ready box that shows the picture. As each piece fits into place, remember the joy and promise of His Resurrection.",
    highlights: [
      "252 chipboard pieces",
      "Finished size 14″ × 11″",
      "Gift box 9.25″ × 7.4″ × 2″ featuring the artwork",
      "100% chipboard and paper",
      "Ages 9+", // CONFIRM (§5, item 22)
      "Made to order; ships separately", // CONFIRM ship time in business days (§5, item 29)
    ],
    specs: [
      { label: "Pieces", value: "252 chipboard pieces" },
      { label: "Finished size", value: "14″ × 11″" },
      { label: "Box", value: "9.25″ × 7.4″ × 2″, featuring the artwork" },
      { label: "Material", value: "100% chipboard and paper" },
      { label: "Ages", value: "9+" }, // CONFIRM (§5, item 22)
      { label: "Fulfillment", value: "Made to order; ships separately" }, // CONFIRM ship time (§5, item 29)
      { label: "Care", value: "Wipe gently with a clean, dry microfiber cloth." },
    ],
    ageRange: "9+", // CONFIRM (§5, item 22)
    badge: "Made to order", // CONFIRM (§5, item 29)
    images: [img.puzzle1, img.puzzle2, img.puzzle3],
    options: [],
    variants: onlyVariant(HANDLES.puzzle, { title: "14″ × 11″, 252 pieces", price: 24.99 }), // CONFIRM price (§5, item 1)
    ratings: [],
    pairsWith: [HANDLES.easterJourney, HANDLES.canvas],
    tags: ["gifts-add-ons", "easter", "made-to-order"],
    seo: {
      title: "The Promised Messiah Easter Puzzle | 252 Pieces",
      description:
        "A 252-piece Easter puzzle of the Savior before the walls of Jerusalem, painted by Kelley Hicken for Easter Journey. Gift-ready box.", // CONFIRM ship time (§5, item 29)
    },
  },

  // §3.14
  {
    id: productId(HANDLES.canvas),
    handle: HANDLES.canvas,
    kind: "gift",
    holiday: "easter",
    title: "He Spoke My Name Canvas Print",
    shortTitle: "He Spoke My Name Canvas",
    subtitle: "10″ × 8″ canvas from Easter Journey",
    // §2.9 add-on line
    cardBlurb: "The moment Mary hears Him speak her name, on a 10″ × 8″ canvas.",
    description:
      "On that first Easter morning, Mary stood weeping until she heard Him speak her name. This canvas captures that moment of joy and recognition from Easter Journey, a reminder that the Savior lives and knows each of us by name. Display it for Easter or all year long as a symbol of hope and the promise of the Resurrection.",
    highlights: [
      "10″ × 8″ horizontal canvas, 0.75″ deep",
      "100% polyester canvas with bright, crisp color",
      "Pinewood frame",
      "Assembled in the USA",
      // CONFIRM: "Hanging hardware" bullet omitted until known (§5, item 29).
      "Made to order; ships separately", // CONFIRM ship time in business days (§5, item 29)
    ],
    specs: [
      { label: "Size", value: "10″ × 8″ horizontal, 0.75″ deep" },
      { label: "Canvas", value: "100% polyester canvas with bright, crisp color" },
      { label: "Frame", value: "Pinewood" },
      { label: "Made in", value: "Assembled in the USA" },
      { label: "Fulfillment", value: "Made to order; ships separately" }, // CONFIRM ship time (§5, item 29)
      { label: "Care", value: "If the canvas gathers dust, wipe it gently with a clean, damp cloth." },
    ],
    badge: "Made to order", // CONFIRM (§5, item 29)
    images: [img.canvas1, img.canvas2, img.canvas3, img.canvas4],
    options: [],
    variants: onlyVariant(HANDLES.canvas, { title: "10″ × 8″ horizontal, 0.75″ deep", price: 24.99 }), // CONFIRM price (§5, item 1)
    ratings: [],
    pairsWith: [HANDLES.easterJourney, HANDLES.puzzle],
    tags: ["gifts-add-ons", "easter", "made-to-order"],
    seo: {
      title: "He Spoke My Name Canvas | Mary & the Risen Christ",
      description:
        "A 10″ × 8″ canvas of Mary Magdalene recognizing the risen Savior, from Easter Journey by Kelley Hicken. A reminder of hope all year long.",
    },
  },
];
