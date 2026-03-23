import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  title: String,
  content: String,
  section: String,
  year: String
}, { timestamps: true });

export default mongoose.model("History", historySchema);