import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { PDP_COPY } from "@/content/pdp";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";

type Props = {
  products: Product[];
  title?: string;
  /** Heading id (unique per page); defaults to one derived from the title. */
  id?: string;
  variant?: "compact" | "default";
  className?: string;
};

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "Pairs well with" cross-sell row (copy deck §3.0a), compact add-on tiles. */
export function PairsWith({ products, title = PDP_COPY.sections.pairsWith, id, variant = "compact", className }: Props) {
  if (products.length === 0) return null;
  const compact = variant === "compact";
  const headingId = id ?? `pdp-${slug(title)}`;
  return (
    <section aria-labelledby={headingId} className={cn("py-14 sm:py-20", className)}>
      <div className="container-page">
        <SectionHeading id={headingId} align="left" title={title} />
        <ul
          className={cn(
            "mt-8 grid gap-4",
            compact
              ? cn("sm:grid-cols-2", products.length === 3 ? "lg:grid-cols-3" : "xl:grid-cols-4")
              : "max-w-sm sm:max-w-none sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {products.map((product) => (
            <li key={product.handle} className="grid min-w-0">
              {/* The card estimates its own image sizes (cover fraction × tile width). */}
              <ProductCard product={product} variant={variant} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
