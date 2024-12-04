import { NextResponse } from "next/server";
import { RequestNetwork } from "@requestnetwork/request-client.js";

// Initialize Request Network client
const requestClient = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: "https://sepolia.gateway.request.network/",
  },
});

// Unique topic for your platform
const PLATFORM_TOPIC = "chainmove-dapp";

export async function GET(request) {
  console.log("Request received at /api/transactions");

  try {
    console.log(`Fetching transactions for topic: ${PLATFORM_TOPIC}`);

    // Fetch all requests associated with the platform topic
    const requests = await requestClient.fromTopic(PLATFORM_TOPIC);

    console.log(`Number of transactions fetched: ${requests.length}`);

    // Extract and filter necessary fields for frontend
    const requestDatas = requests.map((request) => {
      const data = request.getData();

      return {
        requestId: data.requestId,
        departure: data.contentData?.departure || "N/A",
        destination: data.contentData?.destination || "N/A",
        expectedAmount: parseFloat(data.expectedAmount) / 1e18, // Convert to ETH
        currency: data.currency,
        payee: data.payee?.value || "N/A",
        timestamp: new Date(data.timestamp * 1000).toISOString(), // Convert to readable date
      };
    });

    console.log("Returning filtered transactions");
    return NextResponse.json(requestDatas, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching transactions",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
