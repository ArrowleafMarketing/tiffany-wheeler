import type { Metadata } from "next";
import { AddOnsRow } from "@/components/home/add-ons-row";
import { ClosingCta } from "@/components/home/closing-cta";
import { CompleteSetBar } from "@/components/home/complete-set-bar";
import { EmailCapture } from "@/components/home/email-capture";
import { FaqSection } from "@/components/home/faq-section";
import { HeroSection } from "@/components/home/hero";
import { HomeStickyBar } from "@/components/home/home-sticky-bar";
import { MeetAuthor } from "@/components/home/meet-author";
import { PeekInside } from "@/components/home/peek-inside";
import { ReviewsSection } from "@/components/home/reviews-section";
import { ShopRow } from "@/components/home/shop-row";
import { TrustBand } from "@/components/home/trust-band";
import { VideoSection } from "@/components/home/video-section";
import { WhyFamilies } from "@/components/home/why-families";
import { getCurrentSeason } from "@/lib/season";
import { CLAIMS } from "@/lib/store-config";

// CONFIRM price + free-shipping threshold (copy deck §1.1). The shipping half
// only appears while the free-shipping claim is switched on.
export const metadata: Metadata = {
  title: { absolute: "Nephite Christmas & Easter Journey | Tiffany Wheeler" },
  description: `A Book of Mormon Christmas story in the rhythm of ’Twas the Night Before Christmas, plus an 8-day Holy Week journey. Get both books for $49.99${CLAIMS.freeShipping ? ", ships free" : ""}.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nephite Christmas & Easter Journey, by Tiffany Wheeler",
    description: `Two illustrated hardcovers for His birth and His Resurrection. Get both books for $49.99${CLAIMS.freeShipping ? " with free US shipping" : ""}.`,
  },
};

/**
 * Homepage. Sections read the season and catalog themselves (all cached), so
 * the whole page prerenders into the static shell.
 *
 * Christmas modes (paid Meta traffic, cold, on phones) get a shorter page that
 * keeps Nephite Christmas and the set in front: proof right after the offer,
 * then the book itself, the family story, one email ask, a closing buy band,
 * and only then the author and FAQ. The add-ons row is left out (the cart
 * drawer already upsells them, and the PDF stays in /shop and the last-minute
 * hero), and "How families use it" is folded into "Why families". The other seasons keep the fuller deck order (§2).
 */
export default async function Home() {
  const season = await getCurrentSeason();
  const christmas = season.mode === "christmas" || season.mode === "christmas-last-minute";

  return (
    <main id="main" className="flex-1">
      <HeroSection season={season} />
      <TrustBand />
      <ShopRow season={season} />
      {christmas ? (
        <>
          <VideoSection />
          <ReviewsSection />
          <CompleteSetBar />
          <PeekInside />
          <WhyFamilies />
          <EmailCapture />
          <ClosingCta />
          <MeetAuthor />
          {/* CONTENT OWNER: the homepage FAQ should be the 6-item home list (see faq.ts). */}
          <FaqSection />
        </>
      ) : (
        <>
          <CompleteSetBar />
          <WhyFamilies />
          <PeekInside />
          <VideoSection />
          <ReviewsSection />
          <AddOnsRow />
          <EmailCapture />
          <MeetAuthor />
          <FaqSection />
        </>
      )}
      <HomeStickyBar />
    </main>
  );
}
