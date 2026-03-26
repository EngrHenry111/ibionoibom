import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/* ===============================
   FILE FILTER
================================ */

/* ===============================
   SMART FILE VALIDATION
================================ */
// const fileFilter = (req, file, cb) => {
//   const { fieldname, mimetype } = file;

//   // 📌 Passport → image only
//   if (fieldname === "passport") {
//     if (!mimetype.startsWith("image/")) {
//       return cb(new Error("Passport must be an image"), false);
//     }
//   }

//   // 📌 Student ID → image only
//   if (fieldname === "studentID") {
//     if (!mimetype.startsWith("image/")) {
//       return cb(new Error("Student ID must be an image"), false);
//     }
//   }

//   // 📌 Admission Letter → PDF only
//   if (fieldname === "admissionLetter") {
//     if (mimetype !== "application/pdf") {
//       return cb(new Error("Admission Letter must be PDF"), false);
//     }
//   }

//   // 📌 LGA Certificate → PDF only
//   if (fieldname === "lgaCertificate") {
//     if (mimetype !== "application/pdf") {
//       return cb(new Error("LGA Certificate must be PDF"), false);
//     }
//   }

//   cb(null, true);
// };

const fileFilter = (req, file, cb) => {
  console.log("UPLOAD FILE:", file.fieldname, file.mimetype);
  cb(null, true); // ✅ allow everything for now
};

// const fileFilter = (req, file, cb) => {

//   if (!file.mimetype.startsWith("image/") && 
//   file.mimetype !== "application/pdf") {
//     return cb(new Error("Only images and PDFs allowed"), false);
//   }

//   cb(null, true);
// };

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
    return {
      folder: "ibiono/bursary",

      // 🔥 FORCE IMAGE PROCESSING
      resource_type: "image",

      // 🔥 VERY IMPORTANT (THIS FIXES PDF PREVIEW)
      flags: "attachment:false",

      // 🔥 ENSURE PDF IS TRANSFORMABLE
      format: file.mimetype === "application/pdf" ? "png" : undefined,

      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    };
  },
});
// const bursaryStorage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     let folder = "ibiono/bursary/others";

//     // 📂 Dynamic folder structure
//     if (file.fieldname === "passport") {
//       folder = "ibiono/bursary/passport";
//     } else if (file.fieldname === "admissionLetter") {
//       folder = "ibiono/bursary/admission";
//     } else if (file.fieldname === "studentID") {
//       folder = "ibiono/bursary/id";
//     } else if (file.fieldname === "lgaCertificate") {
//       folder = "ibiono/bursary/lga";
//     }

//     const isPDF = file.mimetype === "application/pdf";

//   return {
//     folder,
//     resource_type: isPDF ? "raw" : "image",
//     allowed_formats: isPDF
//       ? ["pdf"]
//       : ["jpg", "jpeg", "png", "webp"],
//   };
//     },
//   });

/* ===============================
   EXPORT BURSARY UPLOADER
================================ */

export const uploadBursaryDocuments = multer({
  storage: bursaryStorage,
  fileFilter,
});