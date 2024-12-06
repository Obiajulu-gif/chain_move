"use client";

import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { payRequest } from "@requestnetwork/payment-processor";
import { ethers } from "ethers";
import { jsPDF } from "jspdf";

function PDFPreview({ pdfPreviewUrl }) {
  return (
    pdfPreviewUrl && (
      <div className="w-full">
        <iframe
          src={pdfPreviewUrl}
          title="PDF Preview"
          style={{
            width: "100%",
            height: "500px",
            border: "1px solid #4a5568",
            borderRadius: "8px",
          }}></iframe>
      </div>
    )
  );
}

const CheckoutComponent = ({ validRequest }) => {
  const { data: walletClient } = useWalletClient();
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (validRequest) {
      generatePDF(validRequest, setPdfPreviewUrl);
    }
  }, [validRequest]);

  const generatePDF = (data, setPdfPreviewUrl) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4", // Standard A4 size
    });

    // Set background color
    doc.setFillColor(0, 0, 0); // Black background
    doc.rect(0, 0, 210, 297, "F"); // A4 size: 210mm x 297mm

    // Set text color
    doc.setTextColor(255, 255, 255);

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Driver's Booking Invoice", 105, 20, { align: "center" });

    // Driver Info
    doc.setFontSize(18);
    doc.text("Driver Details", 10, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${data.driver?.fullName || "N/A"}`, 10, 50);
    doc.text(`Email: ${data.driver?.email || "N/A"}`, 10, 60);
    doc.text(`Receiving Address: ${data.address || "N/A"}`, 10, 70);

    // Client Info
    doc.setFontSize(18);
    doc.text("Client Details", 10, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Full Name: ${user?.fullName || "N/A"}`, 10, 100);
    doc.text(`Email: ${user?.email || "N/A"}`, 10, 110);

    // Ride Info
    doc.setFont("helvetica", "bold");
    doc.text("Ride Details", 10, 130);
    doc.setFont("helvetica", "normal");
    doc.text(`Pickup Location: ${data.pickupLocation || "N/A"}`, 10, 140);
    doc.text(`Destination: ${data.destination || "N/A"}`, 10, 150);
    doc.text(`Estimated Cost: ${data.estimatedCost || "N/A"} ETH`, 10, 160);
    doc.text(
      `Date: ${new Date(data.date).toLocaleDateString() || "N/A"}`,
      10,
      170
    );
    doc.text(`Average Time: ${data.averageTime || "N/A"} minutes`, 10, 180);

    // Status
    doc.setFont("helvetica", "bold");
    doc.text(`Status: ${data.status || "N/A"}`, 10, 200);

    // Footer
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for using ChainMove!", 105, 280, { align: "center" });

    // Generate PDF Blob and set preview URL
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    setPdfPreviewUrl(blobUrl);
  };

  const paymentRequest = async (requestId, estimatedCost) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setStatusMessage("Sign up before creating requests");
      return;
    }

    if (!walletClient) {
      setStatusMessage("Ensure your wallet is connected.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(walletClient);
    const signer = provider.getSigner();

    if (!signer) {
      setStatusMessage("Please connect your wallet");
      return;
    }

    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://sepolia.gateway.request.network/",
      },
    });

    try {
      setIsButtonDisabled(true); // Disable the button

      setStatusMessage("Processing payment...");
      const request = await requestClient.fromRequestId(requestId);
      const requestData = request.getData();

      if (!requestData.expectedAmount) {
        throw new Error("Invalid request data: Missing expected amount.");
      }

      const paymentTx = await payRequest(requestData, signer);
      setStatusMessage("Payment in progress...");

      await paymentTx.wait(2);
      setStatusMessage("Payment completed successfully.");

      // Update status to "completed" after successful payment
      const updateResponse = await fetch("/api/drivers/checkout", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          status: "completed",
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData.error || "Failed to update status to completed"
        );
      }

      setStatusMessage("Payment confirmed. Enjoy your ride");
    } catch (error) {
      console.error("Error processing payment or updating status:", error);
      setStatusMessage(`Error: User rejected the transaction `);
    } finally {
      setIsButtonDisabled(false); // Re-enable the button
    }
  };

  return (
    <div className="p-6 w-full bg-neutral-900 min-h-screen text-white">
      <div>
        <button
          className={`rounded-lg mt-4 px-6 py-2.5 ${
            isButtonDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={isButtonDisabled}
          onClick={() =>
            paymentRequest(validRequest.requestId, validRequest.estimatedCost)
          }>
          {isButtonDisabled
            ? validRequest?.status === "completed"
              ? "Paid"
              : "Processing..."
            : "Book Ride"}
        </button>
        {statusMessage && (
          <p className="text-center text-lg mt-4">{statusMessage}</p>
        )}
      </div>
      <PDFPreview pdfPreviewUrl={pdfPreviewUrl} />
    </div>
  );
};

export default CheckoutComponent;
