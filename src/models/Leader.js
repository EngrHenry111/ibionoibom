import mongoose from "mongoose";
const leaderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    position: { type: String, required: true },
    bio: { type: String, required: true },

    imageUrl: { type: String, required: true }, // ✅ FIXED

    tenure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenure",
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

const Leader = mongoose.model("Leader", leaderSchema);
export default Leader;

// import mongoose from "mongoose";

// const leaderSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     position: { type: String, required: true },
//     bio: { type: String, required: true },
//     imageUrl: { type: String, required: true },

//     tenure: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Tenure",
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["draft", "published"],
//       default: "draft",
//     },
//   },
//   { timestamps: true }
// );

// const Leader = mongoose.model("Leader", leaderSchema);

// export default Leader;
