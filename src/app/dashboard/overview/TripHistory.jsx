"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { RequestNetwork, Utils } from "@requestnetwork/request-client.js";

const TripHistory = () => {
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const account = useAccount();
	const signer = account?.address;

	// Helper function to format timestamp to "minutes ago" or "hours ago"
	const getTimeAgo = (timestamp) => {
		const now = Date.now();
		const differenceInMs = now - new Date(timestamp).getTime();
		const minutesAgo = Math.floor(differenceInMs / (1000 * 60));
		const hoursAgo = Math.floor(differenceInMs / (1000 * 60 * 60));

		if (minutesAgo < 60) {
			return minutesAgo > 0 ? `${minutesAgo} minutes ago` : "Just now";
		} else {
			return hoursAgo > 0 ? `${hoursAgo} hours ago` : "Just now";
		}
	};

	const isToday = (timestamp) => {
		const tripDate = new Date(timestamp * 1000);
		const today = new Date();
		return (
			tripDate.getDate() === today.getDate() &&
			tripDate.getMonth() === today.getMonth() &&
			tripDate.getFullYear() === today.getFullYear()
		);
	};

	const fetchTrips = async () => {
		try {
			const response = await fetch("/api/transactions");
			if (!response.ok) {
				throw new Error("Failed to fetch trip data");
			}

			const data = await response.json();

			const formattedTrips = data.map((trip) => ({
				pickUp: trip.departure,
				payee: trip.payee,
				destination: trip.destination,
				payment: `${trip.expectedAmount.toFixed(2)}`,
				date: getTimeAgo(trip.timestamp),
				requestId: trip.requestId.slice(0, 10),
				state: trip.transactionStatus,
				timestamp: trip.timestamp,
			}));

			setTrips(formattedTrips);
		} catch (error) {
			console.error("Error fetching trip history:", error);
		} finally {
			setLoading(false);
		}
	};

	const payRequest = async (requestId, amount) => {
		if (!signer) {
			alert("Please connect your wallet");
			return;
		}

		const requestClient = new RequestNetwork({
			nodeConnectionConfig: {
				baseURL: "https://sepolia.gateway.request.network/",
			},
			signatureProvider: signer,
		});

		try {
			const paymentTx = await requestClient.payRequest({
				requestId,
				amount: Utils.toBN(amount),
				signer,
			});

			await paymentTx.wait(2);
			alert(`Payment complete. ${paymentTx.hash}`);
			fetchTrips();
		} catch (error) {
			console.error("Error processing payment:", error);
			alert("Payment failed. Please try again.");
		}
	};

	useEffect(() => {
		fetchTrips();
	}, []);

	const totalTrips = trips.length;
	const tripsToday = trips.filter((trip) => isToday(trip.timestamp)).length;

	return (
		<div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-6xl mx-auto space-y-8">
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div className="flex-1 bg-gray-800 p-4 rounded-lg text-center shadow-sm">
					<p className="text-gray-400 text-sm">Total Trips</p>
					<h3 className="text-white text-2xl font-bold">{totalTrips}</h3>
				</div>
				<div className="flex-1 bg-gray-800 p-4 rounded-lg text-center shadow-sm">
					<p className="text-gray-400 text-sm">Trips for Today</p>
					<h3 className="text-white text-2xl font-bold">{tripsToday}</h3>
				</div>
			</div>

			<h2 className="text-3xl font-semibold text-white text-center">
				Trip History
			</h2>

			{loading ? (
				<p className="text-gray-300 text-center">Loading trip history...</p>
			) : trips.length > 0 ? (
				<motion.table
					className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-md text-gray-300"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<thead className="bg-gray-700 text-sm uppercase tracking-wide">
						<tr>
							<th className="p-4 text-left">Pick-Up Point</th>
							<th className="p-4 text-left">Destination</th>
							<th className="p-4 text-left">Amount (ETH)</th>
							<th className="p-4 text-left">Time</th>
							<th className="p-4 text-left">Transaction ID</th>
							<th className="p-4 text-left">State</th>
							<th className="p-4 text-left">Action</th>
						</tr>
					</thead>
					<tbody>
						{trips.map((trip, index) => (
							<motion.tr
								key={index}
								className="border-b border-gray-700 hover:bg-gray-700 transition duration-300"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<td className="p-4">{trip.pickUp}</td>
								<td className="p-4">{trip.destination}</td>
								<td className="p-4">{trip.payment}</td>
								<td className="p-4">{trip.date}</td>
								<td className="p-4">{trip.requestId}</td>
								<td className="p-4">{trip.state}</td>
								<td className="p-4">
									<button
										className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200"
										onClick={() => payRequest(trip.requestId, trip.payment)}
									>
										Pay
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</motion.table>
			) : (
				<p className="text-gray-300 text-center">No trip history available.</p>
			)}
		</div>
	);
};

export default TripHistory;
