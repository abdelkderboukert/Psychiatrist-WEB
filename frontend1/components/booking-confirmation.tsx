"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, DollarSign, Calendar, User, Mail, Phone, ArrowLeft, Home } from "lucide-react"
import { getTranslation } from "@/lib/translations"
import { submitAppointment } from "@/lib/appointment-service"
import type { Language } from "@/lib/translations"
import type { ServiceData } from "@/lib/services-data"
import Link from "next/link"

interface BookingConfirmationProps {
  bookingData: {
    service?: ServiceData
    date?: string
    time?: string
    name?: string
    email?: string
    phone?: string
    notes?: string
    referenceId?: string
  }
  onConfirm: (referenceId: string) => void
  onBack: () => void
  language: Language
}

export function BookingConfirmation({ bookingData, onConfirm, onBack, language }: BookingConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(!!bookingData.referenceId)

  const handleConfirm = async () => {
    if (
      !bookingData.service ||
      !bookingData.date ||
      !bookingData.time ||
      !bookingData.name ||
      !bookingData.email ||
      !bookingData.phone
    ) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitAppointment({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        sessionType: bookingData.service.id,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes || "",
      })

      onConfirm(result.referenceId)
      setIsConfirmed(true)
    } catch (error) {
      console.error("Booking error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isConfirmed && bookingData.referenceId) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          {getTranslation("rendezVous.bookingConfirmed", language)}
        </h2>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{getTranslation("rendezVous.referenceNumber", language)}</p>
              <p className="text-lg font-mono font-semibold">{bookingData.referenceId}</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-muted-foreground mb-6">{getTranslation("rendezVous.confirmationMessage", language)}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/rendez-vous">{getTranslation("rendezVous.bookAnother", language)}</Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              {getTranslation("rendezVous.backToHome", language)}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-semibold">{getTranslation("rendezVous.step4", language)}</h2>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <span>Service</span>
            </div>
            <div className="text-right">
              <p className="font-medium">{getTranslation(bookingData.service?.titleKey || "", language)}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {bookingData.service?.duration}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {bookingData.service?.price}
                </Badge>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>Date & Time</span>
            </div>
            <div className="text-right">
              <p className="font-medium">{bookingData.date}</p>
              <p className="text-sm text-muted-foreground">{bookingData.time}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{bookingData.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{bookingData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{bookingData.phone}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {bookingData.notes && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Additional Notes</p>
              <p className="text-sm text-muted-foreground">{bookingData.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleConfirm} disabled={isSubmitting} size="lg">
          {isSubmitting
            ? getTranslation("booking.submitting", language)
            : getTranslation("rendezVous.confirmBooking", language)}
        </Button>
      </div>
    </div>
  )
}
