// Homepage copy for §2.9–§2.14 (docs/copy-deck.md), verbatim. "[CONFIRM]" tags
// are stripped from the strings and tracked with a `// CONFIRM` comment (§5).
// Numbers that live in store-config are interpolated so copy and cart agree.

import type { StaticImageData } from "next/image";
import { BULK_DISCOUNT, CLAIMS, CONTACT_EMAIL, HANDLES, HANDLING_TIME, SHIPS_FROM, productPath } from "@/lib/store-config";

import family08 from "@/assets/images/lifestyle/family-08.jpg";
import kelleyHicken from "@/assets/images/people/kelley-hicken.jpg";
import tiffanyPortrait from "@/assets/images/people/tiffany-portrait.jpg";

// The four free printables in the Family Activity Pack (772×1000 page previews).
import cubeDove from "@/assets/images/printables/cube-dove.jpg";
import familyPraying from "@/assets/images/printables/family-praying.jpg";
import nephiPreaching from "@/assets/images/printables/nephi-preaching.jpg";
import origamiDove from "@/assets/images/printables/origami-dove.jpg";

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const spelled = (n: number) => NUMBER_WORDS[n] ?? String(n);

const bulkMin = BULK_DISCOUNT.minBooks;
const bulkPct = BULK_DISCOUNT.percent;
/** Bulk-discount lines only while that discount exists in Shopify (CLAIMS.bulkDiscount). */
const BULK = CLAIMS.bulkDiscount;

// ── §2.9 Make it a tradition ────────────────────────────────────────────────

export const addOnsCopy = {
  title: "Make it a tradition",
  subtitle: "Little extras that keep the story going all season.",
  /** Display order: the impulse-priced extras first. */
  handles: [
    HANDLES.starOrnament,
    HANDLES.doveOrnament,
    HANDLES.coloringBook,
    HANDLES.nativityCraft,
    HANDLES.ncPdf,
    HANDLES.puzzle,
    HANDLES.canvas,
  ],
};

// ── §2.10 How families use it ───────────────────────────────────────────────

export type UseCaseIcon = "christmas-eve" | "home" | "ward" | "gift";

export const howFamiliesUseCopy = {
  title: "How families use Nephite Christmas",
  image: {
    src: family08,
    alt: "Family reading Nephite Christmas together on the floor in front of a fireplace",
  },
  items: [
    {
      icon: "christmas-eve",
      title: "Christmas Eve program",
      line: "Read it after the Bethlehem story in Luke 2, and let the kids act out the watching believers and the night with no darkness.",
    },
    {
      icon: "home",
      title: "Family home evening",
      line: "It reads aloud in under five minutes, and then the dove hunt, the coloring book and the nativity craft keep the lesson going.",
    },
    {
      icon: "ward",
      title: "Primary and ward activities",
      line: "Put the PDF on the big screen at a ward Christmas party, and set out nativity crafts at the craft table.",
    },
    {
      icon: "gift",
      title: "A gift from Grandma and Grandpa",
      line: `Send a copy to every grandchild’s home with a gift note in your own words.${BULK ? ` ${spelled(bulkMin)} or more books save ${bulkPct}%.` : ""}`, // CONFIRM bulk discount (§5, item 4)
    },
  ] satisfies { icon: UseCaseIcon; title: string; line: string }[],
};

// ── §2.11 Email capture ─────────────────────────────────────────────────────

export type Printable = { src: StaticImageData; label: string };

export const emailCaptureCopy = {
  section: {
    eyebrow: "Free printables",
    title: "Free: the Nephite Christmas Family Activity Pack",
    subtitle:
      "Fold an origami dove, build a paper cube dove, and color two scenes from the book: Nephi preaching and a family at prayer. Four printable pages, sent straight to your inbox.",
    inputLabel: "Email address",
    placeholder: "you@example.com",
    button: "Send My Free Pack",
    /**
     * Followed by a link to the Privacy Policy and a period. "Never sell", not
     * the deck's "never share": the policy lists the email service and Meta/Google
     * as recipients, so an absolute "never share" would contradict it.
     */
    finePrint:
      "We’ll email your printables right away, plus occasional notes from Tiffany about new books and holiday shipping dates. Unsubscribe anytime. We never sell your email. See our",
    privacyLabel: "Privacy Policy",
    privacyHref: "/privacy",
    success: "It’s on its way! Check your inbox for your Family Activity Pack.",
    successFollowUp: `While you’re here: Nephite Christmas ships from ${SHIPS_FROM} in ${HANDLING_TIME}.`, // CONFIRM handling time (§5, item 6)
    successCta: { label: "Shop Nephite Christmas", href: productPath(HANDLES.nephiteChristmas) },
    visualAlt:
      "The four printables: an origami dove, a cube dove, and coloring pages of Nephi preaching and a family praying",
    printables: [
      { src: origamiDove, label: "Origami Dove" },
      { src: cubeDove, label: "Cube Dove" },
      { src: nephiPreaching, label: "Nephi Preaching" },
      { src: familyPraying, label: "Family Praying" },
    ] satisfies Printable[],
  },
  /**
   * §2.11 popup variant, as a bottom sheet (EmailSheet). Same pack, same list.
   * The fine print is the section's.
   */
  sheet: {
    eyebrow: "Free printables",
    title: "A free Christmas activity pack for your family",
    subtitle: "Four printables from Nephite Christmas: two paper doves and two coloring pages.",
    inputLabel: "Email address",
    placeholder: "you@example.com",
    button: "Email Me the Pack",
    dismiss: "No thanks",
    close: "Close",
    /** After a successful signup. */
    done: "Keep Browsing",
  },
  /** Footer mini signup (§1.5). */
  compact: {
    title: "Free printables + holiday shipping reminders",
    inputLabel: "Email address",
    placeholder: "Your email",
    button: "Sign Up",
    success: "You’re in! Check your inbox.",
  },
  errors: {
    invalid: "Please enter a valid email address.",
    server: "Something went wrong on our end. Please try again in a moment.",
  },
};

