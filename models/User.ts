import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name."],
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      minlength: 8,
    },
    phoneNumber: {
      type: String,
      sparse: true,
      trim: true,
    },
    privyUserId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    walletaddress: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["driver", "investor", "admin"],
      required: [true, "Please specify a role."],
      default: "investor",
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalInvested: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalReturns: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
