"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useRouter } from "@/i18n/navigation";
import { SETTINGS_ID } from "@/constants/navbar";
import AchievementModal from "@/components/window/achievement-modal";
import FolderTile from "@/components/window/folder-tile";
import SkillIcon from "@/components/skill-icon";
import { cn } from "@/libs/cn";
import {
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiAwardFill,
  RiBriefcaseFill,
  RiCheckLine,
  RiDownloadLine,
  RiExternalLinkLine,
  RiFileTextFill,
  RiFileCopyLine,
  RiGraduationCapFill,
  RiLinksLine,
  RiTranslate2,
  RiTrophyFill,
} from "@remixicon/react";
import { matchSocial } from "@/components/matching-icon-social";
import type { Achievement, Contact, DocumentLink, Education, Experience, Project, SkillGroup } from "@/libs/supabase/queries";

const GRID =
  "grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] items-start gap-3";

const COLLAPSED_COUNT = 4;

const initialsOf = (title: string) => {
  const graphemes = Array.from(
    new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
      title.trim(),
    ),
    (s) => s.segment,
  );
  return graphemes.slice(0, 2).join("").toLocaleUpperCase() || "?";
};

const Empty = () => {
  const tw = useTranslations("Window");
  return <p className="text-sm opacity-60">{tw("empty")}</p>;
};

export const ProjectsContent = ({ projects }: { projects: Project[] }) => (
  <div className="block flex-1 overflow-auto p-4">
    {projects.length ? (
      <ul className={GRID}>
        {projects.map((project, i) => (
          <FolderTile key={project.id} label={project.title} index={i}>
            {initialsOf(project.title)}
          </FolderTile>
        ))}
      </ul>
    ) : (
      <Empty />
    )}
  </div>
);

const TOOLS_COLLAPSED = 3;

const ToolBadges = ({ tools }: { tools: string[] }) => {
  const [expanded, setExpanded] = useState(false);
  const hidden = tools.length - TOOLS_COLLAPSED;
  const shown = expanded ? tools : tools.slice(0, TOOLS_COLLAPSED);

  return (
    <ul aria-label="Tools" className="mt-1 flex flex-wrap items-center gap-2">
      {shown.map((tool) => (
        <li
          key={tool}
          className="rounded-full border border-black/10 px-3 py-0.5 text-sm font-medium dark:border-white/15"
        >
          {tool}
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <button
            type="button"
            aria-expanded={expanded}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="cursor-pointer rounded-full bg-neutral-900 px-3 py-0.5 text-sm font-bold text-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-neutral-50 dark:text-neutral-900"
          >
            {expanded ? "−" : `+${hidden}`}
          </button>
        </li>
      )}
    </ul>
  );
};

/** Image (or a trophy / award icon when there is none) on the left, the details on the right. */
const AchievementCard = ({ achievement: a }: { achievement: Achievement }) => {
  const [open, setOpen] = useState(false);

  return (
  <li
    onClick={() => setOpen(true)}
    className="flex cursor-pointer items-start gap-5 max-sm:flex-col max-sm:items-stretch max-sm:gap-3 rounded-xl border border-black/10 bg-black/5 p-4 text-left transition-colors hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
  >
    <div
      aria-hidden
      className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900 max-sm:h-40 max-sm:w-full"
    >
      {a.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote host varies per achievement
        <img src={a.imageUrl} alt="" draggable={false} className="size-full object-cover" />
      ) : a.kind === "trophy" ? (
        <RiTrophyFill size={48} />
      ) : (
        <RiAwardFill size={48} />
      )}
    </div>
    <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
      <h3 className="text-lg font-bold">{a.title}</h3>
      {(a.issuer || a.awardedOn) && (
        <p className="cursor-auto text-sm opacity-60 hover:no-underline">{[a.issuer, a.awardedOn?.slice(0, 4)].filter(Boolean).join(" · ")}</p>
      )}
      {a.description && (
        <p className="line-clamp-2 cursor-auto text-base opacity-80 hover:no-underline">{a.description}</p>
      )}
      {a.tools.length > 0 && <ToolBadges tools={a.tools} />}
    </div>
    {/* The click is handled by the card; this button is the keyboard stop and the cue that the card opens. */}
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={a.title}
      className="grid size-8 shrink-0 cursor-pointer place-items-center self-center max-sm:sr-only rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <RiArrowRightSLine size={24} />
    </button>
    {open && <AchievementModal achievement={a} onClose={() => setOpen(false)} />}
  </li>
  );
};

