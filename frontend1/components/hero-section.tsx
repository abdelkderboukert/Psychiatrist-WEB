"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { getTranslation } from "@/lib/translations";

export function HeroSection() {
  const { language } = useLanguage();

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl mb-6 font-extrabold leading-tight font-serif text-emerald-900">
          {getTranslation("hero.title", language)}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {getTranslation("hero.subtitle", language)}
        </p>
        <Button
          size="lg"
          onClick={scrollToBooking}
          className="text-lg px-8 py-6 rounded-full bg-amber-500 hover:bg-amber-500/90 text-amber-500-foreground"
        >
          {getTranslation("hero.cta", language)}
        </Button>
      </div>
    </section>
  );
}
