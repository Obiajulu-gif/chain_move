import { ArrowRight, Car, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
	return (
		<section className="py-16 text-center bg-gradient-to-br from-[#E57700]/10 to-transparent dark:from-[#E57700]/5 rounded-2xl border border-border">
			<div className="max-w-2xl mx-auto px-4">
				<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
					Ready to get started? 🚀
				</h2>
				<p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
					Join 2,500+ drivers and investors building wealth through transparent, blockchain-powered vehicle financing.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						size="lg"
						className="bg-[#E57700] hover:bg-[#E57700]/90 text-white shadow-lg"
						asChild
					>
						<Link href="/auth?role=driver">
							<Car className="mr-2 h-5 w-5" />
							Get Vehicle Financing
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="border-[#E57700] text-[#E57700] hover:bg-[#E57700]/10"
						asChild
					>
						<Link href="/auth?role=investor">
							<TrendingUp className="mr-2 h-5 w-5" />
							Start Investing Today
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</Button>
				</div>
				<p className="mt-6 text-xs sm:text-sm text-muted-foreground">
					No hidden fees • Transparent pricing • Blockchain secured
				</p>
			</div>
		</section>
	);
}
