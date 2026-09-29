import NextImage from "next/image";
import type { Image } from "@/lib/commerce/types";

export { fromStatic } from "@/lib/images";

type Props = {
  image: Image;
  /** Required for responsive images; describe the rendered width, e.g. "(min-width: 1024px) 480px, 90vw". */
  sizes: string;
  className?: string;
  /**
   * Only for the single LCP image of a page: preloads it and raises its fetch
   * priority above fonts and scripts.
   */
  preload?: boolean;
  /** Visible above the fold but not the LCP image (e.g. a second hero cover). */
  eager?: boolean;
  quality?: 60 | 75 | 85 | 90;
  /**
   * Show the tiny blurred placeholder while loading. Opt-in: each one adds
   * ~1 KB to the HTML and the RSC payload, so keep it for large, prominent
   * images (hero, gallery, covers) and rely on background colors elsewhere.
   */
  blur?: boolean;
  /** Override alt (e.g. "" for decorative duplicates). */
  alt?: string;
};

/** next/image for commerce `Image` values (mock static imports today, Shopify CDN URLs later). */
export function Img({ image, sizes, className, preload, eager, quality, blur, alt }: Props) {
  const withBlur = Boolean(blur && image.blurDataURL);
  return (
    <NextImage
      src={image.url}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      sizes={sizes}
      className={className}
      preload={preload}
      fetchPriority={preload ? "high" : undefined}
      loading={!preload && eager ? "eager" : undefined}
      quality={quality}
      placeholder={withBlur ? "blur" : "empty"}
      blurDataURL={withBlur ? image.blurDataURL : undefined}
    />
  );
}
