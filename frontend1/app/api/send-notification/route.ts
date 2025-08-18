import { type NextRequest, NextResponse } from "next/server";
import {
  generateEmailTemplate,
  type EmailNotificationData,
} from "@/lib/email-service";
import nodemailer from "nodemailer";

// 2. Create a transporter object outside the handler to reuse the connection
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465", // Use `true` for port 465, `false` for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const data: EmailNotificationData = await request.json();

    if (!data.clientName || !data.clientEmail || !data.referenceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailHtml = generateEmailTemplate(data);
    const emailText = `
New Appointment Booking - ${data.referenceId}

Client: ${data.clientName}
Email: ${data.clientEmail}
Phone: ${data.clientPhone}
Service: ${data.sessionType}
Date: ${data.date}
Time: ${data.time}
${data.notes ? `Notes: ${data.notes}` : ""}

Location: ${[data.location.city, data.location.region, data.location.country]
      .filter(Boolean)
      .join(", ")}
Firebase ID: ${data.appointmentId}
    `.trim();

    // 3. Send the email using the transporter
    await transporter.sendMail({
      from: process.env.SMTP_USER, // Sender's email address
      to: process.env.ADMIN_EMAIL || "admin@drsarahpsychology.com", // Recipient's email
      subject: `New Appointment Booking - ${data.referenceId}`,
      html: emailHtml,
      text: emailText,
    });

    return NextResponse.json({
      success: true,
      message: "Admin notification sent successfully",
      referenceId: data.referenceId,
    });
  } catch (error) {
    console.error("[v0] Error in send-notification API:", error);
    return NextResponse.json(
      {
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
