"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

/**
 * attribute="data-theme" makes next-themes write the same attribute the CSS in
 * globals.css keys off. It resolves "system" itself, so the attribute only ever
 * holds light or dark and the stylesheet never has to check the media query.
 */
const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemeProvider
    attribute="data-theme"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </NextThemeProvider>
);

export default ThemeProvider;
