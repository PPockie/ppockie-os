"use client";

import type { ReactNode } from "react";
import { RiCodeSSlashFill, RiExternalLinkLine, RiGithubFill } from "@remixicon/react";
import { useTranslations } from "next-intl";
import DetailModal from "./detail-modal";
import type { Project } from "@/libs/supabase/queries";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const link =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-neutral-900 px-4 py-1.5 text-sm font-bold transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-neutral-50 dark:hover:bg-white/15";

type Block =
  | { kind: "field"; label: string; value: string }
  | { kind: "list"; items: string[] }
  | { kind: "text"; text: string };

/** Splits a description written as "**Label:** value", "- bullet" and plain lines into blocks to lay out as sections. */
const parseDescription = (source: string): Block[] => {
  const blocks: Block[] = [];
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const field = line.match(/^\*\*(.+?):?\*\*:?\s*(.*)$/);
    const last = blocks[blocks.length - 1];
    if (bullet) {
      if (last?.kind === "list") last.items.push(bullet[1]);
      else blocks.push({ kind: "list", items: [bullet[1]] });
    } else if (field) blocks.push({ kind: "field", label: field[1], value: field[2] });
    else blocks.push({ kind: "text", text: line });
  }
  return blocks;
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex w-full flex-col items-start gap-2 border-t border-black/10 pt-4 dark:border-white/15">
    <h4 className="text-sm font-bold opacity-60">{title}</h4>
    {children}
  </section>
);

const ProjectModal = ({ project: p, onClose }: ProjectModalProps) => {
  const t = useTranslations("Project");
  const tt = useTranslations("Timeline");
  const period = p.endedOn ? p.endedOn.slice(0, 4) : p.startedOn ? tt("present") : null;
  const blocks = parseDescription(p.description ?? p.summary ?? "");

  return (
    <DetailModal title={p.title} images={p.images} fallback={<RiCodeSSlashFill size={140} aria-hidden />} onClose={onClose}>
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-3xl font-bold">{p.title}</h3>
        {period && <p className="cursor-auto text-base opacity-60 hover:no-underline">{period}</p>}
      </div>

      {blocks.map((b, i) =>
        b.kind === "field" ? (
          <Section key={i} title={b.label}>
            {b.value && <p className="cursor-auto text-base leading-relaxed opacity-90 hover:no-underline">{b.value}</p>}
          </Section>
        ) : b.kind === "list" ? (
          <Section key={i} title={t("highlights")}>
            <ul className="flex! flex-col items-start gap-2 max-sm:flex!">
              {b.items.map((item) => (
                <li
                  key={item}
                  className="relative cursor-auto pl-5 text-base leading-relaxed opacity-90 before:absolute before:top-[0.65em] before:left-1 before:size-1.5 before:rounded-full before:bg-current"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        ) : (
          <p key={i} className="cursor-auto text-base leading-relaxed opacity-80 hover:no-underline">
            {b.text}
          </p>
        ),
      )}

      {p.techStack.length > 0 && (
        <Section title={t("techStack")}>
          <ul aria-label={t("techStack")} className="flex! flex-wrap items-center gap-2 max-sm:flex!">
            {p.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-black/10 px-3 py-0.5 text-sm font-medium dark:border-white/15"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(p.repoUrl || p.demoUrl) && (
        <div className="flex flex-wrap items-center gap-3">
          {p.demoUrl && (
            <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className={link}>
              <RiExternalLinkLine size={18} />
              {t("demo")}
            </a>
          )}
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className={link}>
              <RiGithubFill size={18} />
              {t("repo")}
            </a>
          )}
        </div>
      )}
    </DetailModal>
  );
};

export default ProjectModal;
