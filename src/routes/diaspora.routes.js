import express from "express";
import Diaspora from "../models/diaspora.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


// ================= CREATE =================
router.post("/", async (req, res) => {
  try {

    const created = await Diaspora.create(req.body);

    res.status(201).json({
      message: "Registration successful",
      data: created
    });

  } catch (error) {
    console.error("DIASPORA ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
});


// ================= GET ALL (ADMIN) =================
router.get("/", protect, async (req, res) => {
  try {
    const data = await Diaspora.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= DELETE =================
router.delete("/:id", protect, async (req, res) => {
  try {
    await Diaspora.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;