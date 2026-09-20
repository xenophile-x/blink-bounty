"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface AppleProvidersProps {
  children: ReactNode;
}

/**
 * AppleProviders — wraps the app with class-based appearance support.
 * CSS variables swap automatically via the `.dark` class.
 */
export function AppleProviders({ children }: AppleProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
