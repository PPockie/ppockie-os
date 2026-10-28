"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAwardFill,
  RiCloseLine,
  RiTrophyFill,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { cn } from "@/libs/cn";
import type { Achievement } from "@/libs/supabase/queries";

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

const arrow =
  "absolute top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-neutral-50/85 text-neutral-900 shadow transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2";

/** A big image with thumbnails under it, like a product page; a trophy / award icon stands in when there are no images. */
const Gallery = ({ achievement: a }: { achievement: Achievement }) => {
  const t = useTranslations("Achievements");
  const [index, setIndex] = useState(0);
  const { images } = a;
  const many = images.length > 1;
  const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length);

  return (
    <div className="flex w-[40%] shrink-0 flex-col bg-neutral-900 text-neutral-50 max-md:h-72 max-md:w-full dark:bg-neutral-950">
      <div className="relative min-h-0 flex-1">
        {images.length ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote host varies per achievement
          <img src={images[index]} alt="" draggable={false} className="absolute inset-0 size-full object-contain" />
        ) : (
          <div aria-hidden className="grid size-full place-items-center">
            {a.kind === "trophy" ? <RiTrophyFill size={140} /> : <RiAwardFill size={140} />}
          </div>
        )}

        {many && (
          <>
            <button type="button" aria-label={t("prevImage")} onClick={() => go(-1)} className={cn(arrow, "left-3")}>
              <RiArrowLeftSLine size={24} />
            </button>
            <button type="button" aria-label={t("nextImage")} onClick={() => go(1)} className={cn(arrow, "right-3")}>
              <RiArrowRightSLine size={24} />
            </button>
          </>
        )}
      </div>

      {many && (
        <ul className="flex shrink-0 gap-2 overflow-x-auto p-3">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                aria-label={t("image", { n: i + 1, total: images.length })}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "block size-16 cursor-pointer overflow-hidden rounded-md border-2 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2",
                  i === index ? "border-neutral-50" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- remote host varies per achievement */}
                <img src={src} alt="" draggable={false} className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** The gallery on the left, the details on the right; long text scrolls inside the right side. */
const AchievementModal = ({ achievement: a, onClose }: AchievementModalProps) => {
  const t = useTranslations("Achievements");
  const tw = useTranslations("Window");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  // Portalled to <body>: a window's `translate` would otherwise become the containing block of `fixed`.
  return createPortal(
    <div
      // React events still bubble through the portal to the card, so keep clicks here from reopening it.
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[10000] grid place-items-center bg-black/50 p-4"
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal
        aria-label={a.title}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            // The window behind listens for Escape too; only this modal should close.
            e.stopPropagation();
            onClose();
          }
        }}
        className="window-pop relative flex h-[min(680px,90vh)] w-[min(1040px,94vw)] overflow-hidden rounded-xl border-4 border-neutral-900 bg-neutral-50 text-left text-neutral-900 shadow-2xl outline-none max-md:flex-col dark:border-neutral-50 dark:bg-neutral-900 dark:text-neutral-50"
      >
        <Gallery key={a.id} achievement={a} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start gap-5 overflow-auto p-8 pr-14">
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-3xl font-bold">{a.title}</h3>
            {(a.issuer || a.awardedOn) && (
              <p className="cursor-auto text-base opacity-60 hover:no-underline">
                {[a.issuer, a.awardedOn?.slice(0, 4)].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>

          {a.description && (
            <p className="cursor-auto text-base leading-relaxed whitespace-pre-line opacity-80 hover:no-underline">
              {a.description}
            </p>
          )}

          {a.position && (
            <section className="flex flex-col items-start gap-1">
              <h4 className="text-sm font-bold opacity-60">{t("position")}</h4>
              <p className="cursor-auto text-base hover:no-underline">{a.position}</p>
            </section>
          )}

          {a.tools.length > 0 && (
            <section className="flex flex-col items-start gap-2">
              <h4 className="text-sm font-bold opacity-60">{t("tools")}</h4>
              <ul aria-label={t("tools")} className="flex flex-wrap items-center gap-2">
                {a.tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-full border border-black/10 px-3 py-0.5 text-sm font-medium dark:border-white/15"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <button
          type="button"
          aria-label={tw("close")}
          onClick={onClose}
          className="absolute top-3 right-3 grid size-8 cursor-pointer place-items-center rounded-md bg-neutral-50/80 text-neutral-900 transition-colors hover:bg-black/10 focus-visible:bg-black/10 focus-visible:outline-none dark:bg-neutral-900/80 dark:text-neutral-50 dark:hover:bg-white/15 dark:focus-visible:bg-white/15"
        >
          <RiCloseLine size={20} />
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default AchievementModal;
