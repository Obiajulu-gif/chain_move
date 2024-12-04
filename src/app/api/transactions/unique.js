import { NextResponse } from "next/server";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";

// Initialize Request Network client
const requestClient = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: "https://sepolia.gateway.request.network/",
  },
});
//test using my address 0xC50D81262335E676092c66af342994EF4a0C329C
export async function GET(request) {
  console.log("Request received at /api/transactions");

  try {
    // Parse the user address from the query parameters
    const { searchParams } = new URL(request.url);
    const identity = searchParams.get("identity");

    if (!identity) {
      console.log("No wallet address provided in the request");
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching transactions for address: ${identity}`);

    // Fetch all requests associated with the user's identity
    const requests = await requestClient.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: identity,
    });

    console.log(`Number of transactions fetched: ${requests.length}`);

    // Extract request data
    const requestDatas = requests.map((request) => {
      const data = request.getData();
      console.log(`Transaction data: ${JSON.stringify(data)}`);
      return data;
    });

    console.log("Returning fetched transactions");
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
