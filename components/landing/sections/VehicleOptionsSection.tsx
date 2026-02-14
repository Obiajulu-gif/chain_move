"use client";

import { landingAssets } from "@/components/landing/assets";
import { Container } from "@/components/landing/Container";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const vehicleSlides = [
	{
		key: "shuttle",
		title: "Shuttle",
		image: landingAssets.vehicles["shuttle-variant"],
	},
	{
		key: "keke",
		title: "Keke",
		image: landingAssets.vehicles["keke-variant"],
	},
] as const;

export function VehicleOptionsSection() {
	const [activeIndex, setActiveIndex] = useState(0);

	const handlePrevious = () => {
		setActiveIndex((prev) =>
			prev === 0 ? vehicleSlides.length - 1 : prev - 1,
		);
	};

	const handleNext = () => {
		setActiveIndex((prev) =>
			prev === vehicleSlides.length - 1 ? 0 : prev + 1,
		);
	};

	const activeVehicle = vehicleSlides[activeIndex];

	return (
		<section className="bg-white py-20 md:py-24">
			<Container>
				<div className="grid items-center gap-8 lg:grid-cols-[1fr_1.3fr]">
					<div className="max-w-[520px]">
						<h2 className="text-[30px] sm:text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[42px]">
							Our <span className="text-cm-orange">Vehicle Options</span>
						</h2>
						<p className="mt-6 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
							ChainMove provides vehicles built for steady income and structured
							ownership growth.
						</p>

						<Link
							href="/auth?role=driver"
							className="mt-10 inline-flex items-center rounded-full bg-cm-orange px-8 py-3.5 text-[16px] sm:text-[18px] font-semibold text-white transition-colors hover:bg-[#de6805]"
						>
							Apply Now!
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</div>

					<div className="relative overflow-hidden rounded-3xl bg-[#efefef] px-4 py-6 sm:px-7 sm:py-8">
						<div className="relative h-[300px] sm:h-[360px] lg:h-[420px]">
							<Image
								key={activeVehicle.key}
								src={activeVehicle.image}
								alt={activeVehicle.title}
								fill
								className="object-contain"
								sizes="(min-width: 1024px) 60vw, 100vw"
							/>
						</div>

						<div className="absolute inset-y-0 left-5 flex items-center">
							<button
								type="button"
								onClick={handlePrevious}
								aria-label="Previous vehicle option"
								className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-black/25 bg-white/80 text-[#232323] backdrop-blur-sm transition-colors hover:bg-white"
							>
								<ChevronLeft className="h-6 w-6" />
							</button>
						</div>

						<div className="absolute inset-y-0 right-5 flex items-center">
							<button
								type="button"
								onClick={handleNext}
								aria-label="Next vehicle option"
								className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-black/25 bg-white/80 text-[#232323] backdrop-blur-sm transition-colors hover:bg-white"
							>
								<ChevronRight className="h-6 w-6" />
							</button>
						</div>

						<div className="mt-2 flex justify-center gap-2">
							{vehicleSlides.map((slide, index) => (
								<span
									key={slide.key}
									className={cn(
										"h-2.5 w-2.5 rounded-full",
										index === activeIndex ? "bg-cm-orange" : "bg-black/20",
									)}
								/>
							))}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