export const AchievementsContent = ({ achievements }: { achievements: Achievement[] }) => (
  <div className="block flex-1 overflow-auto p-4">
    {achievements.length ? (
      <ul className="flex flex-col gap-3">
        {achievements.map((a) => (
          <AchievementCard key={a.id} achievement={a} />
        ))}
      </ul>
    ) : (
      <Empty />
    )}
  </div>
);

/** "mailto:me@x.com" -> "me@x.com", "https://github.com/me/" -> "github.com/me". */
const displayUrl = (url: string) =>
  url.replace(/^mailto:/i, "").replace(/^https?:\/\//i, "").replace(/\/$/, "");

const CopyButton = ({ value }: { value: string }) => {
  const t = useTranslations("Contact");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (insecure context or denied): the address is still on screen to copy by hand.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-sm font-bold transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/15 dark:hover:bg-white/10"
    >
      {copied ? <RiCheckLine size={16} /> : <RiFileCopyLine size={16} />}
      <span className="max-sm:sr-only">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
};

const ContactRowItem = ({ contact }: { contact: Contact }) => {
  const social = matchSocial(contact.platform);
  const isMail = contact.url.startsWith("mailto:");
  const value = displayUrl(contact.url);

  return (
    <li className="flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 transition-colors hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10">
      <a
        href={contact.url}
        {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span
          aria-hidden
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-xl bg-gray-200 dark:bg-gray-700",
            social?.className,
          )}
        >
          {social?.icon ?? <RiLinksLine size={24} />}
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span className="text-lg font-bold">{contact.label}</span>
          <span className="max-w-full truncate text-sm opacity-60">{value}</span>
        </span>
        {!isMail && <RiArrowRightUpLine size={20} aria-hidden className="ml-auto shrink-0 opacity-60" />}
      </a>
      {isMail && (
        <div className="w-auto shrink-0 pr-4">
          <CopyButton value={value} />
        </div>
      )}
    </li>
  );
};

