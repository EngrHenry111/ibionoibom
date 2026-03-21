import Student from "../models/student.model.js";
import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
import crypto from "crypto";



/* ================= TOKEN ================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ================= REGISTER ================= */
export const registerStudent = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log("BODY:", req.body); // 🔥 debug

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await Student.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const student = await Student.create({
      fullName,
      email,
      password, // hashed by model
    });

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      _id: student._id,
      fullName: student.fullName,
      email: student.email,
      token,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error); // 🔥 VERY IMPORTANT
    console.log("REGISTER HIT")
    res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
};

/* ================= LOGIN ================= */
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await student.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      _id: student._id,
      fullName: student.fullName,
      email: student.email,
      token: generateToken(student._id),
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};


/* ================= PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};



// import crypto from "crypto";
// // import Student from "../models/student.model.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import Student from "../models/student.model.js";
// import jwt from "jsonwebtoken";

// /* REGISTER */
// export const registerStudent = async (req,res)=>{

// const { fullName,email,password } = req.body;

// const exists = await Student.findOne({ email });

// if(exists){
//   return res.status(400).json({ message:"Email already exists" });
// }

// const user = await Student.create({ fullName,email,password });

// const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET,{
//   expiresIn:"7d"
// });

// res.json({ user, token });

// };

// /* LOGIN */
// export const loginStudent = async (req,res)=>{

// const { email,password } = req.body;

// const user = await Student.findOne({ email });

// if(!user || !(await user.matchPassword(password))){
//   return res.status(401).json({ message:"Invalid credentials" });
// }

// const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET,{
//   expiresIn:"7d"
// });

// res.json({ user, token });

// };



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔐 Generate raw token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 🔒 Hash token (store hashed, not raw)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    // 🔗 Send RAW token to frontend
    const resetUrl = `http://localhost:5173/bursary/reset-password/${resetToken}`;

    res.json({
      message: "Reset link generated",
      resetUrl,
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await Student.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // 🔐 Generate reset token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     user.resetToken = resetToken;
//     user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins

//     await user.save();

//     // ✅ Instead of email, return link
//     const resetUrl = `http://localhost:5173/bursary/reset-password/${resetToken}`;

//     res.json({
//       message: "Reset link generated",
//       resetUrl, // 🔥 IMPORTANT
//     });

//   } catch (error) {
//     console.error("FORGOT PASSWORD ERROR:", error);

//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// };
/* FORGOT PASSWORD */

// export const forgotPassword = async (req, res) => {

//   const user = await Student.findOne({ email: req.body.email });

//   if (!user) {
//     return res.status(404).json({ message: "Email not found" });
//   }

//   const resetToken = crypto.randomBytes(32).toString("hex");

//   user.resetToken = resetToken;

//   user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins

//   await user.save();

//   const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

//   await sendEmail(
//     user.email,
//     "Password Reset",
//     `Click to reset password: ${resetUrl}`
//   );

//   res.json({ message: "Reset link sent to email" });
// };


export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // 🔐 Hash incoming token to compare
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await Student.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() }, // ⏳ not expired
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // ✅ Set new password
    user.password = password;

    // ❌ Clear reset fields
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Reset failed",
    });
  }
};

// export const resetPassword = async (req, res) => {

//   const user = await Student.findOne({
//     resetToken: req.params.token,
//     resetTokenExpire: { $gt: Date.now() }
//   });

//   if (!user) {
//     return res.status(400).json({ message: "Invalid or expired token" });
//   }

//   user.password = req.body.password;
//   user.resetToken = undefined;
//   user.resetTokenExpire = undefined;

//   await user.save();

//   res.json({ message: "Password reset successful" });
// };