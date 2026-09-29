import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  /** Heading level; sections under the page H1 use h2. */
  as?: "h2" | "h3";
  /** Use on dark (night) backgrounds. */
  inverted?: boolean;
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  inverted,
  className,
  id,
}: Props) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-2 font-hand text-xl leading-none sm:text-2xl",
            inverted ? "text-gold" : "text-periwinkle-text",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag
        id={id}
        className={cn(
          "text-3xl font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl",
          inverted && "text-white",
        )}
      >
        {title}
      </Tag>
      {subtitle ? (
        <p className={cn("mt-3 text-base sm:text-lg", inverted ? "text-white/80" : "text-body")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
