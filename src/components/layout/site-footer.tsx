import { cacheLife } from "next/cache";
import Link from "next/link";
import { EmailCapture } from "@/components/home/email-capture";
import { FOOTER, HEADER } from "@/content/site";
import { ChurchDisclaimer } from "./church-disclaimer";
import { Logo } from "./logo";
import { SocialLinks } from "./social-icons";

/** The current year, cached daily so the footer stays in the static shell. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

/** Site footer: blurb, link columns, email signup, social, legal row and the Church disclaimer. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-cream-deep text-body">
      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Link href="/" prefetch={false} className="inline-flex rounded-md">
            <Logo alt={HEADER.logoAlt} className="h-12" />
          </Link>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed">{FOOTER.blurb}</p>
          <SocialLinks className="mt-5" />
        </div>

        <div className="lg:order-last lg:col-span-3">
          <EmailCapture variant="compact" />
        </div>

        <nav
          aria-label={FOOTER.navLabel}
          className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-span-5"
        >
          {FOOTER.columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-sans text-sm font-bold tracking-[0.08em] text-ink uppercase">{column.title}</h2>
              <ul className="mt-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="inline-flex min-h-11 items-center py-1 text-[0.95rem] leading-snug text-body underline-offset-4 hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="container-page space-y-4 py-6 text-sm">
          <ChurchDisclaimer className="font-semibold text-ink" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CopyrightYear /> {FOOTER.copyrightHolder}. {FOOTER.copyrightSuffix}
            </p>
            <nav aria-label={FOOTER.legalLabel}>
              <ul className="flex flex-wrap gap-x-5">
                {FOOTER.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {FOOTER.showPaymentLine ? <p className="text-muted">{FOOTER.paymentLine}</p> : null}
        </div>
      </div>
    </footer>
  );
}
