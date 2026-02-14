import { landingAssets } from "@/components/landing/assets";
import { Container } from "@/components/landing/Container";
import Image from "next/image";
import Link from "next/link";

export function BuiltForDriversSection() {
	return (
		<section className="bg-white py-20 md:py-24">
			<Container>
				<div className="grid items-center gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-16">
					<div className="relative overflow-hidden rounded-3xl border border-cm-border-light bg-[#d8d8d8]">
						<video
							src={landingAssets.builtForDrivers}
							className="w-full h-auto object-cover"
							autoPlay
							muted
							loop
						/>
					</div>

					<div>
						<p className="text-[15px] font-medium text-[#666]">
							Drive. Earn. Own It.
						</p>
						<h2 className="mt-2 text-[30px] sm:text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] md:text-[40px]">
							Built for <span className="text-cm-orange">Drivers</span>
						</h2>
						<p className="mt-6 text-[16px] sm:text-[19px] leading-[1.2] text-[#6f6f6f]">
							ChainMove helps drivers move from daily settlement to vehicle
							ownership through a clear pay-to-own system. We provide a
							structured way for drivers across South East Nigeria to earn
							weekly income while gradually building vehicle ownership, with
							clear breakdowns, no hidden fees, and real local support.
						</p>

						<p className="mt-6 text-[17px] sm:text-[20px] leading-[1.2] text-[#6f6f6f]">
							You drive. You pay weekly. You gradually build ownership.
						</p>

						<Link
							href="/auth?role=driver"
							className="mt-8 inline-flex rounded-full bg-cm-orange px-8 py-3.5 text-[16px] sm:text-[18px] font-semibold text-white transition-colors hover:bg-[#de6805]"
						>
							Apply Now!
						</Link>
					</div>
				</div>
			</Container>
		</section>
	);
}
