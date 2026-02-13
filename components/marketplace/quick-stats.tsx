import { Card, CardContent } from "@/components/ui/card";

export function QuickStats() {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			<Card className="bg-card dark:bg-[#23232A] border-border text-center">
				<CardContent className="p-4">
					<div className="text-2xl font-bold text-foreground dark:text-white">
						148
					</div>
					<div className="text-sm text-muted-foreground dark:text-gray-300">
						Available Vehicles
					</div>
				</CardContent>
			</Card>
			<Card className="bg-card dark:bg-[#23232A] border-border text-center">
				<CardContent className="p-4">
					<div className="text-2xl font-bold text-green-500">21.2%</div>
					<div className="text-sm text-muted-foreground dark:text-gray-300">
						Average ROI
					</div>
				</CardContent>
			</Card>
			<Card className="bg-card dark:bg-[#23232A] border-border text-center">
				<CardContent className="p-4">
					<div className="text-2xl font-bold text-foreground dark:text-white">
						5
					</div>
					<div className="text-sm text-muted-foreground dark:text-gray-300">
						Vehicle Types
					</div>
				</CardContent>
			</Card>
			<Card className="bg-card dark:bg-[#23232A] border-border text-center">
				<CardContent className="p-4">
					<div className="text-2xl font-bold text-foreground dark:text-white">
						12
					</div>
					<div className="text-sm text-muted-foreground dark:text-gray-300">
						Countries
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
