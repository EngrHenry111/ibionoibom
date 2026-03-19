import { generateLetter, verifyBursary } from "../controllers/bursary.controller.js";
import { protectStudent } from "../middlewares/studentAuth.middleware.js";
import { getMyApplications } from "../controllers/bursary.controller.js";
import express from "express";

const router = express.Router();
router.get("/my", protectStudent, getMyApplications);
router.get("/letter/:id", generateLetter);

router.get("/verify/:code", verifyBursary)

export default router;
