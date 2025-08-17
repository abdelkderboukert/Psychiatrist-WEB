export interface ServiceData {
  id: string
  slug: string
  titleKey: string
  descKey: string
  detailDescKey: string
  icon: string
  duration: string
  price: string
  benefits: string[]
  process: string[]
}

export const servicesData: ServiceData[] = [
  {
    id: "individual",
    slug: "individual-therapy",
    titleKey: "services.individual",
    descKey: "services.individual.desc",
    detailDescKey: "services.individual.detail",
    icon: "Heart",
    duration: "50 minutes",
    price: "$120",
    benefits: [
      "services.individual.benefit1",
      "services.individual.benefit2",
      "services.individual.benefit3",
      "services.individual.benefit4",
    ],
    process: [
      "services.individual.process1",
      "services.individual.process2",
      "services.individual.process3",
      "services.individual.process4",
    ],
  },
  {
    id: "couples",
    slug: "couples-therapy",
    titleKey: "services.couples",
    descKey: "services.couples.desc",
    detailDescKey: "services.couples.detail",
    icon: "Users",
    duration: "60 minutes",
    price: "$150",
    benefits: [
      "services.couples.benefit1",
      "services.couples.benefit2",
      "services.couples.benefit3",
      "services.couples.benefit4",
    ],
    process: [
      "services.couples.process1",
      "services.couples.process2",
      "services.couples.process3",
      "services.couples.process4",
    ],
  },
  {
    id: "family",
    slug: "family-therapy",
    titleKey: "services.family",
    descKey: "services.family.desc",
    detailDescKey: "services.family.detail",
    icon: "Home",
    duration: "75 minutes",
    price: "$180",
    benefits: [
      "services.family.benefit1",
      "services.family.benefit2",
      "services.family.benefit3",
      "services.family.benefit4",
    ],
    process: [
      "services.family.process1",
      "services.family.process2",
      "services.family.process3",
      "services.family.process4",
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find((service) => service.slug === slug)
}
