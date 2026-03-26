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
// import path from "path";
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
const passport = req.files?.passport?.[0]?.secure_url || "";
const admissionLetter = req.files?.admissionLetter?.[0]?.secure_url || "";
const studentID = req.files?.studentID?.[0]?.secure_url || "";
const lgaCertificate = req.files?.lgaCertificate?.[0]?.secure_url || "";// const passport = req.files?.passport?.[0]?.path || req.files?.passport?.[0]?.secure_url || "";
// const admissionLetter = req.files?.admissionLetter?.[0]?.path || req.files?.admissionLetter?.[0]?.secure_url || "";
// const studentID = req.files?.studentID?.[0]?.path || req.files?.studentID?.[0]?.secure_url || "";
// const lgaCertificate = req.files?.lgaCertificate?.[0]?.path || req.files?.lgaCertificate?.[0]?.secure_url || "";
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

    if (!app) {
      return res.status(404).send("Application not found");
    }

    if (app.status !== "approved") {
      return res.status(400).send("Only approved applications allowed");
    }

    // 📄 Create PDF
    const doc = new PDFDocument();

    // 📌 Set headers for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bursary-${app.fullName}.pdf`
    );

    doc.pipe(res);

    /* ================= HEADER ================= */

    doc
      .fontSize(20)
      .text("IBIONO IBOM LOCAL GOVERNMENT", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(16)
      .text("BURSARY APPROVAL LETTER", { align: "center" });

    doc.moveDown(2);

    /* ================= BODY ================= */

    doc.fontSize(12);

    doc.text(`Dear ${app.fullName},`);

    doc.moveDown();

    doc.text(
      "We are pleased to inform you that your bursary application has been APPROVED by Ibiono Ibom Local Government Council."
    );

    doc.moveDown();

    doc.text(`Institution: ${app.institution}`);
    doc.text(`Course: ${app.course}`);
    doc.text(`Tracking ID: ${app.trackingId}`);

    doc.moveDown(2);

    doc.text(
      "This letter serves as an official confirmation of your bursary award."
    );

    doc.moveDown(3);

    /* ================= SIGNATURE ================= */

    doc.text("________________________");
    doc.text("Chairman");
    doc.text("Ibiono Ibom LGA");

    doc.moveDown();

    /* ================= STAMP STYLE ================= */

    doc
      .fontSize(10)
      .fillColor("red")
      .text("OFFICIAL STAMP", { align: "right" });

    doc.end();

  } catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).send("Error generating PDF");
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

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ UPDATE FIRST
    app.status = status;
    await app.save();

    // 🔥 SEND RESPONSE FIRST (VERY IMPORTANT)
    res.json({ message: "Status updated successfully" });

    // 🔥 THEN RUN EMAIL (NON-BLOCKING)
    try {
      // OPTIONAL EMAIL
      // await sendEmail(...);
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError.message);
    }

  } catch (error) {
    console.error("UPDATE ERROR:", error);
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

  // 🔗 Verification link
const verifyUrl = `https://ibionoibomlga.com/verify/${app.verificationCode}`;

// 🧠 Generate QR as base64
const qrImage = await QRCode.toDataURL(verifyUrl);

// 📌 Add QR to PDF
doc.image(qrImage, {
  fit: [100, 100],
  align: "center",
});

doc.moveDown();

doc
  .fontSize(10)
  .fillColor("blue")
  .text("Scan to verify this bursary", { align: "center" });

  doc.end();
};


export const verifyBursary = async (req, res) => {
  try {
    const { code } = req.params;

    const app = await Bursary.findOne({
      verificationCode: code,
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


export const verifyByTrackingId = async (req, res) => {
  try {
    const { trackingId } = req.params;

    console.log("TRACKING RECEIVED:", trackingId); // 🔥 DEBUG

    const app = await Bursary.findOne({ trackingId });

    if (!app) {
      return res.status(404).json({
        message: "Tracking ID not found",
      });
    }

    res.json({
      fullName: app.fullName,
      institution: app.institution,
      status: app.status,
      trackingId: app.trackingId,
    });

  } catch (error) {
    console.error("VERIFY TRACKING ERROR:", error);
    res.status(500).json({
      message: "Verification failed",
    });
  }
};