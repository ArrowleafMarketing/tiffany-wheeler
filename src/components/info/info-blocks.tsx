import { Info } from "lucide-react";
import type { InfoBlock } from "@/content/info";
import { cn } from "@/lib/cn";
import { RichText } from "./rich-text";

type Props = {
  blocks: readonly InfoBlock[];
  className?: string;
};

/** Prose blocks from src/content/info.ts: paragraphs, bulleted/numbered lists and notes. */
export function InfoBlocks({ blocks, className }: Props) {
  return (
    <div className={cn("space-y-4 text-base leading-relaxed text-body sm:text-[1.0625rem]", className)}>
      {blocks.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i}>
              <RichText text={block} />
            </p>
          );
        }
        if ("list" in block) {
          if (block.ordered) {
            return (
              <ol key={i} className="space-y-3">
                {block.list.map((item, n) => (
                  <li key={n} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-periwinkle-light text-sm font-bold text-periwinkle-text"
                    >
                      {n + 1}
                    </span>
                    <span>
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            );
          }
          return (
            <ul key={i} className="space-y-2.5">
              {block.list.map((item, n) => (
                <li key={n} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-periwinkle" />
                  <span>
                    <RichText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="flex gap-3 rounded-(--radius-card) border border-butter-deep bg-butter/60 p-4 text-ink">
            <Info aria-hidden className="mt-1 size-4 shrink-0 text-ink" />
            <span>
              <RichText text={block.note} />
            </span>
          </p>
        );
      })}
    </div>
  );
}
