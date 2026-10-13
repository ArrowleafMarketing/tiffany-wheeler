import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import logo from "@/assets/images/brand/logo.png";
import { formatPostDate, postPath } from "@/components/blog/format";
import { PostBody } from "@/components/blog/post-body";
import { PostCard } from "@/components/blog/post-card";
import { ProductCard } from "@/components/product/product-card";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { BLOG } from "@/content/blog";
import { SITE } from "@/content/site";
import { getArticle, getArticles, getProducts } from "@/lib/commerce";
import type { Article } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { HANDLES, SITE_URL } from "@/lib/store-config";

// Every published post prerenders at build; one published later renders on its
// first visit and is cached from then on. Cache Components needs at least one
// param, so with no posts a placeholder stands in (and 404s).
const PLACEHOLDER = "__no-posts__";

export async function generateStaticParams() {
  const posts = await getArticles();
  return posts.length ? posts.map((post) => ({ handle: post.handle })) : [{ handle: PLACEHOLDER }];
}

const absolute = (url: string) => new URL(url, SITE_URL).toString();

/** Shopify's "Search engine listing" description, else the excerpt, trimmed for a meta description. */
function description(post: Article): string {
  const text = post.seo.description ?? post.excerpt;
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}…` : text;
}

export async function generateMetadata({ params }: PageProps<"/blog/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const post = await getArticle(handle);
  if (!post) return {};
  const title = post.seo.title ?? post.title;
  const url = postPath(post.handle);
  const image = post.image;
  return {
    title,
    description: description(post),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      locale: "en_US",
      url,
      title,
      description: description(post),
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
    twitter: { card: image ? "summary_large_image" : "summary" },
  };
}

const PRODUCT_HANDLES = new Set<string>(Object.values(HANDLES));

export default async function BlogPostPage({ params }: PageProps<"/blog/[handle]">) {
  const { handle } = await params;
  const post = await getArticle(handle);
  if (!post) notFound();

  // A tag that is a product handle ("nephite-christmas") puts that product under the post.
  const tagged = post.tags.filter((tag) => PRODUCT_HANDLES.has(tag)).slice(0, 3);
  const [products, posts] = await Promise.all([
    tagged.length ? getProducts({ handles: tagged }) : Promise.resolve([]),
    getArticles(),
  ]);
  const more = posts.filter((p) => p.handle !== post.handle).slice(0, 3);
  const url = absolute(postPath(post.handle));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: description(post),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    image: post.image ? [absolute(post.image.url)] : undefined,
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE_URL, logo: { "@type": "ImageObject", url: absolute(logo.src) } },
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
  };

  return (
    <main id="main" className="flex-1 bg-cream">
      <article>
        <header className="bg-cream-deep pb-px">
          <div className="container-page pt-6 sm:pt-10">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/blog"
                className="-ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-semibold text-periwinkle-text underline-offset-4 hover:text-ink hover:underline"
              >
                <ArrowLeft aria-hidden className="size-4" />
                {BLOG.allPosts}
              </Link>
              <p className="mt-3 text-sm text-muted sm:text-base">
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                {post.author ? <> · {BLOG.byline(post.author)}</> : null}
              </p>
              <h1 className="mt-2 text-4xl font-semibold leading-[1.08] tracking-[-0.015em] sm:text-5xl">{post.title}</h1>
              {post.excerpt && !post.image ? (
                <p className="mt-4 text-lg leading-relaxed text-body sm:text-xl">{post.excerpt}</p>
              ) : null}
            </div>
          </div>
          {post.image ? (
            // The photo straddles the header band and the page.
            <div className="container-page mt-8 -mb-24 sm:mt-10 sm:-mb-40">
              <div className="relative mx-auto aspect-[3/2] max-w-5xl overflow-hidden rounded-(--radius-card) bg-cream shadow-lift sm:aspect-[2/1]">
                <Img
                  image={post.image}
                  preload
                  sizes="(min-width: 1088px) 1024px, 94vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="h-10 sm:h-14" />
          )}
        </header>

        <div className={cn("container-page pb-14 sm:pb-20", post.image ? "pt-32 sm:pt-52" : "pt-10 sm:pt-14")}>
          <div className="mx-auto max-w-2xl lg:max-w-[46rem]">
            {post.contentHtml ? <PostBody html={post.contentHtml} /> : null}
          </div>
        </div>
      </article>

      {products.length ? (
        <section aria-labelledby="post-products-title" className="border-t border-line bg-paper py-14 sm:py-20">
          <div className="container-page">
            <SectionHeading
              id="post-products-title"
              eyebrow={BLOG.productsEyebrow}
              title={BLOG.productsTitle(products.length)}
            />
            <ul
              className={cn(
                "mx-auto mt-10 grid gap-6",
                products.length === 1 ? "max-w-xl" : products.length === 2 ? "max-w-4xl sm:grid-cols-2" : "max-w-6xl sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {products.map((product) => (
                <li key={product.handle}>
                  <ProductCard product={product} variant={products.length === 1 ? "featured" : "default"} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {more.length ? (
        <section aria-labelledby="more-posts-title" className="border-t border-line bg-cream py-14 sm:py-20">
          <div className="container-page">
            <SectionHeading id="more-posts-title" title={BLOG.morePostsTitle} />
            <ul
              className={cn(
                "mx-auto mt-10 grid gap-6 sm:gap-8",
                more.length === 1 ? "max-w-sm" : more.length === 2 ? "max-w-3xl sm:grid-cols-2" : "max-w-6xl sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {more.map((p) => (
                <li key={p.handle}>
                  <PostCard post={p} as="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
