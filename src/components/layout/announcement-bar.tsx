import { ANNOUNCEMENT, announcementMessages } from "@/content/site";
import { getProduct } from "@/lib/commerce";
import { getCurrentSeason, type Season } from "@/lib/season";
import { HANDLES } from "@/lib/store-config";
import { AnnouncementTicker } from "./announcement-ticker";

/** Slim season bar above the header. Season comes from the cached config. */
export async function AnnouncementBar() {
  const [season, nc] = await Promise.all([getCurrentSeason(), getProduct(HANDLES.nephiteChristmas)]);
  // "Five-star" only while every review is five stars.
  const site = nc?.ratings.find((r) => r.source === "site" && r.count > 0 && !r.borrowedFrom);
  const ncReviewCount = site && site.value >= 5 ? site.count : 0;
  return <AnnouncementBarView season={season} ncReviewCount={ncReviewCount} />;
}

/** Presentational half, exported for previews of other season modes. */
export function AnnouncementBarView({ season, ncReviewCount = 0 }: { season: Season; ncReviewCount?: number }) {
  const messages = announcementMessages(season, { ncReviewCount });
  if (messages.length === 0) return null;
  const festive = season.mode === "christmas" || season.mode === "christmas-last-minute";
  const tone = festive ? "night" : "butter";
  return (
    <aside
      aria-label={ANNOUNCEMENT.regionLabel}
      className={festive ? "bg-night text-gold" : "border-b border-butter-deep/60 bg-butter text-ink"}
    >
      {/* Full-bleed at every width so the ticker runs edge to edge. */}
      <div>
        <AnnouncementTicker
          messages={messages}
          tone={tone}
          labels={{ pause: ANNOUNCEMENT.pause, play: ANNOUNCEMENT.play }}
          secondsPerMessage={ANNOUNCEMENT.secondsPerMessage}
        />
      </div>
    </aside>
  );
}
