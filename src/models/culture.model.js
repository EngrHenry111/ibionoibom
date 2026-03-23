import mongoose from "mongoose";

const cultureSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: String,
  location: String
}, { timestamps: true });

export default mongoose.model("Culture", cultureSchema);