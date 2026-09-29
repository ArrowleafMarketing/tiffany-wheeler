import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { TrustStrip } from "@/components/product/trust-strip";
import { SHOP, type ShopSectionId } from "@/content/site";
import { getProducts, type Product } from "@/lib/commerce";
import { getCurrentSeason, type SeasonMode } from "@/lib/season";
import { HANDLES, SITE_URL, productPath } from "@/lib/store-config";

export const metadata: Metadata = {
  title: SHOP.title,
  description: SHOP.metaDescription,
  alternates: { canonical: "/shop" },
};

const shipsNothing = (p: Product) => p.variants.every((v) => !v.requiresShipping);

/**
 * Each product appears in exactly one section (first match wins), so the
 * page never repeats a card:
 *   Books & Sets        the hardcovers and bundles
 *   Gifts & Add-ons     Christmas extras that ship (activity book, ornaments)
 *   Instant Downloads   Christmas PDFs (nothing ships)
 *   Easter              the Easter extras (PDF, puzzle, canvas)
 */
const RULES: [ShopSectionId, (p: Product) => boolean][] = [
  ["books-sets", (p) => p.tags.includes("books-sets")],
  ["easter", (p) => p.holiday === "easter"],
  ["instant-downloads", (p) => shipsNothing(p)],
  ["gifts-add-ons", () => true],
];

/** Section order by season: last-minute Christmas leads with instant downloads; Easter season with Easter. */
function sectionOrder(mode: SeasonMode): ShopSectionId[] {
  if (mode === "easter") return ["books-sets", "easter", "gifts-add-ons", "instant-downloads"];
  if (mode === "christmas-last-minute") return ["books-sets", "instant-downloads", "gifts-add-ons", "easter"];
  return ["books-sets", "gifts-add-ons", "instant-downloads", "easter"];
}

/** Within Books & Sets: the season's book, the Complete Set, the other book, then the Christmas bundles. */
function booksOrder(featured: "christmas" | "easter"): string[] {
  const lead = featured === "easter" ? HANDLES.easterJourney : HANDLES.nephiteChristmas;
  const other = featured === "easter" ? HANDLES.nephiteChristmas : HANDLES.easterJourney;
  return [lead, HANDLES.completeSet, other, HANDLES.ncBundle, HANDLES.ncBundleOrnament];
}

function rank(order: string[], handle: string) {
  const i = order.indexOf(handle);
  return i === -1 ? order.length : i;
}

export default async function ShopPage() {
  const [products, season] = await Promise.all([getProducts(), getCurrentSeason()]);

  const groups = new Map<ShopSectionId, Product[]>();
  for (const product of products) {
    const [id] = RULES.find(([, test]) => test(product))!;
    groups.set(id, [...(groups.get(id) ?? []), product]);
  }
  const books = groups.get("books-sets");
  if (books) {
    const order = booksOrder(season.featured);
    books.sort((a, b) => rank(order, a.handle) - rank(order, b.handle));
  }

  const sections = sectionOrder(season.mode)
    .map((id) => ({ id, ...SHOP.sections[id], products: groups.get(id) ?? [] }))
    .filter((s) => s.products.length > 0);
  const firstHandle = sections[0]?.products[0]?.handle;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SHOP.title,
    itemListElement: sections
      .flatMap((s) => s.products)
      .map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}${productPath(p.handle)}`,
        name: p.title,
      })),
  };

  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="bg-cream">
        <div className="container-page pt-10 pb-6 sm:pt-14 sm:pb-8">
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.015em] sm:text-5xl lg:text-6xl">
            {SHOP.title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-body sm:text-lg">{SHOP.sub}</p>

          <nav aria-label={SHOP.sectionsNavLabel} className="-mx-4 mt-6 sm:mx-0">
            <ul className="scrollbar-none flex gap-2 overflow-x-auto overflow-y-hidden px-4 pb-1 sm:flex-wrap sm:px-0">
              {sections.map((s) => (
                <li key={s.id} className="shrink-0">
                  <Link
                    href={`#${s.id}`}
                    className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink shadow-soft transition-colors hover:border-periwinkle hover:text-periwinkle-text"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="container-page space-y-14 pb-16 sm:space-y-20 sm:pb-24">
          {sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
                <h2 id={`${section.id}-title`} className="text-2xl leading-tight font-semibold sm:text-3xl">
                  {section.title}
                </h2>
                {"note" in section && section.note ? (
                  <p className="text-sm font-semibold text-periwinkle-text">{section.note}</p>
                ) : null}
              </div>
              <ul
                className={
                  section.id === "books-sets"
                    ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
                }
              >
                {section.products.map((product, i) => (
                  <li key={product.handle}>
                    {/* Hardcovers get full cards; the extras are compact add-on tiles. */}
                    <ProductCard
                      product={product}
                      variant={section.id === "books-sets" ? "default" : "compact"}
                      preload={product.handle === firstHandle}
                      emphasis={section.id === "books-sets" && i === 0}
                      className="h-full"
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <section aria-label={SHOP.trustLabel} className="border-t border-line bg-paper">
        <div className="container-page py-8 sm:py-10">
          <TrustStrip variant="band" />
        </div>
      </section>
    </main>
  );
}
