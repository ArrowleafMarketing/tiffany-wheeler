import type { Metadata } from "next";
import { Info, Mail } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { physicalSubtotal, shippingRowText } from "@/components/cart/free-shipping-progress";
import { ButtonLink } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { Price } from "@/components/ui/price";
import { cartCopy, lineVariantLabel } from "@/content/cart";
import { readCartId } from "@/lib/cart/cookies";
import { BUY_NOW_ATTRIBUTE, INSCRIPTION_ATTRIBUTE, SIGNED_ATTRIBUTE } from "@/lib/cart/ops";
import { commerce, getProducts } from "@/lib/commerce";
import type { Cart } from "@/lib/commerce/types";
import { formatMoney, money, toNumber } from "@/lib/money";
import { productPath } from "@/lib/store-config";

// Mock checkout for the preview store (copy deck §4.6). The heading, notice and
// links are in the static shell; the order summary reads ?cart= (a Buy Now
// cart's checkout URL) or else the cart cookie, so it streams in behind
// <Suspense>. Shopify's hosted checkout replaces this page.

const copy = cartCopy.checkoutPage;

export const metadata: Metadata = {
  title: copy.metaTitle,
  robots: { index: false, follow: false },
};

export default function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  return (
    <main id="main" className="flex-1 bg-cream py-14 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.015em] sm:text-5xl">
            {copy.heading}
          </h1>

          <div className="mt-6 flex gap-3 rounded-(--radius-card) border border-butter-deep bg-butter p-4 sm:p-5">
            <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-ink" />
            <div>
              <p className="font-semibold text-ink">{copy.notice}</p>
              <p className="mt-1 text-body">{copy.sub}</p>
            </div>
          </div>

          <section
            aria-labelledby="order-summary-heading"
            className="mt-8 rounded-(--radius-card) border border-line bg-paper p-5 shadow-soft sm:p-6"
          >
            <h2 id="order-summary-heading" className="text-2xl font-semibold">
              {copy.summaryHeading}
            </h2>
            <Suspense fallback={<OrderSummarySkeleton />}>
              <OrderSummary searchParams={searchParams} />
            </Suspense>
          </section>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <ButtonLink href="/" size="lg" className="w-full sm:w-auto">
              {copy.backButton}
            </ButtonLink>
            <a
              href={copy.questionsHref}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-periwinkle-text underline underline-offset-4"
            >
              <Mail aria-hidden className="size-4" />
              {copy.questions}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

/** The Buy Now cart named in the URL, else the visitor's cart (cookie). */
async function checkoutCart(searchParams: PageProps<"/checkout">["searchParams"]): Promise<Cart | null> {
  const param = (await searchParams).cart;
  const fromUrl = typeof param === "string" && param.length <= 4000 ? await commerce.getCart(param) : null;
  if (fromUrl) return fromUrl;
  const cartId = await readCartId();
  return cartId ? commerce.getCart(cartId) : null;
}

async function OrderSummary({ searchParams }: { searchParams: PageProps<"/checkout">["searchParams"] }) {
  const cart = await checkoutCart(searchParams);

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-display text-xl font-semibold text-ink">{cartCopy.empty.heading}</p>
        <p className="mx-auto mt-2 max-w-sm text-body">{cartCopy.empty.body}</p>
      </div>
    );
  }

  const products = await getProducts();
  const madeToOrder = new Set(products.filter((p) => p.tags.includes("made-to-order")).map((p) => p.handle));
  const physical = physicalSubtotal(cart.lines);
  const attr = (key: string) => cart.attributes.find((a) => a.key === key)?.value ?? "";
  const buyNow = attr(BUY_NOW_ATTRIBUTE) !== "";
  const signed = attr(SIGNED_ATTRIBUTE) !== "" && cart.lines.some((l) => (l.bookCount ?? 0) > 0);
  const inscription = attr(INSCRIPTION_ATTRIBUTE);

  return (
    <>
      {buyNow ? <p className="mt-2 text-sm text-muted">{copy.buyNowNote}</p> : null}
      <ul role="list" className="mt-4 divide-y divide-line border-t border-line">
        {cart.lines.map((line) => {
          const label = lineVariantLabel(line.productTitle, line.variantTitle);
          const note = !line.requiresShipping
            ? cartCopy.line.digital
            : madeToOrder.has(line.productHandle)
              ? cartCopy.line.madeToOrder
              : null;
          const compareAt = line.compareAtUnitPrice
            ? money(toNumber(line.compareAtUnitPrice) * line.quantity)
            : null;
          return (
            <li key={line.id} className="flex gap-4 py-4">
              <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-cream-deep">
                {line.image ? (
                  <Img image={line.image} alt="" sizes="64px" className="size-full object-contain p-1" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug text-ink">
                  <Link
                    href={productPath(line.productHandle)}
                    prefetch={false}
                    className="hover:underline hover:underline-offset-4"
                  >
                    {line.productTitle}
                  </Link>
                </p>
                {label ? <p className="mt-0.5 text-sm text-muted">{label}</p> : null}
                {note ? <p className="mt-0.5 text-xs text-muted">{note}</p> : null}
                <p className="mt-0.5 text-sm text-muted">{copy.quantity(line.quantity)}</p>
              </div>
              <Price price={line.total} compareAtPrice={compareAt} reason={line.compareAtReason} size="sm" className="shrink-0 justify-end text-right" />
            </li>
          );
        })}
      </ul>

      <div className="space-y-1.5 border-t border-line pt-4">
        {cart.savings ? (
          <p className="flex items-baseline justify-between text-sm font-semibold text-forest">
            <span>{cartCopy.summary.savings}</span>
            <span className="tabular-nums">{formatMoney(cart.savings)}</span>
          </p>
        ) : null}
        {cart.discounts?.map((d) => (
          <p key={d.title} className="flex items-baseline justify-between gap-3 text-sm font-semibold text-forest">
            <span>{d.title}</span>
            <span className="tabular-nums">−{formatMoney(d.amount)}</span>
          </p>
        ))}
        <p className="flex items-baseline justify-between">
          <span className="font-semibold text-ink">{cartCopy.summary.subtotal}</span>
          <span className="font-display text-xl font-semibold tabular-nums text-ink">
            {formatMoney(cart.subtotal)}
          </span>
        </p>
        <p className="text-sm text-muted">
          {cart.requiresShipping
            ? `${shippingRowText(physical)} · ${cartCopy.summary.taxNote}`
            : `${cartCopy.freeShipping.digitalOnly} ${cartCopy.summary.taxNote}`}
        </p>
      </div>

      {cart.note ? (
        <div className="mt-4 rounded-xl bg-cream-deep/60 p-4">
          <p className="text-sm font-semibold text-ink">{copy.giftNote}</p>
          <p className="mt-1 whitespace-pre-line text-sm text-body">{cart.note}</p>
        </div>
      ) : null}
      {signed ? (
        <p className="mt-4 rounded-xl bg-cream-deep/60 p-4 text-sm font-semibold text-ink">
          {inscription ? copy.signedTo(inscription) : copy.signed}
        </p>
      ) : null}
    </>
  );
}

function OrderSummarySkeleton() {
  return (
    <div className="mt-4 border-t border-line" aria-busy="true">
      <p className="sr-only">{cartCopy.drawer.loading}</p>
      {[0, 1].map((i) => (
        <div key={i} className="flex animate-pulse gap-4 py-4">
          <div className="size-16 rounded-xl bg-cream-deep" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-2/3 rounded bg-cream-deep" />
            <div className="h-3 w-1/4 rounded bg-cream-deep" />
          </div>
          <div className="h-4 w-14 rounded bg-cream-deep" />
        </div>
      ))}
    </div>
  );
}
