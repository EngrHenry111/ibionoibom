import mongoose from "mongoose";

const healthSchema = new mongoose.Schema({
  name: String,
  location: String,
  type: String,
  phone: String
}, { timestamps: true });

export default mongoose.model("Health", healthSchema);