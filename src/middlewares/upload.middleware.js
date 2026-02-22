import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

/* ===============================
   ENSURE LOCAL DIRS
================================ */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir("uploads/news");
ensureDir("uploads/leaders");

/* ===============================
   FILE FILTER
================================ */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

/* ===============================
   STORAGE SWITCH
================================ */
const isCloudinary = process.env.STORAGE_DRIVER === "cloudinary";

/* ===== CLOUDINARY STORAGE ===== */
const cloudinaryNewsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ibiono/news",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const cloudinaryLeaderStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ibiono/leaders",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

/* ===== LOCAL STORAGE ===== */
const localNewsStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/news"),
  filename: (_, file, cb) =>
    cb(null, `news-${Date.now()}${path.extname(file.originalname)}`),
});

const localLeaderStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/leaders"),
  filename: (_, file, cb) =>
    cb(null, `leader-${Date.now()}${path.extname(file.originalname)}`),
});

/* ===============================
   EXPORT UPLOADERS (SAFE)
================================ */
export const uploadNewsImages = multer({
  storage: isCloudinary ? cloudinaryNewsStorage : localNewsStorage,
  fileFilter,
});

export const uploadLeaderImage = multer({
  storage: isCloudinary ? cloudinaryLeaderStorage : localLeaderStorage,
  fileFilter,
});





// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const ensureDir = (dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// };

// ensureDir("uploads/news");
// ensureDir("uploads/leaders");

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only images allowed"), false);
// };

// const makeStorage = (folder, prefix) =>
//   multer.diskStorage({
//     destination: (_, __, cb) => cb(null, `uploads/${folder}`),
//     filename: (_, file, cb) =>
//       cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`),
//   });

// export const uploadNewsImages = multer({
//   storage: makeStorage("news", "news"),
//   fileFilter,
// });

// export const uploadLeaderImage = multer({
//   storage: makeStorage("leaders", "leader"),
//   fileFilter,
// });
