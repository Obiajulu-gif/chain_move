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
        <h3 className="text-xl text-center font-bold mb-4 text-white">
          Invoice Preview
        </h3>
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
  doc.text("Client Details", 10, 90); // Positioned below the Driver Details
  doc.setFont("helvetica", "normal");
  doc.text(`Full Name: ${user?.fullName || "N/A"}`, 10, 100);
  doc.text(`Email: ${user?.email || "N/A"}`, 10, 110);

  // Ride Info
  doc.setFont("helvetica", "bold");
  doc.text("Ride Details", 10, 130); // Positioned below Client Details
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
  setPdfPreviewUrl(blobUrl); // Use the function passed as a parameter
};


  const paymentRequest = async (requestId, estimatedCost) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Sign up before creating requests");
      return;
    }

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
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 w-full bg-neutral-900 min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <div className="mb-6">
          <p>
            <strong>Request ID:</strong> {validRequest?.requestId || "N/A"}
          </p>
          <p>
            <strong>Amount to Pay:</strong>{" "}
            {validRequest?.estimatedCost || "N/A"} ETH
          </p>
          <button
            className="bg-green-500 rounded-lg mt-4 hover:bg-green-600 px-6 py-2.5"
            onClick={() =>
              paymentRequest(validRequest.requestId, validRequest.estimatedCost)
            }>
            Book Ride
          </button>
        </div>
      </div>
      <PDFPreview pdfPreviewUrl={pdfPreviewUrl} />
    </div>
  );
};

export default CheckoutComponent;
