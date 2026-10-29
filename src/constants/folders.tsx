import {
  RiBookletFill,
  RiCodeBoxFill,
  RiMailFill,
  RiToolsFill,
  RiTrophyFill,
} from "@remixicon/react";
import type { ReactNode } from "react";
import { ABOUT_ID, EDUCATION_ID, RESUME_ID } from "@/constants/navbar";

export interface FolderItem {
  id: string;
  /** Key under `Folders` in messages/*.json. */
  labelKey: string;
  icon: ReactNode;
  /** Fill and icon colour for the folder body and tab. */
  tone: string;
  /** Position inside the welcome section, as a percentage of its box. */
  x: number;
  y: number;
  /** Resting tilt in degrees. */
  rotate: number;
}

const ICON_SIZE = 32;

/** Black and white only; the outline flips in dark mode so both stay visible. */
export const TONE = {
  light: "bg-neutral-50 text-neutral-900",
  dark: "bg-neutral-900 text-neutral-50",
} as const;

/**
 * Grouped by theme and split across the avatar.
 *
 * Left  - what I make and what I can do: projects, skills, achievements.
 * Right - how I share and how to reach me: blogs, contact.
 *
 * The left edge stays clear of the dock and the lower third stays clear of the
 * ring marquee.
 */
export const FOLDERS: FolderItem[] = [
  {
    id: "projects",
    labelKey: "projects",
    icon: <RiCodeBoxFill size={ICON_SIZE} />,
    tone: TONE.dark,
    x: 22,
    y: 16,
    rotate: -5,
  },
  {
    id: "skills",
    labelKey: "skills",
    icon: <RiToolsFill size={ICON_SIZE} />,
    tone: TONE.light,
    x: 30,
    y: 40,
    rotate: 3,
  },
  {
    id: "achievements",
    labelKey: "achievements",
    icon: <RiTrophyFill size={ICON_SIZE} />,
    tone: TONE.dark,
    x: 15,
    y: 38,
    rotate: 4,
  },
  {
    id: "blogs",
    labelKey: "blogs",
    icon: <RiBookletFill size={ICON_SIZE} />,
    tone: TONE.light,
    x: 77,
    y: 16,
    rotate: 5,
  },
  {
    id: "contact",
    labelKey: "contact",
    icon: <RiMailFill size={ICON_SIZE} />,
    tone: TONE.dark,
    x: 84,
    y: 40,
    rotate: -4,
  },
];

/** Every window that has its own URL: the folders plus about and education. */
export const WINDOW_IDS: string[] = [...FOLDERS.map((f) => f.id), ABOUT_ID, EDUCATION_ID, RESUME_ID];
