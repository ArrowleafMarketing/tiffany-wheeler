import { revalidateTag } from "next/cache";

// Daily at 00:05 Mountain Time (vercel.json cron): expire everything tagged
// "season" so order-by dates, "Get it by" lines and the announcement bar roll
// over with the calendar instead of waiting for the hourly cache to lapse.
// Vercel sends `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidateTag("season", { expire: 0 });
  return Response.json({ revalidated: "season" });
}
