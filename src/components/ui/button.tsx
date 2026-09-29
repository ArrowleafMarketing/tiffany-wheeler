import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "night";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-btn) font-semibold tracking-[-0.005em] transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-60 select-none";

const variants: Record<ButtonVariant, string> = {
  // Main purchase action (mockup green).
  primary: "bg-forest text-white shadow-soft hover:bg-forest-dark",
  // The bundle / "best value" action (mockup orange).
  accent: "bg-ember text-white shadow-soft hover:bg-ember-dark",
  outline: "border-2 border-ink/15 bg-paper text-ink hover:border-ink/30 hover:bg-white",
  ghost: "text-ink hover:bg-ink/5",
  // For dark Christmas night sections.
  night: "bg-gold text-night shadow-soft hover:bg-[#edc57a]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base sm:text-[1.05rem]",
};

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the container width (mobile buy boxes). */
  block?: boolean;
  className?: string;
  children: ReactNode;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  block,
  className,
}: Omit<Common, "children">) {
  return cn(base, variants[variant], sizes[size], block && "w-full", className);
}

export function Button({
  variant,
  size,
  block,
  className,
  children,
  type = "button",
  ...props
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, block, className })} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  block,
  className,
  children,
  ...props
}: Common & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={buttonClasses({ variant, size, block, className })} {...props}>
      {children}
    </Link>
  );
}
