import { sendMail } from "@/lib/mailService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, packageSelected, amount, notes } = await req.json();

    if (!name || !packageSelected || !amount || !notes) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const subject = "New BC Casting Payment Proof Submission";
    const body = `
      <b>Name:</b> ${name} <br/>
      <b>Package:</b> ${packageSelected} <br/>
      <b>Amount Paid:</b> ${amount} <br/>
      <b>Details:</b> ${notes}
    `;

    await sendMail("Support@bccastings.com", subject, body);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
