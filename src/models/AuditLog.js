import mongoose from "mongoose";

export default mongoose.model(
  "AuditLog",
  new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    action: String,
    entity: String
  }, { timestamps: true })
);
