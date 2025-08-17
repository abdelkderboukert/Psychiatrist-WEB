"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { getTranslation } from "@/lib/translations"
import type { Language } from "@/lib/translations"

interface PersonalInfoFormProps {
  data: {
    name?: string
    email?: string
    phone?: string
    notes?: string
  }
  onSubmit: (data: { name: string; email: string; phone: string; notes?: string }) => void
  onBack: () => void
  language: Language
}

export function PersonalInfoForm({ data, onSubmit, onBack, language }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    notes: data.notes || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = getTranslation("booking.validation.name", language)
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = getTranslation("booking.validation.email", language)
    }
    if (!formData.phone.trim()) {
      newErrors.phone = getTranslation("booking.validation.phone", language)
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-semibold">{getTranslation("rendezVous.personalInfo", language)}</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{getTranslation("booking.name", language)}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={getTranslation("booking.name.placeholder", language)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">{getTranslation("booking.email", language)}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={getTranslation("booking.email.placeholder", language)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">{getTranslation("booking.phone", language)}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder={getTranslation("booking.phone.placeholder", language)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="notes">{getTranslation("rendezVous.additionalNotes", language)}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder={getTranslation("rendezVous.notesPlaceholder", language)}
                rows={4}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                {getTranslation("rendezVous.confirmBooking", language)}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
