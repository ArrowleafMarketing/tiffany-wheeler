import Image, { type StaticImageData } from "next/image";
import logoSvg from "@/assets/images/brand/logo.svg";
import logoWhite from "@/assets/images/brand/logo-white.png";
import { cn } from "@/lib/cn";

type Props = {
  /** "color" is the periwinkle mark (light backgrounds); "white" is for dark ones. */
  variant?: "color" | "white";
  /** Size with a height class, e.g. "h-11" (width follows the 583×213 ratio). */
  className?: string;
  /** "Tiffany Wheeler, home" when it's the home link; "" when a text label sits next to it. */
  alt?: string;
  /** Above the fold (header): load eagerly instead of lazily. */
  eager?: boolean;
};

const svg = logoSvg as StaticImageData;

/** Tiffany Wheeler butterfly wordmark. The SVG is served as-is (unoptimized). */
export function Logo({ variant = "color", className, alt = "Tiffany Wheeler", eager }: Props) {
  const src = variant === "white" ? logoWhite : svg;
  return (
    <Image
      src={src}
      alt={alt}
      width={583}
      height={213}
      unoptimized={variant === "color"}
      sizes={variant === "white" ? "160px" : undefined}
      loading={eager ? "eager" : undefined}
      // The wordmark's strokes are hairline-thin; a tight same-colour shadow thickens them a touch.
      className={cn("h-11 w-auto", variant === "color" && "drop-shadow-[0_0_0.35px_#6771c8]", className)}
    />
  );
}
