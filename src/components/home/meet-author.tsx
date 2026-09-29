import { ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import { Img } from "@/components/ui/img";
import { meetAuthorCopy as copy } from "@/content/home-bottom";
import { fromStatic } from "@/lib/images";

const portrait = fromStatic(copy.photo.src, copy.photo.alt);
const illustrator = fromStatic(copy.illustratorPhoto.src, copy.illustratorPhoto.alt);

/**
 * Meet the author (§2.12): portrait, first-person bio, illustrator credit, link
 * to /about. Phones put a small portrait beside the heading.
 */
export async function MeetAuthor() {
  return (
    <section aria-labelledby="meet-tiffany-title" className="bg-cream py-12 sm:py-20">
      <div className="container-page">
        <div className="mx-auto grid max-w-4xl grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-4 sm:grid-cols-[11rem_1fr] sm:items-start sm:gap-x-10 sm:gap-y-0 lg:grid-cols-[14rem_1fr] lg:gap-x-14">
          <div className="sm:row-span-2">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-lift ring-4 ring-paper sm:rounded-(--radius-card)">
              <Img
                image={portrait}
                sizes="(min-width: 1024px) 224px, (min-width: 640px) 176px, 72px"
                className="h-full w-full object-cover object-[50%_25%]"
              />
            </div>
          </div>

          <h2
            id="meet-tiffany-title"
            className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl"
          >
            {copy.title}
          </h2>

          <div className="col-span-2 sm:col-span-1 sm:col-start-2">
            {/* Her own words, but not a quotation: a plain paragraph, not a <blockquote>. */}
            <p className="text-lg leading-relaxed text-body sm:mt-4">{copy.bio}</p>
            <p className="mt-4 flex items-start gap-2 text-sm font-medium text-muted">
              <Award aria-hidden className="mt-0.5 size-4 shrink-0 text-periwinkle-text" />
              {/* CONFIRM she wants this used (copy deck §2.12) */}
              {copy.credential}
            </p>

            {/* Phones skip the illustrator card; Peek Inside already credits Kelley Hicken. */}
            <div className="mt-6 flex items-center gap-4 rounded-(--radius-card) border border-line bg-paper p-4 shadow-soft max-sm:hidden">
              <div className="size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-periwinkle-light sm:size-14">
                <Img image={illustrator} sizes="56px" className="h-full w-full object-cover object-[50%_20%]" />
              </div>
              <p className="text-sm leading-relaxed text-body sm:text-base">{copy.illustrator}</p>
            </div>

            <Link
              href={copy.link.href}
              prefetch={false}
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-periwinkle-text underline-offset-4 hover:text-ink hover:underline sm:mt-5"
            >
              {copy.link.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
