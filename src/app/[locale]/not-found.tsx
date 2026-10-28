import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-3xl">404</h1>
      <p className="text-zinc-500">{t("notFound")}</p>
    </div>
  );
}
