import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { addOnsCopy as copy } from "@/content/home-bottom";
import { getProducts } from "@/lib/commerce";

/**
 * "Make it a tradition" (§2.9): the seven add-ons as compact (horizontal) cards.
 * Phones and tablets: a two-row, scroll-snap carousel where the next column
 * peeks in to invite a swipe. Desktop: a centered wrapping grid (3, then 4 across).
 */
export async function AddOnsRow() {
  const products = await getProducts({ handles: copy.handles });
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="add-ons-title" className="bg-cream py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading id="add-ons-title" title={copy.title} subtitle={copy.subtitle} />

        <ul
          className={[
            // phones/tablets: two rows that scroll sideways, full-bleed to the gutter.
            // `relative` makes the row the containing block for absolutely positioned
            // descendants (sr-only labels), so they are clipped instead of widening the page.
            "relative -mx-4 mt-8 grid auto-cols-[84%] grid-flow-col grid-rows-2 gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain",
            "snap-x snap-mandatory scroll-px-4 px-4 pt-1 pb-5 scrollbar-none",
            "sm:-mx-6 sm:mt-10 sm:auto-cols-[46%] sm:scroll-px-6 sm:gap-4 sm:px-6",
            // desktop: centered wrapping grid
            "lg:mx-0 lg:flex lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 lg:pb-0",
          ].join(" ")}
        >
          {products.map((product) => (
            <li
              key={product.id}
              className="flex snap-start lg:w-[calc((100%-2*1rem)/3)] xl:w-[calc((100%-3*1rem)/4)] [&>*]:w-full"
            >
              <ProductCard product={product} variant="compact" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
