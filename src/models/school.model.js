import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  name: String,
  location: String,
  type: String,
});

export default mongoose.model("School", schoolSchema);