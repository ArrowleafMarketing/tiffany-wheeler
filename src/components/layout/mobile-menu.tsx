"use client";

import { ChevronRight, Menu, Truck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { NavLink } from "@/content/site";
import type { Image } from "@/lib/commerce/types";
import { Img } from "@/components/ui/img";

export type MobileMenuLink = NavLink & { image?: Image };

type Props = {
  nav: MobileMenuLink[];
  extra: NavLink[];
  footerLine: string;
  labels: { open: string; close: string; menu: string; extra: string };
  /** The logo, rendered by the server (a link home). */
  logo: ReactNode;
};

/**
 * Hamburger + slide-in sheet for phones. A native modal <dialog> gives focus
 * trapping, Escape to close, an inert page behind it and focus return.
 */
export function MobileMenu({ nav, extra, footerLine, labels, logo }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  function show() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    closeRef.current?.focus();
    setOpen(true);
  }

  function hide() {
    dialogRef.current?.close();
  }

  // Lock page scroll behind the sheet.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Close if the header is hidden/unmounted with the sheet open.
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => dialog?.close();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label={labels.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-ml-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
      >
        <Menu className="size-6" aria-hidden />
      </button>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label={labels.menu}
        onClose={() => setOpen(false)}
        onKeyDown={(e) => {
          // Native Escape handling varies in in-app browsers; close explicitly.
          if (e.key === "Escape") {
            e.preventDefault();
            hide();
          }
        }}
        onClick={(e) => {
          // Backdrop clicks land on the <dialog> itself; any link inside navigates away.
          if (e.target === e.currentTarget || (e.target as Element).closest("a")) hide();
        }}
        className="fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-[min(88vw,22rem)] max-w-none translate-x-0 bg-paper p-0 text-body shadow-lift transition-transform duration-200 ease-out backdrop:bg-ink/45 starting:open:-translate-x-full"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
            {logo}
            <button
              ref={closeRef}
              type="button"
              onClick={hide}
              aria-label={labels.close}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <nav aria-label={labels.menu}>
              <ul className="divide-y divide-line">
                {nav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-14 items-center gap-3 py-2 font-display text-lg font-semibold text-ink"
                    >
                      {link.image ? (
                        <span className="flex size-12 shrink-0 items-center justify-center">
                          <Img
                            image={link.image}
                            alt=""
                            sizes="48px"
                            className="h-auto max-h-12 w-auto max-w-12 rounded-[2px_5px_5px_2px] shadow-soft"
                          />
                        </span>
                      ) : null}
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight className="size-5 text-muted" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 rounded-(--radius-card) bg-cream px-4 py-2">
              <h2 className="sr-only">{labels.extra}</h2>
              <ul>
                {extra.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-11 items-center text-[0.95rem] font-semibold text-ink underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="flex shrink-0 items-center justify-center gap-2 border-t border-line bg-butter px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-sm font-semibold text-ink">
            <Truck className="size-4 text-forest" aria-hidden />
            {footerLine}
          </p>
        </div>
      </dialog>
    </>
  );
}
