import { NextResponse } from "next/server";

// Verified working with the project's GEMINI_API_KEY (Sept 2026):
// gemini-2.5-flash / flash-lite are retired for new users (404),
// gemini-flash-latest is frequently 503, gemini-3-flash-preview works.
const GEMINI_MODEL = "gemini-3-flash-preview";

export async function POST(request: Request) {
  try {
    const { bountyRequirements, submissionUrl } = await request.json();

    if (!bountyRequirements || !submissionUrl) {
      return NextResponse.json(
        { verified: false, reason: "bountyRequirements and submissionUrl are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ verified: false, reason: "API key not configured" }, { status: 500 });
    }

    const prompt = `
      You are an automated code and deliverable auditor for a Solana escrow system.
      Bounty Requirements: "${String(bountyRequirements).slice(0, 2000)}"
      Submitted Work URL: "${String(submissionUrl).slice(0, 500)}"

      Determine if this submission plausibly satisfies the requirement.
      Return JSON only: {"verified": true/false, "reason": "brief explanation"}.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      console.error(`Blinky verify: Gemini ${response.status} ${errBody.slice(0, 300)}`);
      return NextResponse.json(
        { verified: false, reason: `AI auditor unavailable (HTTP ${response.status})` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("Blinky verify: empty candidates", JSON.stringify(data).slice(0, 300));
      return NextResponse.json({ verified: false, reason: "AI auditor returned no result" }, { status: 502 });
    }

    let result: { verified?: unknown; reason?: unknown };
    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json({ verified: false, reason: "AI auditor returned invalid JSON" }, { status: 502 });
    }

    return NextResponse.json({
      verified: result.verified === true,
      reason: typeof result.reason === "string" ? result.reason : "No reason provided",
    });
  } catch (error) {
    console.error("Blinky verify failed:", error);
    return NextResponse.json({ verified: false, reason: "Verification failed" }, { status: 500 });
  }
}
