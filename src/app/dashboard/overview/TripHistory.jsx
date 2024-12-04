"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch trip data");
        }

        const data = await response.json();

        // Map data to the desired format
        const formattedTrips = data.map((trip) => ({
          pickUp: trip.departure,
          destination: trip.destination,
          payment: `${trip.expectedAmount.toFixed(2)} ${trip.currency}`,
          date: getTimeAgo(trip.timestamp),
        }));

        setTrips(formattedTrips);
      } catch (error) {
        console.error("Error fetching trip history:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6">Trip History</h2>
      {loading ? (
        <p className="text-white">Loading trip history...</p>
      ) : trips.length > 0 ? (
        <motion.table
          className="w-full text-lg bg-gray-800 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <thead>
            <tr className="text-gray-400 bg-gray-700">
              <th className="p-4 text-left">Pick-Up Point</th>
              <th className="p-4 text-left">Destination</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Time</th>
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
                whileHover={{ scale: 1.02 }}>
                <td className="p-4 text-white">{trip.pickUp}</td>
                <td className="p-4 text-white">{trip.destination}</td>
                <td className="p-4 text-white">{trip.payment}</td>
                <td className="p-4 text-white">{trip.date}</td>
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
