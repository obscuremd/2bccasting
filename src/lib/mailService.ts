// lib/mail.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_HOST, // e.g. "smtp.gmail.com"
  port: 587,
  secure: false,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USERNAME,
    pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
  },
});

export async function sendMail(to: string, subject: string, body: string) {
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #333333;">BC Casting</h2>
          <p style="font-size: 16px; color: #555555;">${body}</p>
          <hr style="border: none; border-top: 1px solid #eeeeee;" />
          <p style="font-size: 12px; color: #aaaaaa;">
            You're receiving this email from BC Casting updates and notifications system.
          </p>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"BC Casting" <${process.env.NEXT_PUBLIC_SMTP_USERNAME}>`,
    to,
    subject,
    html,
  });
}
