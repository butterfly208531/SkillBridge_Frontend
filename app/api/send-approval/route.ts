import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const CBE_ACCOUNT = process.env.PAYMENT_CBE_ACCOUNT || "Account Name: Yonas Negese | Account Number: 1000783760448";
const TELEBIRR_ACCOUNT = process.env.PAYMENT_TELEBIRR_ACCOUNT || "Name: Yonas Negese | Number: 0955935455";

interface ApprovalRequest {
  email?: string;
  fullName?: string;
  courseName?: string;
  courseSlug?: string;
  price?: number;
  applicationId?: string;
}

export async function POST(request: Request) {
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const resendKey = process.env.RESEND_API_KEY;

  try {
    const body = (await request.json()) as ApprovalRequest;
    const email = (body.email || "").trim();
    const fullName = (body.fullName || "").trim();
    const courseName = (body.courseName || "").trim();
    const applicationId = (body.applicationId || "").trim();
    const origin = new URL(request.url).origin;

    if (!gmailPass && !resendKey) {
      return NextResponse.json(
        { sent: false, error: "No email provider configured (set GMAIL_APP_PASSWORD or RESEND_API_KEY)" },
        { status: 500 },
      );
    }
    if (!email) {
      return NextResponse.json({ sent: false, error: "Recipient email is required" }, { status: 400 });
    }

    const price = Number(body.price || 0);
    const priceLine = price > 0
      ? `Your course fee is <strong>${price.toLocaleString()} ETB</strong>.`
      : "Your course fee is listed on the course page.";

    const uploadPath = applicationId
      ? `${origin}/en/payment/${encodeURIComponent(applicationId)}`
      : null;
    const uploadButton = uploadPath
      ? `
        <div style="text-align:center;margin:24px 0">
          <a href="${uploadPath}" style="display:inline-block;background:#1E90FF;color:#fff;text-decoration:none;font-weight:600;padding:14px 32px;border-radius:10px">
            Upload Your Payment Receipt
          </a>
          <p style="font-size:13px;color:#666;margin-top:10px">After transferring, upload your receipt on this page so we can confirm your payment.</p>
        </div>`
      : "";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
        <div style="background:#1E90FF;color:#fff;padding:24px 32px">
          <h2 style="margin:0">SkillBridge Institute of Technology</h2>
          <p style="margin:8px 0 0;opacity:.9">Application Approved</p>
        </div>
        <div style="padding:32px">
          <p>Dear <strong>${fullName || "Student"}</strong>,</p>
          <p>Congratulations! Your application for the <strong>${courseName || "bootcamp course"}</strong> has been approved.</p>
          <p>${priceLine}</p>
          <p>Please complete your payment by transferring the exact course fee to one of our official accounts below:</p>
          <div style="background:#f5f9ff;border:1px solid #dbeafe;border-radius:10px;padding:16px 20px;margin:16px 0">
            <p style="margin:0 0 8px;font-weight:600">Commercial Bank of Ethiopia (CBE)</p>
            <p style="margin:0">${CBE_ACCOUNT}</p>
            <p style="margin:16px 0 8px;font-weight:600">Telebirr</p>
            <p style="margin:0">${TELEBIRR_ACCOUNT}</p>
          </div>
          ${uploadButton}
          <p>Once the transfer is confirmed, your enrollment will be finalized. Reply to this email if you need any help.</p>
          <p>Best regards,<br/>SkillBridge Institute of Technology</p>
        </div>
      </div>
    `;

    if (gmailPass) {
      // Gmail SMTP (skillbridgeinstituteoftech@gmail.com)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER || "skillbridgeinstituteoftech@gmail.com",
          pass: gmailPass,
        },
      });
      await transporter.sendMail({
        from: `"SkillBridge Institute of Technology" <${process.env.GMAIL_USER || "skillbridgeinstituteoftech@gmail.com"}>`,
        to: email,
        subject: `Application Approved - ${courseName || "SkillBridge Bootcamp"}`,
        html,
      });
      return NextResponse.json({ sent: true, provider: "gmail" });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "SkillBridge <onboarding@resend.dev>",
        to: [email],
        subject: `Application Approved - ${courseName || "SkillBridge Bootcamp"}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ sent: false, error: data?.message || "Resend API error", detail: data }, { status: 502 });
    }
    return NextResponse.json({ sent: true, id: data?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ sent: false, error: message }, { status: gmailPass ? 502 : 500 });
  }
}