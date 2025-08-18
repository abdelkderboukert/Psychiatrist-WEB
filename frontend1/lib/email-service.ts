export interface EmailNotificationData {
  appointmentId: string
  referenceId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  sessionType: string
  date: string
  time: string
  notes?: string
  location: {
    country?: string
    region?: string
    city?: string
  }
}

export async function sendAdminNotification(data: EmailNotificationData): Promise<boolean> {
  try {
    console.log("[v0] Sending admin email notification...")

    const response = await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Email API responded with status: ${response.status}`)
    }

    const result = await response.json()
    console.log("[v0] Admin notification sent successfully:", result)
    return true
  } catch (error) {
    console.error("[v0] Error sending admin notification:", error)
    return false
  }
}

export function formatSessionType(sessionType: string): string {
  const types: Record<string, string> = {
    individual: "Individual Therapy",
    couples: "Couples Counseling",
    family: "Family Therapy",
    consultation: "Initial Consultation",
  }
  return types[sessionType] || sessionType
}

export function generateEmailTemplate(data: EmailNotificationData): string {
  const sessionTypeFormatted = formatSessionType(data.sessionType)
  const locationString = [data.location.city, data.location.region, data.location.country].filter(Boolean).join(", ")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Appointment Booking</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #3b82f6; }
    .label { font-weight: bold; color: #1e40af; }
    .value { margin-top: 5px; }
    .notes { background: #fef3c7; border-left-color: #f59e0b; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🗓️ New Appointment Booking</h1>
      <p>Reference: ${data.referenceId}</p>
    </div>
    
    <div class="content">
      <div class="info-row">
        <div class="label">👤 Client Information</div>
        <div class="value">
          <strong>Name:</strong> ${data.clientName}<br>
          <strong>Email:</strong> ${data.clientEmail}<br>
          <strong>Phone:</strong> ${data.clientPhone}
        </div>
      </div>

      <div class="info-row">
        <div class="label">📅 Appointment Details</div>
        <div class="value">
          <strong>Service:</strong> ${sessionTypeFormatted}<br>
          <strong>Date:</strong> ${data.date}<br>
          <strong>Time:</strong> ${data.time}
        </div>
      </div>

      ${
        data.notes
          ? `
      <div class="info-row notes">
        <div class="label">📝 Additional Notes</div>
        <div class="value">${data.notes}</div>
      </div>
      `
          : ""
      }

      <div class="info-row">
        <div class="label">📍 Client Location</div>
        <div class="value">${locationString || "Location not available"}</div>
      </div>

      <div class="info-row">
        <div class="label">🔗 Firebase Document ID</div>
        <div class="value">${data.appointmentId}</div>
      </div>
    </div>

    <div class="footer">
      <p>This is an automated notification from Dr. Farah Psychology booking system.</p>
      <p>Please contact the client to confirm the appointment details.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
