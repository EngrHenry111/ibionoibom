import Bursary from "../models/bursary.model.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";



/* GENERATE TRACKING ID */
const generateTrackingId = () => {
  return "IBB-" + crypto.randomBytes(4).toString("hex").toUpperCase();
};

/* APPLY */
export const applyBursary = async (req,res)=>{

try{

  
    // ✅ BVN VALIDATION
    if (!req.body.bvn || req.body.bvn.length !== 11) {
      return res.status(400).json({
        message: "Invalid BVN (must be 11 digits)"
      });
    }

const existing = await Bursary.findOne({
  $or: [
    { email: req.body.email },
    { matricNumber: req.body.matricNumber },
    { bvn: req.body.bvn }
  ]
});

if (existing) {
  return res.status(400).json({
    message: "Duplicate application detected"
  });
}


const verificationCode = crypto.randomBytes(8).toString("hex");

const application = await Bursary.create({
  ...req.body,
  user: req.user.id,
  verificationCode,


trackingId: generateTrackingId(),

passport: req.files.passport?.[0]?.path,
admissionLetter: req.files.admissionLetter?.[0]?.path,
studentID: req.files.studentID?.[0]?.path,
lgaCertificate: req.files.lgaCertificate?.[0]?.path,

user: req.user?.id

});

res.status(201).json(application);

}catch(error){

console.error(error);

res.status(500).json({
message:"Application failed"
});

}
};




export const generateLetter = async (req, res) => {
  try {
    const app = await Bursary.findById(req.params.id);

    if (!app || app.status !== "approved") {
      return res.status(400).json({
        message: "Application not approved",
      });
    }

    const verificationUrl = `https://ibionoibomlga.vercel.app/verify/${app.verificationCode}`;

    const qrImage = await QRCode.toDataURL(verificationUrl);

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${app.fullName}-bursary.pdf`
    );

    doc.pipe(res);

    /* ================= LOGO ================= */
    const logoPath = path.join("uploads/assets/logo.png");

    doc.image(logoPath, 250, 30, { width: 80 });

    doc.moveDown(3);

    /* ================= HEADER ================= */
    doc
      .fontSize(18)
      .text("IBIONO IBOM LOCAL GOVERNMENT AREA", {
        align: "center",
      });

    doc.fontSize(14).text("BURSARY APPROVAL CERTIFICATE", {
      align: "center",
    });

    doc.moveDown(2);

    /* ================= BODY ================= */
    doc.fontSize(12);

    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`This is to certify that:`);

    doc.moveDown();

    doc.fontSize(16).text(app.fullName, { align: "center" });

    doc.moveDown();

    doc.fontSize(12).text(
      `has been approved for bursary support under Ibiono Ibom LGA.`
    );

    doc.moveDown();

    doc.text(`Institution: ${app.institution}`);
    doc.text(`Account Number: ${app.accountNumber}`);
    doc.text(`Bank: ${app.bankName}`);
    doc.text(`Tracking ID: ${app.trackingId}`);

    doc.moveDown(2);

    doc.text("This certificate is valid and verifiable online.");

    doc.moveDown(2);

    /* ================= QR CODE ================= */
    doc.image(qrImage, 220, doc.y, { width: 100 });

    doc.moveDown(4);

    doc.text("Scan QR code to verify authenticity", {
      align: "center",
    });

    doc.moveDown(3);

    /* ================= SIGNATURE ================= */
    doc.text("__________________________", { align: "left" });
    doc.text("Executive Chairman", { align: "left" });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate certificate" });
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

    const app = await Bursary.findById(req.params.id);

    app.status = req.body.status;

    await app.save();

    res.json(app);

  } catch (error) {
    res.status(500).json({ message: "Failed" });
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
        message: "Invalid certificate",
      });
    }

    res.json({
      name: app.fullName,
      institution: app.institution,
      status: app.status,
      trackingId: app.trackingId,
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};