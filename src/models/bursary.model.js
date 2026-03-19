import mongoose from "mongoose";

const bursarySchema = new mongoose.Schema(
{
  /* ================= BASIC INFO ================= */
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  matricNumber: { type: String, required: true },
  institution: String,
  course: String,
  level: String,
  lga: String,

  /* ================= FINANCIAL ================= */
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },

  /* ================= IDENTITY ================= */
  bvn: { type: String, required: true },
  nin: { type: String, required: true },

  /* ================= DOCUMENTS ================= */
  passport: String,
  admissionLetter: String,
  studentID: String,
  lgaCertificate: String,

  /* ================= SYSTEM ================= */
  trackingId: {
    type: String,
    unique: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  
  verificationCode: {
    type: String,
    unique: true,
  }

},
{ timestamps: true }
);

/* INDEXES FOR SEARCH + PERFORMANCE */
bursarySchema.index({ trackingId: 1 });
bursarySchema.index({ email: 1 });
bursarySchema.index({ status: 1 });

export default mongoose.model("Bursary", bursarySchema);