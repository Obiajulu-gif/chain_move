import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    bio: "Former Goldman Sachs VP with 10+ years in fintech and blockchain innovation.",
    image: "/images/team-1.jpg",
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    bio: "Ex-Ethereum core developer with expertise in smart contracts and DeFi protocols.",
    image: "/images/team-2.jpg",
  },
  {
    name: "Amara Okafor",
    role: "Head of Operations",
    bio: "Former Uber operations lead with deep understanding of mobility markets in Africa.",
    image: "/images/team-3.jpg",
  },
  {
    name: "David Rodriguez",
    role: "Head of Risk",
    bio: "Former credit risk analyst at JPMorgan with expertise in alternative lending.",
    image: "/images/team-4.jpg",
  },
]

export function TeamSection() {
  return (
		<section className="py-16 bg-background">
			<div className="text-center mb-12">
				<h2 className="text-3xl font-bold text-[#142841] mb-4">
					Meet Our Team 👥
				</h2>
				<p className="text-lg text-gray-600">
					Experienced leaders from fintech, blockchain, and mobility sectors
				</p>
			</div>
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
				{team.map((member, index) => (
					<Card key={index} className="text-center">
						<CardHeader>
							<Image
								src={member.image || "/placeholder.svg"}
								alt={member.name}
								width={200}
								height={200}
								className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
							/>
							<CardTitle className="text-[#142841]">{member.name}</CardTitle>
							<CardDescription className="text-[#E57700] font-medium">
								{member.role}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 text-sm">{member.bio}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
