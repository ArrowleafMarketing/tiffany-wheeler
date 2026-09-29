import { ArrowRight, BookOpen, Check, MapPin, Store, Users, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { proseLinkClass } from "@/components/info/rich-text";
import { WholesaleInquiryForm } from "@/components/info/wholesale-inquiry-form";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { bulkCopy, type BulkCardIcon } from "@/content/home-bottom";
import { WHOLESALE_TERMS, bulkOrdersCopy as copy, wholesaleFormCopy } from "@/content/info";
import { getProducts, type Product } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { CONTACT_EMAIL } from "@/lib/store-config";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/bulk-orders" },
};

const cardIcons: Record<BulkCardIcon, LucideIcon> = { family: Users, ward: BookOpen, store: Store, find: MapPin };

/** Suggested retail = the product's regular price (the printed variant for the coloring book). */
function retailPrice(product: Product | undefined): string | null {
  const variant = product?.variants.find((v) => v.requiresShipping) ?? product?.variants[0];
  return variant ? formatMoney(variant.price) : null;
}

export default async function BulkOrdersPage() {
  const wholesaleHandles = WHOLESALE_TERMS.items.map((item) => item.handle);
  const found = await getProducts({ handles: [...new Set([...copy.shop.handles, ...wholesaleHandles])] });
  const byHandle = new Map(found.map((p) => [p.handle, p]));
  const shopProducts = copy.shop.handles.flatMap((handle) => byHandle.get(handle) ?? []);
  const w = copy.wholesale;

  return (
    <InfoPageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      intro={copy.intro}
      layout="bands"
      actions={
        <>
          <ButtonLink href={copy.cta.href} size="lg">
            {copy.cta.label}
          </ButtonLink>
          <Link
            href={`#${w.id}`}
            className="inline-flex min-h-14 items-center gap-1.5 px-1 font-semibold text-periwinkle-text underline-offset-4 hover:text-ink hover:underline"
          >
            {w.title}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </>
      }
    >
      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section aria-labelledby="bulk-how-title" className="bg-cream py-12 sm:py-16">
        <div className="container-page">
          <SectionHeading id="bulk-how-title" title={copy.how.title} />
          {/* CONFIRM bulk discount terms (copy deck §5, item 4) */}
          <ol className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-5">
            {copy.how.steps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-(--radius-card) border border-line bg-paper p-4 shadow-soft sm:block sm:p-5"
              >
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-forest text-base font-bold text-white"
                >
                  {i + 1}
                </span>
                <div className="sm:mt-3">
                  <h3 className="text-xl font-semibold leading-snug">{step.title}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-body">{step.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Who orders in bulk ───────────────────────────────────────────── */}
      <section aria-labelledby="bulk-who-title" className="bg-paper py-12 sm:py-16">
        <div className="container-page">
          <SectionHeading id="bulk-who-title" title={copy.who.title} />
          {/* CONFIRM the retailer list is current and may be named (copy deck §5, item 15) */}
          <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {bulkCopy.cards.map((card) => {
                const Icon = cardIcons[card.icon];
                return (
                  <li key={card.title} className="flex gap-4 rounded-(--radius-card) border border-line bg-cream p-4">
                    <span
                      aria-hidden
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-periwinkle-light text-periwinkle-text"
                    >
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug">{card.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-body">{card.line}</p>
                      {"link" in card && card.link ? (
                        <Link
                          href={card.link.href}
                          className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-periwinkle-text underline-offset-4 hover:text-ink hover:underline"
                        >
                          {card.link.label}
                          <ArrowRight aria-hidden className="size-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="rounded-(--radius-card) bg-cream-deep/60 p-5 sm:p-7">
              <h3 className="text-2xl font-semibold leading-snug">{copy.ward.title}</h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-body sm:text-lg">
                {copy.ward.items.map((idea) => (
                  <li key={idea} className="flex gap-3">
                    <Check aria-hidden className="mt-1 size-5 shrink-0 text-forest" strokeWidth={2.5} />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
              {/* CONFIRM on-screen sharing terms (copy deck §5, item 30) */}
              <p className="mt-5 rounded-(--radius-btn) bg-butter p-4 text-sm leading-relaxed text-ink">
                {copy.ward.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shop the books ───────────────────────────────────────────────── */}
      <section id={copy.shop.id} aria-labelledby="bulk-shop-title" className="scroll-mt-20 bg-cream py-12 sm:py-16">
        <div className="container-page">
          <SectionHeading id="bulk-shop-title" title={copy.shop.title} subtitle={copy.shop.subtitle} />
          <ul className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shopProducts.map((product) => (
              <li key={product.handle}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-base text-body">
            {copy.contactLine}{" "}
            {/* CONFIRM customer-service address (copy deck §5, item 32) */}
            <a href={`mailto:${CONTACT_EMAIL}`} className={proseLinkClass}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      {/* ── Wholesale ────────────────────────────────────────────────────── */}
      <section id={w.id} aria-labelledby="wholesale-title" className="scroll-mt-20 bg-cream-deep py-14 sm:py-20">
        <div className="container-page">
          {/* minmax(0,1fr): the terms table's min-content width must not widen the page at 320px (WCAG 1.4.10). */}
          <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
            <div className="min-w-0">
              <p className="font-hand text-xl leading-none text-periwinkle-text sm:text-2xl">{w.eyebrow}</p>
              <h2
                id="wholesale-title"
                className="mt-2 text-3xl font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl"
              >
                {w.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-body sm:text-lg">{w.intro}</p>

              <div className="mt-6 overflow-x-auto overflow-y-hidden rounded-(--radius-card) border border-line bg-paper shadow-soft">
                <table className="w-full border-collapse text-left">
                  <caption className="border-b border-line px-4 py-3 text-left font-display text-lg font-semibold text-ink">
                    {w.termsTitle}
                  </caption>
                  <thead className="border-b border-line">
                    <tr className="text-xs font-bold uppercase tracking-[0.06em] text-muted">
                      <th scope="col" className="px-3 pb-2 pt-3 font-bold sm:px-4">
                        {w.colItem}
                      </th>
                      <th scope="col" className="px-3 pb-2 pt-3 text-right font-bold sm:px-4">
                        {w.colWholesale}
                      </th>
                      <th scope="col" className="px-3 pb-2 pt-3 text-right font-bold sm:px-4">
                        <span className="sm:hidden">{w.colRetailShort}</span>
                        <span className="hidden sm:inline">{w.colRetail}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {WHOLESALE_TERMS.items.map((item) => (
                      <tr key={item.handle}>
                        <th scope="row" className="px-3 py-3.5 text-sm font-semibold text-ink sm:px-4 sm:text-base">
                          {item.label}
                        </th>
                        <td className="px-3 py-3.5 text-right font-display text-lg font-semibold text-ink tabular-nums sm:px-4">
                          {formatMoney(item.wholesale)}
                        </td>
                        <td className="px-3 py-3.5 text-right text-body tabular-nums sm:px-4">
                          {retailPrice(byHandle.get(item.handle)) ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CONFIRM wholesale terms still apply (current-site.md §5) */}
              <ul className="mt-5 space-y-2.5 text-base leading-relaxed text-body">
                {[w.minimum(WHOLESALE_TERMS.minimumPerTitle), ...w.terms].map((term) => (
                  <li key={term} className="flex gap-3">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-forest" strokeWidth={2.5} />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">{w.easterNote}</p>
            </div>

            <div className="rounded-(--radius-card) border border-line bg-paper p-5 shadow-soft sm:p-8">
              <h3 className="text-2xl font-semibold leading-tight">{w.formTitle}</h3>
              <p className="mt-2 text-base leading-relaxed text-body">{w.formIntro}</p>
              <WholesaleInquiryForm copy={wholesaleFormCopy} className="mt-6" />
            </div>
          </div>
        </div>
      </section>
    </InfoPageShell>
  );
}
