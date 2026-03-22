import express from "express";
import Tourism from "../models/tourism.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Tourism.find().sort({ createdAt: -1 });
  res.json(data);
});

router.post("/", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { name, location, type, description } = req.body;

    // HARD CHECK
    if (!name || !location || !type || !description) {
      return res.status(400).json({
        message: "Missing fields",
        body: req.body
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
    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: error.message,
      stack: error.stack
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