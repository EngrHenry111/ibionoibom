import mongoose from "mongoose";

const securitySchema = new mongoose.Schema({
  name: String,
  location: String,
  type: String,
  phone: String
}, { timestamps: true });

export default mongoose.model("Security", securitySchema);