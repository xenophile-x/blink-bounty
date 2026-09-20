import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { AppleThemeToggle } from "./AppleThemeToggle";

interface AppleGlassNavProps {
  title?: string;
  action?: ReactNode;
}

/**
 * AppleGlassNav — translucent blurred navigation bar (macOS / iOS style).
 * Theme-aware mark: /Light.png in light mode, /Dark.png in dark mode.
 */
export function AppleGlassNav({ title = "Blinky", action }: AppleGlassNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-apple-glass backdrop-blur-xl border-b border-apple-separator/20">
      <div className="flex justify-between items-center w-full px-5 sm:px-8 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform duration-200">
          <Image
            src="/Light.png"
            alt="Blinky logo"
            width={28}
            height={28}
            priority
            className="w-7 h-7 rounded-[8px] dark:hidden"
          />
          <Image
            src="/Dark.png"
            alt=""
            aria-hidden
            width={28}
            height={28}
            priority
            className="w-7 h-7 rounded-[8px] hidden dark:block"
          />
          <span className="font-semibold text-[17px] tracking-tight">{title}</span>
        </Link>
        <div className="flex items-center gap-3">
          {action}
          <AppleThemeToggle />
        </div>
      </div>
    </nav>
  );
}
