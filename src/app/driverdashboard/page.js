"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaDollarSign } from "react-icons/fa";

const Overview = () => {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [userName, setUserName] = useState("Guest");
	const [loading, setLoading] = useState(false);

	// Form data
	const [driverData, setDriverData] = useState({
		fullName: "",
		idNumber: "",
		document: "",
	});

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user && user.fullName) {
			setUserName(user.fullName);
		}
	}, []);

	const handleNextStep = () => {
		if (step === 2) {
			setShowSuccessModal(false);
		} else {
			setStep((prevStep) => prevStep + 1);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setDriverData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleRegisterDriver = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/driver/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(driverData),
			});

			if (!response.ok) {
				throw new Error("Failed to register driver");
			}

			setShowSuccessModal(true);
		} catch (error) {
			console.error("Error during registration:", error);
			alert("Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8 bg-gray-900 text-white min-h-screen">
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
					<form>
						<div className="mb-4">
							<label className="block text-gray-300 mb-2">Full Name</label>
							<input
								type="text"
								name="fullName"
								value={driverData.fullName}
								onChange={handleInputChange}
								className="w-full p-3 bg-gray-700 text-white rounded"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-gray-300 mb-2">ID Number</label>
							<input
								type="text"
								name="idNumber"
								value={driverData.idNumber}
								onChange={handleInputChange}
								className="w-full p-3 bg-gray-700 text-white rounded"
							/>
						</div>
						<div className="mb-6">
							<label className="block text-gray-300 mb-2">Document</label>
							<input
								type="text"
								name="document"
								value={driverData.document}
								onChange={handleInputChange}
								className="w-full p-3 bg-gray-700 text-white rounded"
							/>
						</div>
					</form>
					<button
						onClick={handleRegisterDriver}
						disabled={loading}
						className={`${
							loading ? "bg-gray-500" : "bg-orange-500 hover:bg-orange-600"
						} text-white font-semibold px-6 py-3 rounded-full transition duration-300 text-lg`}
					>
						{loading ? "Registering..." : "Register"}
					</button>
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
