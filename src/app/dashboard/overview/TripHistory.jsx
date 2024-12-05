"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { payRequest } from "@requestnetwork/payment-processor";
import { ethers } from "ethers";

const TripHistory = () => {
  const [trip, setTrip] = useState(null); // Single trip object
  const [loading, setLoading] = useState(true);
  const { data: walletClient } = useWalletClient();

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

  const fetchTrip = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch trip data");
      }

      const data = await response.json();
      console.log("Fetched trip data:", data);

      // Format the single trip data
      const formattedTrip = {
        pickUp: data.departure,
        payee: data.payee,
        destination: data.destination,
        payment: `${data.expectedAmount.toFixed(2)}`,
        date: getTimeAgo(data.timestamp),
        requestId: data.requestId,
        trimmedRequestId: data.requestId.slice(0, 10),
        state: data.transactionStatus,
        timestamp: data.timestamp,
      };

      console.log("Formatted trip:", formattedTrip);
      setTrip(formattedTrip);
    } catch (error) {
      console.error("Error fetching trip data:", error);
    } finally {
      setLoading(false);
    }
  };

  const paymentRequest = async (requestId, amount) => {
    const provider = new ethers.providers.Web3Provider(walletClient);
    const signer = provider.getSigner();

    if (!signer) {
      alert("Please connect your wallet");
      return;
    }

    if (!walletClient) {
      alert("Wallet client not available. Ensure your wallet is connected.");
      return;
    }

    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://sepolia.gateway.request.network/",
      },
    });

    try {
      console.log("Fetching request:", requestId);
      const request = await requestClient.fromRequestId(requestId);
      const requestData = request.getData();

      console.log("Fetched Request Data:", requestData);
      if (!requestData.expectedAmount) {
        throw new Error("Invalid request data: Missing expected amount.");
      }

      const paymentTx = await payRequest(requestData, signer);
      console.log(`Paying. ${paymentTx.hash}`);

      await paymentTx.wait(2);
      console.log(`Payment complete. ${paymentTx.hash}`);
      alert(`Payment complete. ${paymentTx.hash}`);

      // Refresh trip after payment
      fetchTrip();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6">Trip History</h2>
      {loading ? (
        <p className="text-white">Loading trip history...</p>
      ) : trip ? (
        <motion.table
          className="w-full text-lg bg-gray-800 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <thead>
            <tr className="text-gray-400 bg-gray-700">
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
            <motion.tr
              className="border-b border-gray-700 hover:bg-gray-700 transition duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}>
              <td className="p-4 text-white">{trip.pickUp}</td>
              <td className="p-4 text-white">{trip.destination}</td>
              <td className="p-4 text-white">{trip.payment}</td>
              <td className="p-4 text-white">{trip.date}</td>
              <td className="p-4 text-white">{trip.trimmedRequestId}</td>
              <td className="p-4 text-white">{trip.state}</td>
              <td className="p-4 text-white">
                <button
                  className="bg-yellow-800 text-white px-4 py-2 rounded-lg"
                  onClick={() => paymentRequest(trip.requestId, trip.payment)}>
                  Pay
                </button>
              </td>
            </motion.tr>
          </tbody>
        </motion.table>
      ) : (
        <p className="text-white">No trip history available.</p>
      )}
    </div>
  );
};

export default TripHistory;
