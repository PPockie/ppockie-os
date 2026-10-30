"use client";

import { RiAwardFill, RiTrophyFill } from "@remixicon/react";
import { useTranslations } from "next-intl";
import DetailModal from "./detail-modal";
import type { Achievement } from "@/libs/supabase/queries";

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementModal = ({ achievement: a, onClose }: AchievementModalProps) => {
  const t = useTranslations("Achievements");
  const Icon = a.kind === "trophy" ? RiTrophyFill : RiAwardFill;

  return (
    <DetailModal title={a.title} images={a.images} fallback={<Icon size={140} aria-hidden />} onClose={onClose}>
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-3xl font-bold">{a.title}</h3>
        {(a.issuer || a.awardedOn) && (
          <p className="cursor-auto text-base opacity-60 hover:no-underline">
            {[a.issuer, a.awardedOn?.slice(0, 4)].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {a.description && (
        <p className="cursor-auto text-base leading-relaxed whitespace-pre-line opacity-80 hover:no-underline">
          {a.description}
        </p>
      )}

      {a.position && (
        <section className="flex flex-col items-start gap-1">
          <h4 className="text-sm font-bold opacity-60">{t("position")}</h4>
          <p className="cursor-auto text-base hover:no-underline">{a.position}</p>
        </section>
      )}

      {a.tools.length > 0 && (
        <section className="flex flex-col items-start gap-2">
          <h4 className="text-sm font-bold opacity-60">{t("tools")}</h4>
          <ul aria-label={t("tools")} className="flex flex-wrap items-center gap-2">
            {a.tools.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-black/10 px-3 py-0.5 text-sm font-medium dark:border-white/15"
              >
                {tool}
              </li>
            ))}
          </ul>
        </section>
      )}
    </DetailModal>
  );
};

export default AchievementModal;
