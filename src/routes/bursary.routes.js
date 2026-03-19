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
import { protect } from "../middlewares/auth.middleware.js"; // admin

const router = express.Router();

/* ================= STUDENT ROUTES ================= */

// Apply for bursary
router.post("/apply", protectStudent, applyBursary);

// Get logged-in student's applications
router.get("/my", protectStudent, getMyApplications);

/* ================= ADMIN ROUTES ================= */

// Get all applications (admin)
router.get("/", protect, getAllApplications);

// Update status (approve/reject)
router.patch("/:id/status", protect, updateApplicationStatus);

/* ================= PUBLIC ROUTES ================= */

// Download approval letter
router.get("/letter/:id", generateLetter);

// Verify certificate
router.get("/verify/:code", verifyBursary);

export default router;