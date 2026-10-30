"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiSubtractLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { cn } from "@/libs/cn";

interface ImageLightboxProps {
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.25;
const TAP_ZOOM = 1.25;
const SWIPE_THRESHOLD = 60;
const TAP_SLOP = 5;

const control =
  "grid size-10 cursor-pointer place-items-center rounded-full bg-neutral-50/15 text-neutral-50 transition-colors hover:bg-neutral-50/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-50 disabled:cursor-default disabled:opacity-40";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Full-screen viewer: wheel / buttons / double-click zoom, drag to pan when zoomed, swipe or arrows to change picture. */
const ImageLightbox = ({ images, index, onIndexChange, onClose }: ImageLightboxProps) => {
  const t = useTranslations("Achievements");
  const tw = useTranslations("Window");
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; panX: number; panY: number; moved: boolean; onImage: boolean } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const many = images.length > 1;

  // Each picture starts unzoomed.
  const [shownIndex, setShownIndex] = useState(index);
  if (shownIndex !== index) {
    setShownIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    return () => previous?.focus({ preventScroll: true });
  }, []);

  const go = (step: number) => onIndexChange((index + step + images.length) % images.length);

  const zoomTo = (next: number) => {
    const z = clamp(Math.round(next * 100) / 100, MIN_ZOOM, MAX_ZOOM);
    setZoom(z);
    if (z === 1) setPan({ x: 0, y: 0 });
  };

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal
      aria-label={t("image", { n: index + 1, total: images.length })}
      tabIndex={-1}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        // The achievement modal and the window behind listen for keys too; only this viewer should react.
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        } else if (e.key === "ArrowLeft" && many) go(-1);
        else if (e.key === "ArrowRight" && many) go(1);
        else if (e.key === "+" || e.key === "=") zoomTo(zoom + ZOOM_STEP);
        else if (e.key === "-") zoomTo(zoom - ZOOM_STEP);
        else if (e.key === "0") zoomTo(1);
      }}
      className="fixed inset-0 z-[10001] bg-black/50 text-neutral-50 outline-none"
    >
      <div
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y, moved: false, onImage: e.target instanceof HTMLImageElement };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          const dy = e.clientY - d.y;
          if (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP) {
            d.moved = true;
            setDragging(true);
          }
          if (zoom > 1) setPan({ x: d.panX + dx, y: d.panY + dy });
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          setDragging(false);
          if (!d) return;
          const dx = e.clientX - d.x;
          if (!d.moved) {
            // The stage captures the pointer, so the press target is remembered: a tap on the picture zooms, on the backdrop closes.
            if (d.onImage) zoomTo(zoom > 1 ? 1 : TAP_ZOOM);
            else onClose();
          } else if (zoom === 1 && many && Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setDragging(false);
        }}
        onWheel={(e) => zoomTo(zoom + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP))}
        className={cn(
          "absolute inset-0 touch-none items-center justify-center overflow-hidden select-none",
          dragging ? "cursor-grabbing" : zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- remote host varies per achievement */}
        <img
          src={images[index]}
          alt=""
          draggable={false}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          className={cn(
            "max-h-full max-w-full object-contain",
            !dragging && "transition-transform duration-150 ease-out",
          )}
        />
      </div>

      <div className="absolute top-4 right-4 gap-2">
        <button type="button" aria-label={t("zoomOut")} disabled={zoom <= MIN_ZOOM} onClick={() => zoomTo(zoom - ZOOM_STEP)} className={control}>
          <RiSubtractLine size={22} />
        </button>
        <button type="button" aria-label={t("zoomIn")} disabled={zoom >= MAX_ZOOM} onClick={() => zoomTo(zoom + ZOOM_STEP)} className={control}>
          <RiAddLine size={22} />
        </button>
        <button type="button" aria-label={tw("close")} onClick={onClose} className={control}>
          <RiCloseLine size={22} />
        </button>
      </div>

      {many && (
        <>
          <button type="button" aria-label={t("prevImage")} onClick={() => go(-1)} className={cn(control, "absolute top-1/2 left-4 -translate-y-1/2")}>
            <RiArrowLeftSLine size={26} />
          </button>
          <button type="button" aria-label={t("nextImage")} onClick={() => go(1)} className={cn(control, "absolute top-1/2 right-4 -translate-y-1/2")}>
            <RiArrowRightSLine size={26} />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
};

export default ImageLightbox;
