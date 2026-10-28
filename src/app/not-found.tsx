import { fontStyle, fontVariables } from "@/libs/font";
import { routing } from "@/i18n/routing";
import ThemeProvider from "@/components/theme/theme-provider";
import "./globals.css";

export default function NotFound() {
  return (
    <html
      suppressHydrationWarning
      lang={routing.defaultLocale}
      className={`${fontVariables} h-full antialiased`}
      style={fontStyle(routing.defaultLocale)}
    >
      <body className="min-h-full flex flex-col items-center justify-center gap-2">
        <ThemeProvider>
          <h1 className="text-3xl">404</h1>
          <p className="text-zinc-500">This page could not be found.</p>
        </ThemeProvider>
      </body>
    </html>
  );
}
