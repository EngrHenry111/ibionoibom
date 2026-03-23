import mongoose from "mongoose";

const diasporaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  country: {
    type: String,
    required: true
  },

  profession: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    lowercase: true
  },

  phone: {
    type: String
  },

  interest: {
    type: String,
    enum: [
      "Investment",
      "Education",
      "Health",
      "Agriculture",
      "Mentorship",
      "Tourism"
    ],
    required: true
  },

  message: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("Diaspora", diasporaSchema);