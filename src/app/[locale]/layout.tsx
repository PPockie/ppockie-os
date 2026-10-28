import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontStyle, fontVariables } from "@/libs/font";
import { getAchievements, getContacts, getDocument, getEducation, getExperiences, getProfile, getProjects, getSkillGroups, type Locale } from "@/libs/supabase/queries";
import ThemeProvider from "@/components/theme/theme-provider";
import NavProvider from "@/components/nav/nav-provider";
import WindowProvider from "@/components/window/window-provider";
import "../globals.css";

export const metadata: Metadata = {
  title: "PPockie — folio",
  description: "Information about me, and my PPockie-project",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // A paused or unreachable database should not take the whole page down.
  const [projects, skillGroups, profile, achievements, contacts, experiences, education, resume, cv] = await Promise.all([
    getProjects(locale as Locale).catch(() => []),
    getSkillGroups(locale as Locale).catch(() => []),
    getProfile(locale as Locale).catch(() => null),
    getAchievements(locale as Locale).catch(() => []),
    getContacts(locale as Locale).catch(() => []),
    getExperiences(locale as Locale).catch(() => []),
    getEducation(locale as Locale).catch(() => []),
    getDocument("resume", locale as Locale).catch(() => null),
    getDocument("cv", locale as Locale).catch(() => null),
  ]);
  const documents = [resume, cv].filter((d) => d !== null);

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`${fontVariables} h-full antialiased`}
      style={fontStyle(locale)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NavProvider>
            <NextIntlClientProvider>
              <WindowProvider projects={projects} skillGroups={skillGroups} profile={profile}
                achievements={achievements}
                contacts={contacts}
                experiences={experiences}
                education={education}
                documents={documents}
              >{children}</WindowProvider>
            </NextIntlClientProvider>
          </NavProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
