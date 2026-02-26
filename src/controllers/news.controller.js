// import mongoose from "mongoose";
import News from "../models/News.js";

/* CREATE NEWS */
export const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // const images =
    //   req.files?.map(
    //     (f) => `${process.env.SERVER_URL}/uploads/news/${f.filename}`
    //   ) || [];

    if (req.files && req.files.lenght > 0){
      news.images = req.files.map(file => file.path);
    }

    // const images = req.files?.map((f) => f.filename) || [];

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
    return res.status(500).json({ message: "Server error" });
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




/* ================= CREATE NEWS ================= */
// export const createNews = async (req, res) => {
//   try {
//     const { title, content } = req.body;

//     const imagePaths = req.files
//       ? req.files.map((file) => file.filename)
//       : [];

//     const news = await News.create({
//       title,
//       content,
//       images: imagePaths,
//       createdBy: req.admin.id,
//     });

//     res.status(201).json(news);
//   } catch (error) {
//     console.error("CREATE NEWS ERROR:", error);
//     res.status(500).json({ message: "Failed to create news" });
//   }
// };


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


/* ================= GET ALL NEWS ================= */
// export const getAllNews = async (req, res) => {
//   try {
//     const news = await News.find().sort({ createdAt: -1 });
//     res.status(200).json(news);
//   } catch (error) {
//     console.error("FETCH NEWS ERROR:", error);
//     res.status(500).json({ message: "Failed to fetch news" });
//   }
// };

// export const getAllNews = async (req, res) => {
//   try {
//     const news = await News.find({ status: "published" })
//       .sort({ createdAt: -1 });

//     res.json(news);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch news" });
//   }
// };

// export const getAllNews = async (req, res) => {
//   try {
//     const news = await News.find().sort({ createdAt: -1 });
//     res.json(news);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch news" });
//   }
// };



export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Delete images from uploads folder
    news.images.forEach((img) => {
      const imgPath = path.join(
        process.cwd(),
        "uploads/news",
        img
      );

      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

    await news.deleteOne();

    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// // UPDATE NEWS STATUS
// export const updateNewsStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!status) {
//       return res.status(400).json({ message: "Status is required" });
//     }

//     if (!["draft", "published"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const news = await News.findById(req.params.id);

//     // if (!news) {
//     //   return res.status(404).json({ message: "News not found" });
//     // }

//     news.status = status;
//     await news.save();

//     res.json(news);
//   } catch (error) {
//     console.error("UPDATE STATUS ERROR:", error);
//     res.status(500).json({ message: "Failed to update news status" });
//   }
// };




// export const updateNewsStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body; // "published" or "draft"

//     const news = await News.findById(id);
//     if (!news) return res.status(404).json({ message: "News not found" });

//     news.status = status;
//     await news.save();

//     res.status(200).json(news);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to update news status" });
//   }
// };


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

// export const getPublicNews = async (req, res) => {
//   try {
//     const news = await News.find({ status: "published" })
//       .sort({ createdAt: -1 });

//     res.json(news);
//   } catch (error) {
//     console.error("PUBLIC NEWS ERROR:", error);
//     res.status(500).json({ message: "Failed to fetch public news" });
//   }
// };

// // controllers/news.controller.js


// export const getPublicNewsById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const news = await News.findById(id);

//     if (!news || news.status !== "published") {
//       return res.status(404).json({ message: "News not found" });
//     }

//     // ✅ SINGLE RESPONSE — RETURN STOPS EXECUTION
//     return res.json(news);

//   } catch (error) {
//     console.error("GET PUBLIC NEWS ERROR:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };



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
    const { title, content, existingImages } = req.body;

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Update fields
    news.title = title;
    news.content = content;

    // Handle images
    let finalImages = [];

    // Existing images kept
    if (existingImages) {
      if (Array.isArray(existingImages)) {
        finalImages = existingImages;
      } else {
        finalImages = [existingImages];
      }
    }

    // New uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => f.filename);
      finalImages = [...finalImages, ...newImages];
    }

    news.images = finalImages;

    await news.save();
    res.json(news);
  } catch (error) {
    console.error("UPDATE NEWS ERROR:", error);
    res.status(500).json({ message: "Failed to update news" });
  }
};
