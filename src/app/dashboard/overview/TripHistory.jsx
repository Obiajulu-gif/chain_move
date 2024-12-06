"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCaretUp, FaCaretDown,FaSpinner } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

const TripHistory = () => {
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortField, setSortField] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("asc");

	const fetchTrips = async () => {
		try {
			const response = await fetch("/api/drivers/destination");
			if (!response.ok) {
				throw new Error("Failed to fetch trip data");
			}

			const data = await response.json();

			const formattedTrips = data.invoices.map((trip) => ({
				pickUp: trip.pickupLocation,
				destination: trip.destination,
				payment: `${trip.estimatedCost.toFixed(2)}`,
				date: new Date(trip.date),
				formattedDate: new Date(trip.date).toLocaleString(),
				requestId: trip.requestId,
				trimmedRequestId: trip.requestId?.slice(0, 10) || "none",
				state: trip.status,
				createdAt: new Date(trip.createdAt),
			}));

			setTrips(formattedTrips);
		} catch (error) {
			console.error("Error fetching trip data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTrips();
	}, []);

	const handleSort = (field) => {
		const isAsc = sortField === field && sortOrder === "asc";
		setSortField(field);
		setSortOrder(isAsc ? "desc" : "asc");
	};

	const getSortedTrips = () => {
		return trips.sort((a, b) => {
			const valueA = a[sortField];
			const valueB = b[sortField];
			if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
			return valueA < valueB ? 1 : -1;
		});
	};

	const getPaginatedTrips = () => {
		const sortedTrips = getSortedTrips();
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return sortedTrips.slice(startIndex, endIndex);
	};

	const totalPages = Math.ceil(trips.length / ITEMS_PER_PAGE);

	return (
		<div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-5xl mx-auto overflow-x-auto">
			<h2 className="text-3xl font-bold text-white mb-6">Trip History</h2>
			{loading ? (
				<div className="flex flex-col items-center justify-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1, rotate: 360 }}
						transition={{
							duration: 1,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						<FaSpinner className="w-16 h-16 text-orange-500 animate-spin" />
					</motion.div>
					<p className="text-white text-lg mt-4">Loading trip history...</p>
				</div>
			) : trips.length > 0 ? (
				<>
					<motion.table
						className="w-full text-sm md:text-md bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<thead>
							<tr className="text-gray-300 bg-gray-700">
								<th className="p-4 text-left">Pick-Up Point</th>
								<th className="p-4 text-left">Destination</th>
								<th className="p-4 text-left">Estimated Cost (ETH)</th>
								<th
									className="p-4 text-left cursor-pointer"
									onClick={() => handleSort("date")}
								>
									<div className="flex items-center">
										Date
										{sortField === "date" && (
											<>
												{sortOrder === "asc" ? (
													<FaCaretUp className="ml-2" />
												) : (
													<FaCaretDown className="ml-2" />
												)}
											</>
										)}
									</div>
								</th>
								<th className="p-4 text-left">Request ID</th>
								<th className="p-4 text-left">Action</th>
								<th
									className="p-4 text-left cursor-pointer"
									onClick={() => handleSort("state")}
								>
									<div className="flex items-center">
										Status
										{sortField === "state" && (
											<>
												{sortOrder === "asc" ? (
													<FaCaretUp className="ml-2" />
												) : (
													<FaCaretDown className="ml-2" />
												)}
											</>
										)}
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{getPaginatedTrips().map((trip, index) => (
								<motion.tr
									key={index}
									className={`${
										index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
									} hover:bg-gray-600 transition`}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									<td className="p-4 text-white">{trip.pickUp}</td>
									<td className="p-4 text-white">{trip.destination}</td>
									<td className="p-4 text-white">{trip.payment}</td>
									<td className="p-4 text-white">{trip.formattedDate}</td>
									<td className="p-4 text-white">{trip.trimmedRequestId}</td>
									<td className="p-4 text-white">
										{trip.state === "completed" ? (
											<span className="bg-green-500 px-4 py-2 rounded-lg font-semibold">
												Paid
											</span>
										) : (
											<Link
												href={`/dashboard/checkout/${trip.requestId}`}
												className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white"
											>
												Book
											</Link>
										)}
									</td>
									<td className="p-4 text-white">
										<span
											className={`px-4 py-2 rounded-lg text-sm font-medium ${
												trip.state === "completed"
													? "bg-green-500 text-white"
													: "bg-yellow-500 text-gray-900"
											}`}
										>
											{trip.state}
										</span>
									</td>
								</motion.tr>
							))}
						</tbody>
					</motion.table>
					<div className="flex justify-between items-center mt-4 text-white">
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => prev - 1)}
							className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
						>
							Previous
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</>
			) : (
				<p className="text-white text-lg">No trip history available.</p>
			)}
		</div>
	);
};

export default TripHistory;
