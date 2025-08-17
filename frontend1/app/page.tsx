import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { FeedbackSection } from "@/components/feedback-section"
import { BookingForm } from "@/components/booking-form"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FeedbackSection />
      <BookingForm />
      <Footer />
    </main>
  )
}
