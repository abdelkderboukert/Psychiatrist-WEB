import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getUserLocation, type LocationData } from "@/lib/geolocation"
import { validateTimeSlotAvailability } from "@/lib/time-slot-service"
import { sendAdminNotification } from "@/lib/email-service"

export interface AppointmentData {
  name: string
  email: string
  phone: string
  sessionType: string
  date: string
  time: string
  notes?: string
  location: LocationData
  timestamp: any // Firebase serverTimestamp
  status: "pending" | "confirmed" | "cancelled"
  referenceId: string
}

export interface BookingResult {
  success: boolean
  referenceId: string
  appointmentId?: string
  error?: string
}

export async function submitAppointment(formData: {
  name: string
  email: string
  phone: string
  sessionType: string
  date: string
  time: string
  notes?: string
}): Promise<BookingResult> {
  try {
    // Validate time slot availability first
    console.log("[v0] Validating time slot availability...")
    const availability = await validateTimeSlotAvailability(formData.date, formData.time)

    if (!availability.available) {
      return {
        success: false,
        referenceId: "",
        error: `Time slot not available: ${availability.reason}`,
      }
    }

    // Get user's location data
    console.log("[v0] Getting user location...")
    const location = await getUserLocation()
    console.log("[v0] Location obtained:", location)

    // Generate reference ID
    const referenceId = `RDV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Prepare appointment data
    const appointmentData: AppointmentData = {
      ...formData,
      location,
      timestamp: serverTimestamp(),
      status: "pending",
      referenceId,
    }

    console.log("[v0] Submitting appointment data:", appointmentData)

    // Add to Firestore
    const docRef = await addDoc(collection(db, "appointments"), appointmentData)

    console.log("[v0] Appointment submitted successfully with ID:", docRef.id)

    try {
      await sendAdminNotification({
        appointmentId: docRef.id,
        referenceId,
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        sessionType: formData.sessionType,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        location: {
          country: location.country,
          region: location.region,
          city: location.city,
        },
      })
      console.log("[v0] Admin notification sent successfully")
    } catch (emailError) {
      console.error("[v0] Failed to send admin notification:", emailError)
      // Don't fail the booking if email fails
    }

    return {
      success: true,
      referenceId,
      appointmentId: docRef.id,
    }
  } catch (error) {
    console.error("[v0] Error submitting appointment:", error)

    return {
      success: false,
      referenceId: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export function validateAppointmentData(data: {
  name: string
  email: string
  phone: string
  sessionType: string
  date: string
  time: string
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name.trim()) {
    errors.push("Full name is required")
  }

  if (!data.email.trim()) {
    errors.push("Email is required")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format")
  }

  if (!data.phone.trim()) {
    errors.push("Phone number is required")
  }

  if (!data.sessionType) {
    errors.push("Session type is required")
  }

  if (!data.date) {
    errors.push("Preferred date is required")
  } else {
    const selectedDate = new Date(data.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      errors.push("Preferred date cannot be in the past")
    }
  }

  if (!data.time) {
    errors.push("Preferred time is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
