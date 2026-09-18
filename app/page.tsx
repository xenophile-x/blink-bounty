"use client";
import { useState } from "react";

export default function Home() {
  const [founderAddress, setFounderAddress] = useState("");
  const [generatedBlink, setGeneratedBlink] = useState("");

  const handleGenerate = () => {
    if (!founderAddress) return;
    const origin = window.location.origin;
    const actionUrl = `solana-action:${origin}/api/actions/bounty?founder=${founderAddress}`;
    const dialUrl = `https://dial.to/devnet?action=${encodeURIComponent(actionUrl)}`;
    setGeneratedBlink(dialUrl);
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 max-w-xl mx-auto flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-6">BlinkBounty Generator</h1>
      <div className="flex flex-col gap-4">
        <label className="text-sm text-gray-400">Founder Wallet Address</label>
        <input
          type="text"
          placeholder="Paste Solana Devnet Address..."
          className="p-3 rounded bg-zinc-900 border border-zinc-800 text-white"
          value={founderAddress}
          onChange={(e) => setFounderAddress(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="bg-purple-600 hover:bg-purple-700 py-3 rounded font-semibold text-white transition"
        >
          Generate Shareable Blink
        </button>

        {generatedBlink && (
          <div className="mt-6 p-4 rounded bg-zinc-900 border border-zinc-800 break-all">
            <p className="text-sm text-gray-400 mb-2">Test your Blink on Dialect:</p>
            <a
              href={generatedBlink}
              target="_blank"
              rel="noreferrer"
              className="text-purple-400 underline text-sm"
            >
              {generatedBlink}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}