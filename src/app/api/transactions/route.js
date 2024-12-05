import { NextResponse } from "next/server";
import { RequestNetwork } from "@requestnetwork/request-client.js";

// Initialize Request Network client
const requestClient = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: "https://sepolia.gateway.request.network/",
  },
});

// Unique topic for your platform (commented out for this implementation)
// const PLATFORM_TOPIC = "chainmove-dapp-v1";

export async function GET(request) {
  console.log("Request received at /api/transactions");

  try {
    // Fetch the specific transaction using its request ID
    const requestId =
      "01c350e3c7109924eeb0e87d40128fc00b2127979aaac7440ac302393e3ad75c70";

    console.log(`Fetching transaction with request ID: ${requestId}`);

    // Fetch the request data for the specified request ID
    const request = await requestClient.fromRequestId(requestId);

    // Extract necessary fields for the response
    const data = request.getData();

    const requestData = {
      requestId: data.requestId,
      departure: data.contentData?.departure || "N/A",
      destination: data.contentData?.destination || "N/A",
      expectedAmount: parseFloat(data.expectedAmount) / 1e18, // Convert to ETH
      currency: data.currency,
      payee: data.payee?.value || "N/A",
      timestamp: new Date(data.timestamp * 1000).toISOString(), // Convert to readable date
      transactionStatus: data.state || "Unknown", // Add the transaction status
      errorDetails: data.balance?.error?.message || "No error", // If any error, include it
    };

    console.log("Returning specific transaction data", requestData);
    return NextResponse.json(requestData, { status: 200 });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching the transaction",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
