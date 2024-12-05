"use client";

import { useEffect, useState } from "react";
import BadgeAndTasks from "./BadgeAndTasks";
import TripHistory from "./TripHistory";

const Overview = () => {
	const [userName, setUserName] = useState(" Guest");

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user?.fullName) {
			setUserName(user.fullName);
		}
	}, []);

	return (
		<div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white">
			<h1 className="text-2xl font-semibold mb-4 text-center md:text-left">
				Welcome back, <span className="text-yellow-500"> {userName} </span>
			</h1>
			<div className="flex flex-col md:flex-row md:space-x-6">
				{/* Left Section */}
				<div className="md:w-1/3">
					<BadgeAndTasks />
				</div>
				{/* Right Section */}
				<div className="md:w-2/3 mt-6 md:mt-0">
					<TripHistory />
				</div>
			</div>
		</div>
	);
};

export default Overview;
