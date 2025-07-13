import Image from "next/image"
import Marquee from "@/components/ui/marquee"
import { Award } from "lucide-react";
export function PartnersSection() {
  const partners = [
    { name: "Lisk", logo: "/partners/lisk.png" },
    { name: "AyaHq", logo: "/partners/ayahq.png" },
    { name: "BlockchainUNN", logo: "/partners/BlockchainUNN.png" },
    { name: "GIDA", logo: "/partners/GIDA.jpeg" },
  ]

  return (
      <>
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Award className="h-6 w-6 mr-3" />
              Trusted Partners
            </h2>
            <p className="text-muted-foreground">Powered by leading blockchain and fintech partners</p>
          </div>

          <Marquee pauseOnHover className="[--duration:30s]">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center mx-8 bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section >
    </>
    )
}
