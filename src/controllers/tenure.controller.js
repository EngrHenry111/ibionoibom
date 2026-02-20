import Tenure from "../models/Tenure.js";

/* ADMIN: Get all tenures */
export const getAllTenures = async (req, res) => {
  try {
    const tenures = await Tenure.find().sort({ startYear: -1 });
    res.json(tenures);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tenures" });
  }
};

/* ADMIN: Create tenure */
export const createTenure = async (req, res) => {
  try {
    const { startYear, endYear } = req.body;

    const tenure = await Tenure.create({
      startYear,
      endYear,
    });

    res.status(201).json(tenure);
  } catch (error) {
    res.status(500).json({ message: "Failed to create tenure" });
  }
};


export const deleteTenure = async (req, res) => {
  try {
    await Tenure.findByIdAndDelete(req.params.id);
    res.json({ message: "Tenure deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete tenure" });
  }
};
