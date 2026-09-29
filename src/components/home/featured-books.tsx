import { BookMiniCard } from "@/components/home/book-mini-card";
import { formatLongDate, nextEaster } from "@/components/home/hero";
import { ProductCard } from "@/components/product/product-card";
import { featuredBooksCopy, fill, keepHyphens } from "@/content/home-top";
import { getProduct } from "@/lib/commerce";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { getCurrentSeason, type Season } from "@/lib/season";
import { HANDLES } from "@/lib/store-config";

/** Keeps "8-day" and similar words from breaking across lines in the card copy. */
function tidy(product: Product): Product {
  return {
    ...product,
    subtitle: product.subtitle ? keepHyphens(product.subtitle) : undefined,
    cardBlurb: product.cardBlurb ? keepHyphens(product.cardBlurb) : undefined,
  };
}

/**
 * The two books as cards (copy deck §2.3). The season's lead book comes first
 * and gets more room: Nephite Christmas in the Christmas modes, Easter Journey
 * from Dec 25 to Easter. On phones both are compact cards (the hero above
 * already shows the covers large), so the set offer arrives a screen sooner.
 * Off-season they share the row equally.
 */
export async function FeaturedBooksSection({ season: override }: { season?: Season } = {}) {
  const season = override ?? (await getCurrentSeason());
  const [nc, ej] = await Promise.all([
    getProduct(HANDLES.nephiteChristmas),
    getProduct(HANDLES.easterJourney),
  ]);
  if (!nc || !ej) return null;

  const christmasMode = season.mode === "christmas" || season.mode === "christmas-last-minute";
  const emphasize = season.mode !== "off-season";

  const ncCard = tidy({ ...nc, subtitle: featuredBooksCopy.ncSubtitle });
  // While Christmas is the next holiday, the Easter badge tells people when it's for.
  const ejBadge =
    season.holiday === "christmas"
      ? fill(featuredBooksCopy.ejBadge, { date: formatLongDate(nextEaster(season.today)) })
      : undefined;
  const ejCard = tidy(ejBadge ? { ...ej, badge: ejBadge } : ej);
  const ejNote = christmasMode ? featuredBooksCopy.ejChristmasNote : undefined;

  const cards =
    season.featured === "easter"
      ? [
          { product: ejCard, note: undefined },
          { product: ncCard, note: undefined },
        ]
      : [
          { product: ncCard, note: undefined },
          { product: ejCard, note: ejNote },
        ];

  return (
    <section aria-labelledby="featured-books-heading" className="bg-cream pb-5 pt-10 sm:pb-8 sm:pt-16">
      <div className="container-page">
        <h2 id="featured-books-heading" className="sr-only">
          {featuredBooksCopy.heading}
        </h2>
        {/* md:items-start: each card is as tall as its content, so the shorter one has no gap above its price row. */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:items-start lg:grid-cols-12 lg:gap-8">
          {cards.map(({ product, note }, i) => {
            const lead = emphasize && i === 0;
            return (
              <div
                key={product.handle}
                className={cn(emphasize ? (lead ? "lg:col-span-7" : "lg:col-span-5") : "lg:col-span-6")}
              >
                {/* Phones: compact cards (the hero right above already shows both covers large). */}
                <BookMiniCard
                  product={product}
                  badge={product.badge}
                  note={note}
                  lead={lead || !emphasize}
                  emphasis={lead}
                  className="md:hidden"
                />
                <ProductCard
                  product={product}
                  variant="featured"
                  emphasis={lead}
                  note={note}
                  className="max-md:hidden"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
