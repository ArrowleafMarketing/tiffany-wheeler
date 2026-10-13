import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/post-card";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { BLOG } from "@/content/blog";
import { getArticles } from "@/lib/commerce";

export const metadata: Metadata = {
  title: BLOG.meta.title,
  description: BLOG.meta.description,
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: `${BLOG.meta.title} | Tiffany Wheeler`, description: BLOG.meta.description },
};

// Posts come from Shopify's blog (cached, "blog" profile), so the page is static
// and refreshes every few minutes. With no published posts the blog doesn't exist:
// this 404s, and the footer link and sitemap entries disappear with it.
export default async function BlogPage() {
  const posts = await getArticles();
  if (!posts.length) notFound();
  const [lead, ...rest] = posts;

  return (
    <InfoPageShell layout="bands" eyebrow={BLOG.eyebrow} title={BLOG.title} intro={BLOG.intro}>
      <div className="container-page pb-16 pt-8 sm:pb-24 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          <PostCard post={lead} variant="lead" preload />
          {rest.length ? (
            <ul className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {rest.map((post) => (
                <li key={post.handle}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </InfoPageShell>
  );
}
