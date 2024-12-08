import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    option1: {
      type: new mongoose.Schema(
        {
          text: { type: String, required: true, trim: true },
          voteCount: { type: Number, default: 0 },
        },
        { _id: false } // Disable _id for subdocuments
      ),
      required: true,
    },
    option2: {
      type: new mongoose.Schema(
        {
          text: { type: String, required: true, trim: true },
          voteCount: { type: Number, default: 0 },
        },
        { _id: false } // Disable _id for subdocuments
      ),
      required: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);
