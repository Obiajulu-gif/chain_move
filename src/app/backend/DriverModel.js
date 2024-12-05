import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		idNumber: { type: String, required: true, unique: true },
		document: { type: String, required: true }, // This can be a document URL or base64 string
	},
	{ timestamps: true }
);

const Driver = mongoose.models.Driver || mongoose.model("Driver", DriverSchema);

export default Driver;
