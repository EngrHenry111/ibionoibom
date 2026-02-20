import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir("uploads/news");
ensureDir("uploads/leaders");

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

const makeStorage = (folder, prefix) =>
  multer.diskStorage({
    destination: (_, __, cb) => cb(null, `uploads/${folder}`),
    filename: (_, file, cb) =>
      cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`),
  });

export const uploadNewsImages = multer({
  storage: makeStorage("news", "news"),
  fileFilter,
});

export const uploadLeaderImage = multer({
  storage: makeStorage("leaders", "leader"),
  fileFilter,
});


// import multer from "multer";
// import path from "path";
// import fs from "fs";

// /* ===============================
//    ENSURE UPLOAD FOLDERS EXIST
// ================================ */

// const ensureDir = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// ensureDir("uploads/news");
// ensureDir("uploads/leaders");

// /* ===============================
//    FILE FILTER
// ================================ */

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files allowed"), false);
//   }
// };

// /* ===============================
//    STORAGE: NEWS
// ================================ */

// const newsStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/news");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `news-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });


// export const uploadNewsImage = multer({
//   storage: newsStorage,
//   fileFilter,
// });

// /* ===============================
//    STORAGE: LEADERS
// ================================ */

// const leaderStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/leaders");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `leader-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// /* ===============================
//    EXPORT UPLOADERS
// ================================ */

// export const upload = multer({
//   storage: leaderStorage,
//   fileFilter,
// });
