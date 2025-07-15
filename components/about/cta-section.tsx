import { ArrowRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
	return (
		<section className="py-16 text-center bg-background">
			<h2 className="text-3xl font-bold text-[#142841] dark:text-white mb-4">
				Join the Revolution 🚀
			</h2>
			<p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
				Be part of the future of vehicle financing. Whether you're a driver
				seeking financing or an investor looking for returns, ChainMove has
				opportunities for you.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Button
					size="lg"
					className="bg-[#E57700] dark:bg-[#FFD580] hover:bg-[#E57700]/90 dark:hover:bg-[#FFD580]/90 text-white dark:text-[#142841]"
					asChild
				>
					<Link href="/auth?role=driver">
						Apply for Financing <ArrowRight className="ml-2 h-5 w-5" />
					</Link>
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="border-gray-200 dark:border-gray-700 text-[#142841] dark:text-white"
					asChild
				>
					<Link href="/auth?role=investor">
						Start Investing <Target className="ml-2 h-5 w-5" />
					</Link>
				</Button>
			</div>
		</section>
	);
}
