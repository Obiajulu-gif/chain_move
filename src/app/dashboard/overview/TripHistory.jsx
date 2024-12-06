"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

const TripHistory = () => {
  const [trips, setTrips] = useState([]); // Array of trips
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt"); // Default sort by createdAt
  const [sortOrder, setSortOrder] = useState("asc"); // Ascending order by default

  // Helper function to format timestamp
  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const tripTime = new Date(timestamp).getTime();
    const differenceInMs = tripTime - now;

    if (differenceInMs > 0) {
      const daysAhead = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
      return daysAhead === 1 ? "in 1 day" : `in ${daysAhead} days`;
    } else {
      const differenceInPast = Math.abs(differenceInMs);
      const minutesAgo = Math.floor(differenceInPast / (1000 * 60));
      const hoursAgo = Math.floor(differenceInPast / (1000 * 60 * 60));
      const daysAgo = Math.floor(differenceInPast / (1000 * 60 * 60 * 24));

      if (minutesAgo < 60) {
        return minutesAgo > 0 ? `${minutesAgo} minutes ago` : "Just now";
      } else if (hoursAgo < 24) {
        return `${hoursAgo} hours ago`;
      } else {
        return `${daysAgo} days ago`;
      }
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/drivers/destination");
      if (!response.ok) {
        throw new Error("Failed to fetch trip data");
      }

      const data = await response.json();
      console.log("Fetched trip data:", data);

      if (!data.invoices || data.invoices.length === 0) {
        setTrips([]);
        return;
      }

      const formattedTrips = data.invoices.map((trip) => ({
        pickUp: trip.pickupLocation,
        destination: trip.destination,
        payment: `${trip.estimatedCost.toFixed(2)}`,
        date: trip.date,
        formattedDate: getTimeAgo(trip.date),
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

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
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
    <div className="bg-neutral-900 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Trip History</h2>
      {loading ? (
        <p className="text-white">Loading trip history...</p>
      ) : trips && trips.length > 0 ? (
        <>
          <motion.table
            className="w-full text-md bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <thead>
              <tr className="text-gray-400 bg-neutral-900">
                <th className="p-4 text-left border-b border-neutral-700">
                  Pick-Up Point
                </th>
                <th className="p-4 text-left border-b border-neutral-700">
                  Destination
                </th>
                <th className="p-4 text-left border-b border-neutral-700">
                  Estimated Cost (ETH)
                </th>
                <th
                  className="p-4 text-left border-b border-neutral-700 cursor-pointer"
                  onClick={() => handleSort("date")}>
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
                <th className="p-4 text-left border-b border-neutral-700">
                  Request ID
                </th>
                <th
                  className="p-4 text-left border-b border-neutral-700 cursor-pointer"
                  onClick={() => handleSort("state")}>
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
                <th className="p-4 text-left border-b border-neutral-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedTrips().map((t, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-neutral-700 hover:bg-neutral-700 transition duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}>
                  <td className="p-4 text-white">{t.pickUp}</td>
                  <td className="p-4 text-white">{t.destination}</td>
                  <td className="p-4 text-white">{t.payment}</td>
                  <td className="p-4 text-white">{t.formattedDate}</td>
                  <td className="p-4 text-white">{t.trimmedRequestId}</td>
                  <td className="p-4 text-white">{t.state}</td>
                  <td className="p-4 text-white">
                    {t.state === "completed" ? (
                      <span className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg">
                        Paid
                      </span>
                    ) : (
                      <Link
                        href={`/dashboard/checkout/${t.requestId}`}
                        className="bg-blue-600 hover:bg-blue-700 text-black font-semibold px-4 py-2 rounded-lg">
                        Book
                      </Link>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg">
              Previous
            </button>
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg">
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-white">No trip history available.</p>
      )}
    </div>
  );
};

export default TripHistory;
