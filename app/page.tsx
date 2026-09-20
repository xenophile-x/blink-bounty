"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Check,
  Coins,
  Copy,
  ExternalLink,
  FileCheck2,
  Link2,
  Lock,
  Share2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  AppleButton,
  AppleCard,
  AppleGlassNav,
  AppleTextField,
} from "@/components/apple";

const AppleFounderSteps = [
  {
    icon: Lock,
    title: "Lock funds",
    body: "Founder funds a trustless escrow bound to the bounty requirements.",
  },
  {
    icon: Share2,
    title: "Share anywhere",
    body: "Every bounty becomes a Blink link that unfurls natively in-feed.",
  },
  {
    icon: ShieldCheck,
    title: "Verify & release",
    body: "Submissions are audited before funds release to the worker.",
  },
];

const AppleWorkerSteps = [
  {
    icon: Link2,
    title: "Open the Blink",
    body: "Tap the Dialect link. Your wallet connects and the bounty card loads from GET /api/actions/bounty — title, founder, and submit field.",
  },
  {
    icon: Wallet,
    title: "Submit your work",
    body: "Paste your GitHub or Figma URL. Your wallet signs the POST transaction — you are the fee payer, no funds move yet.",
  },
  {
    icon: Bot,
    title: "AI audit",
    body: "POST /api/verify sends your URL plus the bounty requirements to Gemini. It returns { verified, reason }.",
  },
  {
    icon: Coins,
    title: "Get paid",
    body: "On verified: true, the escrow program releases funds from the founder vault to your wallet. One signature, no middleman.",
  },
];

