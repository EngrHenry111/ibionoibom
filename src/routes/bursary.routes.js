import express from "express";
import {
  applyBursary,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  generateLetter,
  verifyBursary,
  getBursaryStats,
} from "../controllers/bursary.controller.js";

import { protectStudent } from "../middlewares/studentAuth.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadBursaryDocuments } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ================= APPLY ================= */

router.post("/apply", protectStudent, (req, res, next) => {
  uploadBursaryDocuments.fields([
    { name: "passport", maxCount: 1 },
    { name: "admissionLetter", maxCount: 1 },
    { name: "studentID", maxCount: 1 },
    { name: "lgaCertificate", maxCount: 1 },
  ])(req, res, function (err) {
    if (err) {
      console.error("UPLOAD ERROR:", err.message);
      return res.status(400).json({ message: err.message });
    }

    next();
  });
}, applyBursary);
// router.post(
//   "/apply",
//   protectStudent,
//   uploadBursaryDocuments.fields([
//     { name: "passport", maxCount: 1 },
//     { name: "admissionLetter", maxCount: 1 },
//     { name: "studentID", maxCount: 1 },
//     { name: "lgaCertificate", maxCount: 1 },
//   ]),
//   applyBursary
// );

/* ================= STUDENT ================= */
router.get("/my", protectStudent, getMyApplications);

/* ================= ADMIN ================= */
router.get("/", protect, getAllApplications);
router.patch("/:id/status", protect, updateApplicationStatus);

/* ================= PUBLIC ================= */
router.get("/letter/:id", generateLetter);
router.get("/verify/:code", verifyBursary);
router.get("/stats", protect, getBursaryStats)

export default router;