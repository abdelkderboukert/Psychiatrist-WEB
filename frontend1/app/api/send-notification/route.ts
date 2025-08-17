import { type NextRequest, NextResponse } from "next/server";
import {
  generateEmailTemplate,
  type EmailNotificationData,
} from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const data: EmailNotificationData = await request.json();

    // Validate required fields
    if (!data.clientName || !data.clientEmail || !data.referenceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate email content
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

    // For demonstration, we'll use a mock email service
    // In production, you would integrate with services like:
    // - Resend: https://resend.com
    // - SendGrid: https://sendgrid.com
    // - Nodemailer with SMTP
    // - EmailJS: https://emailjs.com

    console.log("[v0] Email notification would be sent:");
    console.log("To: admin@drsarahpsychology.com");
    console.log("Subject: New Appointment Booking -", data.referenceId);
    console.log("HTML Content:", emailHtml.substring(0, 200) + "...");

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: "Admin notification sent successfully",
      referenceId: data.referenceId,
    });

    /* 
    // Example integration with Resend (uncomment and configure):
    
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const emailResult = await resend.emails.send({
      from: 'noreply@drsarahpsychology.com',
      to: process.env.ADMIN_EMAIL || 'admin@drsarahpsychology.com',
      subject: `New Appointment Booking - ${data.referenceId}`,
      html: emailHtml,
      text: emailText,
    })

    return NextResponse.json({
      success: true,
      message: "Admin notification sent successfully",
      emailId: emailResult.data?.id,
      referenceId: data.referenceId,
    })
    */
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
