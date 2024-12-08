"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useWalletClient, useAccount } from "wagmi";
import { FaCaretUp, FaCaretDown, FaSpinner } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("asc");
  const { address } = useAccount();

  const fetchTransactions = async () => {
    try {
      if (!address) {
        console.error("Wallet not connected.");
        return;
      }

      const walletAddress = address; //connected user address
      setLoading(true);
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction data");
      }

      const data = await response.json();
      const formattedTransactions = data.requests.map((tx) => ({
        pickUp: tx.pickUp,
        destination: tx.destination,
        payment: `${tx.expectedAmount.toFixed(4)} ETH`,
        timestamp: new Date(tx.timestamp),
        formattedDate: new Date(tx.timestamp).toLocaleString(),
        requestId: tx.requestId.slice(0, 10),
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const getSortedTransactions = () => {
    return transactions.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
      return valueA < valueB ? 1 : -1;
    });
  };

  const getPaginatedTransactions = () => {
    const sortedTransactions = getSortedTransactions();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedTransactions.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-5xl mx-auto overflow-x-auto">
      <h2 className="text-3xl font-bold text-white mb-6">
        Trip History
      </h2>
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}>
            <FaSpinner className="w-16 h-16 text-orange-500 animate-spin" />
          </motion.div>
          <p className="text-white text-lg mt-4">Loading transactions...</p>
        </div>
      ) : transactions.length > 0 ? (
        <>
          <motion.table
            className="w-full text-sm md:text-md bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <thead>
              <tr className="text-gray-300 bg-gray-700">
                <th className="p-4 text-left">Pick-Up Point</th>
                <th className="p-4 text-left">Destination</th>
                <th className="p-4 text-left">Payment</th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("timestamp")}>
                  <div className="flex items-center">
                    Date
                    {sortField === "timestamp" && (
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
              </tr>
            </thead>
            <tbody>
              {getPaginatedTransactions().map((tx, index) => (
                <motion.tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                  } hover:bg-gray-600 transition`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}>
                  <td className="p-4 text-white">{tx.pickUp}</td>
                  <td className="p-4 text-white">{tx.destination}</td>
                  <td className="p-4 text-white">{tx.payment}</td>
                  <td className="p-4 text-white">{tx.formattedDate}</td>
                  <td className="p-4 text-white">{tx.requestId}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
          {transactions.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-4 text-white">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-white text-lg">No transactions found.</p>
      )}
    </div>
  );
};

export default History;
