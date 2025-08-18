"use client";
import { Header } from "@/components/header";
// import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { FeedbackSection } from "@/components/feedback-section";
import { BookingForm } from "@/components/booking-form";
import { useLanguage } from "@/components/language-provider";
import { getTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function HomePage() {
  const { language } = useLanguage();
  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      <Header />
      {/* <HeroSection /> */}
      <div className="w-screen h-screen bg-white">
        <div className="w-full h-4/5 grid grid-cols-1 lg:grid-cols-5 gap-0">
          <div className="relative lg:col-span-3 h-full overflow-hidden">
            <img
              src="/main.jpeg"
              alt="main photo"
              className="size-full bg-cover blur-xs object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="text-left md:w-2/3 text-white">
                <h1 className="text-4xl font-bold font-serif">
                  {getTranslation("main.title", language)}
                </h1>
                <p className="mt-2 text-sm text-zinc-300/80">
                  {getTranslation("main.subtitle", language)}
                </p>
                <Button
                  size="lg"
                  onClick={scrollToBooking}
                  className="text-md w-48 h-10 mt-5 px-4 py-3 rounded-lg bg-white/70 text-emerald-800"
                >
                  {getTranslation("hero.cta", language)}
                </Button>
              </div>
            </div>
          </div>
          <div className="relative lg:col-span-2 hidden lg:block bg-zinc-50 h-full">
            <div className="absolute -bottom-12 -left-20  p-4 w-full h-48  bg-emerald-950">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="grid size-full grid-cols-1 font-serif text-3xl font-bold gap-3 p-1">
                  <p className="text-white/80">
                    « Lire les livres c’est de la culture. Lire les visages
                    c’est de l’intelligence Lire les âmes c’est de la sagesse et
                    du discernement. »
                  </p>
                </div>
              </div>
            </div>
          </div>
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
