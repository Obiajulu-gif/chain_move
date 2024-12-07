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
      {/* Invoice Details */}
      <div className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg lg:w-1/2 animate-fadeIn overflow-x-auto">
        <h1 className="text-3xl font-bold mb-6 text-orange-500 flex items-center gap-2">
          <FaInfoCircle /> Invoice Details
        </h1>
        <div className="space-y-6 text-lg">
          <p className="flex items-center gap-3">
            <FaLink className="text-blue-400" />
            <span className="font-semibold text-gray-200">Request ID:</span>
            <span>{invoiceData.requestId}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaUser className="text-green-400" />
            <span className="font-semibold text-gray-200">Driver Name:</span>
            <span>{invoiceData.driver?.fullName || "N/A"}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaUser className="text-green-400" />
            <span className="font-semibold text-gray-200">Driver Email:</span>
            <span>{invoiceData.driver?.email || "N/A"}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-yellow-400" />
            <span className="font-semibold text-gray-200">
              Pickup Location:
            </span>
            <span>{invoiceData.pickupLocation || "N/A"}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-yellow-400" />
            <span className="font-semibold text-gray-200">Destination:</span>
            <span>{invoiceData.destination || "N/A"}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaEthereum className="text-purple-400" />
            <span className="font-semibold text-gray-200">Estimated Cost:</span>
            <span>{invoiceData.estimatedCost || "N/A"} ETH</span>
          </p>
          <p className="flex items-center gap-3">
            <FaCalendarAlt className="text-orange-400" />
            <span className="font-semibold text-gray-200">Date:</span>
            <span>
              {new Date(invoiceData.date).toLocaleDateString() || "N/A"}
            </span>
          </p>
          <p className="flex items-center gap-3">
            <FaClock className="text-blue-400" />
            <span className="font-semibold text-gray-200">Average Time:</span>
            <span>{invoiceData.averageTime || "N/A"} hours</span>
          </p>
          <p className="flex items-center gap-3">
            <FaTruck className="text-green-400" />
            <span className="font-semibold text-gray-200">Status:</span>
            <span>{invoiceData.status || "N/A"}</span>
          </p>
          {invoiceData?.chainName && (
            <p className="flex items-center gap-3">
              <FaLink className="text-blue-400" />
              <span className="font-semibold text-gray-200">Paid on:</span>
              <span>{invoiceData.chainName || " "} chain</span>
            </p>
          )}
          <p className="flex items-center gap-3">
            <FaLink className="text-blue-400" />
            <span className="font-semibold text-gray-200">
              Transaction Hash:
            </span>
            <span>{invoiceData.txHash || "N/A"}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaUserTie className="text-purple-400" />
            <span className="font-semibold text-gray-200">Driver Address:</span>
            <span>{invoiceData.address || "N/A"}</span>
          </p>
        </div>
      </div>

      {/* Checkout Component */}
      <div className="lg:w-1/2 animate-slideIn">
        <CheckoutComponent validRequest={invoiceData} />
      </div>
    </div>
  );
};

export default Page;
