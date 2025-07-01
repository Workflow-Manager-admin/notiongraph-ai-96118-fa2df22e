import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt = "", system = "" } = await req.json();

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key is not configured." },
      { status: 500 }
    );
  }

  // ✅ Use Gemini 1.5 Flash model (free)
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${system}\n\n${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.5,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
          responseMimeType: "text/plain",
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const error = await geminiRes.json();
      return NextResponse.json(error, { status: geminiRes.status });
    }

    const data = await geminiRes.json();

    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({
      candidates: [
        {
          content: {
            parts: [{ text: responseText }],
          },
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unexpected error contacting Gemini API." },
      { status: 500 }
    );
  }
}
