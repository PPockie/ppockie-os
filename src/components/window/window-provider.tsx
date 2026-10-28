"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale } from "next-intl";
import { FOLDERS, WINDOW_IDS } from "@/constants/folders";
import { INTRO_DONE_EVENT } from "@/components/ui/intro";
import { routing } from "@/i18n/routing";
import { RiFileUserFill, RiGraduationCapFill } from "@remixicon/react";
import { ABOUT_ID, EDUCATION_ID, RESUME_ID } from "@/constants/navbar";
import FolderWindow from "@/components/window/folder-window";
import AboutWindow from "@/components/window/about-window";
import { AchievementsContent, ContactContent, DocumentsContent, ProjectsContent, SkillsContent, TimelineContent } from "@/components/window/contents";
import type { Achievement, Contact, DocumentLink, Education, Experience, Profile, Project, SkillGroup } from "@/libs/supabase/queries";

interface OpenWindow {
  id: string;
  /** Stacking order; the highest value is the window on top. */
  z: number;
}

interface WindowContextValue {
  open: (id: string) => void;
  /** A resume or CV is published, so the nav can offer the download. */
  hasDocuments: boolean;
}

const WindowContext = createContext<WindowContextValue | null>(null);

const BASE_Z = 100;

const RESUME_WINDOW = { labelKey: RESUME_ID, icon: <RiFileUserFill /> };

/** Same chrome as a folder window, titled from `Folders.education`. */
const EDUCATION_WINDOW = { labelKey: EDUCATION_ID, icon: <RiGraduationCapFill /> };

interface WindowProviderProps {
  children: React.ReactNode;
  projects: Project[];
  skillGroups: SkillGroup[];
  profile: Profile | null;
  achievements: Achievement[];
  contacts: Contact[];
  experiences: Experience[];
  education: Education[];
  documents: DocumentLink[];
}

const WindowProvider = ({ children, projects, skillGroups, profile, achievements, contacts, experiences, education, documents }: WindowProviderProps) => {
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const top = useRef(BASE_Z);

  const focus = useCallback((id: string) => {
    setWindows((list) => {
      const current = list.find((w) => w.id === id);
      // Already on top: skip the state change so a drag doesn't re-render the stack.
      if (current && current.z === top.current) return list;
      top.current += 1;
      return list.map((w) => (w.id === id ? { ...w, z: top.current } : w));
    });
  }, []);

  const open = useCallback(
    (id: string) => {
      setWindows((list) => {
        top.current += 1;
        return list.some((w) => w.id === id)
          ? list.map((w) => (w.id === id ? { ...w, z: top.current } : w))
          : [...list, { id, z: top.current }];
      });
    },
    []
  );

  const close = useCallback((id: string) => {
    setWindows((list) => list.filter((w) => w.id !== id));
  }, []);

  const locale = useLocale();
  const seen = useRef(false);

  // /projects or /th/projects opens that window on arrival, once the intro has finished so it pops in like a click would.
  useEffect(() => {
    const id = window.location.pathname.split("/").filter(Boolean).filter((s) => s !== locale).at(0);
    if (!id || !WINDOW_IDS.includes(id)) return;

    if ("introDone" in document.documentElement.dataset) {
      open(id);
      return;
    }
    const onDone = () => open(id);
    window.addEventListener(INTRO_DONE_EVENT, onDone, { once: true });
    return () => window.removeEventListener(INTRO_DONE_EVENT, onDone);
  }, [locale, open]);

  // The URL follows the window on top; with none open it returns to the desktop.
  useEffect(() => {
    if (windows.length) seen.current = true;
    else if (!seen.current) return;

    const top = windows.reduce<OpenWindow | null>((a, w) => (!a || w.z > a.z ? w : a), null);
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    const path = top ? `${prefix}/${top.id}` : prefix || "/";
    if (window.location.pathname !== path) window.history.replaceState(null, "", path);
  }, [windows, locale]);

  const hasDocuments = documents.length > 0;
  const value = useMemo(() => ({ open, hasDocuments }), [open, hasDocuments]);

  return (
    <WindowContext.Provider value={value}>
      {children}
      {windows.map(({ id, z }, index) => {
        if (id === ABOUT_ID) {
          return (
            <AboutWindow
              key={id}
              profile={profile}
              skillGroups={skillGroups}
              achievements={achievements.length}
              projects={projects.length}
              z={z}
              index={index}
              onFocus={() => focus(id)}
              onClose={() => close(id)}
            />
          );
        }
        if (id === EDUCATION_ID) {
          return (
            <FolderWindow
              key={id}
              item={EDUCATION_WINDOW}
              z={z}
              index={index}
              onFocus={() => focus(id)}
              onClose={() => close(id)}
            >
              <TimelineContent experiences={experiences} education={education} />
            </FolderWindow>
          );
        }
        if (id === RESUME_ID) {
          return (
            <FolderWindow
              key={id}
              item={RESUME_WINDOW}
              z={z}
              index={index}
              onFocus={() => focus(id)}
              onClose={() => close(id)}
            >
              <DocumentsContent documents={documents} />
            </FolderWindow>
          );
        }
        const item = FOLDERS.find((f) => f.id === id);
        return item ? (
          <FolderWindow
            key={id}
            item={item}
            z={z}
            index={index}
            onFocus={() => focus(id)}
            onClose={() => close(id)}
          >
            {id === "projects" ? (
              <ProjectsContent projects={projects} />
            ) : id === "skills" ? (
              <SkillsContent groups={skillGroups} />
            ) : id === "achievements" ? (
              <AchievementsContent achievements={achievements} />
            ) : id === "contact" ? (
              <ContactContent contacts={contacts} />
            ) : undefined}
          </FolderWindow>
        ) : null;
      })}
    </WindowContext.Provider>
  );
};

export const useWindows = () => {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be used within <WindowProvider>");
  return ctx;
};

export default WindowProvider;
