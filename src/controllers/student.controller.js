
import crypto from "crypto";
// import Student from "../models/student.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import Student from "../models/student.model.js";
import jwt from "jsonwebtoken";

/* REGISTER */
export const registerStudent = async (req,res)=>{

const { fullName,email,password } = req.body;

const exists = await Student.findOne({ email });

if(exists){
  return res.status(400).json({ message:"Email already exists" });
}

const user = await Student.create({ fullName,email,password });

const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET,{
  expiresIn:"7d"
});

res.json({ user, token });

};

/* LOGIN */
export const loginStudent = async (req,res)=>{

const { email,password } = req.body;

const user = await Student.findOne({ email });

if(!user || !(await user.matchPassword(password))){
  return res.status(401).json({ message:"Invalid credentials" });
}

const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET,{
  expiresIn:"7d"
});

res.json({ user, token });

};



/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {

  const user = await Student.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = resetToken;

  user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail(
    user.email,
    "Password Reset",
    `Click to reset password: ${resetUrl}`
  );

  res.json({ message: "Reset link sent to email" });
};


export const resetPassword = async (req, res) => {

  const user = await Student.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};