import mongoose from "mongoose";

const tenureSchema = new mongoose.Schema(
  {
    startYear: {
      type: Number,
      required: true,
    },
    endYear: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tenure", tenureSchema);
