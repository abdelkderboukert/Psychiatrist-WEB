"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { getTranslation } from "@/lib/translations";

export function AboutSection() {
  const { language } = useLanguage();

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl text-amber-700 md:text-4xl font-bold font-serif">
              {getTranslation("about.title", language)}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {getTranslation("about.description", language)}
            </p>
          </div>
          {/* <Card className="overflow-hidden rounded-t-3xl">
            <CardContent className="p-0">
              <img
                src="/Farah-Eddy-980x980.png"
                alt="Dr. Sarah - Professional Psychologist"
                className="w-full h-96 object-cove"
              />
            </CardContent>
          </Card> */}
          <div className="overflow-hidden rounded-t-full">
            <img
              src="Farah-Eddy-980x980.png"
              alt="Dr.farah - Professional Psychologist"
              className="w-full h-1/2 object-cove shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
