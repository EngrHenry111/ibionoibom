import Leader from "../models/Leader.js";
import Archive from "../models/archive.model.js";
import mongoose from "mongoose";
/* ===============================
   CREATE LEADER
// ================================ */

export const createLeader = async (req, res) => {
  try {

    const leader = await Leader.create({
      fullName: req.body.fullName,
      position: req.body.position,
      bio: req.body.bio,
      tenure: req.body.tenure,
      status: req.body.status || "draft",
      imageUrl: req.file?.path // Cloudinary URL
    });

    /* ===============================
       CREATE ARCHIVE RECORD
    ============================== */

    if (leader.status === "published") {

      await Archive.create({
        title: leader.fullName,
        description: leader.position,
        category: "leader",
        year: leader.tenure,
        tags: ["leadership", "chairman"],
        referenceId: leader._id
      });

    }

    res.status(201).json(leader);

  } catch (error) {

    console.error("CREATE LEADER ERROR:", error);

    res.status(500).json({
      message: "Failed to create leader"
    });

  }
};

/* ===============================
   GET ALL LEADERS (ADMIN)
================================ */
export const getAllLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find()
      .populate("tenure")
      .sort({ createdAt: -1 });

    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaders" });
  }
};

/* ===============================
   GET LEADER BY ID
================================ */
export const getLeaderById = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id)
      .populate("tenure");

    if (!leader) {
      return res.status(404).json({ message: "Leader not found" });
    }

    res.json(leader);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leader" });
  }
};

/* ===============================
   UPDATE LEADER
================================ */
export const updateLeader = async (req, res) => {
  try {

    const leader = await Leader.findById(req.params.id);

    if (!leader) {
      return res.status(404).json({
        message: "Leader not found"
      });
    }

    leader.fullName = req.body.fullName || leader.fullName;
    leader.position = req.body.position || leader.position;
    leader.bio = req.body.bio || leader.bio;
    leader.tenure = req.body.tenure || leader.tenure;
    leader.status = req.body.status || leader.status;

    // CLOUDINARY IMAGE UPDATE
    if (req.file) {
      leader.imageUrl = req.file.path;
    }

    await leader.save();

    res.json(leader);

  } catch (error) {

    console.error("UPDATE LEADER ERROR:", error);

    res.status(500).json({
      message: "Failed to update leader"
    });

  }
};

/* ===============================
   DELETE LEADER
================================ */
export const deleteLeader = async (req, res) => {
  try {
    await Leader.findByIdAndDelete(req.params.id);
    res.json({ message: "Leader deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete leader" });
  }
};

/* ===============================
   UPDATE STATUS
================================ */
export const updateLeaderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Leader.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const getPublicLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find({ status: "published" })
      .populate({
        path: "tenure",
        select: "startYear endYear",
      })
      .sort({ "tenure.startYear": -1, createdAt: -1 })
      .lean();

    res.json(leaders);
  } catch (error) {
    console.error("GET PUBLIC LEADERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch leaders" });
  }
};




/* ================= PUBLIC ================= */

// Public: only published leaders
export const getPublishedLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find({ status: "published" })
      .sort({ "tenure.start": -1 });

    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaders" });
  }
};



export const getPublishedLeadersGrouped = async (req, res) => {
  try {
    const leaders = await Leader.find({ status: "published" })
      .populate("tenure")
      .sort({ createdAt: -1 });

    const grouped = {};

    leaders.forEach((leader) => {
      if (!leader.tenure) return;

      const key = `${leader.tenure.startYear}-${leader.tenure.endYear}`;

      if (!grouped[key]) {
        grouped[key] = {
          tenure: leader.tenure,
          leaders: [],
        };
      }

      grouped[key].leaders.push(leader);
    });

    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaders" });
  }
};


export const getPublicLeadersByTenure = async (req, res) => {
  try {
    const leaders = await Leader.find({ status: "published" })
      .populate("tenure", "startYear endYear")
      .sort({ "tenure.startYear": -1 });

    // Group leaders by tenure
    const grouped = {};

    leaders.forEach((leader) => {
      if (!leader.tenure) return;

      const key = `${leader.tenure.startYear}-${leader.tenure.endYear}`;

      if (!grouped[key]) {
        grouped[key] = {
          tenure: leader.tenure,
          leaders: [],
        };
      }

      grouped[key].leaders.push(leader);
    });

    res.json(Object.values(grouped));
  } catch (error) {
    console.error("PUBLIC LEADERS ERROR:", error);
    res.status(500).json({ message: "Failed to load leaders" });
  }
};


export const getPublicLeaderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid leader ID" });
    }

    const leader = await Leader.findOne({
      _id: id,
      status: "published",
    }).populate({
      path: "tenure",
      select: "startYear endYear",
    });

    if (!leader) {
      return res.status(404).json({ message: "Leader not found" });
    }

    res.json(leader);
  } catch (error) {
    console.error("GET PUBLIC LEADER BY ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch leader" });
  }
};
