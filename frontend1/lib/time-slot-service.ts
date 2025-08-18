import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface BookedSlot {
  date: string;
  time: string;
  sessionType: string;
}

export async function getAvailableTimeSlots(date: string): Promise<TimeSlot[]> {
  const baseTimeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  try {
    // Get all bookings for the selected date
    const appointmentsRef = collection(db, "appointments");
    const q = query(
      appointmentsRef,
      where("preferredDate", "==", date),
      where("status", "in", ["pending", "confirmed"])
    );

    const querySnapshot = await getDocs(q);
    const bookedSlots: BookedSlot[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookedSlots.push({
        date: data.preferredDate,
        time: data.preferredTime,
        sessionType: data.sessionType,
      });
    });

    // Create time slots with availability
    const timeSlots: TimeSlot[] = baseTimeSlots.map((time) => {
      const isDirectlyBooked = bookedSlots.some((slot) => slot.time === time);

      if (isDirectlyBooked) {
        return {
          time,
          available: false,
          reason: "Already booked",
        };
      }

      // Check if this slot is blocked by a previous booking (2-hour rule)
      const isBlockedByPrevious = bookedSlots.some((slot) => {
        const bookedHour = Number.parseInt(slot.time.split(":")[0]);
        const currentHour = Number.parseInt(time.split(":")[0]);

        // Block next 2 hours after a booking
        return currentHour > bookedHour && currentHour <= bookedHour + 2;
      });

      if (isBlockedByPrevious) {
        return {
          time,
          available: false,
          reason: "Blocked by previous appointment",
        };
      }

      // Check if booking this slot would conflict with future bookings
      const wouldBlockFuture = bookedSlots.some((slot) => {
        const futureHour = Number.parseInt(slot.time.split(":")[0]);
        const currentHour = Number.parseInt(time.split(":")[0]);

        // This slot would block a future booking within 2 hours
        return futureHour > currentHour && futureHour <= currentHour + 2;
      });

      if (wouldBlockFuture) {
        return {
          time,
          available: false,
          reason: "Would conflict with existing appointment",
        };
      }

      return {
        time,
        available: true,
      };
    });

    return timeSlots;
  } catch (error) {
    console.error("[v0] Error fetching available time slots:", error);
    // Return all slots as available if there's an error
    return baseTimeSlots.map((time) => ({ time, available: true }));
  }
}

export async function validateTimeSlotAvailability(
  date: string,
  time: string
): Promise<{ available: boolean; reason?: string }> {
  try {
    const availableSlots = await getAvailableTimeSlots(date);
    const slot = availableSlots.find((s) => s.time === time);

    if (!slot) {
      return { available: false, reason: "Invalid time slot" };
    }

    return {
      available: slot.available,
      reason: slot.reason,
    };
  } catch (error) {
    console.error("[v0] Error validating time slot:", error);
    return { available: false, reason: "Unable to validate availability" };
  }
}
