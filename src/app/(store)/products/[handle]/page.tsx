import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/home/faq-list";
import { BuyAgainRow } from "@/components/product/buy-again-row";
import { BuyBox, BuyBoxProvider, PDP_END_ID } from "@/components/product/buy-box";
import { buyBoxConfig, firstAvailable, giftOptionHandles, shipsFreeAt } from "@/components/product/buy-box-config";
import { DeliveryPromise } from "@/components/product/delivery-promise";
import { PairsWith } from "@/components/product/pairs-with";
import { PeekInsideCarousel } from "@/components/product/peek-inside-carousel";
import { ProductDetails } from "@/components/product/product-details";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductJsonLd } from "@/components/product/product-json-ld";
import { ProductOverview } from "@/components/product/product-overview";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductStory } from "@/components/product/product-story";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { TrustStrip } from "@/components/product/trust-strip";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import * as siteFaqModule from "@/content/faq";
import {
  ALSO_BY,
  BUY_BOX_FACTS,
  BUY_BOX_TRUST,
  EJ_CHRISTMAS_LINE,
  GUARANTEE_KINDS,
  LAST_MINUTE_HEADLINES,
  PDP_COPY,
  PDP_SITE_FAQS,
  PULL_QUOTES,
  VALUE_STACK,
} from "@/content/pdp";
import { getProduct, getProducts, getReviews } from "@/lib/commerce";
import type { Faq, Product } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, money, toNumber } from "@/lib/money";
import { formatSeasonDate, getCurrentSeason, type Season } from "@/lib/season";
import { CLAIMS, FREE_SHIPPING_THRESHOLD, HANDLES, productPath } from "@/lib/store-config";

