"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { FolderItem } from "@/constants/folders";
import { cn } from "@/libs/cn";

/** Grapheme-aware split so Thai vowel/tone marks stay attached to their base. */
const splitGraphemes = (text: string) =>
  Array.from(
    new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
    (s) => s.segment
  );

interface FolderProps {
  item: FolderItem;
  onPress?: () => void;
}

const Folder = ({ item, onPress }: FolderProps) => {
  const t = useTranslations("Folders");
  const label = t(item.labelKey);
  const chars = splitGraphemes(label);

  return (
    <li
      data-intro="folder"
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto max-lg:static max-lg:translate-none"
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
    >
      <button
        type="button"
        aria-label={label}
        onClick={onPress}
        className="group flex flex-col items-center gap-2 cursor-pointer rounded-xl border border-transparent px-4 max-lg:px-0 pt-2 pb-3 transition-colors duration-150 hover:border-black/10 hover:bg-black/5 focus-visible:border-black/10 focus-visible:bg-black/5 focus-visible:outline-none dark:hover:border-white/15 dark:hover:bg-white/10 dark:focus-visible:border-white/15 dark:focus-visible:bg-white/10"
      >
        <span
          style={{ rotate: `${item.rotate}deg` }}
          className="relative block w-24 h-18 max-lg:w-16 max-lg:h-12 max-lg:rotate-0! mt-3 transition-transform duration-200 group-hover:rotate-0! group-focus-visible:rotate-0!"
        >
          <span
            aria-hidden
            className={cn(
              "absolute -top-3 left-0 h-4 w-11 rounded-t-lg border-4 border-b-0 border-neutral-900 dark:border-neutral-50 group-hover:bg-rainbow-wave group-focus-visible:bg-rainbow-wave",
              item.tone
            )}
          />
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-xl rounded-tl-none border-4 border-neutral-900 dark:border-neutral-50 shadow-xl shadow-gray-800/25 group-hover:bg-rainbow-wave group-focus-visible:bg-rainbow-wave group-hover:text-neutral-900! group-focus-visible:text-neutral-900!",
              item.tone
            )}
          >
            {item.icon}
          </span>
        </span>

        <span className="text-sm max-sm:text-xs font-medium whitespace-nowrap" aria-hidden>
          {chars.map((char, i) => (
            <span
              key={i}
              className="wave-char"
              style={{ "--i": i, "--n": chars.length } as CSSProperties}
            >
              {char}
            </span>
          ))}
        </span>
      </button>
    </li>
  );
};

export default Folder;
