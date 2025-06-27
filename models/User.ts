import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name."],
  },
  email: {
    type: String,
    required: function (this: any) {
      return !this.walletaddress;
    },
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: function (this: any) {
      return !this.walletaddress;
    },
    minlength: 8,
  },
  walletaddress: {
    type: String,
    required: function (this: any) {
      return !this.email && !this.password;
    },
    unique: true,
    sparse: true,
  },
  role: {
    type: String,
    enum: ["driver", "investor", "admin"],
    required: [true, "Please specify a role."],
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);