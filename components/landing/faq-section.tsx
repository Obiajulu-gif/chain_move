import { FileText, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "How does vehicle co-ownership work on ChainMove?",
      answer:
        "Vehicle co-ownership allows multiple investors to jointly own a vehicle through blockchain tokenization. Each vehicle is divided into tokens representing ownership stakes. Co-owners earn proportional returns from vehicle usage and can trade their tokens on our marketplace.",
    },
    {
      question: "What is asset tokenization and how does it benefit me?",
      answer:
        "Asset tokenization converts physical vehicles into digital tokens on the blockchain. This enables fractional ownership, easier trading, transparent ownership records, and automated profit distribution through smart contracts. You can own a piece of multiple vehicles instead of buying one entirely.",
    },
    {
      question: "How are returns distributed among co-owners?",
      answer:
        "Returns are automatically distributed through smart contracts based on your ownership percentage. If you own 10% of a vehicle's tokens, you receive 10% of the net income from that vehicle's operations, including ride-sharing, rentals, and any asset appreciation.",
    },
    {
      question: "Can I sell my vehicle tokens?",
      answer:
        "Yes! Vehicle tokens can be traded on our marketplace, providing liquidity for your investment. You can sell your entire stake or partial ownership to other investors, making it easy to adjust your portfolio or exit investments.",
    },
    {
      question: "What types of vehicles can be co-owned and tokenized?",
      answer:
        "We support tokenization of cars, motorcycles, trucks, vans, and commercial vehicles used for ride-sharing, delivery, logistics, and personal transportation. Each vehicle undergoes verification and valuation before tokenization.",
    },
    {
      question: "How is vehicle maintenance and management handled?",
      answer:
        "Vehicle maintenance is managed by the primary operator (usually the driver) with costs deducted from gross earnings before profit distribution. All maintenance records are tracked on the blockchain for transparency among co-owners.",
    },
  ]

  return (
    <section className="py-20 bg-muted/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <HelpCircle className="h-8 w-8 mr-3 text-[#E57700]" />
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about vehicle co-ownership and tokenization
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 rounded-lg overflow-hidden hover:border-[#E57700] transition-colors dark:border-gray-700"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-[#E57700] flex-shrink-0" />
                    <span className="font-medium text-foreground dark:text-white">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
