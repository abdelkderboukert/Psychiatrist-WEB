import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getServiceBySlug } from "@/lib/services-data"
import { ServiceDetailClient } from "@/components/service-detail-client"

interface ServicePageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return [{ slug: "individual-therapy" }, { slug: "couples-therapy" }, { slug: "family-therapy" }]
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <ServiceDetailClient service={service} />
      </div>
    </div>
  )
}
