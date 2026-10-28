import { notFound } from "next/navigation";
import { WINDOW_IDS } from "@/constants/folders";
import App from "../page";

type Props = { params: Promise<{ locale: string; folder: string }> };

export function generateStaticParams() {
  return WINDOW_IDS.map((folder) => ({ folder }));
}

/** The desktop with one window already open: /projects, /th/skills, ... */
export default async function FolderPage({ params }: Props) {
  const { locale, folder } = await params;
  if (!WINDOW_IDS.includes(folder)) notFound();

  return <App params={Promise.resolve({ locale })} />;
}
