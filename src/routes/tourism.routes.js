import express from "express";
import Tourism from "../models/tourism.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Tourism.find().sort({ createdAt: -1 });
  res.json(data);
});

router.post("/", protect, async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 DEBUG

    const { name, location, type, description } = req.body;

    if (!name || !location || !type || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const created = await Tourism.create({
      name,
      location,
      type,
      description
    });

    res.json(created);

  } catch (error) {
    console.error("TOURISM CREATE ERROR:", error); // 🔥 VERY IMPORTANT

    res.status(500).json({
      message: "Server error while creating tourism data",
    });
  }
});


router.put("/:id", protect, async (req, res) => {
  const updated = await Tourism.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete("/:id", protect, async (req, res) => {
  await Tourism.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;