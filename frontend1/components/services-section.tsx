"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { getTranslation } from "@/lib/translations";
import { Heart, Users, Home, ArrowRight } from "lucide-react";
import { servicesData } from "@/lib/services-data";

export function ServicesSection() {
  const { language } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return Heart;
      case "Users":
        return Users;
      case "Home":
        return Home;
      default:
        return Heart;
    }
  };

  return (
    <section className="py-20 px-4 bg-amber-100/15">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-emerald-800 font-extrabold font-serif">
          {getTranslation("services.title", language)}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {servicesData.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <Card
                key={service.id}
                className="text-center hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-emerald-900" />
                  </div>
                  <CardTitle className="text-2xl font-serif">
                    {getTranslation(service.titleKey, language)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {getTranslation(service.descKey, language)}
                  </p>
                  <Link href={`/services/${service.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-emerald-200/20 group-hover:text-emerald-700/20 transition-colors bg-transparent"
                    >
                      {getTranslation("services.learnMore", language)}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
