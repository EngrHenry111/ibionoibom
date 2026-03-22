import express from "express";
import Tourism from "../models/tourism.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


// ================= GET ALL =================
router.get("/", async (req, res) => {
  try {
    const data = await Tourism.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


// ================= CREATE =================
router.post("/", protect, async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 debug

    const { name, location, type, description } = req.body;

    // validation
    if (!name || !location || !type || !description) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const created = await Tourism.create({
      name,
      location,
      type,
      description
    });

    res.status(201).json(created);

  } catch (error) {
    console.error("CREATE ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
});


// ================= UPDATE =================
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Tourism.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


// ================= DELETE =================
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Tourism.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;