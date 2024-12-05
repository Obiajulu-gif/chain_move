// /InvoiceModel.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    driver: {
      fullName: {
        type: String,
        required: [true, "Driver's full name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Driver's email is required"],
        lowercase: true,
        trim: true,
        match: [
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please provide a valid email address",
        ],
      },
    },
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    estimatedCost: {
      type: Number,
      required: [true, "Estimated cost is required"],
      min: [0, "Estimated cost cannot be negative"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    averageTime: {
      type: String,
      required: [true, "Average time is required"],
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "booked", "completed"],
      default: "available",
    },
    requestId: {
      type: String,
      required: [true, "Request ID is required"],
      unique: true,
      trim: true,
    },
    txHash: {
      type: String,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

delete mongoose.models.Invoice;
export default mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);
