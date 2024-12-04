"use client";

import { useState, useEffect } from "react";
import { parseUnits } from "viem";
import { useWalletClient, useAccount } from "wagmi";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { jsPDF } from "jspdf";

export default function CreateTransportInvoice() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Awaiting Input");
  const [requestData, setRequestData] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // Blob URL for PDF preview
  const [message, setMessage] = useState(""); // For success or error messages
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  // Generate PDF Preview as the user types
  useEffect(() => {
    if (departure || destination || amount) {
      generatePDFPreview();
    }
  }, [departure, destination, amount]);

  async function createRequest() {
    try {
      setMessage(""); // Clear previous messages
      setMessageType("");

      if (!walletClient) {
        setMessage("Wallet client not available. Please connect your wallet.");
        setMessageType("error");
        return;
      }

      if (!departure || !destination || !amount) {
        setMessage("Please fill in all required fields.");
        setMessageType("error");
        return;
      }

      setStatus("Submitting");

      // Initialize Request Network client
      const signatureProvider = new Web3SignatureProvider(walletClient);
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider,
      });

      // Prepare the request parameters
      const requestCreateParameters = {
        requestInfo: {
          currency: {
            type: Types.RequestLogic.CURRENCY.ETH,
            network: "sepolia",
          },
          expectedAmount: parseUnits(amount || "0", 18).toString(), // Convert ETH to Wei
          payee: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: address,
          },
          timestamp: Utils.getCurrentTimestampInSecond(),
        },
        paymentNetwork: {
          id: Types.Extension.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
          parameters: {
            paymentAddress: address,
          },
        },
        contentData: {
          reason: "Ride booking invoice",
          departure,
          destination,
        },
        signer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address,
        },
        topics: ["chainmove-dapp"],
      };

      // Create the request
      const request = await requestClient.createRequest(
        requestCreateParameters
      );

      setStatus("Waiting for Confirmation");
      const confirmedRequestData = await request.waitForConfirmation();

      setStatus("Request Confirmed");
      setRequestData(confirmedRequestData);
      setMessage("Invoice created successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Error creating request:", error);
      setStatus("Error Occurred");
      setMessage(error.message || "Failed to create the request.");
      setMessageType("error");
    }
  }

  function generatePDFPreview() {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [100, 150], // Custom paper size
    });

    // Styling and formatting
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Ride Booking Invoice Preview", 50, 10, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${departure || "N/A"}`, 10, 30);
    doc.text(`To: ${destination || "N/A"}`, 10, 40);
    doc.text(`Amount: ${amount || "0"} ETH`, 10, 50);

    doc.setDrawColor(0); // Black border
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 90, 140); // Draw a border for the PDF

    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    setPdfPreviewUrl(blobUrl); // Update the preview URL
  }

  const isSubmitting = status === "Submitting";

  return (
    <div className="p-8 bg-gray-900 min-h-screen flex flex-col md:flex-row gap-4 text-white ">
      <div className=" w-full">
        <h1 className="text-3xl font-bold mb-4">Create Ride Invoice</h1>
        <div className="">
          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded text-sm ${
                messageType === "success" ? "bg-green-500" : "bg-red-500"
              }`}>
              {message}
            </div>
          )}
          <div>
            <label className="block mb-2">Departure</label>
            <input
              type="text"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-lg"
              placeholder="Enter departure location"
            />
          </div>
          <div>
            <label className="block mb-2">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-lg"
              placeholder="Enter destination"
            />
          </div>
          <div>
            <label className="block mb-2">Amount (ETH)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-lg"
              placeholder="Enter amount in ETH"
            />
          </div>
          <button
            onClick={createRequest}
            disabled={isSubmitting}
            className={`w-full py-4 mt-4 rounded-lg text-lg font-semibold transition ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}>
            {isSubmitting ? "Creating Invoice..." : "Create Invoice"}
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      {pdfPreviewUrl && (
        <div className=" w-full">
          <h3 className="text-xl ml-12 font-bold mb-4">Invoice Preview</h3>
          <iframe
            src={pdfPreviewUrl}
            title="PDF Preview"
            style={{
              width: "100mm",
              height: "100mm", // Match the custom PDF size
              border: "2px solid #4a5568", // Optional border styling
              borderRadius: "8px",
              overflow: "hidden",
              margin: "0 auto",
            }}></iframe>
        </div>
      )}
    </div>
  );
}
