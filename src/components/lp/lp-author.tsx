import { Img } from "@/components/ui/img";
import { meetAuthorCopy as copy } from "@/content/home-bottom";
import { fromStatic } from "@/lib/images";

const portrait = fromStatic(copy.photo.src, copy.photo.alt);

/**
 * Short author bio (copy deck §2.12) with her photo and the illustrator credit.
 * No link to /about: on an ad landing page every exit costs an order.
 */
export function LpAuthor() {
  return (
    <section aria-labelledby="lp-author-heading" className="bg-cream py-12 sm:py-16">
      <div className="container-page">
        <div className="mx-auto grid max-w-3xl grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-start sm:gap-x-8">
          <div className="overflow-hidden rounded-full shadow-soft ring-4 ring-paper sm:row-span-2">
            <Img
              image={portrait}
              sizes="(min-width: 640px) 144px, 80px"
              className="aspect-square h-auto w-full object-cover object-[50%_25%]"
            />
          </div>
          <h2
            id="lp-author-heading"
            className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] sm:self-end sm:text-4xl"
          >
            {copy.title}
          </h2>
          <div className="col-span-2 sm:col-span-1 sm:col-start-2">
            {/* Her own words, but not a quotation: a plain paragraph, not a <blockquote>. */}
            <p className="text-[1.0625rem] leading-relaxed text-body">{copy.bio}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{copy.illustrator}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