// One template for all 14 products; it adapts by product.kind. Every data read
// is 'use cache' (catalog, reviews, season), so each handle prerenders to a
// fully static page. Unknown handles 404 before anything streams.

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  const image = product.images[0];
  const url = productPath(product.handle);
  return {
    // Deck SEO titles are complete (brand included where it fits), so skip the template.
    title: { absolute: product.seo.title },
    description: product.seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "Tiffany Wheeler",
      locale: "en_US",
      url,
      title: product.seo.title,
      description: product.seo.description,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

type FaqItem = Faq & { id?: string };

function includes(product: Product, handle: string): boolean {
  return product.variants.some((v) => v.components?.some((c) => c.productHandle === handle));
}

function componentHandles(product: Product): string[] {
  return [...new Set(product.variants.flatMap((v) => v.components?.map((c) => c.productHandle) ?? []))];
}

function badgeTone(product: Product) {
  if (product.variants.every((v) => !v.requiresShipping)) return "periwinkle" as const;
  if (product.tags.includes("made-to-order")) return "neutral" as const;
  // Ember is reserved for the real best-value offer (a genuine compare-at).
  if (product.kind === "bundle" && product.variants.some((v) => v.compareAtPrice)) return "ember" as const;
  if (product.kind === "book" && product.holiday === "christmas") return "night" as const;
  if (product.holiday === "easter") return "forest" as const;
  return "butter" as const;
}

/** "Ages 3–10 · Hardcover · 46 pages", from the catalog (§3.1/§3.2 buy-box bullets). */
function quickFacts(product: Product): string[] {
  const pages = product.specs.find((s) => s.label === "Pages")?.value;
  return (BUY_BOX_FACTS[product.handle] ?? []).flatMap((fact) => {
    if (fact === "ages") return product.ageRange ? [PDP_COPY.facts.ages(product.ageRange)] : [];
    if (fact === "hardcover") return product.kind === "book" ? [PDP_COPY.facts.hardcover] : [];
    return pages ? [pages] : [];
  });
}

/** §3.2 Christmas-mode line under the Easter Journey CTA, from the real Easter date. */
function ejChristmasLine(season: Season): string | null {
  if (season.mode !== "christmas") return null;
  const { easter, palmSunday, year } = season.easter;
  return EJ_CHRISTMAS_LINE(formatSeasonDate(easter), year, formatSeasonDate(palmSunday));
}

/** §3.10 headline once hardcovers can't make it for Christmas (after the last shipping cutoff). */
function lastMinuteHeadline(product: Product, season: Season): string | null {
  const headline = LAST_MINUTE_HEADLINES[product.handle];
  if (!headline || season.mode !== "christmas-last-minute") return null;
  const lastCutoff = season.christmas.priorityOrderBy ?? season.christmas.standardOrderBy;
  return season.today > lastCutoff ? headline : null;
}

/** The site FAQs (src/content/faq.ts), whether they're exported as a list or built per season. */
function siteFaqs(season: Season): FaqItem[] {
  const source = (siteFaqModule as unknown as Record<string, unknown>).allFaqs;
  if (typeof source === "function") return (source as (s: Season) => FaqItem[])(season);
  return Array.isArray(source) ? (source as FaqItem[]) : [];
}

function pickFaq(list: FaqItem[], spec: { ids: readonly string[]; question: RegExp }): FaqItem | undefined {
  return list.find((f) => f.id && spec.ids.includes(f.id)) ?? list.find((f) => spec.question.test(f.question));
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const isBundle = product.kind === "bundle";
  const bundleWithNc = isBundle && includes(product, HANDLES.nephiteChristmas);
  const parts = componentHandles(product);
  const giftPicker = product.handle === HANDLES.nephiteChristmas;
  const includesNc = product.handle === HANDLES.nephiteChristmas || bundleWithNc;

  const [season, pairs, reviews, giftOptions, components, alsoBy] = await Promise.all([
    getCurrentSeason(),
    product.pairsWith.length ? getProducts({ handles: product.pairsWith }) : Promise.resolve([]),
    getReviews(bundleWithNc ? HANDLES.nephiteChristmas : product.handle),
    giftPicker ? getProducts({ handles: giftOptionHandles(product) }) : Promise.resolve([]),
    isBundle && parts.length ? getProducts({ handles: parts }) : Promise.resolve([]),
    ALSO_BY[product.handle] ? getProducts({ handles: ALSO_BY[product.handle] }) : Promise.resolve([]),
  ]);

  const config = buyBoxConfig(product, giftOptions);
  const madeToOrder = product.tags.includes("made-to-order");
  const shipsSomething = config.items.some((i) => i.requiresShipping);
  const hasDigital = config.items.some((i) => !i.requiresShipping);
  const siteRating = reviews.length > 0 ? product.ratings.find((r) => r.source === "site" && r.count > 0) : undefined;
  const facts = quickFacts(product);
  const quote = PULL_QUOTES[product.handle];
  const ejLine = product.handle === HANDLES.easterJourney ? ejChristmasLine(season) : null;
  const headline = lastMinuteHeadline(product, season);
  const longTitle = product.title.length > 32;
  const guaranteed = CLAIMS.moneyBackGuarantee && !madeToOrder && GUARANTEE_KINDS.includes(product.kind);
  const trustIds = madeToOrder
    ? BUY_BOX_TRUST.madeToOrder
    : BUY_BOX_TRUST.physical.filter((id) => id !== "guarantee" || guaranteed);
  const longPage = Boolean(product.peekInside?.length) || reviews.length > 0;

  // Product FAQs, plus the site answers a cold visitor asks before buying.
  const site = siteFaqs(season);
  const christmasShipping =
    shipsSomething &&
    !madeToOrder &&
    product.holiday !== "easter" &&
    (season.mode === "christmas" || season.mode === "christmas-last-minute");
  const faqs = [
    christmasShipping ? pickFaq(site, PDP_SITE_FAQS.christmasOrderBy) : undefined,
    ...(product.faqs ?? []),
    guaranteed && shipsSomething ? pickFaq(site, PDP_SITE_FAQS.guarantee) : undefined,
    product.kind === "book" || product.kind === "bundle" || product.kind === "digital"
      ? pickFaq(site, PDP_SITE_FAQS.church)
      : undefined,
  ].filter((f, i, all): f is FaqItem => Boolean(f) && all.findIndex((g) => g?.question === f?.question) === i);

  const badge = product.badge ? <Badge tone={badgeTone(product)}>{product.badge}</Badge> : null;
  const ratingOf = siteRating?.borrowedFrom;

  return (
    <main id="main" className="flex-1">
      <ProductJsonLd product={product} />
      <BuyBoxProvider config={config}>
        <div className="container-page pb-12 pt-3 sm:pb-16 sm:pt-6">
          <nav aria-label="Breadcrumb" className="mb-4 hidden text-sm text-muted sm:block">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/shop" className="hover:text-ink hover:underline">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="truncate text-body">
                {product.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-3 sm:gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery
                images={product.images}
                title={product.title}
                bookCover={product.kind === "book"}
                phoneBadge={badge}
              />
            </div>

            <div className="min-w-0">
              {headline ? (
                <p className="mb-2 font-hand text-2xl leading-none text-periwinkle-text">{headline}</p>
              ) : null}
              {/* On phones the badge sits on the photo instead, to save a row. */}
              {badge ? <div className="mb-3 hidden sm:block">{badge}</div> : null}
              <h1
                className={cn(
                  "font-semibold leading-[1.05] tracking-[-0.015em]",
                  longTitle ? "text-[1.75rem] sm:text-4xl" : "text-[2rem] sm:text-5xl",
                )}
              >
                {product.title}
              </h1>
              {product.subtitle ? (
                <p className="mt-1.5 text-[0.9375rem] leading-snug text-body sm:mt-2 sm:text-xl">{product.subtitle}</p>
              ) : null}

              {siteRating || facts.length ? (
                <div className="flex flex-wrap items-center gap-x-3 text-sm sm:mt-2">
                  {siteRating ? (
                    <a
                      href="#reviews"
                      aria-label={
                        ratingOf
                          ? PDP_COPY.ratingAriaOf(siteRating.value.toFixed(1), siteRating.count, ratingOf)
                          : PDP_COPY.ratingAria(siteRating.value.toFixed(1), siteRating.count)
                      }
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink hover:underline"
                    >
                      <span aria-hidden className="inline-flex">
                        <Stars value={siteRating.value} size={15} />
                      </span>
                      <span aria-hidden>
                        {ratingOf
                          ? PDP_COPY.ratingLinkOf(siteRating.value.toFixed(1), siteRating.count, ratingOf)
                          : PDP_COPY.ratingLink(siteRating.value.toFixed(1), siteRating.count)}
                      </span>
                    </a>
                  ) : null}
                  {facts.length ? (
                    // No leading separator: on narrow phones this wraps to its own line.
                    <p className={cn("text-muted", !siteRating && "py-2")}>{facts.join(" · ")}</p>
                  ) : null}
                </div>
              ) : null}

              <BuyBox
                className="mt-2 sm:mt-5"
                slots={{
                  physical: shipsSomething
                    ? {
                        delivery: (
                          <>
                            {ejLine ? <p className="text-sm font-semibold text-olive">{ejLine}</p> : null}
                            <DeliveryPromise
                              requiresShipping
                              madeToOrder={madeToOrder}
                              holiday={product.holiday}
                              pdfAlternative={includesNc}
                            />
                          </>
                        ),
                        below: <TrustStrip variant="inline" ids={trustIds} />,
                      }
                    : undefined,
                  digital: hasDigital
                    ? {
                        delivery: <DeliveryPromise requiresShipping={false} />,
                        below: <TrustStrip variant="inline" digital />,
                      }
                    : undefined,
                }}
              />

              {quote ? (
                <figure className="mt-6 rounded-(--radius-card) border border-line bg-paper p-5 shadow-soft">
                  <Stars value={5} size={15} label="5 out of 5 stars" />
                  <blockquote className="mt-2 font-display text-lg leading-snug text-ink">{quote.quote}</blockquote>
                  <figcaption className="mt-2 text-sm text-muted">— {quote.author}</figcaption>
                </figure>
              ) : null}
            </div>
          </div>
        </div>

        {/* Below the buy box: proof first (pages, reviews), a second buy row, then the details. */}
        {product.peekInside?.length ? (
          <section aria-labelledby="pdp-peek" id="peek-inside" className="scroll-mt-24 bg-cream-deep py-14 sm:py-20">
            <div className="container-page">
              <SectionHeading id="pdp-peek" title={PDP_COPY.sections.peekInside} subtitle={PDP_COPY.peekIntro} />
              <div className="mt-8 sm:mt-10">
                <PeekInsideCarousel title={PDP_COPY.peekLabel(product.title)} spreads={product.peekInside.slice(0, 5)} />
              </div>
            </div>
          </section>
        ) : null}

        <ProductReviews product={product} reviews={reviews} />

        {longPage ? <BuyAgainRow /> : null}

        <ProductOverview
          product={product}
          aside={isBundle && firstAvailable(product).compareAtPrice ? <ValueStack product={product} components={components} /> : null}
        />

        {faqs.length ? (
          <section id="faq" aria-labelledby="pdp-faq" className="scroll-mt-24 border-t border-line py-14 sm:py-20">
            <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-16">
              <SectionHeading
                id="pdp-faq"
                align="left"
                eyebrow={PDP_COPY.sections.faqEyebrow}
                title={PDP_COPY.sections.faq}
              />
              <FaqList items={faqs} />
            </div>
          </section>
        ) : null}

        <ProductDetails product={product} className="bg-paper" />
        <ProductStory product={product} />

        <PairsWith products={pairs} className="border-t border-line bg-cream-deep" />
        {alsoBy.length ? (
          <PairsWith title={PDP_COPY.sections.alsoBy} products={alsoBy} className="bg-cream-deep pt-0 sm:pt-0" />
        ) : null}

        <div id={PDP_END_ID} aria-hidden />
        <StickyBuyBar />
      </BuyBoxProvider>
    </main>
  );
}

/** §3.3 value stack, only when the compare-at really is the sum of the parts. */
function ValueStack({ product, components }: { product: Product; components: Product[] }) {
  const variant = firstAvailable(product);
  const compareAt = variant.compareAtPrice;
  if (!compareAt || !variant.components?.length) return null;
  const rows = variant.components.flatMap((c) => {
    const p = components.find((x) => x.handle === c.productHandle);
    const v = p?.variants.find((x) => x.id === c.variantId);
    return p && v ? [{ label: VALUE_STACK.line(p.title, v.title), price: v.price, quantity: c.quantity }] : [];
  });
  const sum = rows.reduce((n, r) => n + toNumber(r.price) * r.quantity, 0);
  if (rows.length !== variant.components.length || Math.abs(sum - toNumber(compareAt)) > 0.004) return null;
  const savings = money(toNumber(compareAt) - toNumber(variant.price));
  const shipsFree = shipsFreeAt(variant);

  return (
    <table className="w-full max-w-md border-collapse overflow-hidden rounded-(--radius-card) bg-butter/60 text-left text-sm sm:text-base">
      <caption className="sr-only">{VALUE_STACK.caption}</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-butter-deep/60">
            <th scope="row" className="px-4 py-2.5 font-normal">
              {row.label}
            </th>
            <td className="px-4 py-2.5 text-right tabular-nums">{formatMoney(row.price)}</td>
          </tr>
        ))}
        <tr className="border-b border-butter-deep/60">
          <th scope="row" className="px-4 py-2.5 font-normal text-muted">
            {VALUE_STACK.separately}
          </th>
          <td className="px-4 py-2.5 text-right tabular-nums text-muted">
            <s>{formatMoney(compareAt)}</s>
          </td>
        </tr>
        <tr className="border-b border-butter-deep/60">
          <th scope="row" className="px-4 py-3 font-display text-lg font-semibold text-ink">
            {product.shortTitle ?? product.title.split(":")[0]}
          </th>
          <td className="px-4 py-3 text-right">
            <span className="font-display text-lg font-semibold tabular-nums text-ink">{formatMoney(variant.price)}</span>
            <span className="block text-xs font-bold text-ember-dark">
              {VALUE_STACK.youSave(formatMoney(savings))}
            </span>
          </td>
        </tr>
        {shipsFree ? (
          <tr>
            <th scope="row" className="px-4 py-2.5 font-normal">
              {VALUE_STACK.shipping}
            </th>
            <td className="px-4 py-2.5 text-right font-semibold text-forest-dark">
              {VALUE_STACK.shippingFree(FREE_SHIPPING_THRESHOLD)}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}
