import { Download } from "lucide-react";
import { PDP_COPY } from "@/content/pdp";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";

/** The Details section: the specs table and, for digital items, the usage terms. */
export function ProductDetails({ product, className }: { product: Product; className?: string }) {
  const showSpecs = product.specs.length > 0;
  if (!showSpecs && !product.usageNote) return null;

  return (
    <section aria-labelledby="pdp-details" className={cn("border-t border-line py-12 sm:py-16", className)}>
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
        {showSpecs ? (
          <div>
            <h2 id="pdp-details" className="text-2xl font-semibold sm:text-3xl">
              {PDP_COPY.sections.details}
            </h2>
            <table className="mt-5 w-full border-collapse text-left text-sm sm:text-base">
              <tbody>
                {product.specs.map((spec) => (
                  <tr key={spec.label} className="border-b border-line last:border-b-0">
                    <th scope="row" className="w-2/5 py-3 pr-4 align-top font-semibold text-ink">
                      {spec.label}
                    </th>
                    <td className="py-3 align-top">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h2 id="pdp-details" className="sr-only">
            {PDP_COPY.sections.details}
          </h2>
        )}
        {product.usageNote ? (
          <div className="self-start rounded-(--radius-card) border border-line bg-periwinkle-light/60 p-5 sm:p-6">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Download aria-hidden className="size-4 text-periwinkle-text" />
              {PDP_COPY.usageHeading(product.variants.some((v) => v.requiresShipping))}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{product.usageNote}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
