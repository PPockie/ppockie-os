"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { RiCloseLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import Gallery from "./gallery";

interface DetailModalProps {
  title: string;
  images: string[];
  /** Stands in on the left when there are no images. */
  fallback: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

/** The gallery on the left, the details (children) on the right; long text scrolls inside the right side. */
const DetailModal = ({ title, images, fallback, onClose, children }: DetailModalProps) => {
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
        aria-label={title}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            // The window behind listens for Escape too; only this modal should close.
            e.stopPropagation();
            onClose();
          }
        }}
        className="window-pop relative flex h-[min(680px,90vh)] w-[min(1360px,96vw)] items-stretch gap-0 overflow-hidden rounded-xl border-4 border-neutral-900 bg-neutral-50 text-left text-neutral-900 shadow-2xl outline-none max-md:flex-col dark:border-neutral-50 dark:bg-neutral-900 dark:text-neutral-50"
      >
        <Gallery images={images} fallback={fallback} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start gap-5 overflow-auto p-8 pr-14">{children}</div>

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

export default DetailModal;
