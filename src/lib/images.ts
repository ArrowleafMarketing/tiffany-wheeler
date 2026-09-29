import type { StaticImageData } from "next/image";
import type { Image } from "@/lib/commerce/types";

/** Turns a static image import into the commerce `Image` shape (keeps the blur placeholder). */
export function fromStatic(src: StaticImageData, alt: string): Image {
  return { url: src.src, width: src.width, height: src.height, alt, blurDataURL: src.blurDataURL };
}
