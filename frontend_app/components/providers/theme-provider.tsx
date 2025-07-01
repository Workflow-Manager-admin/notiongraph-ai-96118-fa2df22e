"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider provides app-wide theme context:
 * Ensures global theme variables (including secondary light blue brand) propagate to all UI components.
 * Wraps NextThemesProvider for theme switching.
 *
 * PUBLIC_INTERFACE
 */
export function ThemeProvider({
  children,
  ...props
}: Readonly<React.ComponentProps<typeof NextThemesProvider>>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
