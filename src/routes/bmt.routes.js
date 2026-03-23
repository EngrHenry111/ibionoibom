import express from "express";
import BMT from "../models/bmt.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


// ================= CREATE =================
router.post("/", protect, async (req, res) => {
  try {
    const created = await BMT.create(req.body);
    res.json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET PUBLIC =================
router.get("/", async (req, res) => {
  try {

    const now = new Date();

    const data = await BMT.find({
      isPublished: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ]
    }).sort({ isPinned: -1, priority: -1, createdAt: -1 });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET ADMIN =================
router.get("/admin", protect, async (req, res) => {
  try {
    const data = await BMT.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= UPDATE =================
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await BMT.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= DELETE =================
router.delete("/:id", protect, async (req, res) => {
  try {
    await BMT.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;