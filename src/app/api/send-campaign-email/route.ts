import { NextResponse } from "next/server";
import { Resend } from "resend";

// WARNING: Hardcoding API keys is not recommended for production.
// This is for demonstration ONLY. In production, always use environment variables.
const resendApiKey = "re_EnQYV3R8_N7aKu2c2c7i8rXctXxMAvVsC"; // <-- Your Resend API Key here

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY.");
}
const resend = new Resend(resendApiKey);

export async function POST(req: Request) {
  const { to, subject, text, html, from } = await req.json();

  try {
    const response = await resend.emails.send({
      from: from || "Acme <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send email" },
      { status: 500 }
    );
  }
}