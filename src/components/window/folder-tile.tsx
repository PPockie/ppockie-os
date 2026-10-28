import type { ReactNode } from "react";
import { TONE } from "@/constants/folders";
import { cn } from "@/libs/cn";

interface FolderTileProps {
  label: string;
  /** Position in the list; alternates the dark and light tile. */
  index: number;
  /** A folder for things that hold more, a file for a single item. */
  shape?: "folder" | "file";
  /** Whatever sits on the face: letters, a logo. */
  children: ReactNode;
}

const FACE = "text-3xl font-grapixoso font-bold group-hover:bg-rainbow-wave group-hover:text-neutral-900!";

/** The folder from the desktop, laid out in flow for use inside a window. */
const FolderShape = ({ tone, children }: { tone: string; children: ReactNode }) => (
  <span className="relative mt-3 block h-18 w-24">
    <span
      aria-hidden
      className={cn(
        "absolute -top-3 left-0 h-4 w-11 rounded-t-lg border-4 border-b-0 border-neutral-900 group-hover:bg-rainbow-wave dark:border-neutral-50",
        tone
      )}
    />
    <span
      aria-hidden
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-xl rounded-tl-none border-4 border-neutral-900 shadow-xl shadow-gray-800/25 dark:border-neutral-50",
        FACE,
        tone
      )}
    >
      {children}
    </span>
  </span>
);

// Sheet outline in a 72x88 box: 4px stroke drawn along its centre line, rounded
// corners, top-right corner folded. BODY also clips the face so the fill and the
// hover rainbow stay inside the outline.
const FILE_BODY = "M10 2H48L70 24V78A8 8 0 0 1 62 86H10A8 8 0 0 1 2 78V10A8 8 0 0 1 10 2Z";
const FILE_FLAP = "M48 2V16A8 8 0 0 0 56 24H70Z";

/** A sheet with a folded corner, outlined like the folder. */
const FileShape = ({ tone, children }: { tone: string; children: ReactNode }) => (
  <span className="relative block h-22 w-18 drop-shadow-[0_10px_8px_rgba(31,41,55,0.25)]">
    <span
      aria-hidden
      style={{ clipPath: `path('${FILE_BODY}')` }}
      className={cn(
        "absolute inset-0 flex items-center justify-center pt-5 text-xl font-bold group-hover:bg-rainbow-wave group-hover:text-neutral-900!",
        tone
      )}
    >
      {children}
    </span>
    <svg
      aria-hidden
      viewBox="0 0 72 88"
      strokeWidth={4}
      strokeLinejoin="round"
      strokeLinecap="round"
      className="absolute inset-0 size-full fill-none stroke-neutral-900 dark:stroke-neutral-50"
    >
      <path d={FILE_BODY} />
      <path d={FILE_FLAP} className="fill-neutral-300" />
    </svg>
  </span>
);

/** A folder or file tile in flow, for use inside a window. */
const FolderTile = ({ label, index, shape = "folder", children }: FolderTileProps) => {
  const tone = index % 2 === 0 ? TONE.dark : TONE.light;
  const Shape = shape === "file" ? FileShape : FolderShape;

  return (
    <li className="group flex flex-col items-center gap-2 rounded-xl border border-transparent px-2 pt-2 pb-3 transition-colors duration-150 hover:border-black/10 hover:bg-black/5 dark:hover:border-white/15 dark:hover:bg-white/10">
      <Shape tone={tone}>{children}</Shape>

      <span className="line-clamp-2 text-center text-sm font-medium wrap-anywhere">
        {label}
      </span>
    </li>
  );
};

export default FolderTile;
