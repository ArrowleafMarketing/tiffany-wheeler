import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ButtonLink } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { Price } from "@/components/ui/price";
import { shopRowCopy as copy } from "@/content/home-top";
import { getProducts } from "@/lib/commerce";
import type { Product } from "@/lib/commerce/types";
import { toNumber } from "@/lib/money";
import { getCurrentSeason, type Season } from "@/lib/season";
import { HANDLES, productPath } from "@/lib/store-config";
import { ShopRowScroller } from "./shop-row-scroller";

/** Christmas-first order; Easter-led seasons move the Easter items to the front. */
const ORDER = [
  HANDLES.nephiteChristmas,
  HANDLES.completeSet,
  HANDLES.ncBundleOrnament,
  HANDLES.ncBundle,
  HANDLES.coloringBook,
  HANDLES.starOrnament,
  HANDLES.doveOrnament,
  HANDLES.ncPdf,
  HANDLES.easterJourney,
  HANDLES.ejPdf,
];

function ordered(products: Product[], season: Season): Product[] {
  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const list = ORDER.map((h) => byHandle.get(h)).filter((p): p is Product => Boolean(p));
  if (season.featured !== "easter") return list;
  return [...list.filter((p) => p.holiday === "easter"), ...list.filter((p) => p.holiday !== "easter")];
}

/**
 * "Shop the collection": one simple horizontal row right under the trust band. A
 * cover on a soft tile, the name, one line, the price and Add to Cart, with
 * arrows to cycle and a Shop All link.
 */
export async function ShopRow({ season: override }: { season?: Season } = {}) {
  const season = override ?? (await getCurrentSeason());
  const products = ordered(await getProducts({ handles: ORDER }), season);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="shop-row-heading" className="bg-cream py-10 sm:py-14">
      <div className="container-page">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
          <h2 id="shop-row-heading" className="text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">
            {copy.heading}
          </h2>
          <ButtonLink href="/shop" variant="outline" size="md" className="shrink-0">
            {copy.shopAll}
          </ButtonLink>
        </div>

        <ShopRowScroller labels={{ previous: copy.previous, next: copy.next }}>
          {products.map((p) => {
            const variant = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
            const image = p.images[0];
            const name = p.shortTitle ?? p.title;
            const href = productPath(p.handle);
            return (
              <li key={p.handle} className="relative flex w-(--tile) shrink-0 snap-start flex-col">
                <Link href={href} prefetch={false} className="group block" tabIndex={-1} aria-hidden>
                  {/* Fixed square tile: every cover fits inside it, so tall ones (the activity book) shrink instead of stretching the card. */}
                  <div className="relative aspect-square overflow-hidden rounded-(--radius-card) bg-cream-deep">
                    {image ? (
                      <Img
                        image={{ ...image, alt: "" }}
                        sizes="(min-width: 640px) 240px, 62vw"
                        className="absolute inset-[12%] size-[76%] object-contain drop-shadow-[0_10px_14px_rgb(20_12_0/0.25)] transition-transform duration-300 group-hover:-translate-y-1"
                      />
                    ) : null}
                  </div>
                </Link>
                <h3 className="mt-3 truncate font-sans text-base font-semibold leading-snug">
                  {/* Padded so the name is a comfortable tap target on phones. */}
                  <Link href={href} prefetch={false} className="-my-2 inline-block max-w-full truncate py-2 align-top hover:underline">
                    {name}
                  </Link>
                </h3>
                {/* Always two lines tall, so every price and button sits at the same height. */}
                <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-body">{p.subtitle}</p>
                <div className="mt-2 flex flex-col items-start gap-2.5">
                  <Price price={variant.price} compareAtPrice={variant.compareAtPrice} reason={variant.compareAtReason} />
                  <AddToCartButton
                    variantId={variant.id}
                    productHandle={p.handle}
                    productTitle={p.title}
                    variantTitle={variant.title}
                    price={toNumber(variant.price)}
                    available={variant.availableForSale}
                    size="md"
                    className="px-4"
                  >
                    {copy.add}
                    <span className="sr-only">: {name}</span>
                  </AddToCartButton>
                </div>
              </li>
            );
          })}
        </ShopRowScroller>
      </div>
    </section>
  );
}