// ── §2.12 Meet the author ───────────────────────────────────────────────────

export const meetAuthorCopy = {
  title: "Meet Tiffany",
  bio: "Hi, I’m Tiffany Wheeler. I live in Idaho’s Treasure Valley with my husband, John, and our six children. As a girl I spent summers biking to the library and reading beneath the lilac bushes. Now I write faith-filled stories that bring families closer to one another and to Jesus Christ. My mantra is “Enjoy the Journey.” I’m so glad our paths have crossed.",
  illustrator:
    "Both books are illustrated by Idaho artist Kelley Hicken, who believes creativity is inherent in every human being.",
  credential: "Named one of Idaho Business Review’s 2025 Women of the Year.", // CONFIRM she wants this used (§5)
  link: { label: "Read Tiffany’s story", href: "/about" },
  photo: { src: tiffanyPortrait, alt: "Tiffany Wheeler, author of Nephite Christmas and Easter Journey" },
  illustratorPhoto: { src: kelleyHicken, alt: "Kelley Hicken, illustrator" },
};

// ── §2.13 Bulk orders and where to find it ──────────────────────────────────

export type BulkCardIcon = "family" | "ward" | "store" | "find";

export const bulkCopy = {
  title: "Gifts for the whole family, or the whole ward",
  subtitle: BULK
    ? `Buy ${bulkMin} or more books and save ${bulkPct}% on each, applied automatically at checkout.` // CONFIRM bulk discount (§5, item 4)
    : `Sending copies to several homes, or ordering for a ward? Email ${CONTACT_EMAIL} and we’ll help.`,
  cards: [
    {
      icon: "family",
      title: "Grandparents and big families",
      line: BULK
        ? `Send a copy to every grandchild’s home. Mix and match titles; ${bulkMin}+ books save ${bulkPct}%.` // CONFIRM bulk discount (§5, item 4)
        : "Send a copy to every grandchild’s home, each with a gift note in your own words.",
      link: { label: "Shop the books", href: "/shop#books-sets" },
    },
    {
      icon: "ward",
      title: "Primary, ward and classroom",
      line: "Hardcovers for teachers, PDFs for the big screen, and nativity crafts for the craft table.",
      link: { label: "See instant downloads", href: "/shop#instant-downloads" },
    },
    {
      icon: "store",
      title: "Stores and gift shops",
      line: "Carry Nephite Christmas and the Coloring & Activity Book at wholesale prices (reseller permit required).",
      link: { label: "Apply for Wholesale", href: "/bulk-orders#wholesale" },
    },
    {
      icon: "find",
      title: "Find it in stores",
      // Text only: no logos and no outbound links.
      line: "Nephite Christmas is also carried by BYU Store, Eborn Books in Provo, Barnes & Noble in Sandy, and This Is the Place Bookstore in Palmyra, NY and Kirtland, OH.", // CONFIRM retailers still current (§5)
    },
  ] satisfies { icon: BulkCardIcon; title: string; line: string; link?: { label: string; href: string } }[],
  contactLead: "Questions about a large order? Email",
  contactEmail: CONTACT_EMAIL, // CONFIRM customer-service address (§5, item 32)
  /** Footer label (§1.5) reused for the link to the bulk page. */
  bulkLink: { label: "Bulk & Ward Orders", href: "/bulk-orders" },
  /** The homepage's one-line version (Christmas mode): the §2.13 heading as a question, then the link. */
  lineLead: "Gifts for the whole family, or the whole ward?",
};

// ── §2.14 FAQ ───────────────────────────────────────────────────────────────

export const faqSectionCopy = {
  title: "Questions? We’re here to help.",
};
