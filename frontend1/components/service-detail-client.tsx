"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, CheckCircle, ArrowRight, Heart, Users, Home } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/translations"
import type { ServiceData } from "@/lib/services-data"
import Link from "next/link"

interface ServiceDetailClientProps {
  service: ServiceData
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const { language } = useLanguage()

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

  const Icon = getIcon(service.icon)

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {getTranslation(service.titleKey, language)}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {getTranslation(service.detailDescKey, language)}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {service.duration}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {service.price}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {getTranslation("services.benefits", language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {service.benefits.map((benefitKey, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{getTranslation(benefitKey, language)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              {getTranslation("services.process", language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {service.process.map((processKey, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-muted-foreground">{getTranslation(processKey, language)}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="text-center bg-primary/5 border-primary/20">
        <CardContent className="pt-8">
          <h3 className="text-2xl font-semibold mb-4">{getTranslation("services.ready", language)}</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {getTranslation("services.ready.desc", language)}
          </p>
          <Link href="/rendez-vous">
            <Button size="lg" className="gap-2">
              {getTranslation("services.book", language)}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  )
}
