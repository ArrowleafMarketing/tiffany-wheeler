// Blog copy (not in the copy deck; drafted in the deck's voice for review).
// Posts themselves are written in Shopify (Content → Blog posts).

import type { NavLink } from "@/content/site";

export const BLOG = {
  /** Footer link, shown only while at least one post is published. */
  nav: { label: "Blog", href: "/blog" } satisfies NavLink,
  /** The footer column it joins. */
  footerColumn: "About",
  meta: {
    title: "Blog",
    description:
      "Christ-centered Christmas and Easter traditions, family reading ideas and the stories behind Nephite Christmas and Easter Journey, from author Tiffany Wheeler.",
  },
  eyebrow: "From Tiffany",
  title: "The Blog",
  intro: "Traditions, family reading ideas and the stories behind the books.",
  latest: "Latest post",
  readMore: "Read the post",
  allPosts: "All posts",
  byline: (author: string) => `By ${author}`,
  productsEyebrow: "Read it together",
  productsTitle: (count: number) => (count === 1 ? "The book from this post" : "From this post"),
  morePostsTitle: "More from the blog",
} as const;
