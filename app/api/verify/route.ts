import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { bountyRequirements, submissionUrl } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const prompt = `
      You are an automated code and deliverable auditor for a Solana escrow system.
      Bounty Requirements: "${bountyRequirements}"
      Submitted Work URL: "${submissionUrl}"
      
      Determine if this submission plausible satisfies the requirement. 
      Return JSON only: {"verified": true/false, "reason": "brief explanation"}.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        }),
      }
    );

    const data = await response.json();
    const result = JSON.parse(data.candidates[0].content.parts[0].text);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ verified: false, reason: "Verification failed" }, { status: 500 });
  }
}