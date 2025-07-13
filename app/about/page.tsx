import { Navigation } from "@/components/landing/navigation";
import {
	PageHeader,
	MissionSection,
	ValuesSection,
	TimelineSection,
	CTASection,
	// TeamSection, // Uncomment when needed
} from "@/components/about";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-[#18181B]">
			{/* Header */}
			<Navigation />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Header */}
				<PageHeader />

				{/* Mission Section */}
				<MissionSection />

				{/* Values Section */}
				<ValuesSection />

				{/* Team Section - Uncomment when needed */}
				{/* <TeamSection /> */}

				{/* Timeline Section */}
				<TimelineSection />

				{/* CTA Section */}
				<CTASection />
			</div>
		</div>
	);
}
