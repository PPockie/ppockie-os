import { setRequestLocale } from "next-intl/server";
import { Intro, Navbar, Welcome } from "@/components/ui";
import { getContacts, type Locale } from "@/libs/supabase/queries";
type Props = { params: Promise<{ locale: string }> };

export default async function App ({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // A paused or unreachable database should not take the whole page down.
  const contacts = await getContacts(locale as Locale).catch(() => []);

  return <IAppContent contacts={contacts} />;
}

function IAppContent({ contacts }: { contacts: Awaited<ReturnType<typeof getContacts>> }) {
  return (
   <main className="flex flex-col">
      <Intro />
      <Navbar contacts={contacts} />
      <Welcome />
   </main>
  );
}
