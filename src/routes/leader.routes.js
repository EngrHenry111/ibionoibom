import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadLeaderImage } from "../middlewares/upload.middleware.js";
import {
  createLeader,
  getAllLeaders,
  getLeaderById,
  updateLeader,
  deleteLeader,
  updateLeaderStatus,

  // PUBLIC
  getPublicLeaders,
  getPublicLeaderById,
  getPublicLeadersByTenure,
} from "../controllers/leader.controller.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTES (NO AUTH)
========================= */

// MUST COME FIRST
router.get("/public/grouped", getPublicLeadersByTenure);
router.get("/public/:id", getPublicLeaderById);
router.get("/public", getPublicLeaders);

/* =========================
   ADMIN ROUTES (PROTECTED)
========================= */

router.get("/", protect, getAllLeaders);
router.get("/:id", protect, getLeaderById);

router.post(
  "/",
  protect,
  uploadLeaderImage.single("image"),
  createLeader
);

router.put(
  "/:id",
  protect,
  uploadLeaderImage.single("image"),
  updateLeader
);

router.delete("/:id", protect, deleteLeader);
router.patch("/:id/status", protect, updateLeaderStatus);

export default router;



// import express from "express";
// import { protect } from "../middlewares/auth.middleware.js";
// import {uploadLeaderImage} from "../middlewares/upload.middleware.js";
// import {
//   createLeader,
//   getAllLeaders,
//   getLeaderById,
//   updateLeader,
//   deleteLeader,
//   updateLeaderStatus,
//   getPublishedLeaders,
//   getPublishedLeadersGrouped,
//   getPublicLeaders,
//   getPublicLeadersByTenure,
//   getPublicLeaderById,
// } from "../controllers/leader.controller.js";

// const router = express.Router();

// router.get("/", protect, getAllLeaders);
// router.get("/public", getPublishedLeaders);
// router.get("/public", getPublicLeaders);

// router.get("/:id", protect, getLeaderById);
// router.post("/", protect, uploadLeaderImage.single("image"), createLeader);
// router.put("/:id", protect, uploadLeaderImage.single("image"), updateLeader);
// router.delete("/:id", protect, deleteLeader);
// router.patch("/:id/status", protect, updateLeaderStatus);

// router.get("/public/:id", getPublicLeaderById);
// router.get("/public/grouped", getPublishedLeadersGrouped);
// // PUBLIC
// router.get("/public/grouped", getPublicLeadersByTenure);

// export default router;


