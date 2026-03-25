
import News from "../models/News.js";
import cloudinary from "../config/cloudinary.js";


/* CREATE NEWS */
export const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const images = req.files?.length
      ? req.files.map((file) => file.path)
      : [];

    const news = await News.create({
      title,
      content,
      images,
      status: "draft",
      createdBy: req.admin.id,
    });

    return res.status(201).json(news);
  } catch (err) {
    console.error("CREATE NEWS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};
/* GET ALL (ADMIN) */
export const getAllNews = async (req, res) => {
  const news = await News.find().sort({ createdAt: -1 });
  return res.json(news);
};

/* GET PUBLIC NEWS */
export const getPublicNews = async (req, res) => {
  try {
    const news = await News.find({ status: "published" })
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (err) {
    console.error("GET PUBLIC NEWS ERROR:", err);
    res.status(500).json({ message: "Failed to load news" });
  }
};


/* ================= PUBLIC: GET BY ID ================= */

export const getPublicNewsById = async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (err) {
    console.error("GET PUBLIC NEWS BY ID ERROR:", err);
    res.status(500).json({ message: "Failed to load news" });
  }
};


/* UPDATE STATUS */
export const updateNewsStatus = async (req, res) => {
  const { status } = req.body;

  if (!["draft", "published"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const news = await News.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  return res.json(news);
};



/**GET SINGLE NEWS */
export const getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news || news.status !== "published") {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news" });
  }
};


export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    if (news.images && news.images.length > 0) {
      for (let imageUrl of news.images) {
        try {
          const parts = imageUrl.split("/upload/");
          if (parts.length > 1) {
            const publicIdWithVersion = parts[1];
            const publicId = publicIdWithVersion
              .replace(/^v\d+\//, "") // remove version like v123/
              .split(".")[0];

            await cloudinary.uploader.destroy(publicId);
            console.log("Deleted from Cloudinary:", publicId);
          }
        } catch (cloudErr) {
          console.error("Cloudinary delete error:", cloudErr);
        }
      }
    }

    await news.deleteOne();

    res.json({ message: "News deleted successfully" });
  } catch (err) {
    console.error("DELETE NEWS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getPublishedNews = async (req, res) => {
  try {
    const news = await News.find({ status: "published" })
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news" });
  }
};

export const getSinglePublishedNews = async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news" });
  }
};



export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    console.error("GET NEWS BY ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
};

export const updateNews = async (req, res) => {
  try {

    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        message: "News not found"
      });
    }

    news.title = req.body.title || news.title;
    news.content = req.body.content || news.content;
    news.status = req.body.status || news.status;

    // CLOUDINARY MULTIPLE IMAGES
    if (req.files && req.files.length > 0) {
      news.images = req.files.map(file => file.path);
    }

    await news.save();

    res.json(news);

  } catch (error) {

    console.error("UPDATE NEWS ERROR:", error);

    res.status(500).json({
      message: "Failed to update news"
    });

  }
};