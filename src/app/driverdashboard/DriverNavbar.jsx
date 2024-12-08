"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaBell, FaSearch, FaWallet } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import { ConnectBtn } from "@app/app/web3/ConnectBtn";

const DriverNavbar = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [userPrincipal, setUserPrincipal] = useState(null);

	useEffect(() => {
		// Retrieve userPrincipal from localStorage and format it
		const principal = localStorage.getItem("userPrincipal");
		if (principal) {
			// Format principal to show only first and last few characters
			const formattedPrincipal = `${principal.slice(0, 5)}...${principal.slice(
				-5
			)}`;
			setUserPrincipal(formattedPrincipal);
		}
	}, []);

	return (
		<div className="bg-gray-900 px-6 py-4 flex justify-between items-center lg:pl-72">
			{/* Left Section - Search bar */}
			<div className="flex items-center border rounded-md border-gray-400 space-x-2 w-full lg:w-auto">
				{/* Search Bar */}
				<div className="flex items-center bg-gray-900 px-4 py-2 rounded-lg w-full lg:w-96">
					<FaSearch className="text-orange-500 mr-2" />
					<input
						type="text"
						placeholder="Search for any ride here..."
						className="bg-transparent text-white placeholder-gray-500 focus:outline-none lg:w-full w-52"
					/>
				</div>
			</div>

			{/* Right Section - Wallet, Notifications, and Profile */}
			<div className="flex items-center space-x-4">
				{userPrincipal && (
					<span className="text-white font-medium text-sm bg-orange-700 px-3 py-1 rounded-lg">
						{userPrincipal}
					</span>
				)}

				{/* Notification Bell with Badge */}
				<div className="relative">
					<FaBell className="text-gray-200 text-2xl cursor-pointer hover:text-white transition duration-300" />
					<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-orange-500 bg-gray-300 rounded-full transform -translate-y-1 translate-x-1">
						4
					</span>
				</div>
				{/* rainbowkit connect button */}
				<ConnectBtn />
			</div>
		</div>
	);
};

export default DriverNavbar;
