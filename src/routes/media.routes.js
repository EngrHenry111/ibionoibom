import express from "express";
import {
  uploadLeaderImage,
  uploadNewsImages,
} from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===== LEADER IMAGE UPLOAD ===== */
router.post(
  "/leader",
  protect,
  uploadLeaderImage.single("image"), // ✅ MUST CALL .single()
  (req, res) => {
    res.json({
      success: true,
      file: req.file.filename,
    });
  }
);

/* ===== NEWS IMAGES UPLOAD (MULTIPLE) ===== */
router.post(
  "/news",
  protect,
  uploadNewsImages.array("images", 10), // ✅ MUST CALL .array()
  (req, res) => {
    res.json({
      success: true,
      files: req.files.map((f) => f.filename),
    });
  }
);

export default router;
