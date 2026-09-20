"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * AppleThemeToggle — minimal appearance switcher.
 * Circular grouped control with press-down feedback. Lucide icons only.
 */
export function AppleThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <span className="w-9 h-9 rounded-full bg-apple-bg-secondary animate-pulse" aria-hidden />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-apple-bg-secondary text-apple-text hover:bg-apple-bg-tertiary transition-all duration-200 active:scale-95"
    >
      {isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
    </button>
  );
}
