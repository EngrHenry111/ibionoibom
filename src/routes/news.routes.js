import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { uploadNewsImages } from "../middlewares/upload.middleware.js";
import {
  createNews,
  getAllNews,
  updateNews,
  deleteNews,
  getNewsById,
  updateNewsStatus,
  getSingleNews,
  getPublishedNews,
  getSinglePublishedNews,
  getPublicNews,
  getPublicNewsById,
} from "../controllers/news.controller.js";

const router = express.Router();

router.get("/public", getPublicNews);
router.get("/public", getPublishedNews);


router.get("/", protect, getAllNews);

// CREATE → everyone
// ✅ CREATE news (multiple images)
router.post(
  "/",
  protect,
  uploadNewsImages.array("images", 5),
  createNews
);

router.put(
  "/:id",
  protect,
  uploadNewsImages.array("images", 5),
  updateNews
);


router.get("/:id", getSingleNews);

// UPDATE STATUS → admin & super_admin
router.patch(
   "/:id/status",
  protect,
  requireRole("admin", "super_admin"),
  updateNewsStatus
);


// DELETE → super_admin only
router.delete(
  "/:id",
  protect,
  requireRole("super_admin"),
  deleteNews
);

/* PUBLIC */
/* ================= PUBLIC ROUTES ================= */

// Public: Only published news


// Public: Single published news
router.get("/public/:id", getSinglePublishedNews);

router.get("/:id", protect, getNewsById);

// router.get("/public/:id", getPublicNewsById);
router.get("/public/:id", getPublicNewsById);

export default router;




