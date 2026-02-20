import mongoose from "mongoose";

export default mongoose.model(
  "Office",
  new mongoose.Schema({
    title: String,
    rankOrder: Number
  })
);
