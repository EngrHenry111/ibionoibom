import Bursary from "../models/bursary.model.js";
import crypto from "crypto";

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
  email: req.body.email
});

/* PREVENT DUPLICATE */
if(existing){
  return res.status(400).json({
    message:"You already applied"
  });
}

const application = await Bursary.create({

...req.body,

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

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.status !== "approved") {
      return res.status(400).json({
        message: "Application not approved yet"
      });
    }

    res.send(`
      <h1>Ibiono Ibom LGA</h1>
      <p>Congratulations ${app.fullName}</p>
      <p>Your bursary has been approved.</p>
      <p>Tracking ID: ${app.trackingId}</p>
    `);

  } catch (error) {
    res.status(500).json({ message: "Failed to generate letter" });
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

  if (app.status !== "approved") {
    return res.status(400).send("Not approved");
  }

  res.send(`
    <h1>Ibiono Ibom LGA</h1>
    <p>Dear ${app.fullName}</p>
    <p>Your bursary application has been approved.</p>
    <p>Tracking ID: ${app.trackingId}</p>
  `);
};