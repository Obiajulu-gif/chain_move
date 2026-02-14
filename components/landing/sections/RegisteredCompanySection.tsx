import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { ArrowUpRight, BadgeCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function RegisteredCompanySection() {
  return (
		<section className="bg-white py-20 md:py-24">
			<Container>
				<div className="rounded-3xl border border-cm-border-light bg-[#fcf8f6] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:p-10">
					<div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
						<div className="max-w-[640px]">
							<p className="inline-flex items-center gap-2 rounded-full border border-cm-orange/50 bg-white px-4 py-1.5 text-[14px] font-medium text-cm-orange">
								<BadgeCheck className="h-4 w-4" />
								Registered Company
							</p>
							<h2 className="mt-5 text-[30px] font-bold leading-[1.02] tracking-[-0.03em] text-[#6c2b04] sm:text-[36px] md:text-[42px]">
								Fully Registered with CAC
							</h2>
							<p className="mt-5 text-[16px] leading-[1.3] text-[#6f6f6f] sm:text-[19px]">
								ChainMove operates as a duly registered company in Nigeria. Our
								legal structure and compliance posture are built for trust,
								transparency, and long-term operations.
							</p>
							<p className="mt-6 text-[18px] font-semibold text-[#2a2a2a]">
								CAC Reg No: RC-8834932
							</p>

							<Link
								href={landingAssets.about.cacCertificate}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#2f2f2f] px-6 py-3 text-[15px] font-semibold text-[#2a2a2a] transition-colors hover:bg-black/5"
							>
								View Registration
								<ArrowUpRight className="h-4 w-4" />
							</Link>
						</div>

						<div className="rounded-2xl border border-cm-border-light bg-white p-3 sm:p-4">
							<div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#f2f2f2]">
								<Image
									src={landingAssets.about.cacCertificate}
									alt="CAC certificate placeholder"
									fill
									className="object-cover"
									sizes="(min-width: 1024px) 46vw, 100vw"
								/>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
