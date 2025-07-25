import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name."],
    },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: 8,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
    },
    privateKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["driver", "investor", "admin"],
      required: [true, "Please specify a role."],
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    // Updated fields for KYC stages
    kycStatus: {
      type: String,
      enum: ["none", "pending", "approved_stage1", "pending_stage2", "approved_stage2", "rejected"], // Updated enum
      default: "none",
    },
    kycDocuments: {
      type: [String], // Array of document URLs or paths
      default: [],
    },
    kycRejectionReason: {
      type: String,
      default: null, // Can be null if not rejected or no reason provided
    },
    // New fields for second stage KYC (physical meeting)
    physicalMeetingDate: {
      type: Date,
      default: null,
    },
    physicalMeetingStatus: {
      type: String,
      enum: ["none", "scheduled", "approved", "rescheduled", "completed", "rejected_stage2"], // Added 'approved' and 'rescheduled'
      default: "none",
    },
    // New field for in-app notifications
    notifications: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
        link: { type: String }, // Optional link for the notification
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
