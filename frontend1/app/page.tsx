"use client";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { FeedbackSection } from "@/components/feedback-section";
import { BookingForm } from "@/components/booking-form";
import { useLanguage } from "@/components/language-provider";
import { getTranslation } from "@/lib/translations";

import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen">
      <Header />
      {/* <HeroSection /> */}
      <div className="w-screen h-screen bg-white">
        <div className="w-full h-4/5 grid grid-cols-1 lg:grid-cols-5 gap-0">
          <div className="lg:col-span-3 bg-blue-500 h-full">
            <img src="" alt="" />
          </div>
          <div className="lg:col-span-2 hidden lg:block bg-white h-full"></div>
        </div>
      </div>
      <AboutSection />
      <div className="w-full h-[500hwh] bg-emerald-950 flex flex-col items-center justify-center">
        <h1 className="text-5xl text-amber-700 mt-10 font-serif font-bold text-center">
          {getTranslation("sercvices.readMore", language)}
        </h1>
        <div className="grid md:grid-cols-3 gap-8 mx-2">
          <Card className="text-center hover:shadow-lg transition-all bg-emerald-950 duration-300 group my-10">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                {getTranslation("services.titr1", language)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                {/* {getTranslation("Planifier une ConsultationdescKey", language)} */}
                {getTranslation("services.readMore1", language)}
              </p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-all bg-emerald-950 duration-300 group my-10">
            <CardHeader>
              <CardTitle className="text-xl text-white/80">
                {getTranslation("services.titr2", language)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white leading-relaxed">
                {getTranslation("services.readMore2", language)}
              </p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-all bg-emerald-950 duration-300 group my-10">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                {getTranslation("services.titr3", language)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-white/80">
                {getTranslation("services.readMore3", language)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <ServicesSection />
      <FeedbackSection />
      <BookingForm />
      <Footer />
    </main>
  );
}