/** A short invitation, then every contact as a row: the nav only quick-links email, GitHub and LinkedIn. */
export const ContactContent = ({ contacts }: { contacts: Contact[] }) => {
  const t = useTranslations("Contact");

  return (
    <div className="block flex-1 overflow-auto p-6">
      {contacts.length ? (
        <div className="flex flex-col items-stretch gap-5 text-left">
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-2xl font-bold">{t("title")}</h3>
            <span className="text-base opacity-70">{t("intro")}</span>
          </div>
          <ul className="flex flex-col items-stretch gap-3">
            {contacts.map((c) => (
              <ContactRowItem key={c.id} contact={c} />
            ))}
          </ul>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

const LanguageRow = () => {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // The window's own URL is kept so the settings window reopens in the new language.
  const change = (next: string) => {
    if (next === locale) return;
    startTransition(() => router.replace(`/${SETTINGS_ID}`, { locale: next }));
  };

  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/15 dark:bg-white/5">
      <span
        aria-hidden
        className="grid size-12 shrink-0 place-items-center rounded-xl bg-gray-200 dark:bg-gray-700"
      >
        <RiTranslate2 size={24} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start">
        <span className="text-lg font-bold">{t("language")}</span>
        <span className="text-sm opacity-60">{t("languageHint")}</span>
      </span>
      <div role="group" aria-label={t("language")} className="flex shrink-0 gap-2">
        {routing.locales.map((l) => (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={l === locale}
            disabled={pending}
            onClick={() => change(l)}
            className={cn(
              "cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait",
              l === locale
                ? "border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
                : "border-black/10 hover:bg-black/10 dark:border-white/15 dark:hover:bg-white/10",
            )}
          >
            {t(`languages.${l}`)}
          </button>
        ))}
      </div>
    </li>
  );
};

/** Preferences as rows, the same layout as the contact list. */
export const SettingsContent = () => {
  const t = useTranslations("Settings");

  return (
    <div className="block flex-1 overflow-auto p-6">
      <div className="flex flex-col items-stretch gap-5 text-left">
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-2xl font-bold">{t("title")}</h3>
          <span className="text-base opacity-70">{t("intro")}</span>
        </div>
        <ul className="flex flex-col items-stretch gap-3">
          <LanguageRow />
        </ul>
      </div>
    </div>
  );
};

const SkillGroupFrame =({ group }: { group: SkillGroup }) => {
  const [expanded, setExpanded] = useState(false);
  const hidden = group.skills.length - COLLAPSED_COUNT;
  const expandable = hidden > 0;
  const shown = expanded
    ? group.skills
    : group.skills.slice(0, COLLAPSED_COUNT);

  return (
    <section
      onClick={expandable ? () => setExpanded((v) => !v) : undefined}
      className={cn(
        "relative mt-2 rounded-xl border border-black/10 bg-black/5 p-3 pt-5 dark:border-neutral-50",
        expanded && "col-span-2 max-sm:col-span-1",
        expandable &&
          "cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/10",
      )}
    >
      <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2 text-center text-5xl max-sm:text-3xl leading-tight font-noto-sans-thai font-bold text-black/10">
        {expandable ? (
          <button
            type="button"
            aria-expanded={expanded}
            className="cursor-pointer focus-visible:underline focus-visible:outline-none"
          >
            {/* {group.label} {expanded ? "−" : `+${hidden}`} */}
            {group.label}
          </button>
        ) : (
          group.label
        )}
      </h3>

      {expandable ? (
        <p className="text-sm w-8 flex justify-center items-center aspect-square bg-rose-800 text-white rounded-full absolute -top-2.5 -right-2.5">
          {expanded ? "−" : `+${hidden}`}
        </p>
      ) : (
        ""
      )}

      <ul
        className={cn(
          "grid items-start gap-3",
          expanded ? "grid-cols-4 max-sm:grid-cols-2" : "grid-cols-2 grid-rows-2",
        )}
      >
        {shown.map((skill, i) => (
          <FolderTile key={skill.id} label={skill.name} index={i} shape="file">
            <SkillIcon name={skill.name} icon={skill.icon} />
          </FolderTile>
        ))}
      </ul>
    </section>
  );
};

export const SkillsContent = ({ groups }: { groups: SkillGroup[] }) => (
  <div className="block flex-1 overflow-auto p-4">
    {groups.length ? (
      <div className="grid grid-flow-dense grid-cols-2 max-sm:grid-cols-1 items-stretch gap-x-5 gap-y-6">
        {groups.map((group) => (
          <SkillGroupFrame key={group.id} group={group} />
        ))}
      </div>
    ) : (
      <Empty />
    )}
  </div>
);

/** "2024-03-01" -> "Mar 2024" (or "มี.ค. 2567"); read as UTC so the day never slips into the previous month. */
const formatMonth = (date: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));

interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string | null;
  startedOn: string | null;
  endedOn: string | null;
  badges: string[];
  bullets: string[];
  note?: string;
}

const TimelineSection = ({
  title,
  icon,
  entries,
}: {
  title: string;
  icon: React.ReactNode;
  entries: TimelineEntry[];
}) => {
  const t = useTranslations("Timeline");
  const locale = useLocale();

  if (!entries.length) return null;

  return (
    <section className="flex flex-col items-stretch gap-4 text-left">
      <h3 className="flex items-center gap-2 text-xl font-bold">
        <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
          {icon}
        </span>
        {title}
      </h3>

      <ol className="relative ml-4 border-l-2 border-neutral-900/15 dark:border-neutral-50/20">
        {entries.map((e) => {
          const current = !e.endedOn;
          const range = e.startedOn
            ? `${formatMonth(e.startedOn, locale)} - ${e.endedOn ? formatMonth(e.endedOn, locale) : t("present")}`
            : e.endedOn
              ? formatMonth(e.endedOn, locale)
              : null;

          return (
            <li key={e.id} className="relative flex flex-col items-start gap-1 pb-6 pl-6 last:pb-0">
              <span
                aria-hidden
                className={cn(
                  "absolute top-1.5 -left-[8px] size-3.5 rounded-full border-2 border-neutral-50 bg-neutral-900 dark:border-neutral-900 dark:bg-neutral-50",
                  current && "bg-rainbow-wave dark:bg-rainbow-wave",
                )}
              />
              {range && <p className="text-sm font-medium opacity-60">{range}</p>}
              <h4 className="text-lg font-bold">{e.title}</h4>
              {e.subtitle && <p className="text-base opacity-70">{e.subtitle}</p>}
              {e.note && <p className="text-sm opacity-70">{e.note}</p>}
              {e.bullets.length > 0 && (
                <ul className="mt-1 ml-5 flex list-disc flex-col gap-1 text-sm opacity-80">
                  {e.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
              {e.badges.length > 0 && (
                <ul className="mt-1 flex flex-wrap items-center gap-2">
                  {e.badges.map((b) => (
                    <li key={b} className="rounded-full border border-black/10 px-3 py-0.5 text-sm font-medium dark:border-white/15">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

/** Experience and education as two vertical timelines, newest first, like the resume. */
export const TimelineContent = ({
  experiences,
  education,
}: {
  experiences: Experience[];
  education: Education[];
}) => {
  const t = useTranslations("Timeline");

  const work: TimelineEntry[] = experiences.map((e) => ({
    id: e.id,
    title: e.position,
    subtitle: [e.company, e.team, e.location].filter(Boolean).join(" · "),
    startedOn: e.startedOn,
    endedOn: e.endedOn,
    badges: e.techStack,
    bullets: e.bullets,
  }));
  const study: TimelineEntry[] = education.map((e) => ({
    id: e.id,
    title: e.institution,
    subtitle: [e.degree, e.location].filter(Boolean).join(" · "),
    startedOn: e.startedOn,
    endedOn: e.endedOn,
    badges: [],
    bullets: e.bullets,
    note: e.gpax ? `${t("gpax")}: ${e.gpax}` : undefined,
  }));

  return (
    <div className="block flex-1 overflow-auto p-6">
      {work.length || study.length ? (
        <div className="flex flex-col items-stretch gap-8">
          <TimelineSection title={t("experience")} icon={<RiBriefcaseFill size={18} />} entries={work} />
          <TimelineSection title={t("education")} icon={<RiGraduationCapFill size={18} />} entries={study} />
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

const DocumentRowItem = ({ document: d }: { document: DocumentLink }) => {
  const t = useTranslations("Documents");
  const action =
    "flex shrink-0 items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-sm font-bold transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/15 dark:hover:bg-white/10";

  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/15 dark:bg-white/5">
      <span
        aria-hidden
        className="grid size-12 shrink-0 place-items-center rounded-xl bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
      >
        <RiFileTextFill size={24} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start">
        <span className="text-lg font-bold">{t(d.kind)}</span>
        {d.title && <span className="max-w-full truncate text-sm opacity-60">{d.title}</span>}
      </span>
      <div className="flex items-center gap-2">
        <a href={d.viewUrl} target="_blank" rel="noopener noreferrer" className={action}>
          <RiExternalLinkLine size={16} />
          {t("view")}
        </a>
        <a href={d.downloadUrl} download className={action}>
          <RiDownloadLine size={16} />
          {t("download")}
        </a>
      </div>
    </li>
  );
};

/** The published resume and CV, each to view or download. */
export const DocumentsContent = ({ documents }: { documents: DocumentLink[] }) => (
  <div className="block flex-1 overflow-auto p-6">
    {documents.length ? (
      <ul className="flex flex-col items-stretch gap-3 text-left">
        {documents.map((d) => (
          <DocumentRowItem key={d.kind} document={d} />
        ))}
      </ul>
    ) : (
      <Empty />
    )}
  </div>
);
