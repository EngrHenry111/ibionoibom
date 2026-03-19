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