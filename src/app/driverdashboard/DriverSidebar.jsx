"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
	FaCar,
	FaChartBar,
	FaChevronLeft,
	FaChevronRight,
	FaCog,
	FaExchangeAlt,
	FaGift,
	FaIdCard,
	FaQuestionCircle,
	FaSignOutAlt,
	FaUser,
	FaUserTie,
} from "react-icons/fa";

const DriverSidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const sidebarVariants = {
		open: { width: "16rem", transition: { duration: 0.5 } },
		closed: { width: "4rem", transition: { duration: 0.5 } },
	};

	const linkVariants = {
		hover: { scale: 1.05 },
		tap: { scale: 0.95 },
	};

	return (
		<motion.div
			className="bg-gray-900 text-white max-h-screen p-5 flex flex-col justify-between fixed md:relative z-50 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded"
			style={{ height: "100vh" }}
			animate={isSidebarOpen ? "open" : "closed"}
			variants={sidebarVariants}
		>
			{/* Sidebar Header */}
			<div>
				<Link href="/">
					<h2 className="text-3xl font-extrabold text-orange-500 tracking-wide">
						{isSidebarOpen && "ChainMove"}
					</h2>
				</Link>

				{/* Main Navigation */}
				<nav className="mt-8 flex flex-col space-y-4">
					{[
						{
							href: "/driverdashboard/overview",
							icon: <FaChartBar />,
							label: "Overview",
						},
						{ href: "/driverdashboard/trips", icon: <FaCar />, label: "Trips" },
						{
							href: "/driverdashboard/request-funds",
							icon: <FaExchangeAlt />,
							label: "Request Funds",
						},
						{
							href: "/driverdashboard/dao",
							icon: <FaUserTie />,
							label: "ChainMove DAO",
							badge: "Coming Soon",
						},
						{
							href: "/driverdashboard/rewards",
							icon: <FaGift />,
							label: "Rewards",
						},
					].map(({ href, icon, label, badge }) => (
						<motion.div
							key={href}
							whileHover="hover"
							whileTap="tap"
							variants={linkVariants}
						>
							<Link
								href={href}
								className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
							>
								<div className="flex items-center space-x-4">
									<span className="text-2xl text-gray-300">{icon}</span>
									{isSidebarOpen && (
										<span className="text-base font-semibold text-gray-100">
											{label}
										</span>
									)}
								</div>
								{isSidebarOpen && badge && (
									<motion.span
										className="bg-orange-500 text-xs text-white px-2 py-1 rounded-full font-semibold"
										animate={{ y: [0, -2, 0] }}
										transition={{ repeat: Infinity, duration: 1.5 }}
									>
										{badge}
									</motion.span>
								)}
							</Link>
						</motion.div>
					))}
				</nav>

				{/* Profile Section */}
				{isSidebarOpen && (
					<div className="text-sm text-gray-400 mt-6 font-medium">
						Access Other Profiles
					</div>
				)}
				<nav className="mt-4 space-y-3">
					{[
						{ href: "/dashboard", icon: <FaUser />, label: "User Profile" },
						{
							href: "/investordashboard",
							icon: <FaUserTie />,
							label: "Investor Profile",
						},
					].map(({ href, icon, label }) => (
						<motion.div
							key={href}
							whileHover="hover"
							whileTap="tap"
							variants={linkVariants}
						>
							<Link
								href={href}
								className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors"
							>
								<span className="text-2xl text-gray-300">{icon}</span>
								{isSidebarOpen && (
									<span className="text-base font-semibold text-gray-100">
										{label}
									</span>
								)}
							</Link>
						</motion.div>
					))}
				</nav>
			</div>

			{/* Bottom Section */}
			<div className="flex flex-col space-y-4 mt-auto">
				{[
					{
						href: "/driverdashboard/help",
						icon: <FaQuestionCircle />,
						label: "Help",
					},
					{
						href: "/driverdashboard/settings",
						icon: <FaCog />,
						label: "Settings",
					},
					{ href: "/", icon: <FaSignOutAlt />, label: "Log Out" },
				].map(({ href, icon, label }) => (
					<motion.div
						key={href}
						whileHover="hover"
						whileTap="tap"
						variants={linkVariants}
					>
						<Link
							href={href}
							className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors"
						>
							<span className="text-2xl text-gray-300">{icon}</span>
							{isSidebarOpen && (
								<span className="text-base font-semibold text-gray-100">
									{label}
								</span>
							)}
						</Link>
					</motion.div>
				))}
			</div>

			{/* Toggle Button */}
			<motion.button
				className="absolute top-4 right-4 text-orange-500 hover:text-orange-400"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
				whileHover={{ scale: 1.2 }}
				whileTap={{ scale: 0.9 }}
			>
				{isSidebarOpen ? (
					<FaChevronLeft size={24} />
				) : (
					<FaChevronRight size={24} />
				)}
			</motion.button>
		</motion.div>
	);
};

export default DriverSidebar;
