import { NextResponse } from "next/server";
import { Resend } from "resend";

// Make sure to set RESEND_API_KEY in your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Optionally, you can check for a response error property and handle accordingly
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