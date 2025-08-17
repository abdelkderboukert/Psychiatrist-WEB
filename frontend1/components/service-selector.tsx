"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Heart, Users, Home } from "lucide-react"
import { getTranslation } from "@/lib/translations"
import { servicesData, type ServiceData } from "@/lib/services-data"
import type { Language } from "@/lib/translations"

interface ServiceSelectorProps {
  selectedService?: ServiceData
  onServiceSelect: (service: ServiceData) => void
  language: Language
}

export function ServiceSelector({ selectedService, onServiceSelect, language }: ServiceSelectorProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return Heart
      case "Users":
        return Users
      case "Home":
        return Home
      default:
        return Heart
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {getTranslation("rendezVous.selectService", language)}
      </h2>

      <div className="grid gap-4">
        {servicesData.map((service) => {
          const Icon = getIcon(service.icon)
          const isSelected = selectedService?.id === service.id

          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => onServiceSelect(service)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{getTranslation(service.titleKey, language)}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{getTranslation(service.descKey, language)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {service.price}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
