import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Img } from "@/components/ui/img";
import { VALUE_STACK } from "@/content/pdp";
import { lpValueStackCopy as copy } from "@/content/lp";
import type { Product } from "@/lib/commerce/types";
import { formatMoney, money, toNumber } from "@/lib/money";
import { CLAIMS, FREE_SHIPPING_THRESHOLD } from "@/lib/store-config";

type Props = {
  /** The Complete Set. */
  set: Product;
  /** The set's component products (Nephite Christmas, Easter Journey). */
  parts: Product[];
};

/**
 * The Complete Set offer (copy deck §3.3 value stack): each hardcover's own
 * price, their real sum struck through as "If bought separately", the set price
 * and free shipping, then a one-tap add. It renders only when the compare-at
 * really is the sum of the parts (FTC 16 CFR 233), so it can't show a fake saving.
 */
export function LpValueStack({ set, parts }: Props) {
  const variant = set.variants.find((v) => v.availableForSale) ?? set.variants[0];
  const compareAt = variant?.compareAtPrice;
  if (!variant || !compareAt || !variant.components?.length) return null;

  const rows = variant.components.flatMap((c) => {
    const p = parts.find((x) => x.handle === c.productHandle);
    const v = p?.variants.find((x) => x.id === c.variantId);
    return p && v ? [{ label: VALUE_STACK.line(p.title, v.title), price: v.price, quantity: c.quantity }] : [];
  });
  const sum = rows.reduce((n, r) => n + toNumber(r.price) * r.quantity, 0);
  if (rows.length !== variant.components.length || Math.abs(sum - toNumber(compareAt)) > 0.004) return null;

  const price = toNumber(variant.price);
  const savings = money(toNumber(compareAt) - price);
  const shipsFree = CLAIMS.freeShipping && variant.requiresShipping && price >= FREE_SHIPPING_THRESHOLD;
  const name = set.shortTitle ?? set.title;
  const image = set.images[0];

  return (
    <section aria-labelledby="lp-set-heading" className="bg-butter py-12 sm:py-16">
      <div className="container-page">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-10">
          {image ? (
            <div className="relative mx-auto aspect-square w-full max-w-60 overflow-hidden rounded-(--radius-card) shadow-soft max-md:hidden md:max-w-none">
              <Img
                image={image}
                alt={copy.imageAlt}
                sizes="(min-width: 1024px) 22rem, (min-width: 768px) 38vw, 15rem"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          ) : null}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-ember-dark">{copy.eyebrow}</p>
            <h2 id="lp-set-heading" className="mt-1.5 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl">
              {copy.headline}
            </h2>
            <p className="mt-3 leading-relaxed text-body">{copy.sub}</p>

            <table className="mt-5 w-full border-collapse overflow-hidden rounded-(--radius-card) bg-paper text-left text-[0.9375rem] shadow-soft sm:text-base">
              <caption className="sr-only">{VALUE_STACK.caption}</caption>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-line">
                    <th scope="row" className="px-4 py-2.5 font-normal">
                      {row.label}
                    </th>
                    <td className="px-4 py-2.5 text-right tabular-nums">{formatMoney(row.price)}</td>
                  </tr>
                ))}
                <tr className="border-b border-line">
                  <th scope="row" className="px-4 py-2.5 font-normal text-muted">
                    {VALUE_STACK.separately}
                  </th>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted">
                    <s>{formatMoney(compareAt)}</s>
                  </td>
                </tr>
                <tr className={shipsFree ? "border-b border-line" : undefined}>
                  <th scope="row" className="px-4 py-3 font-display text-lg font-semibold text-ink">
                    {name}
                  </th>
                  <td className="px-4 py-3 text-right">
                    <span className="font-display text-lg font-semibold tabular-nums text-ink">
                      {formatMoney(variant.price)}
                    </span>
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

            {/* data-buy-cta: the sticky bar steps aside while this button is on screen. */}
            <div data-buy-cta="" className="mt-5">
              <AddToCartButton
                variantId={variant.id}
                productHandle={set.handle}
                productTitle={set.title}
                variantTitle={variant.title}
                price={price}
                available={variant.availableForSale}
                variant="accent"
                size="lg"
                block
              >
                {copy.cta} — {formatMoney(variant.price)}
              </AddToCartButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
