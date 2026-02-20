import express from "express";
import {
  getAllTenures,
  createTenure,
  deleteTenure,
} from "../controllers/tenure.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ADMIN */
router.get("/", protect, getAllTenures);
router.post("/", protect, createTenure);
router.delete("/:id", protect, deleteTenure);


// Public version (important)
router.get("/public", getAllTenures);

export default router;
