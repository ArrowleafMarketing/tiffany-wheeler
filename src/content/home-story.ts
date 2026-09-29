// Homepage story sections: why families love it (§2.5), peek inside (§2.6) and
// video (§2.7) from docs/copy-deck.md. Copy is verbatim; "[CONFIRM]" tags are
// stripped and tracked with `// CONFIRM` comments (see copy deck §5).
// Review-derived copy (the §2.5 proof line, §2.8) lives in src/content/reviews.ts.

import { doveCopy } from "@/content/home-top";

// ── §2.5 Why families love Nephite Christmas (with the best of §2.10) ───────

export type Reason = {
  /** Icon key; the section maps it to a lucide icon. */
  icon: "rhythm" | "dove" | "night" | "christmas-eve";
  title: string;
  line: string;
};

export const whyFamilies = {
  heading: "Why families love Nephite Christmas",
  reasons: [
    {
      icon: "rhythm",
      title: "It reads like the poem you already know",
      line: "Rhyming couplets in the rhythm of ’Twas the Night Before Christmas make it easy to read aloud and fun to hear.",
    },
    {
      icon: "dove",
      title: "Kids hunt for the hidden dove",
      // CONFIRM: “every page” (copy deck §5, item 23); gated on CLAIMS.doveOnEveryPage.
      line: doveCopy.reason,
    },
    {
      icon: "night",
      title: "The same holy night, across the sea",
      line: "Samuel’s sign, Nephi’s prayer and a night with no darkness, from 3\u00a0Nephi\u00a01: the night before the Savior was born.",
    },
    // §2.10 "How families use it", folded in: its strongest use case.
    {
      icon: "christmas-eve",
      title: "Made for your Christmas Eve program",
      // U+00A0 keeps "Luke 2" together.
      line: "Read it after the Bethlehem story in Luke\u00a02, and let the kids act out the watching believers and the night with no darkness.",
    },
  ] satisfies Reason[],
  /** The other §2.10 use cases, as one line under the list. */
  alsoFor: "Families also read it for family home evening, at Primary and ward Christmas parties, and as a gift from Grandma and Grandpa.",
  imageAlt: "Jacob, a Nephite boy in a red headband, drawing on a tablet",
} as const;

// ── §2.6 Peek inside ─────────────────────────────────────────────────────────

export const peekInside = {
  heading: "Take a peek inside",
  intro: "Every spread is painted by Idaho illustrator Kelley Hicken. Here are a few favorite pages.",
  tablistLabel: "Choose a book",
  /** Accessible name of each carousel region. */
  carouselTitle: (bookTitle: string) => `Inside ${bookTitle}`,
  /** CTA under the carousel: the Complete Set. The price comes from the catalog. */
  cta: (price: string) => `Get Both Books — ${price}`, // CONFIRM price (§5, item 1)
  secondaryLink: "Or shop each book",
} as const;

/** Carousel microcopy (§2.6), shared by every PeekInsideCarousel. */
export const carouselCopy = {
  previous: "Previous spread",
  next: "Next spread",
  position: (n: number, total: number) => `Spread ${n} of ${total}`,
  /** Phones: a spread split into two single-page slides. */
  pagePosition: (n: number, total: number, side: "left" | "right") => `Spread ${n} of ${total}, ${side} page`,
  mobileHint: "Swipe to turn the page →",
} as const;

// ── §2.7 Video ───────────────────────────────────────────────────────────────

/**
 * WebVTT caption files (copy deck §5, item 11). The player renders a
 * `<track kind="captions">` for each one that is set.
 * TODO(client): nobody has transcribed the audio yet, so neither file exists.
 * Add public/video/trailer.en.vtt and public/video/readaloud.en.vtt, then set
 * the paths below. (A config value, not a file-system check: public/ isn't
 * available to the server at runtime on Vercel.)
 */
export const videoCaptions: { trailer: string | null; readAloud: string | null; label: string; srcLang: string } = {
  trailer: null, // "/video/trailer.en.vtt"
  readAloud: null, // "/video/readaloud.en.vtt"
  label: "English",
  srcLang: "en",
};

