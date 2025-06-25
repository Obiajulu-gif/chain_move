import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["driver", "investor", "admin"],
    required: [true, "Please specify a role."],
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);