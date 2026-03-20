import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/* ===============================
   FILE FILTER
================================ */
const fileFilter = (req, file, cb) => {

  if (!file.mimetype.startsWith("image/") && 
  file.mimetype !== "application/pdf") {
    return cb(new Error("Only images and PDFs allowed"), false);
  }

  cb(null, true);
};

/* ===============================
   CLOUDINARY STORAGE - LEADERS
================================ */
const leaderStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ibiono/leaders",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

/* ===============================
   CLOUDINARY STORAGE - NEWS
================================ */
const newsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ibiono/news",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

/* ===============================
   EXPORT UPLOADERS
================================ */

export const uploadLeaderImage = multer({
  storage: leaderStorage,
  fileFilter,
});

export const uploadNewsImages = multer({
  storage: newsStorage,
  fileFilter,
});


/* ===============================
   CLOUDINARY STORAGE - BURSARY
================================ */

const bursaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "ibiono/bursary/others";

    // 📂 Dynamic folder structure
    if (file.fieldname === "passport") {
      folder = "ibiono/bursary/passport";
    } else if (file.fieldname === "admissionLetter") {
      folder = "ibiono/bursary/admission";
    } else if (file.fieldname === "studentID") {
      folder = "ibiono/bursary/id";
    } else if (file.fieldname === "lgaCertificate") {
      folder = "ibiono/bursary/lga";
    }

    return {
      folder,
      resource_type: "auto", // 🔥 allows PDF + image
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    };
  },
});

/* ===============================
   EXPORT BURSARY UPLOADER
================================ */

export const uploadBursaryDocuments = multer({
  storage: bursaryStorage,
  fileFilter,
});