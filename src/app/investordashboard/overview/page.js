"use client";
import { useEffect, useState } from "react";
import BadgeAndTasks from "./BadgeAndTasks";
import WalletInfo from "./WalletInfo";
import TripHistory from "./InvestmentHistory";
import PortfolioDashboard from "./PortfolioDashboard";

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
				Welcome, {userName}
			</h1>
			<div
				className="grid gap-6 md:grid-cols-3"
				style={{
					gridTemplateAreas: `
            "wallet wallet badge"
            "portfolio portfolio badge"
            "history history badge"
          `,
				}}
			>
				<div className="md:col-span-1" style={{ gridArea: "badge" }}>
					<BadgeAndTasks />
				</div>
				<div className="md:col-span-2" style={{ gridArea: "wallet" }}>
					<WalletInfo />
				</div>
				<div className="md:col-span-2" style={{ gridArea: "portfolio" }}>
					<PortfolioDashboard />
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
