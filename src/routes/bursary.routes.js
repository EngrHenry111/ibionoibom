import express from "express";
import {
  applyBursary,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  generateLetter,
  verifyBursary,
} from "../controllers/bursary.controller.js";

import { protectStudent } from "../middlewares/studentAuth.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ================= APPLY ================= */
router.post(
  "/apply",
  protectStudent,
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "admissionLetter", maxCount: 1 },
    { name: "studentID", maxCount: 1 },
    { name: "lgaCertificate", maxCount: 1 },
  ]),
  applyBursary
);

/* ================= STUDENT ================= */
router.get("/my", protectStudent, getMyApplications);

/* ================= ADMIN ================= */
router.get("/", protect, getAllApplications);
router.patch("/:id/status", protect, updateApplicationStatus);

/* ================= PUBLIC ================= */
router.get("/letter/:id", generateLetter);
router.get("/verify/:code", verifyBursary);

export default router;