"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
	FaChartBar,
	FaChevronLeft,
	FaChevronRight,
	FaCog,
	FaExchangeAlt,
	FaGift,
	FaIdCard,
	FaQuestionCircle,
	FaSignOutAlt,
	FaUserTie,
} from "react-icons/fa";

const InvestorSidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Sidebar animation variants for framer-motion
	const sidebarVariants = {
		open: { width: "16rem", transition: { duration: 0.5 } },
		closed: { width: "5rem", transition: { duration: 0.5 } },
	};

	// Link hover and tap animations
	const linkVariants = {
		hover: { scale: 1.05 },
		tap: { scale: 0.95 },
	};

	return (
		<motion.div
			className="bg-gray-900 text-white max-h-screen p-4 flex flex-col justify-between fixed md:relative z-50 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded"
			style={{ height: "100vh" }}
			animate={isSidebarOpen ? "open" : "closed"}
			variants={sidebarVariants}
		>
			{/* Sidebar Header */}
			<div>
				<Link href="/">
					<motion.h2
						className="text-3xl font-bold text-orange-500"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						{isSidebarOpen && "ChainMove"}
					</motion.h2>
				</Link>

				{/* Main Navigation */}
				<nav className="mt-8 flex flex-col space-y-4">
					{[
						{
							href: "/investordashboard/overview",
							icon: <FaChartBar />,
							label: "Overview",
						},
						{
							href: "/investordashboard/investments",
							icon: <FaExchangeAlt />,
							label: "Investments",
						},
						{
							href: "/investordashboard/fund-a-driver",
							icon: <FaExchangeAlt />,
							label: "Fund A Driver",
						},
						{
							href: "/investordashboard/dao",
							icon: <FaUserTie />,
							label: "ChainMove DAO",
							badge: "Coming Soon",
						},
						{
							href: "/investordashboard/rewards",
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
								className="flex items-center justify-between p-2 rounded hover:bg-gray-800 transition-colors"
							>
								<div className="flex items-center space-x-4">
									<span className="text-2xl">{icon}</span>
									{isSidebarOpen && (
										<span className="text-lg font-medium">{label}</span>
									)}
								</div>
								{isSidebarOpen && badge && (
									<motion.span
										className="bg-orange-500 text-xs text-white px-2 py-1 rounded-full"
										animate={{ y: [0, -2, 0] }}
										transition={{ repeat: Infinity, duration: 1.5 }}
									>
										{badge}
									</motion.span>
								)}
							</Link>
						</motion.div>
					))}

					{/* Access Other Profiles Section */}
					{isSidebarOpen && (
						<motion.div
							className="text-sm text-gray-400 mt-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							Access Other Profiles
						</motion.div>
					)}

					{[
						{
							href: "/driverdashboard",
							icon: <FaIdCard />,
							label: "Driver Profile",
						},
						{ href: "/dashboard", icon: <FaUserTie />, label: "User Profile" },
					].map(({ href, icon, label }) => (
						<motion.div
							key={href}
							whileHover="hover"
							whileTap="tap"
							variants={linkVariants}
						>
							<Link
								href={href}
								className="flex items-center space-x-4 p-2 rounded hover:bg-gray-800 transition-colors"
							>
								<span className="text-2xl">{icon}</span>
								{isSidebarOpen && (
									<span className="text-lg font-medium">{label}</span>
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
						href: "/dashboard/help",
						icon: <FaQuestionCircle />,
						label: "Help",
					},
					{
						href: "/investordashboard/settings",
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
							className="flex items-center space-x-4 p-2 rounded hover:bg-gray-800 transition-colors"
						>
							<span className="text-2xl">{icon}</span>
							{isSidebarOpen && (
								<span className="text-lg font-medium">{label}</span>
							)}
						</Link>
					</motion.div>
				))}
			</div>

			{/* Toggle Button */}
			<motion.button
				className="absolute top-4 right-4 text-orange-500"
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

export default InvestorSidebar;
