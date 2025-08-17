"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/translations"

export function AboutSection() {
  const { language } = useLanguage()

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {getTranslation("about.title", language)}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {getTranslation("about.description", language)}
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img
                src="/psychologist-portrait.png"
                alt="Dr. Sarah - Professional Psychologist"
                className="w-full h-96 object-cover"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
