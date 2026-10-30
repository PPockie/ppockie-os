/** "2025-03-01" -> "Mar 2025" (or the locale's equivalent). */
export const formatMonth = (date: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
