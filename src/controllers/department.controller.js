import Department from "../models/Department.js";

/* =====================================================
   CREATE DEPARTMENT (Admin Only)
===================================================== */
export const createDepartment = async (req, res) => {
  try {
    const { name, description, head } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const department = await Department.create({
      name,
      description,
      head,
    });

    res.status(201).json(department);

  } catch (error) {
    console.error("CREATE DEPARTMENT ERROR:", error);
    res.status(500).json({ message: "Failed to create department" });
  }
};


/* =====================================================
   GET ALL DEPARTMENTS (Admin Only)
===================================================== */
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .sort({ createdAt: -1 });

    res.json(departments);

  } catch (error) {
    console.error("GET ALL DEPARTMENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};


/* =====================================================
   GET PUBLIC DEPARTMENTS (Published Only)
===================================================== */
export const getPublicDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ status: "published" })
      .sort({ createdAt: -1 });

    res.json(departments);

  } catch (error) {
    console.error("PUBLIC DEPARTMENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch public departments" });
  }
};


/* =====================================================
   GET DEPARTMENT BY ID (Admin)
===================================================== */
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(department);

  } catch (error) {
    console.error("GET DEPARTMENT BY ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch department" });
  }
};


/* =====================================================
   UPDATE DEPARTMENT (Admin)
===================================================== */
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, head } = req.body;

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, head },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(updated);

  } catch (error) {
    console.error("UPDATE DEPARTMENT ERROR:", error);
    res.status(500).json({ message: "Failed to update department" });
  }
};


/* =====================================================
   UPDATE DEPARTMENT STATUS (Publish / Draft)
===================================================== */
export const updateDepartmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(updated);

  } catch (error) {
    console.error("UPDATE DEPARTMENT STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};


/* =====================================================
   DELETE DEPARTMENT (Admin)
===================================================== */
export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });

  } catch (error) {
    console.error("DELETE DEPARTMENT ERROR:", error);
    res.status(500).json({ message: "Failed to delete department" });
  }
};
