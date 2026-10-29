"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

/**
 * attribute="data-theme" makes next-themes write the same attribute the CSS in
 * globals.css keys off. It resolves "system" itself, so the attribute only ever
 * holds light or dark and the stylesheet never has to check the media query.
 *
 * The init script only matters in the server HTML. When the layout is rendered
 * on the client (switching language swaps it), React 19 warns about the
 * executable <script>, so there it gets a type the browser ignores.
 */
const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemeProvider
    attribute="data-theme"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
    scriptProps={typeof window === "undefined" ? undefined : { type: "application/json" }}
  >
    {children}
  </NextThemeProvider>
);

export default ThemeProvider;
