import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Img } from "@/components/ui/img";
import { BLOG } from "@/content/blog";
import type { Article } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatPostDate, postPath } from "./format";

type Props = {
  post: Article;
  /** 'lead': the newest post, wide (image beside the text from md). 'default': grid card. */
  variant?: "lead" | "default";
  /** Heading level inside the page. */
  as?: "h2" | "h3";
  /** Only for the index page's lead image (the LCP). */
  preload?: boolean;
};

/** A post's image, date, title, excerpt and link, for the blog index and "More from the blog". */
export function PostCard({ post, variant = "default", as: Heading = "h2", preload }: Props) {
  const href = postPath(post.handle);
  const lead = variant === "lead";
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-(--radius-card) border border-line bg-paper shadow-soft transition-shadow duration-300 hover:shadow-lift",
        lead && "md:grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]",
      )}
    >
      <div className={cn("relative aspect-[3/2] overflow-hidden bg-cream-deep", lead && "md:aspect-auto md:min-h-80")}>
        {post.image ? (
          <Img
            image={post.image}
            sizes={lead ? "(min-width: 1216px) 660px, (min-width: 768px) 56vw, 92vw" : "(min-width: 1024px) 370px, (min-width: 640px) 46vw, 92vw"}
            preload={preload}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className={cn("flex flex-1 flex-col gap-2 p-5 sm:p-6", lead && "md:justify-center md:p-8 lg:p-10")}>
        {lead ? <p className="font-hand text-xl leading-none text-periwinkle-text">{BLOG.latest}</p> : null}
        <p className="text-sm text-muted">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
        </p>
        <Heading
          className={cn(
            "font-semibold leading-[1.15] tracking-[-0.01em]",
            lead ? "text-2xl sm:text-3xl" : "text-xl",
          )}
        >
          {/* The whole card is clickable through this link's ::after. */}
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:text-periwinkle-text">
            {post.title}
          </Link>
        </Heading>
        {post.excerpt ? (
          <p className={cn("leading-relaxed text-body", lead ? "line-clamp-4 text-base sm:text-lg" : "line-clamp-3 text-[0.9375rem]")}>
            {post.excerpt}
          </p>
        ) : null}
        <p
          aria-hidden
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-periwinkle-text"
        >
          {BLOG.readMore}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}
