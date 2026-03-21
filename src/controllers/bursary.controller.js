import Bursary from "../models/bursary.model.js";
import {
  validateBVN,
  validateNIN,
  detectFraud,
} from "../services/identity.services.js"

import {
  verifyBVNExternal,
  verifyNINExternal,
  verifyFaceMatch,
} from "../services/identity.services.js";

import crypto from "crypto";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";
import { sendEmail } from "../utils/sendEmails.js";


/* ================= APPLY BURSARY ================= */
export const applyBursary = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    /* ================= GET DATA ================= */
    const {
      fullName,
      email,
      phone,
      matricNumber,
      institution,
      course,
      level,
      lga,
      accountNumber,
      bankName,
      bvn,
      nin,
    } = req.body;

    /* ================= BASIC VALIDATION ================= */
    if (
      !fullName ||
      !email ||
      !phone ||
      !matricNumber ||
      !accountNumber ||
      !bankName ||
      !bvn ||
      !nin
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    /* ================= IDENTITY VALIDATION ================= */
    if (!validateBVN(bvn)) {
      return res.status(400).json({
        message: "Invalid BVN format",
      });
    }

    if (!validateNIN(nin)) {
      return res.status(400).json({
        message: "Invalid NIN format",
      });
    }

    /* ================= FRAUD DETECTION ================= */
    const isFraud = await detectFraud(Bursary, {
      email,
      bvn,
      nin,
    });

    /* ================= DUPLICATE CHECK ================= */
    const existing = await Bursary.findOne({
      $or: [
        { email },
        { matricNumber },
        { bvn },
        { nin },
      ],
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied",
      });
    }

    /* ================= FILES ================= */

const passport = req.files?.passport?.[0]?.path || req.files?.passport?.[0]?.secure_url || "";
const admissionLetter = req.files?.admissionLetter?.[0]?.path || req.files?.admissionLetter?.[0]?.secure_url || "";
const studentID = req.files?.studentID?.[0]?.path || req.files?.studentID?.[0]?.secure_url || "";
const lgaCertificate = req.files?.lgaCertificate?.[0]?.path || req.files?.lgaCertificate?.[0]?.secure_url || "";
    // const passport = req.files?.passport?.[0]?.path || "";
    // const admissionLetter = req.files?.admissionLetter?.[0]?.path || "";
    // const studentID = req.files?.studentID?.[0]?.path || "";
    // const lgaCertificate = req.files?.lgaCertificate?.[0]?.path || "";

    /* ================= GENERATE IDS ================= */
    const trackingId =
      "IBB-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const verificationCode = crypto.randomBytes(8).toString("hex");
    /* ================= EXTERNAL VERIFICATION ================= */

const bvnCheck = await verifyBVNExternal(bvn);
const ninCheck = await verifyNINExternal(nin);

const faceCheck = await verifyFaceMatch(
  req.files?.passport?.[0]?.path,
  req.files?.studentID?.[0]?.path
);

/* ================= FINAL STATUS ================= */

let verificationStatus = "verified";

if (
  bvnCheck.status === "fallback" ||
  ninCheck.status === "fallback" ||
  faceCheck.status === "fallback"
) {
  verificationStatus = "unverified"; // safe fallback
}

if (isFraud) {
  verificationStatus = "failed";
}

    /* ================= CREATE ================= */
    const application = await Bursary.create({
      fullName,
      email,
      phone,
      matricNumber,
      institution,
      course,
      level,
      lga,

      accountNumber,
      bankName,

      bvn,
      nin,

      passport,
      admissionLetter,
      studentID,
      lgaCertificate,

      trackingId,
      verificationCode,

      verificationStatus,
      fraudFlag: isFraud,

      user: req.user?._id,

      // ✅ FIXED
      verificationStatus: isFraud ? "failed" : "verified",
      fraudFlag: isFraud,
    });

    /* ================= RESPONSE ================= */
    res.status(201).json({
      message: "Application submitted successfully",
      trackingId: application.trackingId,
    });

    } catch (error) {
  console.error("🔥 APPLY BURSARY FULL ERROR:", error);
  console.error("🔥 ERROR MESSAGE:", error.message);
  console.error("🔥 ERROR STACK:", error.stack);

  return res.status(500).json({
    message: error.message || "Failed to submit application",
  });
}
  // } catch (error) {
  //   console.error("APPLY BURSARY ERROR:", error);

  //   /* ================= MULTER ERROR HANDLING ================= */
  //   if (error.message?.includes("File too large")) {
  //     return res.status(400).json({
  //       message: "File size should not exceed 2MB",
  //     });
  //   }

  //   if (error.message?.includes("must be")) {
  //     return res.status(400).json({
  //       message: error.message,
  //     });
  //   }

  //   res.status(500).json({
  //     message: "Failed to submit application",
  //   });
  // }
};

