"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const account = useAccount(); // Current connected wallet address
  const signer = account?.address;
  console.log("signer", signer);
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

  // Helper function to check if the trip is from today
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

      // Map data to the desired format
      const formattedTrips = data.map((trip) => ({
        pickUp: trip.departure,
        payee: trip.payee,
        destination: trip.destination,
        payment: `${trip.expectedAmount.toFixed(2)}`,
        date: getTimeAgo(trip.timestamp),
        requestId: trip.requestId.slice(0, 10), // Trim requestId to the first 10 characters
        state: trip.transactionStatus, // State of the transaction
        timestamp: trip.timestamp, // Add timestamp to check for today's trips
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

    // Initialize the RequestNetwork client
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://sepolia.gateway.request.network/", // Adjust URL if needed
      },
      signatureProvider: signer,
    });

    try {
      const requestData = await requestClient.getRequest({ requestId });

      const paymentTx = await requestClient.payRequest({
        requestId,
        amount: Utils.toBN(amount), // Convert to the appropriate format if needed
        signer,
      });

      await paymentTx.wait(2);
      console.log(`Payment complete. ${paymentTx.hash}`);
      alert(`Payment complete. ${paymentTx.hash}`);

      // Optionally refresh trips after payment is made
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
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Total Trips and Trips Created Today */}
      <div className="flex space-x-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg flex-1 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Trips</p>
            <h3 className="text-white text-xl font-semibold">{totalTrips}</h3>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg flex-1 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Trips for Today</p>
            <h3 className="text-white text-xl font-semibold">{tripsToday}</h3>
          </div>
        </div>
      </div>

      {/* Trip History */}
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
              <th className="p-4 text-left">Amount (ETH) </th>
              <th className="p-4 text-left">Time</th>
              <th className="p-4 text-left">Transaction ID</th>
              <th className="p-4 text-left">State</th>
              <th className="p-4 text-left">Action</th>
              {/* Add action column */}
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
                <td className="p-4 text-white">{trip.requestId}</td>
                {/* Display trimmed requestId */}
                <td className="p-4 text-white">{trip.state}</td>
                {/* Display transaction state */}
                <td className="p-4 text-white">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => payRequest(trip.requestId, trip.payment)}>
                    Pay
                  </button>
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
