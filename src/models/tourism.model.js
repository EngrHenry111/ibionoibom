import mongoose from "mongoose";

const tourismSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  location: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    required: true,
    enum: ["Nature", "Culture", "Recreation"]
  },

  description: {
    type: String,
    required: true,
    trim: true
  }

}, { timestamps: true });

export default mongoose.model("Tourism", tourismSchema);