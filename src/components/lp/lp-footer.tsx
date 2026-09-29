import Link from "next/link";
import { ChurchDisclaimer } from "@/components/layout/church-disclaimer";
import { lpFooterCopy } from "@/content/lp";
import { getCurrentSeason } from "@/lib/season";

/**
 * Landing-page footer: the required Church disclaimer, the store policies and
 * the copyright line. No nav columns, no signup and no social links, so the
 * only way forward is the offer (or the policies a careful buyer checks first).
 */
export async function LpFooter() {
  // The year comes from the cached season (Mountain Time), so the footer stays in the static shell.
  const { today } = await getCurrentSeason();
  return (
    <footer className="mt-auto border-t border-line bg-cream-deep text-sm text-body">
      <div className="container-page space-y-3 py-8 sm:py-10">
        <ChurchDisclaimer className="font-semibold text-ink" />
        <nav aria-label={lpFooterCopy.navLabel}>
          <ul className="-mx-2 flex flex-wrap">
            {lpFooterCopy.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="inline-flex min-h-11 items-center px-2 underline-offset-4 hover:text-ink hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-muted">{lpFooterCopy.copyright(today.slice(0, 4))}</p>
      </div>
    </footer>
  );
}
