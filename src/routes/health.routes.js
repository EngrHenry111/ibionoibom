import express from "express";
import Health from "../models/health.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Health.find().sort({ createdAt: -1 });
  res.json(data);
});

router.post("/", protect, async (req, res) => {
  const created = await Health.create(req.body);
  res.json(created);
});

router.put("/:id", protect, async (req, res) => {
  const updated = await Health.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});
router.delete("/:id", protect, async (req, res) => {
  await Health.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;