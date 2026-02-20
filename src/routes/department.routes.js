import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getPublicDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus
} from "../controllers/department.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/public", getPublicDepartments);

/* ================= ADMIN ================= */
router.get("/", protect, getAllDepartments);
router.get("/:id", protect, getDepartmentById);
router.post("/", protect, createDepartment);
router.put("/:id", protect, updateDepartment);
router.patch("/:id/status", protect, updateDepartmentStatus);
router.delete("/:id", protect, deleteDepartment);

export default router;
