"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";

const Overview = () => {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const isRegistered = false; // Mock driver registration status
	const isCheckingRegistration = false; // Mock loading state for registration check

	const handleNextStep = () => {
		if (step === 2) {
			setShowSuccessModal(false);
		} else {
			setStep((prevStep) => prevStep + 1);
		}
	};

	const handleRegisterDriver = async () => {
		setShowSuccessModal(true);
	};

	return (
		<div className="p-8 bg-gray-900 text-white min-h-screen">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-semibold">Hello Emmanuel,</h1>
				<div className="flex items-center space-x-4">
					<div className="text-sm">
						{isCheckingRegistration ? (
							<span className="text-gray-400">Checking registration...</span>
						) : isRegistered ? (
							<div className="flex flex-col">
								<span className="text-gray-400">Status</span>
								<span className="text-xs text-green-500">
									Registered Driver
								</span>
							</div>
						) : (
							<div className="flex flex-col">
								<span className="text-gray-400">Status</span>
								<span className="text-xs text-orange-500">Not Registered</span>
							</div>
						)}
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-gray-400">Currency</span>
						<div className="relative inline-flex items-center bg-gray-800 rounded-md px-4 py-2">
							<FaDollarSign className="text-green-500 mr-1" />
							<span className="text-white">USD</span>
						</div>
					</div>
				</div>
			</div>

			{/* Step 1: Welcome Card */}
			{step === 1 && (
				<div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between shadow-lg">
					<div className="w-1/2 flex justify-center items-center">
						<Image
							src="/images/driver.png"
							alt="BlockRide Driver"
							className="rounded-lg"
							width={600}
							height={600}
						/>
					</div>
					<div className="w-1/2 pl-8">
						<h2 className="text-4xl font-bold mb-4 leading-snug">
							Welcome to ChainMove <br /> For Drivers!
						</h2>
						<p className="text-gray-400 mb-6 leading-relaxed">
							As a ChainMove driver, you have the freedom to earn from every
							trip while taking full advantage of our blockchain-powered
							platform.
						</p>
						<div className="flex space-x-2 mb-4">
							<span className="w-3 h-3 rounded-full bg-orange-500"></span>
							<span className="w-3 h-3 rounded-full bg-gray-500"></span>
							<span className="w-3 h-3 rounded-full bg-gray-500"></span>
						</div>
						<button
							onClick={handleNextStep}
							className="bg-orange-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-orange-600 transition duration-300 text-lg"
						>
							Start Verification
						</button>
					</div>
				</div>
			)}

			{/* Step 2: Verification Page */}
			{step === 2 && (
				<div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-8">
					<h2 className="text-3xl font-bold mb-4">
						Complete Verification To Access Your Driver Portal
					</h2>
					<ul className="text-lg text-gray-400 mb-6">
						<li>🔹 Personal Information</li>
						<li>🔹 Government-Issued ID</li>
						<li>🔹 A Photo Holding Valid ID</li>
					</ul>
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500">
							Review time: 5mins - 3 working days
						</p>
						<button
							onClick={() => {
								handleRegisterDriver();
								setStep(1); // Reset to step 1 if you want
								router.push("/driverdashboard/overview");
							}}
							disabled={isRegistered || isCheckingRegistration}
							className={`${
								isRegistered
									? "bg-gray-500 cursor-not-allowed"
									: "bg-orange-500 hover:bg-orange-600"
							} text-white font-semibold px-6 py-3 rounded-full transition duration-300 text-lg`}
						>
							{isRegistered
								? "Already Registered"
								: isCheckingRegistration
								? "Checking..."
								: "Start Now"}
						</button>
					</div>
				</div>
			)}

			{/* Success Modal */}
			{showSuccessModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-gray-800 p-6 rounded-lg text-center w-80 relative">
						<button
							onClick={() => setShowSuccessModal(false)}
							className="absolute top-2 right-2 text-gray-400"
						>
							&times;
						</button>
						<h3 className="text-2xl font-semibold mb-6">Identity Verified</h3>
						<p className="text-orange-400 text-lg font-semibold mb-4">
							You have successfully completed your verification.
						</p>
						<button
							onClick={() => router.push("/driverdashboard/overview")}
							className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-600 transition duration-300 text-lg"
						>
							Open Dashboard
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Overview;
