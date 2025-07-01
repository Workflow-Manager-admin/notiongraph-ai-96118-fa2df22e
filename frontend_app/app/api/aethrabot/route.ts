import { NextRequest, NextResponse } from "next/server";

// PUBLIC_INTERFACE
/**
 * POST handler for /api/aethrabot:
 * Proxies chat requests to the Gemini API using GEMINI_API_KEY from environment variables.
 */
export async function POST(req: NextRequest) {
  // Get user prompt from incoming request
  const { prompt = "", system = "" } = await req.json();

  // Read Gemini API key from environment variable
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key is not configured." },
      { status: 500 }
    );
  }

  // Prepare request to Gemini API (example: Gemini 1.5 Pro, adjust endpoint as needed)
  const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + GEMINI_API_KEY;

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
            ...(system && { role: "system", text: system }),
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const error = await geminiRes.json();
      return NextResponse.json(error, { status: geminiRes.status });
    }

    const data = await geminiRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unexpected error contacting Gemini API." },
      { status: 500 }
    );
  }
}
