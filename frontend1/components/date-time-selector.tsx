"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, X } from "lucide-react"
import { getTranslation } from "@/lib/translations"
import { getAvailableTimeSlots, type TimeSlot } from "@/lib/time-slot-service"
import type { Language } from "@/lib/translations"

interface DateTimeSelectorProps {
  selectedDate?: string
  selectedTime?: string
  onDateTimeSelect: (date: string, time: string) => void
  onBack: () => void
  language: Language
}

export function DateTimeSelector({
  selectedDate,
  selectedTime,
  onDateTimeSelect,
  onBack,
  language,
}: DateTimeSelectorProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate ? new Date(selectedDate) : undefined)
  const [time, setTime] = useState<string | undefined>(selectedTime)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (date) {
      const dateString = date.toISOString().split("T")[0]
      setLoading(true)
      getAvailableTimeSlots(dateString)
        .then((slots) => {
          setAvailableSlots(slots)
          // Clear selected time if it's no longer available
          if (time && !slots.find((slot) => slot.time === time && slot.available)) {
            setTime(undefined)
          }
        })
        .catch((error) => {
          console.error("[v0] Error loading time slots:", error)
          setAvailableSlots([])
        })
        .finally(() => setLoading(false))
    } else {
      setAvailableSlots([])
      setTime(undefined)
    }
  }, [date, time])

  const handleContinue = () => {
    if (date && time) {
      onDateTimeSelect(date.toISOString().split("T")[0], time)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-semibold">{getTranslation("rendezVous.step2", language)}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>{getTranslation("booking.date", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {getTranslation("rendezVous.availableTimes", language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!date ? (
              <p className="text-muted-foreground text-center py-8">Please select a date first</p>
            ) : loading ? (
              <p className="text-muted-foreground text-center py-8">Loading available times...</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {getTranslation("rendezVous.noAvailableTimes", language)}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => (
                  <div key={slot.time} className="relative">
                    <Button
                      variant={time === slot.time ? "default" : "outline"}
                      size="sm"
                      onClick={() => slot.available && setTime(slot.time)}
                      disabled={!slot.available}
                      className={`w-full justify-center ${
                        !slot.available
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {slot.time}
                      {!slot.available && <X className="w-3 h-3 ml-1" />}
                    </Button>
                    {!slot.available && slot.reason && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                          {slot.reason}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleContinue} disabled={!date || !time} size="lg">
          Continue
        </Button>
      </div>
    </div>
  )
}
