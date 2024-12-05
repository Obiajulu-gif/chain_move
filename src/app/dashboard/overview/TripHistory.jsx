"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

const TripHistory = () => {
  const [trip, setTrip] = useState(null); // Single trip object
  const [loading, setLoading] = useState(true);

  // Helper function to format timestamp to "minutes ago" or "hours ago"
  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const tripTime = new Date(timestamp).getTime();
    const differenceInMs = tripTime - now;

    if (differenceInMs > 0) {
      // Future date
      const daysAhead = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
      return daysAhead === 1 ? "in 1 day" : `in ${daysAhead} days`;
    } else {
      // Past date
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
        setTrip([]);
        return;
      }

      // Format all trips
      const formattedTrips = data.invoices.map((trip) => ({
        pickUp: trip.pickupLocation,
        destination: trip.destination,
        payment: `${trip.estimatedCost.toFixed(2)}`,
        date: getTimeAgo(trip.date),
        requestId: trip.requestId,
        trimmedRequestId: trip.requestId?.slice(0, 10) || "none",
        state: trip.state,
      }));

      console.log("Formatted trips:", formattedTrips);
      setTrip(formattedTrips);
    } catch (error) {
      console.error("Error fetching trip data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="bg-neutral-900 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Trip History</h2>
      {loading ? (
        <p className="text-white">Loading trip history...</p>
      ) : trip && trip.length > 0 ? (
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
              <th className="p-4 text-left border-b border-neutral-700">
                Date
              </th>
              <th className="p-4 text-left border-b border-neutral-700">
                Request ID
              </th>
              <th className="p-4 text-left border-b border-neutral-700">
                Status
              </th>
              <th className="p-4 text-left border-b border-neutral-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {trip.map((t, index) => (
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
                <td className="p-4 text-white">{t.date}</td>
                <td className="p-4 text-white">{t.trimmedRequestId}</td>
                <td className="p-4 text-white">{t.state}</td>
                <td className="p-4 text-white">
                  <Link
                    href={`/dashboard/checkout/${t.requestId}`}
                    className="bg-green-600 hover:bg-green-700 text-black font-semibold px-4 py-2 rounded-lg">
                    Book
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <p className="text-white">No trip history available.</p>
      )}
    </div>
  );
};

export default TripHistory;
