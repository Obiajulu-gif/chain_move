import connectDb from "../../backend/connectDb";
import Driver from "../../backend/DriverModel";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			// Connect to MongoDB
			await connectDb();

			// Destructure the request body
			const { fullName, idNumber, document } = req.body;

			// Validate the input
			if (!fullName || !idNumber || !document) {
				return res.status(400).json({ message: "All fields are required" });
			}

			// Create a new driver in the database
			const newDriver = new Driver({ fullName, idNumber, document });
			await newDriver.save();

			return res
				.status(201)
				.json({ message: "Driver registered successfully" });
		} catch (error) {
			console.error("Error registering driver:", error);
			return res
				.status(500)
				.json({ message: "Server error. Check logs for details." });
		}
	} else {
		// Handle unsupported methods
		res.setHeader("Allow", ["POST"]);
		return res
			.status(405)
			.json({ message: `Method ${req.method} not allowed` });
	}
}
