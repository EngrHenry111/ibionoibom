import mongoose from "mongoose";

const economicSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  location: String
}, { timestamps: true });

export default mongoose.model("Economic", economicSchema);