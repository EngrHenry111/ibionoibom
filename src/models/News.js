import mongoose from "mongoose";
const newsSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    images: [String],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);


// const newsSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     content: { type: String, required: true },

//     images: [String], // ✅ MULTIPLE IMAGES (unchanged)

//     status: {
//       type: String,
//       enum: ["draft", "published"],
//       default: "draft",
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("News", newsSchema);


