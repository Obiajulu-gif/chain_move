"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
        setInvoiceData(data.invoice); // Save the invoice data to state
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!invoiceData) {
    return <p>No data found for this Request ID.</p>;
  }

  return (
    <div className="p-6  flex flex-col lg:flex-row gap-4 bg-neutral-900 min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-bold mb-4">Invoice Details</h1>
        <div className="space-y-4">
          <p>
            <strong>Request ID:</strong> {invoiceData.requestId}
          </p>
          <p>
            <strong>Driver Name:</strong>{" "}
            {invoiceData.driver?.fullName || "N/A"}
          </p>
          <p>
            <strong>Driver Email:</strong> {invoiceData.driver?.email || "N/A"}
          </p>
          <p>
            <strong>Pickup Location:</strong>{" "}
            {invoiceData.pickupLocation || "N/A"}
          </p>
          <p>
            <strong>Destination:</strong> {invoiceData.destination || "N/A"}
          </p>
          <p>
            <strong>Estimated Cost:</strong>{" "}
            {invoiceData.estimatedCost || "N/A"} ETH
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(invoiceData.date).toLocaleDateString() || "N/A"}
          </p>
          <p>
            <strong>Average Time:</strong> {invoiceData.averageTime || "N/A"}{" "}
            hours
          </p>
          <p>
            <strong>Status:</strong> {invoiceData.status || "N/A"}
          </p>
          <p>
            <strong>Transaction Hash:</strong> {invoiceData.txHash || "N/A"}
          </p>
          <p>
            <strong>Driver Address:</strong> {invoiceData.address || "N/A"}
          </p>
        </div>
      </div>
        <CheckoutComponent validRequest={invoiceData} />
    </div>
  );
};

export default Page;
