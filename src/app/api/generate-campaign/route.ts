import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// WARNING: Never expose your real API key in the client.
// It is safe in this server-side code.
const GEMINI_API_KEY = "AIzaSyCCSDw1FEhj81J-xHjLUGlT5aZHU65KOlw";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { targetIndustry, messageTemplates, campaignGoal } = await req.json();

    const prompt = `
You are an expert email campaign copywriter.
- Target Industry: ${targetIndustry}
- Key Message Templates / Points: ${messageTemplates}
- Campaign Goal: ${campaignGoal}
Write a compelling, conversion-focused email campaign (1-3 emails) tailored for this industry and goal, using the provided templates and best practices. Format as plain text.
`;

    // The SDK expects "contents" as an array of objects with a "role" and "parts".
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // The SDK returns the text under response.candidates[0].content.parts[0].text
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No campaign generated.";

    return NextResponse.json({ emailCampaign: text });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate campaign." },
      { status: 500 }
    );
  }
}