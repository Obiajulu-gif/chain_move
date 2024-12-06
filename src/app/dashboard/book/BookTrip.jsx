"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

const BookTrip = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(null); // Tracks which button is clicked

	const handleSelect = (path, buttonType) => {
		setLoading(buttonType); // Set the loading state to the button type
		setTimeout(() => {
			setLoading(null); // Clear the loading state after navigation
			router.push(path);
		}, 1500); // Add a slight delay for visual feedback
	};

	const cardVariants = {
		hidden: { opacity: 0, scale: 0.9 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.5, type: "spring" },
		},
	};

	return (
		<div className="p-4 bg-gray-900 min-h-screen text-white flex flex-col items-center">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{
					opacity: 1,
					y: 0,
					transition: { duration: 0.6, type: "spring" },
				}}
				className="text-4xl font-extrabold mb-8 text-center tracking-tight text-orange-500"
			>
				Book A Trip
			</motion.h1>
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: 1,
					y: 0,
					transition: { duration: 0.6, delay: 0.2, type: "spring" },
				}}
				className="text-2xl font-medium text-center mb-12 tracking-wide text-gray-300"
			>
				Choose Your Ride Option
			</motion.h2>

			<div className="flex flex-col md:flex-row justify-center gap-10">
				{/* Solo-Trip Card */}
				<motion.div
					variants={cardVariants}
					initial="hidden"
					animate="visible"
					className="bg-gray-800 p-6 rounded-lg w-full md:w-1/3 flex flex-col items-center shadow-lg transform hover:scale-105 transition-transform duration-300"
				>
					<div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
						<Image
							src="/images/soloride.png"
							alt="Solo Trip"
							layout="fill"
							objectFit="cover"
							className="rounded-lg"
						/>
					</div>
					<h3 className="text-2xl font-semibold mb-4 text-orange-400 tracking-wide">
						Solo-Trip
					</h3>
					<p className="text-lg text-gray-400 text-center mb-6">
						Enjoy a private trip all to yourself, perfect for direct routes and
						complete comfort.
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => handleSelect("/dashboard/book/solo-trip", "solo")}
						className={`relative bg-orange-500 text-white py-3 px-8 rounded-full text-lg font-semibold transition duration-300 ${
							loading === "solo"
								? "bg-orange-600 cursor-not-allowed"
								: "hover:bg-orange-600"
						}`}
					>
						{loading === "solo" ? (
							<span className="flex items-center justify-center gap-2">
								<FaSpinner className="animate-spin" />
								Selecting...
							</span>
						) : (
							"Select"
						)}
					</motion.button>
				</motion.div>

				{/* Shared-Ride Card */}
				<motion.div
					variants={cardVariants}
					initial="hidden"
					animate="visible"
					className="bg-gray-800 p-6 rounded-lg w-full md:w-1/3 flex flex-col items-center shadow-lg transform hover:scale-105 transition-transform duration-300"
				>
					<div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
						<Image
							src="/images/sharedride.png"
							alt="Shared Ride"
							layout="fill"
							objectFit="cover"
							className="rounded-lg"
						/>
					</div>
					<h3 className="text-2xl font-semibold mb-4 text-orange-400 tracking-wide">
						Shared-Ride
					</h3>
					<p className="text-lg text-gray-400 text-center mb-6">
						Share your ride with others heading in the same direction and save
						on costs while reducing your carbon footprint.
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() =>
							handleSelect("/dashboard/book/shared-ride", "shared")
						}
						className={`relative bg-orange-500 text-white py-3 px-8 rounded-full text-lg font-semibold transition duration-300 ${
							loading === "shared"
								? "bg-orange-600 cursor-not-allowed"
								: "hover:bg-orange-600"
						}`}
					>
						{loading === "shared" ? (
							<span className="flex items-center justify-center gap-2">
								<FaSpinner className="animate-spin" />
								Selecting...
							</span>
						) : (
							"Select"
						)}
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
};

export default BookTrip;
