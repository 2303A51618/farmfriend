// backend/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["farmer", "buyer", "agent", "admin"],
      default: "farmer",
    },
    verified: { type: Boolean, default: false }, // ✅ Added
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
