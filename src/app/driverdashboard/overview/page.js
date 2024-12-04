"use client";
import { useEffect, useState } from "react";
import Badge from "./Badge";
import WalletInfo from "./WalletInfo";
import VideoTutorial from "./VideoTutorial";
import TripHistory from "./TripHistory";
import FundingProgress from "./FundingProgress";

const Overview = () => {
	const [userName, setUserName] = useState("Guest");

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user && user.fullName) {
			setUserName(user.fullName);
		}
	}, []);

	return (
		<div className="p-6 space-y-6 bg-gray-900 min-h-screen text-white">
			<h1 className="text-2xl font-semibold mb-4 text-center md:text-left">
				Hello {userName}, Welcome to your driver dashboard
			</h1>
			<div
				className="grid gap-6 md:grid-cols-3"
				style={{
					gridTemplateAreas: `
            "badge wallet wallet"
            "badge progress progress"
            "badge video video"
            "badge history history"
          `,
				}}
			>
				<div className="md:col-span-1" style={{ gridArea: "badge" }}>
					<Badge />
				</div>
				<div className="md:col-span-2" style={{ gridArea: "wallet" }}>
					<WalletInfo />
				</div>
				<div className="md:col-span-2" style={{ gridArea: "progress" }}>
					<FundingProgress />
				</div>
				<div className="md:col-span-2" style={{ gridArea: "video" }}>
					<VideoTutorial />
				</div>
				<div className="md:col-span-2" style={{ gridArea: "history" }}>
					<TripHistory />
				</div>
			</div>

			{/* Mobile-specific layout */}
			<style jsx>{`
				@media (max-width: 768px) {
					div[style*="grid-template-areas"] {
						display: flex;
						flex-direction: column;
					}
				}
			`}</style>
		</div>
	);
};

export default Overview;
