import { selectHeroCopy } from "@/components/home/hero";
import { TrustStrip } from "@/components/product/trust-strip";
import { trustBandLabel } from "@/content/home-top";
import { getCurrentSeason } from "@/lib/season";
import { HANDLES } from "@/lib/store-config";

/** The reviews item is left out: the hero's rating row sits one swipe above. */
const HOME_TRUST_IDS = ["shipping", "ships-from", "gift-note", "guarantee"] as const;

/** When the hero leads with the PDF, the guarantee comes out: /returns excludes downloaded PDFs. */
const PDF_LED_TRUST_IDS = ["instant", "shipping", "ships-from", "gift-note"] as const;

/**
 * The trust strip band directly under the hero (copy deck §2.2). Four items, so
 * phones get a clean 2 × 2 grid with no orphan; which claims appear is decided
 * by CLAIMS in store-config (see trustItems). The hero has no checkmark line,
 * so this band carries the store promises.
 */
export async function TrustBand() {
  const season = await getCurrentSeason();
  const pdfLeads = selectHeroCopy(season).primary.add === HANDLES.ncPdf;
  return (
    <section aria-label={trustBandLabel} className="border-y border-line bg-paper">
      <div className="container-page py-5 sm:py-7">
        <TrustStrip variant="band" ids={pdfLeads ? PDF_LED_TRUST_IDS : HOME_TRUST_IDS} />
      </div>
    </section>
  );
}
