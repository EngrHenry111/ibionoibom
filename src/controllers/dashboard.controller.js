import News from "../models/News.js";
import Leader from "../models/Leader.js";
import Department from "../models/Department.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const totalLeaders = await Leader.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const publishedNews = await News.countDocuments({ status: "published" });
    const publishedLeaders = await Leader.countDocuments({ status: "published" });
    const publishedDepartments = await Department.countDocuments({ status: "published" });

    res.json({
      totalNews,
      totalLeaders,
      totalDepartments,
      publishedNews,
      publishedLeaders,
      publishedDepartments,
    });

  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
