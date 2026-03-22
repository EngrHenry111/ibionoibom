import mongoose from "mongoose";

const tourismSchema = new mongoose.Schema({
  name: String,
  location: String,
  type: String,
  description: String
}, { timestamps: true });

export default mongoose.model("Tourism", tourismSchema);