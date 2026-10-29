import {
  RiFileUserFill,
  RiGraduationCapFill,
  RiSettings3Fill,
  RiUserSmileFill,
} from "@remixicon/react";
import { ReactNode } from "react";
import type { Axis } from "@/hooks/animation";

export interface NavListProps {
  id: number | string;
  name: string;
  category: string;
  icon?: ReactNode;
  className?: string;
  href?: string;
  windowId?: string;
}

export const ABOUT_ID = "about";

export const EDUCATION_ID = "education";

export const RESUME_ID = "resume";

export const SETTINGS_ID = "settings";

export const NAV_CONTACT_PLATFORMS = ["email", "github", "linkedin"];

export const ICON_SIZE = 28;

const BOX = "w-14";

export const NAVBAR_VARIANT = {
  default: {
    nav: "left-10 top-1/2 -translate-y-1/2",
    div: "flex flex-col gap-4",
    ul: "flex flex-col items-center gap-4",
    item: "w-full",
    divider: "w-full h-0.75",
    tip: "left-full ml-5 top-1/2 -translate-y-1/2",
    tipArrow: "-left-1.5 top-1/2 -translate-y-1/2",
    axis: "y",
  },
  top: {
    nav: "left-1/2 top-10 -translate-x-1/2",
    div: "flex items-center gap-4",
    ul: "flex items-center gap-4",
    item: `${BOX} shrink-0`,
    divider: "h-8 w-0.75 shrink-0",
    tip: "top-full mt-5 left-1/2 -translate-x-1/2",
    tipArrow: "-top-1.5 left-1/3 -translate-x-1/2",
    axis: "x",
  },
  bottom: {
    nav: "left-1/2 bottom-5 -translate-x-1/2",
    div: "flex items-center gap-4",
    ul: "flex items-center gap-4",
    item: `${BOX} shrink-0`,
    divider: "h-8 w-0.75 shrink-0",
    tip: "bottom-full mb-5 left-1/2 -translate-x-1/2",
    tipArrow: "-bottom-1.5 left-1/2 -translate-x-1/2",
    axis: "x",
  },
} as const satisfies Record<string, { axis: Axis } & Record<string, string>>;

export type NavPosition = keyof typeof NAVBAR_VARIANT;

export const NAV_POSITIONS = Object.keys(NAVBAR_VARIANT) as NavPosition[];

const DEFAULT_POSITION: NavPosition = "default";

const DOCK = {
  nav: "max-lg:fixed max-lg:top-auto max-lg:bottom-4 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:translate-y-0 max-lg:p-2.5 max-lg:w-[calc(100%-2rem)] md:max-lg:max-w-lg",
  div: "max-lg:grid max-lg:w-full max-lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] max-lg:gap-3",
  ul: "max-lg:contents",
  logo: "max-lg:hidden",
  item: "max-lg:w-full max-lg:aspect-auto max-lg:h-14 md:max-lg:h-16",
  hidden: "max-lg:hidden",
} as const;

export const NAVBAR = {
  position: DEFAULT_POSITION,
  dock: DOCK,
  logo: 50,
  magnify: { scale: 1.35, radius: 90 },
  style: {
    nav: "z-99 p-3 border-4 border-gray-900 rounded-3xl shadow-xl shadow-gray-800/35 bg-(--color-background) backdrop-blur-sm",
    logo: "rounded-xl bg-gray-900",
    item: "rounded-xl bg-gray-200 hover:bg-rainbow-wave",
    divider: "rounded-full bg-neutral-800",
    label: "text-sm cursor-pointer hover:underline transition-all",
    tooltip:
      "pointer-events-none absolute z-10 whitespace-nowrap rounded-xl bg-gray-950 px-3 py-1.5 text-sm font-medium text-neutral-50 shadow-xl shadow-gray-800/35 opacity-0 scale-90 transition-all duration-150 group-hover/item:opacity-100 group-hover/item:scale-100",
    tooltipArrow: "absolute size-3 rotate-45 rounded-xs bg-gray-950",
  },
} as const;

export const NAV_LIST: NavListProps[] = [
  {
    id: 1,
    name: "About me",
    category: "information",
    icon: <RiUserSmileFill size={ICON_SIZE} />,
    windowId: ABOUT_ID,
  },
  {
    id: 2,
    name: "Education/Experience",
    category: "information",
    icon: <RiGraduationCapFill size={ICON_SIZE} />,
    windowId: EDUCATION_ID,
  },
  {
    id: 3,
    name: "Resume/CV",
    category: "information",
    icon: <RiFileUserFill size={ICON_SIZE} />,
    windowId: RESUME_ID,
  },
];

export const NAV_SETTINGS: NavListProps = {
  id: SETTINGS_ID,
  name: "Settings",
  category: "settings",
  icon: <RiSettings3Fill size={ICON_SIZE} />,
  windowId: SETTINGS_ID,
};
