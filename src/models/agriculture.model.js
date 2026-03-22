import mongoose from "mongoose";

const agriSchema = new mongoose.Schema({
  name: String,
  location: String,
  type: String
}, { timestamps: true });

export default mongoose.model("Agriculture", agriSchema);