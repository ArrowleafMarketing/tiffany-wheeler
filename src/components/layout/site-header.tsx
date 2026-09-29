import Link from "next/link";
import bothBooks from "@/assets/images/books/both-books.jpg";
import ejCover from "@/assets/images/books/ej-cover.jpg";
import ncCover from "@/assets/images/books/nc-cover.jpg";
import { CartButton } from "@/components/cart/cart-button";
import { HEADER, MOBILE_EXTRA_LINKS, mainNav } from "@/content/site";
import { fromStatic } from "@/lib/images";
import { getCurrentSeason } from "@/lib/season";
import { HANDLES, productPath } from "@/lib/store-config";
import { Logo } from "./logo";
import { MobileMenu, type MobileMenuLink } from "./mobile-menu";

type Props = {
  /** Landing pages (/lp/*): logo only, not a link, no nav (§1.3). The cart stays reachable. */
  minimal?: boolean;
};

// Small covers beside the book links in the mobile menu (decorative; the label names the book).
const MENU_THUMBS: Record<string, ReturnType<typeof fromStatic>> = {
  [productPath(HANDLES.nephiteChristmas)]: fromStatic(ncCover, ""),
  [productPath(HANDLES.easterJourney)]: fromStatic(ejCover, ""),
  [productPath(HANDLES.completeSet)]: fromStatic(bothBooks, ""),
};

const headerClasses =
  "sticky top-0 z-40 border-b border-line/80 bg-cream/95 backdrop-blur-md supports-[backdrop-filter]:bg-cream/85";

/** Sticky site header: logo, season-ordered nav, cart; hamburger sheet on phones. */
export async function SiteHeader({ minimal = false }: Props) {
  if (minimal) {
    return (
      <header className={headerClasses}>
        <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[4.75rem]">
          <span />
          <Logo alt={HEADER.logoAltPlain} eager className="h-14 lg:h-[4.25rem]" />
          <div className="flex justify-end">
            <CartButton className="-mr-2" />
          </div>
        </div>
      </header>
    );
  }

  const season = await getCurrentSeason();
  const nav = mainNav(season.mode);
  const menuNav: MobileMenuLink[] = nav.map((link) => ({ ...link, image: MENU_THUMBS[link.href] }));

  return (
    <header className={headerClasses}>
      <div className="container-page flex h-16 items-center gap-2 lg:h-[4.75rem]">
        {/* Phones and tablets: hamburger left, logo centred, cart right. */}
        <div className="flex flex-1 items-center lg:hidden">
          <MobileMenu
            nav={menuNav}
            extra={MOBILE_EXTRA_LINKS}
            footerLine={HEADER.mobileFooterLine}
            labels={{
              open: HEADER.openMenu,
              close: HEADER.closeMenu,
              menu: HEADER.menuLabel,
              extra: HEADER.mobileExtraLabel,
            }}
            logo={
              <Link href="/" prefetch={false} className="-my-1 inline-flex rounded-md py-1">
                <Logo alt={HEADER.logoAlt} className="h-9" />
              </Link>
            }
          />
        </div>

        <div className="flex shrink-0 justify-center lg:flex-1 lg:justify-start">
          {/* No prefetch: the home tree is large and rarely the next page from a product page. */}
          <Link href="/" prefetch={false} className="-my-1 inline-flex rounded-md py-1">
            <Logo alt={HEADER.logoAlt} eager className="h-14 lg:h-[4.25rem]" />
          </Link>
        </div>

        <nav aria-label={HEADER.mainNavLabel} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex h-11 items-center rounded-full px-3 text-[0.95rem] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-ink/5 xl:px-3.5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-1 items-center justify-end">
          <CartButton className="-mr-2" />
        </div>
      </div>
    </header>
  );
}
