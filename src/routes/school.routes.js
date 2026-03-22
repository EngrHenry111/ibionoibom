import express from "express";
import School from "../models/school.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= GET ALL ================= */
router.get("/", async (req, res) => {
  const schools = await School.find().sort({ createdAt: -1 });
  res.json(schools);
});

/* ================= CREATE ================= */
router.post("/", protect, async (req, res) => {
  const { name, location, type } = req.body;

  const school = await School.create({ name, location, type });

  res.json(school);
});

/*==================== EDIT ===================*/
router.put("/:id", protect, async (req, res) => {
  const updated = await School.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* ================= DELETE ================= */
router.delete("/:id", protect, async (req, res) => {
  await School.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

export default router;