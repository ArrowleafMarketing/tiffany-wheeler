import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Anchor id (e.g. "pickup" for /shipping#pickup). */
  id: string;
  title: ReactNode;
  /** Small hand-lettered line above the heading. */
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

/** A titled section inside an info page's readable column (h2 + content). */
export function InfoSection({ id, title, eyebrow, children, className }: Props) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-24", className)}>
      {eyebrow ? (
        <p className="mb-1 font-hand text-xl leading-none text-periwinkle-text sm:text-2xl">{eyebrow}</p>
      ) : null}
      <h2
        id={headingId}
        className="text-2xl font-semibold leading-[1.15] tracking-[-0.01em] sm:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
