"use client"

import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/translations"

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="bg-card border-t py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">{getTranslation("site.title", language)}</h3>
            <p className="text-muted-foreground">
              Professional psychological support in a safe and caring environment.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: info@drsarahpsychology.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Wellness St, City, State 12345</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Office Hours</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Dr. Sarah Psychology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
