// backend/src/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true }, // ✅ Added farmer
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, 
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Delivered"],
      default: "Pending",
    },
    approved: { type: Boolean, default: false },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    agentCommission: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
