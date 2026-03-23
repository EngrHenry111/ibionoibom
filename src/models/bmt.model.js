import mongoose from "mongoose";

const bmtSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: [
      "Government",
      "Alert",
      "Event",
      "Opportunity",
      "Emergency"
    ],
    required: true
  },

  priority: {
    type: String,
    enum: ["normal", "urgent"],
    default: "normal"
  },

  isPinned: {
    type: Boolean,
    default: false
  },

  isPublished: {
    type: Boolean,
    default: true
  },

  expiryDate: {
    type: Date
  }

}, { timestamps: true });

export default mongoose.model("BMT", bmtSchema);