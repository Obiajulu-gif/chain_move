"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { parseUnits } from "viem";
import { useWalletClient, useAccount } from "wagmi";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { jsPDF } from "jspdf";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../components/Map"), { ssr: false });

function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="my-4 md:my-5">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-3 capitalize bg-gray-900 text-white rounded-lg border border-gray-700"
        placeholder={placeholder}
      />
    </div>
  );
}

function PDFPreview({ pdfPreviewUrl }) {
  return (
    pdfPreviewUrl && (
      <div className="w-full">
        <h3 className="text-xl text-center font-bold mb-4 text-white">
          Preview
        </h3>
        <iframe
          src={pdfPreviewUrl}
          title="PDF Preview"
          style={{
            width: "100mm",
            height: "150mm",
            border: "1px solid #4a5568",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "0 auto",
          }}></iframe>
      </div>
    )
  );
}

export default function CreateTransportInvoice() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [avgTime, setAvgTime] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [status, setStatus] = useState("");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const generatePDFPreview = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user?.email || "N/A";
    const userFullName = user?.fullName || "N/A";

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);

    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("Driver's Booking Invoice", 105, 50, { align: "center" });

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("About The Driver", 20, 80);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(`Name: ${userFullName}`, 20, 100);
    doc.text(`Email: ${userEmail}`, 20, 115);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Ride Details", 20, 140);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(`Pickup Location: ${pickup || "N/A"}`, 20, 160);
    doc.text(`Destination: ${destination || "N/A"}`, 20, 175);
    doc.text(`Estimated Cost: ${amount || "0"} ETH`, 20, 190);
    doc.text(`Date: ${date || "N/A"}`, 20, 205);
    doc.text(`Average Time: ${avgTime || "N/A"} hours`, 20, 220);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Thank you for using our service!", 105, 280, { align: "center" });

    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    setPdfPreviewUrl(blobUrl);
  }, [pickup, destination, amount, avgTime, date]);

  useEffect(() => {
    if (pickup || destination || amount || avgTime || date) {
      generatePDFPreview();
    }
  }, [pickup, destination, amount, avgTime, date, generatePDFPreview]);

  async function createRequest() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Sign up before creating requests");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      if (!walletClient) {
        setLoading(false);
        setStatus("Wallet client not available. Please connect your wallet.");
        return;
      }

      const signatureProvider = new Web3SignatureProvider(walletClient);
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider,
      });

      const requestCreateParameters = {
        requestInfo: {
          currency: {
            type: Types.RequestLogic.CURRENCY.ETH,
            network: "sepolia",
          },
          expectedAmount: parseUnits(amount || "0", 18).toString(),
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
          reason: "Create Ride booking invoice",
          pickup,
          destination,
          avgTime,
          date,
        },
        signer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address,
        },
        topics: ["chainmove-dapp-v1"],
      };

      const request = await requestClient.createRequest(
        requestCreateParameters
      );

      const requestId = request.requestId;

      setStatus("Request Confirmed. Saving to backend...");

      const invoiceData = {
        driver: {
          fullName: user?.fullName || "Unknown Driver",
          email: user?.email || "Unknown Email",
        },
        pickupLocation: pickup,
        destination,
        estimatedCost: amount,
        date,
        averageTime: avgTime,
        status: "available",
        requestId,
        address,
      };

      const response = await fetch("/api/drivers/destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save invoice to backend");
      }

      setStatus("Success and Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error creating request:", error);
      setStatus(error.message || "Failed to create the request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="p-8 bg-gray-900 min-h-screen text-white"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto auto",
        gap: "20px",
      }}>
      {/* Left Component */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Create Ride Invoice</h1>
        <InputField
          label="Pick Up Location"
          type="text"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Enter pick up location"
        />
        <InputField
          label="Destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
        />
        <InputField
          label="Estimated Trip Cost (ETH)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter estimated trip cost"
        />
        <InputField
          label="Average Time (hours)"
          type="number"
          value={avgTime}
          onChange={(e) => setAvgTime(e.target.value)}
          placeholder="Enter average time to complete journey"
        />
        <InputField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Select date"
        />
        <button
          className={`w-full py-3 mt-4 rounded-lg text-lg font-semibold ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          onClick={createRequest}
          disabled={loading}>
          {loading ? "Processing..." : "Generate Invoice"}
        </button>
      </div>

      {/* Right Component */}
      <div>
        <PDFPreview pdfPreviewUrl={pdfPreviewUrl} />
      </div>

      {/* Full-Width Map Component */}
      <div style={{ gridColumn: "1 / -1" }}>
        <Map />
      </div>
    </div>
  );
}
