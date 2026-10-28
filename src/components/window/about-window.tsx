"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine, RiUserSmileFill } from "@remixicon/react";
import { useTranslations } from "next-intl";
import AVATAR from "@/../public/images/Charactor.png";
import SkillRing from "@/components/window/skill-ring";
import type { Profile, SkillGroup } from "@/libs/supabase/queries";
import { useDraggableWindow } from "@/hooks/use-draggable-window";

interface AboutWindowProps {
  profile: Profile | null;
  skillGroups: SkillGroup[];
  projects: number;
  achievements: number;
  z: number;
  index: number;
  onFocus: () => void;
  onClose: () => void;
}

const WIDTH = 720;
const HEIGHT = 540;
const BAR = 44;
const RINGS_PER_PAGE = 4;
const START_YEAR = 2026;
const chevron =
  "grid size-8 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-black/10 focus-visible:bg-black/10 focus-visible:outline-none disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent dark:hover:bg-white/15 dark:focus-visible:bg-white/15";

/** The bio clamped to two lines, with a toggle at the end of the text that only appears when it is actually cut off. */
const Bio = ({ text }: { text: string }) => {
  const t = useTranslations("About");
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, open]);

  const toggle = (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className="cursor-pointer text-base font-bold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
    >
      {open ? t("readLess") : t("readMore")}
    </button>
  );

  // Collapsed, the toggle sits over the end of the last line behind a fade so it reads as part of the sentence.
  return (
    <div className="relative">
      <p ref={ref} className={`text-base whitespace-pre-line opacity-80 ${open ? "" : "line-clamp-2"}`}>
        {text}
        {open && <> {toggle}</>}
      </p>
      {clamped && !open && (
        <span className="absolute right-0 bottom-0 bg-linear-to-r from-transparent to-neutral-50 to-30% pl-8 dark:to-neutral-900">
          {toggle}
        </span>
      )}
    </div>
  );
};

/** An Instagram style profile: avatar on the left, name, bio and counts beside it, each position's share of my skills below. */
const AboutWindow = ({ profile, skillGroups, projects, achievements, z, index, onFocus, onClose }: AboutWindowProps) => {
  const t = useTranslations("About");
  const tw = useTranslations("Window");

  // A skill used in two positions (TypeScript) counts once in the total, so 100% is every skill I list.
  const total = new Set(skillGroups.flatMap((g) => g.skills.map((s) => s.name))).size;
  const rings = skillGroups.map(({ id, label, skills }) => ({
    id,
    label,
    percent: total ? Math.round((skills.length / total) * 100) : 0,
  }));
  // The site went up in START_YEAR, so later years read as a range instead of replacing it.
  const currentYear = new Date().getFullYear();
  const years = currentYear > START_YEAR ? `${START_YEAR}-${currentYear}` : `${START_YEAR}`;
  const pages = Math.ceil(rings.length / RINGS_PER_PAGE);
  const [page, setPage] = useState(0);
  const stats = [
    { key: "projects", value: projects },
    { key: "achievements", value: achievements },
    { key: "skills", value: total },
  ] as const;

  const { ref, pos, barProps } = useDraggableWindow({ width: WIDTH, height: HEIGHT, index });

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, [ref]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={t("title")}
      tabIndex={-1}
      onPointerDownCapture={onFocus}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      style={{
        zIndex: z,
        width: `min(${WIDTH}px, 92vw)`,
        translate: `${pos.x}px ${pos.y}px`,
      }}
      className="window-pop fixed top-0 left-0 flex flex-col items-stretch overflow-hidden rounded-xl border-4 border-neutral-900 bg-neutral-50 text-neutral-900 shadow-2xl shadow-gray-800/35 outline-none dark:border-neutral-50 dark:bg-neutral-900 dark:text-neutral-50"
    >
      <div
        {...barProps}
        style={{ height: BAR }}
        className="flex shrink-0 cursor-grab touch-none select-none items-center gap-2 border-b-4 border-neutral-900 px-3 active:cursor-grabbing dark:border-neutral-50"
      >
        <span aria-hidden className="[&_svg]:size-5">
          <RiUserSmileFill />
        </span>
        <h2 className="flex-1 truncate text-base font-grapixoso font-bold">{t("title")}</h2>
        <button
          type="button"
          aria-label={tw("close")}
          onClick={onClose}
          className="grid size-7 cursor-pointer place-items-center rounded-md transition-colors hover:bg-black/10 focus-visible:bg-black/10 focus-visible:outline-none dark:hover:bg-white/15 dark:focus-visible:bg-white/15"
        >
          <RiCloseLine size={20} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-stretch justify-between gap-6 p-8 text-left select-none">
        <div className="flex w-full items-center justify-start gap-8 max-sm:flex-col max-sm:text-center">
          <div className="shrink-0 self-start rounded-full bg-rainbow-wave p-1.5">
            <div className="relative size-40 overflow-hidden rounded-full border-4 border-neutral-50 bg-neutral-900 dark:border-neutral-900 max-sm:size-32">
              <Image
                draggable={false}
                fill
                sizes="160px"
                src={AVATAR}
                alt=""
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start gap-2 max-sm:items-center">
            {/* <p className="text-4xl font-grapixoso font-bold">{t("handle")}</p> */}
            {profile && (
              <>
                <p className="text-2xl font-bold whitespace-nowrap">{profile.fullName}</p>
                <p className="text-base opacity-60">{t("username")}</p>
                {(profile.bio ?? profile.headline) && <Bio text={(profile.bio ?? profile.headline)!} />}
              </>
            )}

            <ul className="mt-3 grid w-full grid-cols-3 gap-3">
              {stats.map(({ key, value }) => (
                <li
                  key={key}
                  className="flex flex-col items-start px-4 rounded-xl bg-black/2 border border-black/10  py-3 dark:border-white/15"
                >
                  <span className="text-3xl font-bold">{value}</span>
                  <span className="text-base opacity-60">{t(`stats.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {rings.length > 0 && (
          <div className="flex items-center gap-2 border-t border-neutral-900/10 pt-6 dark:border-neutral-50/15">
            {pages > 1 && (
              <button
                type="button"
                aria-label={t("prev")}
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className={chevron}
              >
                <RiArrowLeftSLine size={24} />
              </button>
            )}
            <ul aria-label={t("stats.skills")} className="grid flex-1 grid-cols-4 justify-items-center gap-y-4">
              {rings.slice(page * RINGS_PER_PAGE, (page + 1) * RINGS_PER_PAGE).map(({ id, label, percent }) => (
                <SkillRing key={id} label={label} percent={percent} />
              ))}
            </ul>
            {pages > 1 && (
              <button
                type="button"
                aria-label={t("next")}
                disabled={page === pages - 1}
                onClick={() => setPage((p) => p + 1)}
                className={chevron}
              >
                <RiArrowRightSLine size={24} />
              </button>
            )}
          </div>
        )}

        <p className="border-t-2 border-neutral-900/10 pt-4 text-center text-xs opacity-50 dark:border-neutral-50/15">
          {t("copyright", { year: years })}
        </p>
      </div>
    </div>
  );
};

export default AboutWindow;
