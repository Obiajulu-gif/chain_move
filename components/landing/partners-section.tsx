import Image from "next/image"

export function PartnersSection() {
  const partners = [
    { name: "Lisk", logo: "/partners/lisk.png" },
    { name: "AyaHq", logo: "/partners/ayahq.png" },
    { name: "BlockchainUNN", logo: "/partners/BlockchainUNN.png" },
    { name: "GIDA", logo: "/partners/GIDA.jpeg" },
  ]

  return (
    <section className="py-12 bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-foreground dark:text-white">Trusted by Industry Leaders</h2>
          <p className="text-muted-foreground mt-2">Our partners who believe in our vision</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="relative h-12 w-32 md:h-16 md:w-40 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={64}
                className="object-contain max-h-full max-w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
