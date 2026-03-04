import express from "express";
import { searchArchive } from "../controllers/archive.controller.js";

const router = express.Router();

router.get("/search", searchArchive);

export default router;
