"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	FaInfoCircle,
	FaUser,
	FaMapMarkerAlt,
	FaEthereum,
	FaClock,
	FaCalendarAlt,
	FaTruck,
	FaLink,
	FaUserTie,
} from "react-icons/fa";
import CheckoutComponent from "./CheckoutComponent";

const Page = () => {
	const { requestId } = useParams();
	const [invoiceData, setInvoiceData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchInvoiceData = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`/api/drivers/checkout?requestId=${requestId}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch invoice data");
				}

				const data = await response.json();
				setInvoiceData(data.invoice);
			} catch (err) {
				console.error("Error fetching invoice data:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (requestId) {
			fetchInvoiceData();
		}
	}, [requestId]);

	if (loading) {
		return <p className="text-center text-lg text-white">Loading...</p>;
	}

	if (error) {
		return <p className="text-center text-lg text-red-500">Error: {error}</p>;
	}

	if (!invoiceData) {
		return (
			<p className="text-center text-lg text-yellow-500">
				No data found for this Request ID.
			</p>
		);
	}

	return (
		<div className="p-6 flex flex-col lg:flex-row gap-6 bg-gray-900 min-h-screen text-white">
			<div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold mb-6 text-orange-500 flex items-center gap-2">
					<FaInfoCircle /> Invoice Details
				</h1>
				<div className="space-y-4 text-lg">
					<p className="flex items-center gap-2">
						<FaLink className="text-blue-400" />
						<strong>Request ID:</strong> {invoiceData.requestId}
					</p>
					<p className="flex items-center gap-2">
						<FaUser className="text-green-400" />
						<strong>Driver Name:</strong>{" "}
						{invoiceData.driver?.fullName || "N/A"}
					</p>
					<p className="flex items-center gap-2">
						<FaUser className="text-green-400" />
						<strong>Driver Email:</strong> {invoiceData.driver?.email || "N/A"}
					</p>
					<p className="flex items-center gap-2">
						<FaMapMarkerAlt className="text-yellow-400" />
						<strong>Pickup Location:</strong>{" "}
						{invoiceData.pickupLocation || "N/A"}
					</p>
					<p className="flex items-center gap-2">
						<FaMapMarkerAlt className="text-yellow-400" />
						<strong>Destination:</strong> {invoiceData.destination || "N/A"}
					</p>
					<p className="flex items-center gap-2">
						<FaEthereum className="text-purple-400" />
						<strong>Estimated Cost:</strong>{" "}
						{invoiceData.estimatedCost || "N/A"} ETH
					</p>
					<p className="flex items-center gap-2">
						<FaCalendarAlt className="text-orange-400" />
						<strong>Date:</strong>{" "}
						{new Date(invoiceData.date).toLocaleDateString() || "N/A"}
					</p>
					<p className="flex items-center gap-2">
						<FaClock className="text-blue-400" />
						<strong>Average Time:</strong> {invoiceData.averageTime || "N/A"}{" "}
						hours
					</p>
					<p className="flex items-center gap-2">
						<FaTruck className="text-green-400" />
						<strong>Status:</strong> {invoiceData.status || "N/A"}
					</p>
					<p className="flex items-center gap-2">
						<FaLink className="text-blue-400" />
						<strong>Transaction Hash:</strong> {invoiceData.txHash || "N/A"}
					</p>
					<p className="flex items-center gap-2">
						<FaUserTie className="text-purple-400" />
						<strong>Driver Address:</strong> {invoiceData.address || "N/A"}
					</p>
				</div>
			</div>
			<div className="flex-1">
				<CheckoutComponent validRequest={invoiceData} />
			</div>
		</div>
	);
};

export default Page;
