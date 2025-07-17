import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name."],
    },
    email: {
      type: String,
      required: function (this: any) {
        return !this.walletaddress
      },
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: function (this: any) {
        return !this.walletaddress
      },
      minlength: 8,
    },
    walletaddress: {
      type: String,
      required: function (this: any) {
        return !this.email && !this.password
      },
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
      enum: ["none", "scheduled", "completed", "rejected_stage2"],
      default: "none",
    },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
