import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	idNumber: { type: String, required: true },
	document: { type: String, required: true },
});

export default mongoose.models.Driver || mongoose.model("Driver", DriverSchema);
