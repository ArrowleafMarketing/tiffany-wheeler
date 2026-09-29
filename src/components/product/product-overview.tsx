import { Check, Heart } from "lucide-react";
import type { ReactNode } from "react";
import { EXTRA_LISTS, PDP_COPY } from "@/content/pdp";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";

type Props = {
  product: Product;
  /** Extra block under the description (the Complete Set value stack). */
  aside?: ReactNode;
  className?: string;
};

/** Gifts list their details in the specs table; ornaments in the highlights. */
function highlightsHeading(product: Product): string | null {
  if (product.highlights.length === 0) return null;
  if (product.kind === "gift") return null;
  if (product.kind === "ornament") return PDP_COPY.sections.details;
  return PDP_COPY.sections.whatsInside;
}

function List({ items, icon, className }: { items: readonly string[]; icon: "check" | "heart"; className?: string }) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed">
          {icon === "check" ? (
            <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-forest-light text-forest">
              <Check aria-hidden className="size-3.5" strokeWidth={3} />
            </span>
          ) : (
            <Heart aria-hidden className="mt-1 size-4 shrink-0 text-periwinkle" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The short description with What’s Inside and Perfect for side by side (one
 * band instead of two), plus any extra list (the nativity craft's Ideas).
 */
export function ProductOverview({ product, aside, className }: Props) {
  const insideHeading = highlightsHeading(product);
  const perfectFor = product.perfectFor ?? [];
  const extra = EXTRA_LISTS[product.handle];
  const labelledBy = insideHeading ? "pdp-inside" : "pdp-overview";

  return (
    <section aria-labelledby={labelledBy} className={cn("border-t border-line bg-paper py-12 sm:py-16", className)}>
      <div className="container-page">
        {insideHeading ? null : (
          <h2 id="pdp-overview" className="sr-only">
            About {product.title}
          </h2>
        )}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-prose">
            <p className="text-lg leading-relaxed text-body sm:text-xl">{product.description}</p>
            {aside ? <div className="mt-8">{aside}</div> : null}
          </div>
          {insideHeading ? (
            <div>
              <h2 id="pdp-inside" className="text-2xl font-semibold sm:text-3xl">
                {insideHeading}
              </h2>
              <List items={product.highlights} icon="check" className="mt-5" />
            </div>
          ) : null}
        </div>

        {perfectFor.length > 0 || extra ? (
          <div className="mt-10 grid gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-16">
            {perfectFor.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">{PDP_COPY.sections.perfectFor}</h2>
                <List items={perfectFor} icon="heart" className="mt-5" />
              </div>
            ) : null}
            {extra ? (
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">{extra.heading}</h2>
                <List items={extra.items} icon="check" className="mt-5" />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