export const generateLetter = async (req, res) => {
  try {
    const app = await Bursary.findById(req.params.id);

    // ❗ CHECK IF FOUND
    if (!app) {
      return res.status(404).send("Application not found");
    }

    // ❗ ONLY APPROVED CAN DOWNLOAD
    if (app.status !== "approved") {
      return res.status(400).send("Only approved applications can download letter");
    }

    res.setHeader("Content-Type", "text/html");

    res.send(`
      <html>
        <head>
          <title>Bursary Approval Letter</title>
        </head>
        <body style="font-family: Arial; padding: 20px;">
          <h1>Ibiono Ibom LGA</h1>
          <h2>Bursary Approval Letter</h2>

          <p>Dear <strong>${app.fullName}</strong>,</p>

          <p>
            We are pleased to inform you that your bursary application
            has been <strong>approved</strong>.
          </p>

          <p><strong>Tracking ID:</strong> ${app.trackingId}</p>
          <p><strong>Institution:</strong> ${app.institution}</p>

          <br/>

          <p>Congratulations 🎉</p>

          <p>Signed,</p>
          <p>Ibiono Ibom Local Government</p>
        </body>
      </html>
    `);

  } catch (error) {
    console.error("LETTER ERROR:", error);

    res.status(500).send("Server error generating letter");
  }
};


export const getMyApplications = async (req, res) => {
  try {

    const apps = await Bursary.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(apps);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch applications"
    });

  }
};

export const getAllApplications = async (req, res) => {
  try {

    const apps = await Bursary.find().sort({ createdAt: -1 });

    res.json(apps);

  } catch (error) {
    res.status(500).json({ message: "Failed" });
  }
};



export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Bursary.findById(req.params.id);

    app.status = status;
    await app.save();

    // 🔥 SEND EMAIL
    await sendEmail(
      app.email,
      "Bursary Application Update",
      `<h3>Hello ${app.fullName}</h3>
       <p>Your application has been <strong>${status}</strong>.</p>`
    );

    res.json({ message: "Updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

export const downloadLetter = async (req, res) => {

  const app = await Bursary.findById(req.params.id);

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Ibiono Ibom LGA", { align: "center" });

  doc.moveDown();

  doc.text(`Name: ${app.fullName}`);
  doc.text(`Tracking ID: ${app.trackingId}`);
  doc.text(`Status: Approved`);

  doc.end();
};


export const verifyBursary = async (req, res) => {
  try {
    const app = await Bursary.findOne({
      verificationCode: req.params.code,
    });

    if (!app) {
      return res.status(404).json({
        message: "Invalid or not found",
      });
    }

    res.json({
      fullName: app.fullName,
      institution: app.institution,
      status: app.status,
      trackingId: app.trackingId,
      year: app.createdAt,
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);

    res.status(500).json({
      message: "Verification failed",
    });
  }
};



export const getBursaryStats = async (req, res) => {
  try {
    const total = await Bursary.countDocuments();
    const approved = await Bursary.countDocuments({ status: "approved" });
    const pending = await Bursary.countDocuments({ status: "pending" });
    const rejected = await Bursary.countDocuments({ status: "rejected" });

    res.json({
      total,
      approved,
      pending,
      rejected,
    });

  } catch (error) {
    console.error("STATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch stats",
    });
  }
};