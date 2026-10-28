"use client";

import { useEffect } from "react";
import { RiCloseLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import type { FolderItem } from "@/constants/folders";
import { useDraggableWindow } from "@/hooks/use-draggable-window";

interface FolderWindowProps {
  item: Pick<FolderItem, "labelKey" | "icon">;
  z: number;
  /** Position in the open stack; used to cascade new windows. */
  index: number;
  onFocus: () => void;
  onClose: () => void;
  /** Window body; falls back to the empty message when omitted. */
  children?: React.ReactNode;
}

const WIDTH = 720;
const HEIGHT = 520;
const BAR = 44;

const FolderWindow = ({ item, z, index, onFocus, onClose, children }: FolderWindowProps) => {
  const t = useTranslations("Folders");
  const tw = useTranslations("Window");
  const label = t(item.labelKey);

  const { ref, pos, barProps } = useDraggableWindow({ width: WIDTH, height: HEIGHT, index });

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, [ref]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      onPointerDownCapture={onFocus}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      style={{
        zIndex: z,
        width: `min(${WIDTH}px, 92vw)`,
        height: `min(${HEIGHT}px, 80vh)`,
        translate: `${pos.x}px ${pos.y}px`,
      }}
      className="window-pop fixed top-0 left-0 flex flex-col items-stretch gap-0 overflow-hidden rounded-xl border-4 border-neutral-900 bg-neutral-50 text-neutral-900 shadow-2xl shadow-gray-800/35 outline-none dark:border-neutral-50 dark:bg-neutral-900 dark:text-neutral-50"
    >
      <div
        {...barProps}
        style={{ height: BAR }}
        className="flex shrink-0 cursor-grab touch-none select-none items-center gap-2 border-b-4 border-neutral-900 px-3 active:cursor-grabbing dark:border-neutral-50"
      >
        <span aria-hidden className="[&_svg]:size-5">
          {item.icon}
        </span>
        <h2 className="flex-1 truncate text-base font-grapixoso font-bold">{label}</h2>
        <button
          type="button"
          aria-label={tw("close")}
          onClick={onClose}
          className="grid size-7 cursor-pointer place-items-center rounded-md transition-colors hover:bg-black/10 focus-visible:bg-black/10 focus-visible:outline-none dark:hover:bg-white/15 dark:focus-visible:bg-white/15"
        >
          <RiCloseLine size={20} />
        </button>
      </div>

      {children ?? (
        <div className="block flex-1 overflow-auto p-4 text-sm opacity-60">
          {tw("empty")}
        </div>
      )}
    </div>
  );
};

export default FolderWindow;
