"use client";
import {
	Search,
	UserCheck,
	Rocket,
	HelpCircle,
	Phone,
	FileText,
	Shield,
	AlertTriangle,
	Mail,
	Twitter,
	Linkedin,
	Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FooterLink {
	name: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	links: FooterLink[];
}

const currentYear = new Date().getFullYear();

const footerConfig = {
	company: {
		name: "ChainMove",
		logo: "/images/chainmovelogo.png",
		description:
			"Decentralized vehicle financing powered by blockchain technology.",
		social: [
			{
				name: "Email",
				icon: Mail,
				href: "mailto:okoyeemmanuelobiajulu@gmail.com",
			},
			{ name: "Twitter", icon: Twitter, href: "https://x.com/chainmove1" },
			{
				name: "LinkedIn",
				icon: Linkedin,
				href: "https://www.linkedin.com/company/chainmove/",
			},
		],
	},
	sections: [
		{
			title: "Platform",
			icon: Search,
			links: [
				{ name: "Marketplace", icon: Search, href: "/marketplace" },
				{ name: "About Us", icon: UserCheck, href: "/about" },
				{ name: "Announcements", icon: Rocket, href: "/announcements" },
				{ name: "Book a Demo", icon: Zap, href: "https://calendly.com/amaobiokeoma/30min" },
			],
		},
		{
			title: "Support",
			icon: HelpCircle,
			links: [
				{ name: "Help Center", icon: HelpCircle, href: "#" },
				{ name: "Contact Us", icon: Phone, href: "#" },
				{
					name: "Documentation",
					icon: FileText,
					href: "https://docs.chainmove.xyz/",
				},
			],
		},
		{
			title: "Legal",
			icon: Shield,
			links: [
				{ name: "Privacy Policy", icon: Shield, href: "#" },
				{ name: "Terms of Service", icon: FileText, href: "#" },
				{ name: "Risk Disclosure", icon: AlertTriangle, href: "#" },
			],
		},
	] as FooterSection[],
	copyright: `© ${currentYear} ChainMove. All rights reserved.`,
	builtWith: "Built on Lisk Layer 2.",
};

export function Footer() {
	return (
		<footer className="bg-gray-900 text-white py-12">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center mb-4">
							<Image
								src={footerConfig.company.logo}
								alt={`${footerConfig.company.name} Logo`}
								width={32}
								height={32}
								className="mr-3"
							/>
							<span className="text-2xl font-bold text-[#E57700]">
								{footerConfig.company.name}
							</span>
						</div>
						<p className="text-gray-400 flex items-center">
							<Rocket className="h-4 w-4 mr-2" />
							{footerConfig.company.description}
						</p>
						<div className="flex space-x-4 mt-4">
							{footerConfig.company.social.map((social, index) => (
								<a
									key={index}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#E57700] transition-colors"
									aria-label={social.name}
								>
									<social.icon className="h-4 w-4" />
								</a>
							))}
						</div>
					</div>

					{footerConfig.sections.map((section, index) => (
						<div key={index}>
							<h3 className="font-semibold mb-4 flex items-center">
								<section.icon className="h-4 w-4 mr-2" />
								{section.title}
							</h3>
							<ul className="space-y-2 text-gray-400">
								{section.links.map((link, linkIndex) => {
									const Icon = link.icon;
									return (
										<li key={linkIndex}>
											<Link
												href={link.href}
												className="hover:text-white transition-colors flex items-center"
											>
												<Icon className="h-3 w-3 mr-2" />
												{link.name}
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</div>

				<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
					<p className="flex items-center justify-center">
						{footerConfig.copyright}
						<Zap className="h-4 w-4 mx-2" />
						{footerConfig.builtWith}
					</p>
				</div>
			</div>
		</footer>
	);
}
