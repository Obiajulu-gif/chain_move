import { Badge } from "@/components/ui/badge"

const milestones = [
  {
    year: "2024",
    title: "Company Founded",
    description: "ChainMove was established with a vision to democratize vehicle financing.",
  },
  { year: "2024", title: "MVP Launch", description: "Launched our minimum viable product on Lisk testnet." },
  { year: "2025", title: "Seed Funding", description: "Raised $20,000 in seed funding from AyaHq X LiskHQ Incubation Program." },
  {
    year: "2025",
    title: "Mainnet Launch",
    description: "Successfully deployed on Lisk mainnet with first vehicle fundings.",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description: "Expanding operations to 5 new countries across Africa.",
  },
]

export function TimelineSection() {
  return (
		<section className="py-16 bg-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
			<div className="text-center mb-12">
				<h2 className="text-3xl font-bold text-[#142841] dark:text-white mb-4">
					Our Journey 📅
				</h2>
				<p className="text-lg text-gray-600 dark:text-gray-300">
					Key milestones in ChainMove's growth
				</p>
			</div>
			<div className="max-w-4xl mx-auto">
				<div className="relative">
					<div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E57700] dark:bg-[#FFD580]"></div>
					<div className="space-y-8">
						{milestones.map((milestone, index) => (
							<div key={index} className="relative flex items-start">
								<div className="flex-shrink-0 w-8 h-8 bg-[#E57700] dark:bg-[#FFD580] rounded-full flex items-center justify-center relative z-10">
									<div className="w-3 h-3 bg-white dark:bg-[#23232A] rounded-full"></div>
								</div>
								<div className="ml-6">
									<div className="flex items-center mb-2">
										<Badge className="bg-[#142841] dark:bg-[#FFD580] text-white dark:text-[#142841] mr-3">
											{milestone.year}
										</Badge>
										<h3 className="text-lg font-semibold text-[#142841] dark:text-white">
											{milestone.title}
										</h3>
									</div>
									<p className="text-gray-600 dark:text-gray-300">
										{milestone.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
