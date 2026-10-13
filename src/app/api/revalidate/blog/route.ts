import { revalidateTag } from "next/cache";

// Shows a newly published or edited blog post right away instead of within the
// "blog" cache window (~10 minutes). Same secret as the season cron:
//   curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://tiffany-wheeler.com/api/revalidate/blog
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidateTag("articles", { expire: 0 });
  return Response.json({ revalidated: "articles" });
}
