"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Calendar, User } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/translations"
import type { ServiceData } from "@/lib/services-data"
import { ServiceSelector } from "@/components/service-selector"
import { DateTimeSelector } from "@/components/date-time-selector"
import { PersonalInfoForm } from "@/components/personal-info-form"
import { BookingConfirmation } from "@/components/booking-confirmation"

type BookingStep = "service" | "datetime" | "info" | "confirmation"

interface BookingData {
  service?: ServiceData
  date?: string
  time?: string
  name?: string
  email?: string
  phone?: string
  notes?: string
  referenceId?: string
}

export function RendezVousClient() {
  const { language } = useLanguage()
  const [currentStep, setCurrentStep] = useState<BookingStep>("service")
  const [bookingData, setBookingData] = useState<BookingData>({})

  const steps = [
    { id: "service", label: getTranslation("rendezVous.step1", language), icon: User },
    { id: "datetime", label: getTranslation("rendezVous.step2", language), icon: Calendar },
    { id: "info", label: getTranslation("rendezVous.step3", language), icon: User },
    { id: "confirmation", label: getTranslation("rendezVous.step4", language), icon: Check },
  ]

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    const stepOrder: BookingStep[] = ["service", "datetime", "info", "confirmation"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const stepOrder: BookingStep[] = ["service", "datetime", "info", "confirmation"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4" />
          {getTranslation("rendezVous.backToHome", language)}
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {getTranslation("rendezVous.title", language)}
          </h1>
          <p className="text-lg text-muted-foreground">{getTranslation("rendezVous.subtitle", language)}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = steps.findIndex((s) => s.id === currentStep) > index

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {currentStep === "service" && (
          <ServiceSelector
            selectedService={bookingData.service}
            onServiceSelect={(service) => {
              updateBookingData({ service })
              nextStep()
            }}
            language={language}
          />
        )}

        {currentStep === "datetime" && (
          <DateTimeSelector
            selectedDate={bookingData.date}
            selectedTime={bookingData.time}
            onDateTimeSelect={(date, time) => {
              updateBookingData({ date, time })
              nextStep()
            }}
            onBack={prevStep}
            language={language}
          />
        )}

        {currentStep === "info" && (
          <PersonalInfoForm
            data={bookingData}
            onSubmit={(data) => {
              updateBookingData(data)
              nextStep()
            }}
            onBack={prevStep}
            language={language}
          />
        )}

        {currentStep === "confirmation" && (
          <BookingConfirmation
            bookingData={bookingData}
            onConfirm={(referenceId) => {
              updateBookingData({ referenceId })
            }}
            onBack={prevStep}
            language={language}
          />
        )}
      </div>
    </div>
  )
}
