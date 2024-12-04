"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const BookTrip = () => {
	const router = useRouter();

	const cardVariants = {
		hidden: { opacity: 0, scale: 0.9 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.5, type: "spring" },
		},
	};

	return (
		<div className="p-6 md:p-8 bg-gray-900 min-h-screen text-white flex flex-col items-center">
			{/* Header */}
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{
					opacity: 1,
					y: 0,
					transition: { duration: 0.6, type: "spring" },
				}}
				className="text-3xl md:text-4xl font-bold mb-6 text-center"
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
				className="text-xl md:text-2xl font-medium text-center mb-8"
			>
				Select An Option
			</motion.h2>

			{/* Trip Cards */}
			<div className="flex flex-col md:flex-row justify-center gap-8 w-full">
				{/* Solo-Trip Card */}
				<motion.div
					variants={cardVariants}
					initial="hidden"
					animate="visible"
					className="bg-gray-800 p-6 md:p-8 rounded-lg flex flex-col items-center shadow-lg w-full md:w-1/3 hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
				>
					<div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden mb-4">
						<Image
							src="/images/solo.png"
							alt="Solo Trip"
							layout="fill"
							objectFit="cover"
							className="rounded-lg"
						/>
					</div>
					<h3 className="text-xl md:text-2xl font-semibold mb-2">Solo-Trip</h3>
					<p className="text-sm md:text-lg text-gray-400 text-center mb-6">
						Enjoy a private trip all to yourself, perfect for direct routes and
						complete comfort.
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => router.push("/dashboard/book/solo-trip")}
						className="bg-orange-500 text-white py-2 px-6 md:py-3 md:px-8 rounded-full text-sm md:text-lg font-semibold hover:bg-orange-600 transition duration-300"
					>
						Select
					</motion.button>
				</motion.div>

				{/* Shared-Ride Card */}
				<motion.div
					variants={cardVariants}
					initial="hidden"
					animate="visible"
					className="bg-gray-800 p-6 md:p-8 rounded-lg flex flex-col items-center shadow-lg w-full md:w-1/3 hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
				>
					<div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden mb-4">
						<Image
							src="/images/shared.png"
							alt="Shared Ride"
							layout="fill"
							objectFit="cover"
							className="rounded-lg"
						/>
					</div>
					<h3 className="text-xl md:text-2xl font-semibold mb-2">
						Shared-Ride
					</h3>
					<p className="text-sm md:text-lg text-gray-400 text-center mb-6">
						Share your ride with others heading in the same direction and save
						on costs while reducing your carbon footprint.
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => router.push("/dashboard/book/shared-ride")}
						className="bg-orange-500 text-white py-2 px-6 md:py-3 md:px-8 rounded-full text-sm md:text-lg font-semibold hover:bg-orange-600 transition duration-300"
					>
						Select
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
};

export default BookTrip;
