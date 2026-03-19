import express from "express";
import {
  registerStudent,
  loginStudent,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/student.controller.js";

import { protectStudent } from "../middlewares/studentAuth.middleware.js";

const router = express.Router();

/* ================= AUTH ================= */

// Register
router.post("/register", registerStudent);

// Login
router.post("/login", loginStudent);

/* ================= PROFILE ================= */

router.get("/profile", protectStudent, getProfile);

/* ================= PASSWORD RESET ================= */

// Request reset link
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

export default router;