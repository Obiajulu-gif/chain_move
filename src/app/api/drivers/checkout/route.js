import connectDb from "../../../backend/connectDb";
import Invoice from "../destination/model";
import { NextResponse } from "next/server";


// GET: Retrieve invoices with optional filtering
export async function GET(request) {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    // Parse query parameters
    const url = new URL(request.url);
    const requestId = url.searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    console.log(`Querying invoice with requestId: ${requestId}`);

    // Fetch the specific invoice by requestId
    const invoice = await Invoice.findOne({ requestId });

    if (!invoice) {
      return NextResponse.json(
        { error: "No invoice found with the provided requestId" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Invoice retrieved successfully", invoice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving invoice:", error);
    return NextResponse.json(
      { error: "Failed to retrieve invoice" },
      { status: 500 }
    );
  }
}
