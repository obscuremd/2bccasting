// app/api/send-email/route.ts
import { sendMail } from "@/lib/mailService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Fields 'to', 'subject', and 'body' are required." },
        { status: 400 }
      );
    }

    await sendMail(to, subject, body);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
