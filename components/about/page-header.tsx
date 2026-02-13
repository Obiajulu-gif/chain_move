import { Award, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PageHeader() {
	return (
		<div className="mb-12">
			{/* CAC Certification Badge - Builds Trust */}
			<div className="flex flex-wrap items-center gap-3 mb-6">
				<Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2">
					<Shield className="h-4 w-4 mr-2" />
					CAC Registered Company
				</Badge>
				<Badge variant="outline" className="border-[#E57700] text-[#E57700] px-4 py-2">
					<Award className="h-4 w-4 mr-2" />
					Regulated & Compliant
				</Badge>
			</div>

			<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
				About ChainMove
			</h1>
			<p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
				We're a legally registered, blockchain-powered platform revolutionizing vehicle financing across Africa. 
				Trusted by thousands of drivers and investors to create transparent, accessible mobility opportunities.
			</p>

			{/* Trust Indicators */}
			<div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
				<div className="flex items-center">
					<div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
					<span>Corporate Affairs Commission Certified</span>
				</div>
				<div className="flex items-center">
					<div className="w-2 h-2 bg-[#E57700] rounded-full mr-2" />
					<span>2,500+ Active Users</span>
				</div>
				<div className="flex items-center">
					<div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
					<span>Built on Lisk Blockchain</span>
				</div>
			</div>
		</div>
	);
}
