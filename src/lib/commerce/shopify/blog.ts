import "server-only";

import type { Article, Image } from "../types";
import { storefront } from "./client";

/*
  Blog posts from Shopify's blog (Content → Blog posts), read through the
  Storefront API. Posts from every blog are listed together, newest first. The
  Headless channel's token needs the "read content" permission
  (unauthenticated_read_content); without it, or if Shopify is unreachable,
  the blog is hidden instead of breaking the pages that link to it.
*/

type SArticle = {
  handle: string;
  title: string;
  excerpt: string | null;
  preview: string;
  publishedAt: string;
  tags: string[];
  authorV2: { name: string } | null;
  blog: { handle: string };
  image: { url: string; altText: string | null; width: number | null; height: number | null } | null;
  seo: { title: string | null; description: string | null } | null;
  contentHtml?: string;
};

const ARTICLE_FIELDS = `fragment ArticleCard on Article { handle title excerpt preview: content(truncateAt: 220) publishedAt tags authorV2 { name } blog { handle } image { url altText width height } seo { title description } }`;

const LIST_QUERY = `${ARTICLE_FIELDS}\nquery BlogArticles { articles(first: 100, sortKey: PUBLISHED_AT, reverse: true) { nodes { ...ArticleCard } } }`;

const POST_QUERY = `${ARTICLE_FIELDS}\nquery BlogArticle($blog: String!, $handle: String!) { blog(handle: $blog) { articleByHandle(handle: $handle) { ...ArticleCard contentHtml } } }`;

function toImage(image: SArticle["image"], title: string): Image | undefined {
  if (!image) return undefined;
  // Article images usually carry their size; 3:2 is a safe guess when they don't.
  return { url: image.url, width: image.width ?? 1500, height: image.height ?? 1000, alt: image.altText ?? title };
}

function toArticle(a: SArticle): Article {
  return {
    handle: a.handle,
    title: a.title,
    excerpt: (a.excerpt?.trim() || a.preview).replace(/\s+/g, " ").trim(),
    contentHtml: a.contentHtml,
    publishedAt: a.publishedAt,
    author: a.authorV2?.name || undefined,
    tags: a.tags.map((t) => t.trim().toLowerCase()),
    image: toImage(a.image, a.title),
    seo: { title: a.seo?.title || undefined, description: a.seo?.description || undefined },
  };
}

/** Logs why the blog is hidden: the missing permission gets a fix-it message. */
function report(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/unauthenticated_read_content|access denied/i.test(message)) {
    console.warn(
      "[blog] Hidden: the Shopify Headless channel's Storefront API token can't read blog posts. In Shopify admin → Sales channels → Headless → (storefront) → Storefront API permissions, enable “Read content” (unauthenticated_read_content) and save.",
    );
  } else {
    console.error(`[blog] Hidden: couldn’t load posts from Shopify (${message})`);
  }
}

/** Every published post, newest first, with the blog it belongs to. */
async function listArticles(): Promise<{ article: Article; blog: string }[]> {
  const data = await storefront<{ articles: { nodes: SArticle[] } }>(LIST_QUERY);
  // Handles are unique per blog, not per store: the newest post wins a clash.
  const seen = new Set<string>();
  return data.articles.nodes
    .filter((a) => !seen.has(a.handle) && Boolean(seen.add(a.handle)))
    .map((a) => ({ article: toArticle(a), blog: a.blog.handle }));
}

export async function getArticles(): Promise<Article[]> {
  try {
    return (await listArticles()).map(({ article }) => article);
  } catch (error) {
    report(error);
    return [];
  }
}

export async function getArticle(handle: string): Promise<Article | null> {
  try {
    const found = (await listArticles()).find(({ article }) => article.handle === handle);
    if (!found) return null;
    const data = await storefront<{ blog: { articleByHandle: SArticle | null } | null }>(POST_QUERY, {
      blog: found.blog,
      handle,
    });
    const article = data.blog?.articleByHandle;
    return article ? toArticle(article) : null;
  } catch (error) {
    report(error);
    return null;
  }
}
