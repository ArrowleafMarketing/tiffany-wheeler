import { Gift, House, MoonStar, Presentation, type LucideIcon } from "lucide-react";
import doveArt from "@/assets/images/art/dove.webp";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { howFamiliesUseCopy as copy, type UseCaseIcon } from "@/content/home-bottom";
import { fromStatic } from "@/lib/images";

const icons: Record<UseCaseIcon, LucideIcon> = {
  "christmas-eve": MoonStar,
  home: House,
  ward: Presentation,
  gift: Gift,
};

const still = fromStatic(copy.image.src, copy.image.alt);
const dove = fromStatic(doveArt, "");

/** How families use Nephite Christmas (§2.10): four use cases beside a family still. */
export async function HowFamiliesUse() {
  return (
    <section aria-labelledby="how-families-title" className="bg-paper py-14 sm:py-20">
      <div className="container-page grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-14 lg:gap-y-8">
        <div className="relative lg:col-start-2">
          <SectionHeading id="how-families-title" title={copy.title} align="left" />
          <Img
            image={dove}
            alt=""
            sizes="64px"
            className="pointer-events-none absolute -top-6 right-0 hidden h-auto w-16 opacity-80 sm:block"
          />
        </div>

        <figure className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="aspect-[4/3] overflow-hidden rounded-(--radius-card) shadow-lift">
            <Img
              image={still}
              sizes="(min-width: 1024px) 600px, (min-width: 640px) 90vw, 100vw"
              className="h-full w-full object-cover object-[18%_60%]"
            />
          </div>
        </figure>

        <ul className="grid gap-6 sm:grid-cols-2 lg:col-start-2 lg:gap-x-8">
          {copy.items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.title} className="flex gap-4 sm:flex-col sm:gap-3">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-periwinkle-light text-periwinkle-text"
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-body">{item.line}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
