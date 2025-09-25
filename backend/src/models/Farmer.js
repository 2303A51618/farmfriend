// backend/src/models/Farmer.js
import mongoose from "mongoose";

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  farmName: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  createdAt: { type: Date, default: Date.now },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  verified: { type: Boolean, default: false },
});

const Farmer = mongoose.model("Farmer", FarmerSchema);

export default Farmer;
