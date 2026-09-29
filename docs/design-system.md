# Design system

**Direction:** keep the warmth of the approved mockup (cream paper, deep navy serif headlines, forest-green buttons, a butter-yellow bundle bar with an orange button, soft rounded cards) and add Tiffany's own brand: the butterfly logo plus periwinkle accents. Christmas sections add a night-blue and gold accent, and Easter sections add sunrise and olive. The feel is cozy, reverent and well made, like a keepsake picture book. It should never feel loud or like a discount site.

The tokens live in `src/app/globals.css` (Tailwind v4 `@theme`). Always use the token utilities (`bg-cream`, `text-ink`, `bg-forest`, and so on) instead of raw hex values.

## Color

| Token | Use |
|---|---|
| `cream` / `cream-deep` | Page background, alternate section bands |
| `paper` | Cards, drawers, inputs |
| `line` | Hairline borders (`border-line`) |
| `ink` | Headings, prices, strong text |
| `body` | Paragraph text |
| `muted` | Secondary text; contrast is at least 4.5:1 on cream |
| `forest` (+`-dark`, `-light`) | **Primary action** (Add to Cart), success states, checkmarks |
| `ember` (+`-dark`, `-light`) | **Bundle/best-value action** ("Get Both Books"), savings pills. Use sparingly: at most one ember button in view. |
| `butter` / `butter-deep` | Complete Set bar, highlight bands, announcement bar |
| `periwinkle` (+`-text`, `-light`) | Brand accent: eyebrows, links, focus rings, small icons. Use `periwinkle-text` for text. |
| `star` | Rating stars only |
| `night` / `night-light` / `gold` | Christmas story sections (the Nephite Christmas cover is deep indigo). Gold text on night. |
| `sunrise` / `olive` | Easter Journey sections |
| `berry` | Tiny Christmas accents (a bow, a badge). Not for buttons. |

## Type

- **Display:** Fraunces (`font-display`), soft axis on and weight 600. Use it for H1–H3, prices and the product titles on cards.
  - H1 is `text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.015em]`.
  - H2 comes from `SectionHeading`.
- **Body / UI:** Figtree (`font-sans`). Body text is 16–18px, with `leading-relaxed` for paragraphs.
- **Hand:** Caveat (`font-hand`). Use it only for eyebrows and small margin notes ("Find the hidden dove!", "Small books. Big hearts."). Never use it for body text or buttons.

## Shape and depth

- **Cards:** `rounded-(--radius-card) bg-paper border border-line shadow-soft`. Use `shadow-lift` on hover or for featured items.
- **Buttons:** `rounded-(--radius-btn)`. Minimum height is 48px (`md`); hero and buy boxes use `lg` (56px).
- **Book covers:** always use `<BookCover>`. It adds the spine, page edge and `shadow-book`, so no flat rectangles.
- **Section rhythm:** `py-14 sm:py-20`. Alternate `bg-cream`, `bg-paper` and `bg-cream-deep` bands. Soft wave dividers are welcome as inline SVG.

## Components to reuse (in `src/components/ui`, `src/components/product`)

- `Button` / `ButtonLink` / `buttonClasses()`: variants `primary | accent | outline | ghost | night`, sizes `sm | md | lg`, and a `block` prop.
- `Price`: honest strike-through. It only shows compare-at when it's higher, and it has optional "Save $X".
- `Stars`: accessible star rating.
- `Badge`: tones `ember | forest | butter | periwinkle | night | neutral`.
- `SectionHeading`: eyebrow (hand font), title, subtitle, `align`, `inverted`.
- `Img` (`@/components/ui/img`): next/image for commerce `Image` values. It always needs a `sizes` prop. `fromStatic()` (`@/lib/images`) turns a static import into an `Image`.
- `BookCover`: hardcover rendering of a flat cover, with optional `tilt`.
- Icons come from `lucide-react` (v1). Check that an export exists before using it. Lucide has no brand logos, so draw social icons as small inline SVGs.

## Imagery

- Real family photos and the book's own art only. No stock photos and no AI people.
- Put the family video stills (`src/assets/images/lifestyle/family-*.jpg`) next to reviews and "how families use it" copy.
- Peek-inside spreads use the actual pages. On phones, prefer the single-page crops in `peek/mobile/`.
- Every image needs a real `alt` (see `src/assets/images/README.md`). Decorative accents such as the dove, lamp, olive and palm use `alt=""`.

## Conversion rules (non-negotiable)

1. One primary action per view. Price and stars sit next to every buy button.
2. No fake urgency. Deadlines come from `getCurrentSeason()` (real order-by dates only), and there are no countdown timers that reset.
3. A strike-through price only when it's real: `compareAtPrice` must be the sum of the separate prices or a genuine former price.
4. Mobile first, because Meta ad traffic arrives on phones in an in-app browser:
   - Tap targets are at least 44px.
   - Keep the page free of layout shift: images have fixed aspect ratios.
   - Load only the hero image eagerly (`preload`), and lazy-load everything else.
5. Every section works without JavaScript except the cart and carousels. Client components should be small islands.
6. Accessibility: visible focus, semantic landmarks, one `h1` per page, labelled controls, and `prefers-reduced-motion` respected.
7. Copy comes from `docs/copy-deck.md`. Keep `[CONFIRM]` claims visually identical but tracked in `src/content` with a `// CONFIRM` comment.
