import type { CSSProperties } from "react";
import type { Image } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { Img } from "@/components/ui/img";

type Props = {
  cover: Image;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** Only for the page's LCP cover: preloads it at high priority. */
  preload?: boolean;
  /** Visible above the fold but not the LCP image (e.g. a second hero cover). */
  eager?: boolean;
  /** Blurred placeholder while loading. Defaults to on for the preloaded (LCP) cover only. */
  blur?: boolean;
  /** Slight 3D turn, for hero compositions. */
  tilt?: "left" | "right" | "none";
};

/**
 * Renders a flat front cover as a hardcover book: spine shading, a hint of
 * page edges and a soft cast shadow. Keeps both books visually consistent
 * without needing separate 3D mockups. Size it by width (the height follows the
 * cover's aspect ratio) or by height with `w-auto`.
 */
export function BookCover({ cover, sizes, className, style, preload, eager, blur, tilt = "none" }: Props) {
  return (
    <div
      className={cn("relative min-h-0 min-w-0 [perspective:1400px]", className)}
      style={{ aspectRatio: `${cover.width} / ${cover.height}`, ...style }}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
          tilt === "left" && "[transform:rotateY(14deg)_rotateZ(-1deg)]",
          tilt === "right" && "[transform:rotateY(-14deg)_rotateZ(1deg)]",
        )}
      >
        {/* page block peeking out on the fore-edge */}
        <div
          aria-hidden
          className="absolute inset-y-[1.2%] -right-[2.2%] w-[4%] rounded-r-[3px] bg-[repeating-linear-gradient(90deg,#fffaf0_0_1px,#e8dcc4_1px_2px)] shadow-[inset_1px_0_2px_rgb(0_0_0/0.15)]"
        />
        <div className="relative h-full w-full overflow-hidden rounded-[3px_8px_8px_3px] shadow-book">
          <Img
            image={cover}
            sizes={sizes}
            preload={preload}
            eager={eager}
            blur={blur ?? preload}
            quality={85}
            className="absolute inset-0 size-full object-cover"
          />
          {/* spine hinge + gloss */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.28)_0%,rgb(255_255_255/0.18)_1.8%,rgb(0_0_0/0.12)_3.2%,transparent_7%,transparent_78%,rgb(255_255_255/0.06)_100%)]"
          />
        </div>
      </div>
    </div>
  );
}
