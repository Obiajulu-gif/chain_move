import { NextResponse } from "next/server";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";

// Initialize Request Network client
const requestClient = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: "https://sepolia.gateway.request.network/",
  },
});

export async function POST(request) {
  console.log("Request received at /api/transactions");

  try {
    const body = await request.json();
    const walletAddress = body.walletAddress;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching transactions for wallet address: ${walletAddress}`);

    // Fetch all requests where the specified address is involved
    const requests = await requestClient.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: walletAddress,
    });

    console.log(`Total requests found: ${requests.length}`);

    // Map and structure the response data
    const requestsData = requests.map((request) => {
      const data = request.getData();
      return {
        requestId: data.requestId,
        Reason: data.contentData.reason || "Unspecified",
        pickUp: data.contentData.pickup || "Unspecified",
        destination: data.contentData.destination || "Unspecified",
        expectedAmount: parseFloat(data.expectedAmount) / 1e18,
        currency: data.currency || "ETH",
        payee: data.payee?.value || "Unspecified",
        payer: data.payer?.value || "Unspecified",
        timestamp: new Date(data.timestamp * 1000).toISOString(),
        transactionStatus: data.state || "Unspecified",
      };
    });

    console.log("Returning all transactions data", requestsData);
    return NextResponse.json({ requests: requestsData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching the transactions",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
