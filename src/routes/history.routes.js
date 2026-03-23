import express from "express";
import History from "../models/history.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await History.find().sort({ createdAt: -1 });
  res.json(data);
});

router.post("/", protect, async (req, res) => {
  const created = await History.create(req.body);
  res.json(created);
});

router.put("/:id", protect, async (req, res) => {
  const updated = await History.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", protect, async (req, res) => {
  await History.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;