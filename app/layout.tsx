import type { Metadata } from "next";
import "./globals.css";
import { AppleProviders } from "@/components/apple/AppleProviders";

export const metadata: Metadata = {
  title: "Blinky — Trustless In-Feed Escrow",
  description:
    "Lock funds into a trustless Solana escrow bounty and share it anywhere as a Blink.",
  icons: {
    icon: [
      { url: "/Light.png", media: "(prefers-color-scheme: light)" },
      { url: "/Dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/Dark.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-apple-bg text-apple-text">
        <AppleProviders>{children}</AppleProviders>
      </body>
    </html>
  );
}
