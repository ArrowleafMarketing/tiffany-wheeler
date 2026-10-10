import type { Metadata } from "next";
import Link from "next/link";
import wavingBoy from "@/assets/images/art/waving-boy-still.webp";
import { BookCover } from "@/components/product/book-cover";
import { ButtonLink } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { Price } from "@/components/ui/price";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NOT_FOUND } from "@/content/site";
import { getProducts } from "@/lib/commerce";
import { fromStatic } from "@/lib/images";
import { getCurrentSeason } from "@/lib/season";
import { HANDLES, productPath } from "@/lib/store-config";

export const metadata: Metadata = {
  title: NOT_FOUND.metaTitle,
  robots: { index: false, follow: true },
};

// A static first frame (224px, ~16 KB) instead of the 762 KB looping animation:
// nothing moves without a pause control (WCAG 2.2.2), and no blur placeholder
// behind the transparent art.
const boy = fromStatic(wavingBoy, NOT_FOUND.boyAlt);

export default async function NotFound() {
  const season = await getCurrentSeason();
  const order =
    season.featured === "easter"
      ? [HANDLES.easterJourney, HANDLES.nephiteChristmas, HANDLES.completeSet]
      : [HANDLES.nephiteChristmas, HANDLES.easterJourney, HANDLES.completeSet];
  const found = await getProducts({ handles: order });
  const books = order.flatMap((h) => found.filter((p) => p.handle === h));

  return (
    <>
    <SiteHeader />
    <main id="main" className="flex-1 bg-cream">
      <div className="container-page grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-12 lg:py-20">
        {/* ≤192px so the 224px still stays sharp enough on 2x screens. */}
        <div className="mx-auto w-36 sm:w-40 md:w-48">
          <Img image={boy} sizes="(min-width: 768px) 192px, 160px" className="h-auto w-full" />
        </div>

        <div className="text-center md:text-left">
          <p className="mb-2 font-hand text-2xl leading-none text-periwinkle-text">{NOT_FOUND.eyebrow}</p>
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.015em] sm:text-5xl">{NOT_FOUND.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">{NOT_FOUND.body}</p>

          {/* Up to lg: one row per book (cover, then title and price) so the qualified
              "$54.98 separately" price never overflows a narrow card. */}
          <ul className="mt-8 grid gap-3 lg:grid-cols-3 lg:gap-5">
            {books.map((p) => {
              const variant = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
              return (
                <li key={p.handle}>
                  <Link
                    href={productPath(p.handle)}
                    className="group flex h-full items-center gap-4 rounded-(--radius-card) border border-line bg-paper p-3 text-left shadow-soft transition-shadow hover:shadow-lift lg:flex-col lg:gap-0 lg:p-4 lg:text-center"
                  >
                    <span className="flex h-20 w-24 shrink-0 items-center justify-center lg:h-32 lg:w-full lg:items-end">
                      {p.images[0] && p.kind === "book" ? (
                        <BookCover
                          cover={{ ...p.images[0], alt: "" }}
                          sizes="(min-width: 1024px) 160px, 96px"
                          // Fit the box by the cover's long side so the ratio is kept.
                          className={p.images[0].width > p.images[0].height ? "w-full" : "h-full"}
                        />
                      ) : p.images[0] ? (
                        <Img
                          image={p.images[0]}
                          alt=""
                          sizes="(min-width: 1024px) 128px, 96px"
                          className="h-full w-auto rounded-lg object-contain"
                        />
                      ) : null}
                    </span>
                    <span className="flex min-w-0 flex-col lg:items-center">
                      <span className="font-display text-base leading-tight font-semibold text-ink group-hover:underline lg:mt-3">
                        {p.handle === HANDLES.completeSet ? NOT_FOUND.setShortTitle : p.title}
                      </span>
                      {variant ? (
                        <Price
                          price={variant.price}
                          compareAtPrice={variant.compareAtPrice}
                          reason={variant.compareAtReason}
                          size="sm"
                          className="mt-1 lg:justify-center"
                        />
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <ButtonLink href="/" size="md">
              {NOT_FOUND.homeCta}
            </ButtonLink>
            <ButtonLink href="/shop" size="md" variant="outline">
              {NOT_FOUND.shopCta}
            </ButtonLink>
          </div>

          <p className="mt-8 text-sm text-body">
            {NOT_FOUND.helpLine}{" "}
            {NOT_FOUND.helpLinks.map((link, i) => (
              <span key={link.href}>
                {i > 0 ? " · " : null}
                <Link href={link.href} className="font-semibold text-periwinkle-text underline underline-offset-4">
                  {link.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
