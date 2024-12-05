import connectDb from "../../../backend/connectDb";
import Invoice from "./model";
import { NextResponse } from "next/server";

// POST: Upload a new invoice
export async function POST(request) {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    const {
      driver,
      pickupLocation,
      destination,
      estimatedCost,
      date,
      averageTime,
      status,
      requestId,
      address,
    } = await request.json();
    console.log("address", address);

    // Validate required fields
    if (!driver?.fullName || !driver?.email) {
      return NextResponse.json(
        { error: "Driver information (fullName and email) is required" },
        { status: 400 }
      );
    }

    if (
      !pickupLocation ||
      !destination ||
      !estimatedCost ||
      !date ||
      !averageTime ||
      !requestId ||
      !address
    ) {
      return NextResponse.json(
        { error: "All ride details and blockchain fields are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["available", "booked", "completed"];
    if (status && !validStatuses.includes(status)) {
      console.log("Invalid status provided.");
      return NextResponse.json(
        {
          error:
            "Invalid status. Valid statuses are: available, booked, completed.",
        },
        { status: 400 }
      );
    }

    // Check if the requestId already exists
    const existingInvoice = await Invoice.findOne({ requestId });
    if (existingInvoice) {
      return NextResponse.json(
        { error: "Invoice with the same requestId already exists" },
        { status: 400 }
      );
    }

    // Create new invoice with txHash set to an empty string
    console.log("Creating a new invoice...");
    const newInvoice = await Invoice.create({
      driver,
      pickupLocation,
      destination,
      estimatedCost,
      date,
      averageTime,
      status: status || "available", // Default to "available" if not provided
      requestId,
      txHash: "", // Set txHash to an empty string
      address,
    });
    console.log("New invoice created successfully.", newInvoice);

    return NextResponse.json(
      {
        message: "Invoice created successfully",
        invoice: {
          id: newInvoice._id,
          driver: newInvoice.driver,
          pickupLocation: newInvoice.pickupLocation,
          destination: newInvoice.destination,
          estimatedCost: newInvoice.estimatedCost,
          date: newInvoice.date,
          averageTime: newInvoice.averageTime,
          status: newInvoice.status,
          requestId: newInvoice.requestId,
          txHash: newInvoice.txHash, // Will be an empty string
          address: newInvoice.address,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during invoice creation:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

// GET: Retrieve invoices with optional filtering
export async function GET(request) {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    // Parse query parameters
    const url = new URL(request.url);
    const driverEmail = url.searchParams.get("email");
    const status = url.searchParams.get("status");
    const requestId = url.searchParams.get("requestId");
    const txHash = url.searchParams.get("txHash");

    // Build the query
    const query = {};
    if (driverEmail) {
      query["driver.email"] = driverEmail;
    }
    if (status) {
      query.status = status;
    }
    if (requestId) {
      query.requestId = requestId;
    }
    if (txHash) {
      query.txHash = txHash;
    }

    console.log("Querying invoices with:", query);

    // Fetch invoices from the database
    const invoices = await Invoice.find(query);

    if (invoices.length === 0) {
      return NextResponse.json(
        { message: "No invoices found matching the criteria" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Invoices retrieved successfully", invoices },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    return NextResponse.json(
      { error: "Failed to retrieve invoices" },
      { status: 500 }
    );
  }
}
