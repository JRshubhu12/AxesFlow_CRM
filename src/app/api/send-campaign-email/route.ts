import { NextResponse } from "next/server";

import { Resend } from "resend";

// NOTE: Hardcoded for demo; use env var in production!

const resendApiKey = "re_4ijr8Coz_Ks7wQ7kTuKhgGsf1hJd86Asc";

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

    // If Resend's API returns error, ensure message is present

    if (response.error) {
      const errorMsg =
        typeof response.error === "string"
          ? response.error
          : response.error?.message ||
            JSON.stringify(response.error) ||
            "Unknown error";

      console.error("Resend error:", errorMsg);

      return NextResponse.json(
        { error: errorMsg },

        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    const errorMsg =
      error?.message ||
      (typeof error === "string" ? error : JSON.stringify(error)) ||
      "Failed to send email";

    console.error("Email send error:", errorMsg);

    return NextResponse.json(
      { error: errorMsg },

      { status: 500 }
    );
  }
}
