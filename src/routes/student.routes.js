
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

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", protectStudent, getProfile);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
export default router;
