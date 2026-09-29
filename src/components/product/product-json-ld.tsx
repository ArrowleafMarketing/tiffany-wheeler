import type { Image, Product, Variant } from "@/lib/commerce/types";
import { toNumber } from "@/lib/money";
import { SITE_URL, productPath } from "@/lib/store-config";

// Product structured data (schema.org Product, plus Book for the hardcovers),
// rendered as a native <script> per node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
// aggregateRating is only emitted for a real site rating of *this* product:
// bundles carry Nephite Christmas's rating in the catalog for display
// (`borrowedFrom`), but it isn't the bundle's own rating, so it is never claimed
// here. numberOfPages comes from the catalog's "Pages" spec (one source per book).

const BRAND = "Tiffany Wheeler";

const absolute = (url: string) => new URL(url, SITE_URL).toString();

const spec = (product: Product, label: string) => product.specs.find((s) => s.label === label)?.value;

function offer(product: Product, variant: Variant, url: string) {
  return {
    "@type": "Offer",
    name: product.variants.length > 1 ? `${product.title} (${variant.title})` : undefined,
    sku: variant.sku,
    price: toNumber(variant.price).toFixed(2),
    priceCurrency: variant.price.currencyCode,
    availability: variant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    url,
    seller: { "@type": "Organization", name: BRAND },
  };
}

export function productJsonLd(product: Product) {
  const url = absolute(productPath(product.handle));
  const images = product.images.slice(0, 4).map((image: Image) => absolute(image.url));
  const isBundle = product.kind === "bundle";
  const rating = isBundle
    ? undefined
    : product.ratings.find((r) => r.source === "site" && r.count > 0 && !r.borrowedFrom);
  const isBook = product.kind === "book";
  const author = spec(product, "Author");
  const illustrator = spec(product, "Illustrator");
  const publisher = spec(product, "Publisher")?.split(",")[0]?.trim(); // CONFIRM publisher (copy deck §5, item 24)
  const isbn = spec(product, "ISBN-13")?.replace(/[^0-9X]/gi, ""); // CONFIRM ISBN (copy deck §5, item 24)
  const pages = Number.parseInt(spec(product, "Pages") ?? "", 10);

  return {
    "@context": "https://schema.org",
    "@type": isBook ? ["Product", "Book"] : "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: product.description,
    image: images,
    url,
    sku: product.variants.length === 1 ? product.variants[0].sku : undefined,
    brand: { "@type": "Brand", name: BRAND },
    ...(isBook
      ? {
          author: author ? { "@type": "Person", name: author } : undefined,
          illustrator: illustrator ? { "@type": "Person", name: illustrator } : undefined,
          publisher: publisher ? { "@type": "Organization", name: publisher } : undefined,
          isbn: isbn || undefined,
          numberOfPages: Number.isFinite(pages) ? pages : undefined,
          bookFormat: "https://schema.org/Hardcover",
          inLanguage: "en",
          typicalAgeRange: product.ageRange, // CONFIRM ages (copy deck §5, item 22)
        }
      : {}),
    offers:
      product.variants.length === 1
        ? offer(product, product.variants[0], url)
        : product.variants.map((variant) => offer(product, variant, url)),
    aggregateRating: rating
      ? {
          "@type": "AggregateRating",
          ratingValue: rating.value.toFixed(1),
          reviewCount: rating.count,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
  };
}

/** `<script type="application/ld+json">` for a product page. */
export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so no string in the catalog can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }}
    />
  );
}
