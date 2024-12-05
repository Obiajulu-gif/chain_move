"use client";

import { useState, useEffect } from "react";
import { parseUnits } from "viem";
import { useWalletClient, useAccount } from "wagmi";
import {
	RequestNetwork,
	Types,
	Utils,
} from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { jsPDF } from "jspdf";

function InputField({ label, type, value, onChange, placeholder }) {
	return (
		<div className="my-4 md:my-5 ">
			<label className="block mb-1">{label}</label>
			<input
				type={type}
				value={value}
				onChange={onChange}
				className="w-full p-3 capitalize bg-gray-900 text-white rounded-lg border border-gray-700"
				placeholder={placeholder}
			/>
		</div>
	);
}

function PDFPreview({ pdfPreviewUrl }) {
	return (
		pdfPreviewUrl && (
			<div className="w-full">
				<h3 className="text-xl text-center font-bold mb-4 text-white">
					Preview
				</h3>
				<iframe
					src={pdfPreviewUrl}
					title="PDF Preview"
					style={{
						width: "100mm",
						height: "150mm",
						border: "1px solid #4a5568",
						borderRadius: "8px",
						overflow: "hidden",
						margin: "0 auto",
					}}
				></iframe>
			</div>
		)
	);
}

export default function CreateTransportInvoice() {
	const [pickup, setPickup] = useState("");
	const [destination, setDestination] = useState("");
	const [amount, setAmount] = useState("");
	const [avgTime, setAvgTime] = useState("");
	const [date, setDate] = useState(() => {
		const today = new Date();
		return today.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
	});
	const [status, setStatus] = useState(" ");
	const [requestData, setRequestData] = useState(null);
	const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();

	// Generate PDF Preview as the user types
	useEffect(() => {
		if (pickup || destination || amount || avgTime || date) {
			generatePDFPreview();
		}
	}, [pickup, destination, amount, avgTime, date]);

	async function createRequest() {
		const user = JSON.parse(localStorage.getItem("user"));
		if (!user) {
			alert("Sign up before creating requests");
			return;
		}

		try {
			setStatus("");

			if (!walletClient) {
				setStatus("Wallet client not available. Please connect your wallet.");
				return;
			}

			if (!pickup || !destination || !amount || !avgTime || !date) {
				setStatus("Please fill in all required fields.");
				return;
			}

			setStatus("Uploading to IPFS...");

			const signatureProvider = new Web3SignatureProvider(walletClient);
			const requestClient = new RequestNetwork({
				nodeConnectionConfig: {
					baseURL: "https://sepolia.gateway.request.network/",
				},
				signatureProvider,
			});

			const requestCreateParameters = {
				requestInfo: {
					currency: {
						type: Types.RequestLogic.CURRENCY.ETH,
						network: "sepolia",
					},
					expectedAmount: parseUnits(amount || "0", 18).toString(),
					payee: {
						type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
						value: address,
					},
					timestamp: Utils.getCurrentTimestampInSecond(),
				},
				paymentNetwork: {
					id: Types.Extension.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
					parameters: {
						paymentAddress: address,
					},
				},
				contentData: {
					reason: "Create Ride booking invoice",
					pickup,
					destination,
					avgTime,
					date,
				},
				signer: {
					type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
					value: address,
				},
				topics: ["chainmove-dapp-v1"],
			};

			const request = await requestClient.createRequest(
				requestCreateParameters
			);
			console.log("Request:", request);

			// Retrieve the requestId
			const requestId = request.requestId;

			console.log("Request ID:", requestId);

			setStatus("Waiting for Confirmation...");
			const confirmedRequestData = await request.waitForConfirmation();

			setStatus("Request Confirmed. Saving to backend...");

			// Prepare data for backend
			const invoiceData = {
				driver: {
					fullName: user?.fullName || "Unknown Driver",
					email: user?.email || "Unknown Email",
				},
				pickupLocation: pickup,
				destination: destination,
				estimatedCost: amount,
				date: date,
				averageTime: avgTime,
				status: "available", // Default to "available" when created
				requestId, // Add requestId
				address, // Use connected wallet address
			};

			// POST request to the backend route
			const response = await fetch("/api/drivers/destination", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(invoiceData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save invoice to backend");
			}

			const responseData = await response.json();
			console.log("Invoice saved successfully:", responseData);

			setStatus("Destination created and saved to backend successfully!");
		} catch (error) {
			console.error("Error creating request:", error);
			setStatus(error.message || "Failed to create the request.");
		}
	}

	function generatePDFPreview() {
		const user = JSON.parse(localStorage.getItem("user"));
		const userEmail = user?.email || "N/A";
		const userFullName = user?.fullName || "N/A";
		const logoUrl = "/images/blockridelogo.png"; // Path to your logo in the public folder

		// Preload the image and generate the PDF
		const loadImage = (url) =>
			new Promise((resolve, reject) => {
				const img = new Image();
				img.crossOrigin = "Anonymous"; // Avoid CORS issues
				img.src = url; // Use relative URL for the public folder
				img.onload = () => {
					const canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;
					const ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0);
					resolve(canvas.toDataURL("image/png")); // Convert to Base64
				};
				img.onerror = (err) => reject(err);
			});

		loadImage(logoUrl)
			.then((base64Logo) => {
				const doc = new jsPDF({
					orientation: "portrait",
					unit: "mm",
					format: "a4", // A4 paper size
				});

				// Set background color
				doc.setFillColor(0, 0, 0); // Black background
				doc.rect(0, 0, 210, 297, "F"); // A4 size: 210mm x 297mm

				// Add logo
				const imgWidth = 50; // Adjust size as needed
				const imgHeight = 20;
				doc.addImage(base64Logo, "PNG", 80, 10, imgWidth, imgHeight); // Centered at the top

				// Set text color to white
				doc.setTextColor(255, 255, 255);

				// Invoice Header
				doc.setFontSize(40); // Increased font size for header
				doc.setFont("helvetica", "bold");
				doc.text("Driver's Booking Invoice", 105, 50, { align: "center" });

				// User Information Section
				doc.setFontSize(24); // Larger section headers
				doc.setFont("helvetica", "bold");
				doc.text("About The Driver", 20, 80);

				doc.setFont("helvetica", "normal");
				doc.setFontSize(18); // Larger font for content
				doc.text(`Name: ${userFullName}`, 20, 100);
				doc.text(`Email: ${userEmail}`, 20, 115);

				// Ride Information Section
				doc.setFont("helvetica", "bold");
				doc.setFontSize(24);
				doc.text("Ride Details", 20, 140);

				doc.setFont("helvetica", "normal");
				doc.setFontSize(18);
				doc.text(`Pickup Location: ${pickup || "N/A"}`, 20, 160);
				doc.text(`Destination: ${destination || "N/A"}`, 20, 175);
				doc.text(`Estimated Cost: ${amount || "0"} ETH`, 20, 190);
				doc.text(`Date: ${date || "N/A"}`, 20, 205);
				doc.text(`Average Time: ${avgTime || "N/A"} hours`, 20, 220);

				// Footer Section
				doc.setFont("helvetica", "bold");
				doc.setFontSize(18);
				doc.text("Thank you for using our service!", 105, 280, {
					align: "center",
				});

				// Generate the PDF Blob
				const blob = doc.output("blob");
				const blobUrl = URL.createObjectURL(blob);

				setPdfPreviewUrl(blobUrl);
			})
			.catch((error) => {
				console.error("Error loading image:", error);
				alert("Failed to load the logo. Please check the image path.");
			});
	}

	return (
		<div className="p-8 bg-gray-950 min-h-screen flex flex-col md:flex-row gap-4 text-white">
			<div className="w-full">
				<h1 className="text-3xl font-bold mb-4">Create Ride Invoice</h1>
				<div>
					<InputField
						label="Pick Up Location"
						type="text"
						value={pickup}
						onChange={(e) => setPickup(e.target.value)}
						placeholder="Enter pick up location"
					/>
					<InputField
						label="Destination"
						type="text"
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						placeholder="Enter destination"
					/>
					<InputField
						label="Estimated Trip Cost (ETH)"
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder="Enter estimated trip cost"
					/>
					<InputField
						label="Average Time (hours)"
						type="number"
						value={avgTime}
						onChange={(e) => setAvgTime(e.target.value)}
						placeholder="Enter average time to complete journey"
					/>
					<InputField
						label="Date"
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						placeholder="Select date"
					/>
					{status && <div className=" text-sm">{status}</div>}{" "}
					<button
						onClick={createRequest}
						className="w-full py-3 mt-4 rounded-lg text-lg font-semibold bg-orange-500 hover:bg-orange-600"
					>
						Generate Invoice
					</button>
				</div>
			</div>
			<PDFPreview pdfPreviewUrl={pdfPreviewUrl} />
		</div>
	);
}