export const trailer = {
  heading: "Watch families read it by the fire",
  sub: "Grandmas, moms and kids gathered around Nephite Christmas. (0:16)",
  /** Accessible name of the <video> element, and the analytics title. */
  videoTitle: "Nephite Christmas trailer",
  playLabel: "Play Video",
  playAriaLabel: "Play a 16-second preview of the Nephite Christmas trailer, with sound",
  posterAlt: "A mother and her children read Nephite Christmas together by the fireplace",
  /**
   * Visible text description (WCAG 1.2.3), written from the shot list in
   * docs/discovery/videos-printables.md §1.2.
   */
  /** The site serves a 16-second cut (public/video/trailer-preview-*.mp4); the end card shows when it ends. */
  endCard: {
    line: "Start the tradition this Christmas Eve.",
    product: (title: string, price: string) => `${title} — ${price}`,
  },
  endCardLabel: "The trailer preview has ended",
  replay: "Watch again",
  /** Call to action under the videos. */
  cta: {
    lookInside: "Look inside the book",
  },
  description: {
    title: "About this video",
    body: "In this trailer, families read Nephite Christmas by a glowing fireplace: grandmothers in armchairs with their granddaughters, a mom with three kids on the carpet, and another mom laughing with her toddler. The camera shows the night-blue cover and a few illustrated pages up close.",
  },
} as const;

/**
 * Read-aloud excerpt. The deck's copy names Tiffany as the reader, but that is
 * unconfirmed (copy deck §5, item 11; public/video/README.md, open item 1), so
 * the neutral copy renders until `readerConfirmed` is flipped.
 */
export const readAloud = {
  // CONFIRM: is the reader in IMG_3989 Tiffany, and may we use the clip? (§5, item 11)
  readerConfirmed: false,
  /** Deck copy (§2.7), for use once confirmed. */
  confirmed: {
    heading: "Hear Tiffany read it", // CONFIRM it’s Tiffany in the video
    sub: "Pull up a chair. Author Tiffany Wheeler reads the opening pages aloud.", // CONFIRM
    posterAlt: "Tiffany Wheeler reads Nephite Christmas aloud in front of her fireplace", // CONFIRM
  },
  /** Neutral stand-in: the deck's copy without the unconfirmed reader claim. */
  neutral: {
    heading: "Hear it read aloud",
    sub: "Pull up a chair and listen to the opening pages.",
    posterAlt: "A woman holds up Nephite Christmas in front of a fireplace, ready to read it aloud",
  },
  videoTitle: "Nephite Christmas read-aloud excerpt",
  /** readaloud-clip.mp4 runs 42.8s. */
  duration: "0:43",
  durationSpoken: "43 seconds",
  playLabel: "Play Video",
  playAriaLabel: (durationSpoken: string) =>
    `Play a read-aloud of the opening pages of Nephite Christmas, ${durationSpoken}, with sound`,
  /** Optional end card (§2.7). The price comes from the catalog. */
  endCard: {
    line: "Finish the story at home.",
    product: (title: string, price: string) => `${title} — ${price}`,
  },
  replay: "Watch again",
  /** Accessible name of the end card, which receives focus when the clip ends. */
  endCardLabel: "The read-aloud has ended",
  /**
   * Transcript (WCAG 1.2.1 / 1.2.2 stand-in until captions exist). The reading
   * is the book's own opening text from docs/discovery/book-text/nephite-christmas.txt;
   * the clip's timing (public/video/README.md) covers the opening page and the
   * first two spreads, and stops before the right-hand page of the third.
   */
  transcript: {
    summary: "Read the transcript",
    note: "The reader first holds up the cover, says a few words about the book and opens it to the title page. That short introduction isn’t transcribed yet. Then she reads the opening pages, which are the book’s own words:",
    lines: [
      "’Twas the night before Christmas, and all through the land…",
      "…the wicked were threatening, the time was at hand.",
      "For Samuel the prophet said the sign would soon come, but the wait had just gotten too long for some.",
      "The believers all hoped it would come any day. For the sign to appear, they continued to pray.",
    ],
  },
} as const;

export function readAloudCopy() {
  return readAloud.readerConfirmed ? readAloud.confirmed : readAloud.neutral;
}
