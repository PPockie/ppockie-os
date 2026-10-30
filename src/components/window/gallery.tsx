"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { cn } from "@/libs/cn";
import ImageLightbox from "./image-lightbox";

interface GalleryProps {
  images: string[];
  fallback: ReactNode;
}

const arrow =
  "grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-neutral-50/85 text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2";

/** How far (px) the big image has to be dragged sideways to change picture. */
const DRAG_THRESHOLD = 40;
/** Below this the press counts as a click and opens the full-screen viewer. */
const CLICK_SLOP = 5;

/** A big image with thumbnails under it, like a product page; `fallback` stands in when there are no images. */
const Gallery = ({ images, fallback }: GalleryProps) => {
  const t = useTranslations("Achievements");
  const [index, setIndex] = useState(0);
  const many = images.length > 1;
  const [paused, setPaused] = useState(false);
  const [viewing, setViewing] = useState(false);
  const thumbs = useRef<HTMLUListElement>(null);
  const dragStart = useRef<number | null>(null);
  const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length);

  // Advance every 3s and loop; depending on `index` restarts the timer after a manual change.
  useEffect(() => {
    if (!many || paused || viewing) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % images.length), 3000);
    return () => clearTimeout(id);
  }, [index, many, paused, viewing, images.length]);

  // Keep the active thumbnail in view inside the strip without scrolling the page.
  useEffect(() => {
    const el = thumbs.current?.children[index] as HTMLElement | undefined;
    const box = thumbs.current;
    if (!el || !box) return;
    box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
  }, [index]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex w-[60%] shrink-0 flex-col items-stretch gap-0 bg-neutral-900 text-neutral-50 max-md:h-72 max-md:w-full dark:bg-neutral-950"
    >
      <div
        onPointerDown={(e) => {
          dragStart.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={(e) => {
          if (dragStart.current === null) return;
          const dx = e.clientX - dragStart.current;
          dragStart.current = null;
          if (many && Math.abs(dx) > DRAG_THRESHOLD) go(dx < 0 ? 1 : -1);
          else if (images.length && Math.abs(dx) <= CLICK_SLOP) setViewing(true);
        }}
        onPointerCancel={() => (dragStart.current = null)}
        className={cn(
          "relative min-h-0 w-full flex-1 touch-pan-y items-stretch select-none",
          images.length > 0 && "cursor-zoom-in",
        )}
      >
        {images.length ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote host varies per item
          <img src={images[index]} alt="" draggable={false} className="absolute inset-0 size-full object-contain" />
        ) : (
          <div aria-hidden className="grid size-full place-items-center">
            {fallback}
          </div>
        )}
      </div>

      {many && (
        <div className="w-full shrink-0 gap-2 p-3">
          <button type="button" aria-label={t("prevImage")} onClick={() => go(-1)} className={arrow}>
            <RiArrowLeftSLine size={20} />
          </button>

          <ul ref={thumbs} className="relative flex! min-w-0 flex-1 gap-2 overflow-x-hidden">
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
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote host varies per item */}
                  <img src={src} alt="" draggable={false} className="size-full object-cover" />
                </button>
              </li>
            ))}
          </ul>

          <button type="button" aria-label={t("nextImage")} onClick={() => go(1)} className={arrow}>
            <RiArrowRightSLine size={20} />
          </button>
        </div>
      )}

      {viewing && (
        <ImageLightbox images={images} index={index} onIndexChange={setIndex} onClose={() => setViewing(false)} />
      )}
    </div>
  );
};

export default Gallery;