export default function Home() {
  const [founderAddress, setFounderAddress] = useState("");
  const [generatedBlink, setGeneratedBlink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const generatorRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showGenerator) {
      // Wait for the hero collapse to paint before scrolling,
      // otherwise the scroll target moves mid-animation and it bounces.
      const id = window.setTimeout(() => {
        generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => window.clearTimeout(id);
    }
  }, [showGenerator]);

  useEffect(() => {
    if (showHowItWorks) {
      const id = window.setTimeout(() => {
        howItWorksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => window.clearTimeout(id);
    }
  }, [showHowItWorks]);

  const handleBackToTop = () => {
    setShowGenerator(false);
    setShowHowItWorks(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 80);
  };

  const handleGenerate = () => {
    if (!founderAddress.trim()) return;
    const origin = window.location.origin;
    const actionUrl = `solana-action:${origin}/api/actions/bounty?founder=${founderAddress.trim()}`;
    const dialUrl = `https://dial.to/devnet?action=${encodeURIComponent(actionUrl)}`;
    setGeneratedBlink(dialUrl);
    setCopied(false);
  };

  const handleClear = () => {
    setFounderAddress("");
    setGeneratedBlink("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedBlink) return;
    try {
      await navigator.clipboard.writeText(generatedBlink);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text">
      <AppleGlassNav />

      <main className="max-w-5xl w-full mx-auto px-6 pb-32 flex flex-col gap-10 flex-1 [overflow-anchor:none]">
        {/* Hero */}
        <header className={`flex-1 flex flex-col items-center justify-center text-center gap-4 max-w-2xl mx-auto w-full ${showGenerator || showHowItWorks ? "" : "min-h-[calc(100svh-180px)]"}`}>
          {!(showGenerator || showHowItWorks) && (
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
              The best way to fund
              <br />
              the work you love.
            </h1>
          )}
          <div className="flex justify-center gap-6 text-[17px]">
            <button
              type="button"
              onClick={() => setShowGenerator((v) => !v)}
              aria-expanded={showGenerator}
              className="text-apple-blue font-normal inline-flex items-center gap-0.5 hover:underline active:scale-95 transition-transform"
            >
              Create a bounty
              <ArrowUpRight
                size={17}
                className={`transition-transform duration-200 ${showGenerator ? "rotate-90" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={() => setShowHowItWorks((v) => !v)}
              aria-expanded={showHowItWorks}
              className="text-apple-blue font-normal inline-flex items-center gap-0.5 hover:underline active:scale-95 transition-transform"
            >
              How it works
              <ArrowUpRight
                size={17}
                className={`transition-transform duration-200 ${showHowItWorks ? "rotate-90" : ""}`}
              />
            </button>
          </div>
        </header>

        {/* Generator — revealed on demand */}
        {showGenerator && (
          <div ref={generatorRef} className="scroll-mt-24 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center gap-4 min-h-[calc(100svh-300px)]">
            <button
              type="button"
              onClick={handleBackToTop}
              className="self-start inline-flex items-center gap-1.5 text-apple-blue text-[15px] font-medium hover:opacity-80 active:scale-95 transition"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <AppleCard
              title="Create a bounty"
              subtitle="Enter the founder wallet. We generate a shareable Blink instantly."
            >
            <div className="flex flex-col gap-4 mt-2">
              <AppleTextField
                id="founder"
                label="Founder wallet address"
                hint="Solana devnet address that funds the escrow."
                placeholder="Paste Solana Devnet Address…"
                value={founderAddress}
                onChange={(e) => setFounderAddress(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <AppleButton
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={!founderAddress.trim()}
                  className="flex-1"
                >
                  Generate Shareable Blink
                </AppleButton>
                <AppleButton variant="secondary" onClick={handleClear}>
                  Cancel
                </AppleButton>
              </div>

              {generatedBlink && (
                <div className="mt-2 p-4 rounded-apple-md bg-apple-bg break-all">
                  <p className="text-sm text-apple-text-secondary mb-2">
                    Test your Blink on Dialect:
                  </p>
                  <a
                    href={generatedBlink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-apple-blue text-sm font-medium break-all hover:opacity-80 transition-opacity"
                  >
                    {generatedBlink}
                  </a>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <AppleButton
                      variant="secondary"
                      size="medium"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Copied" : "Copy Link"}
                    </AppleButton>
                    <a
                      href={generatedBlink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-semibold rounded-full px-5 py-2.5 text-[15px] bg-apple-blue text-white hover:opacity-90 transition-all duration-200 active:scale-95"
                    >
                      Open in Dialect <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </AppleCard>
          </div>
        )}

        {/* How it works — revealed on demand */}
        {showHowItWorks && (
          <div ref={howItWorksRef} className="scroll-mt-24 flex flex-col gap-10 pt-10">
            <button
              type="button"
              onClick={handleBackToTop}
              className="self-start inline-flex items-center gap-1.5 text-apple-blue text-[15px] font-medium hover:opacity-80 active:scale-95 transition"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <section className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold tracking-tight">
                For founders. <span className="text-apple-text-secondary font-semibold">Three steps, no clutter.</span>
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 mt-2">
                {AppleFounderSteps.map((step) => (
                  <AppleCard key={step.title} title={step.title}>
                    <step.icon size={22} className="text-apple-blue mb-3" strokeWidth={1.8} />
                    <p className="text-apple-text-secondary text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </AppleCard>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold tracking-tight">
                For workers. <span className="text-apple-text-secondary font-semibold">How you access the escrow.</span>
              </h2>
              <p className="text-apple-text-secondary max-w-2xl leading-relaxed">
                You never touch code or the contract directly. The Blink is the
                contract interface — your wallet signs, the escrow program holds,
                and the AI auditor approves the release.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                {AppleWorkerSteps.map((step, i) => (
                  <AppleCard key={step.title} title={`${i + 1}. ${step.title}`}>
                    <step.icon size={22} className="text-apple-blue mb-3" strokeWidth={1.8} />
                    <p className="text-apple-text-secondary text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </AppleCard>
                ))}
              </div>
              <AppleCard className="flex flex-col sm:flex-row items-start gap-4">
                <FileCheck2 size={24} className="text-apple-green shrink-0 mt-1" strokeWidth={1.8} />
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight mb-1">
                    What you need
                  </h3>
                  <p className="text-apple-text-secondary text-sm leading-relaxed">
                    A Solana devnet wallet (Phantom or Solflare), the Blink link
                    from the founder, and your deliverable URL. No API keys, no
                    signup — the founder&apos;s escrow and the verification API do
                    the rest.
                  </p>
                </div>
              </AppleCard>
            </section>
          </div>
        )}

      </main>

      <footer className="fixed bottom-0 inset-x-0 z-40 bg-apple-glass backdrop-blur-xl border-t border-apple-separator/20">
        <div className="flex flex-col gap-0.5 text-center items-center py-3 px-6">
          <p className="text-[13px] text-apple-text-secondary">
            Trustless escrow for open work
          </p>
          <p className="text-[13px] text-apple-text-secondary">
            Copyright © 2026 Blinky. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
